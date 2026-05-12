/**
 * Utility for normalizing and scaling face detection results.
 *
 * Coordinate contract:
 *  - Backend always returns bounding boxes in ORIGINAL IMAGE pixel coordinates.
 *  - Frontend scales them to display coordinates using computeObjectFitContainRect.
 *  - We NEVER guess whether values are percentages vs pixels; we always use
 *    mediaSize (original image/video dimensions) for scaling.
 */

/**
 * Normalizes any bounding box format to { x, y, width, height }.
 * Supports:
 *  - { x, y, width, height }        ← canonical
 *  - { left, top, width, height }   ← legacy local backend
 *  - [x, y, w, h]                   ← array form (bbox field)
 *  - { x1, y1, x2, y2 }            ← corner form
 *
 * Returns null if rawBox is missing or invalid.
 */
export function normalizeBoundingBox(rawBox) {
  if (!rawBox) return null

  if (Array.isArray(rawBox)) {
    if (rawBox.length >= 4) {
      const [x, y, width, height] = rawBox.map(Number)
      if (width > 0 && height > 0) return { x, y, width, height }
    }
    return null
  }

  if (typeof rawBox === 'object') {
    // Corner form
    if (rawBox.x2 !== undefined && rawBox.y2 !== undefined &&
        rawBox.x1 !== undefined && rawBox.y1 !== undefined) {
      const x = rawBox.x1
      const y = rawBox.y1
      const width = rawBox.x2 - rawBox.x1
      const height = rawBox.y2 - rawBox.y1
      if (width > 0 && height > 0) return { x, y, width, height }
      return null
    }

    // Standard / legacy form
    const x = Number(rawBox.x !== undefined ? rawBox.x : (rawBox.left !== undefined ? rawBox.left : null))
    const y = Number(rawBox.y !== undefined ? rawBox.y : (rawBox.top !== undefined ? rawBox.top : null))
    const width = Number(rawBox.width !== undefined ? rawBox.width : (rawBox.w !== undefined ? rawBox.w : null))
    const height = Number(rawBox.height !== undefined ? rawBox.height : (rawBox.h !== undefined ? rawBox.h : null))

    if (!isNaN(x) && !isNaN(y) && !isNaN(width) && !isNaN(height) && width > 0 && height > 0) {
      return { x, y, width, height }
    }
  }

  return null
}

/**
 * Normalizes backend response into a consistent frontend faces array.
 *
 * Supports response shapes from:
 *  - Local backend  (status: "success", faces: [...], confidence 0–100)
 *  - HF Space       (success: true, faces: [...], confidence 0–1)
 *  - Legacy shapes  (detections, results, predictions arrays)
 *  - Single-face    (emotion + confidence at root level)
 *
 * Always returns: { faces, latency_ms, source, image_size | null }
 */
export function normalizeDetectionResult(data) {
  if (!data) return { faces: [], latency_ms: 0, source: 'unknown', image_size: null }

  // Collect raw face array
  let rawFaces = []
  if (Array.isArray(data.faces)) rawFaces = data.faces
  else if (Array.isArray(data.detections)) rawFaces = data.detections
  else if (Array.isArray(data.results)) rawFaces = data.results
  else if (Array.isArray(data.predictions)) rawFaces = data.predictions
  else if (data.emotion !== undefined && data.confidence !== undefined) {
    // Single-face response at root
    rawFaces = [data]
  }

  const faces = rawFaces.map((face, index) => {
    const rawConf = face.confidence !== undefined
      ? face.confidence
      : (face.score !== undefined ? face.score : 0)

    // Normalize confidence to 0-1.
    // Local backend previously returned 0-100; new backend returns 0-1.
    // Guard: if value > 1 it must be 0-100 scale.
    const confidence = rawConf > 1 ? rawConf / 100 : rawConf

    // Normalize all_probs values to 0-1 as well
    const rawAllProbs = face.all_probs || {}
    const all_probs = {}
    for (const [k, v] of Object.entries(rawAllProbs)) {
      all_probs[k] = v > 1 ? v / 100 : v
    }

    // Try bounding_box first, then bbox array, then box, then rectangle
    const bounding_box =
      normalizeBoundingBox(face.bounding_box) ||
      normalizeBoundingBox(face.bbox) ||
      normalizeBoundingBox(face.box) ||
      normalizeBoundingBox(face.rectangle) ||
      null

    return {
      id: face.face_id !== undefined ? face.face_id : (face.id !== undefined ? face.id : index),
      emotion: (face.emotion || face.label || 'unknown').toLowerCase(),
      confidence,
      all_probs,
      bounding_box,
      raw: face
    }
  })

  // image_size from backend (prefer this over frontend-measured size for accuracy)
  let image_size = data.image_size || data.imageSize || null
  if (image_size) {
    image_size = {
      width: Number(image_size.width || image_size.w),
      height: Number(image_size.height || image_size.h)
    }
    if (isNaN(image_size.width) || isNaN(image_size.height)) image_size = null
  }

  return {
    faces,
    latency_ms: data.latency_ms || 0,
    source: data.source || 'unknown',
    image_size,
  }
}

/**
 * Computes the rectangle occupied by media inside an object-fit: contain frame.
 * Returns { x, y, width, height } in container-local coordinates.
 *
 * x/y are the letter-box offsets (0 if no letter-boxing on that axis).
 */
export function computeObjectFitContainRect(containerWidth, containerHeight, mediaWidth, mediaHeight) {
  if (!containerWidth || !containerHeight || !mediaWidth || !mediaHeight) {
    return { x: 0, y: 0, width: containerWidth || 0, height: containerHeight || 0 }
  }

  const mediaRatio = mediaWidth / mediaHeight
  const containerRatio = containerWidth / containerHeight

  let width, height

  if (containerRatio > mediaRatio) {
    // Container wider → pillarbox (black bars on left/right)
    height = containerHeight
    width = height * mediaRatio
  } else {
    // Container taller → letterbox (black bars on top/bottom)
    width = containerWidth
    height = width / mediaRatio
  }

  return {
    x: (containerWidth - width) / 2,
    y: (containerHeight - height) / 2,
    width,
    height,
  }
}

/**
 * Scales a bounding box from original media coordinates to display coordinates.
 *
 * @param {Object} box         - { x, y, width, height } in original media pixels
 * @param {Object} mediaSize   - { width, height } original media dimensions
 * @param {Object} displayRect - from computeObjectFitContainRect
 * @returns {{ left, top, width, height }} in container-local CSS pixels
 */
export function scaleFaceBoxToDisplay(box, mediaSize, displayRect) {
  if (!box || !mediaSize?.width || !mediaSize?.height ||
      !displayRect?.width || !displayRect?.height) {
    return { left: 0, top: 0, width: 0, height: 0 }
  }

  const scaleX = displayRect.width / mediaSize.width
  const scaleY = displayRect.height / mediaSize.height

  return {
    left: displayRect.x + box.x * scaleX,
    top:  displayRect.y + box.y * scaleY,
    width:  box.width  * scaleX,
    height: box.height * scaleY,
  }
}

/**
 * Clamps a display box so it stays within the displayRect boundaries.
 * Prevents boxes from being drawn outside the visible media area.
 *
 * @param {{ left, top, width, height }} displayBox
 * @param {{ x, y, width, height }}      displayRect
 */
export function clampDisplayBox(displayBox, displayRect) {
  const left  = Math.max(displayRect.x, displayBox.left)
  const top   = Math.max(displayRect.y, displayBox.top)
  const right  = Math.min(displayRect.x + displayRect.width,  displayBox.left + displayBox.width)
  const bottom = Math.min(displayRect.y + displayRect.height, displayBox.top  + displayBox.height)

  return {
    left,
    top,
    width:  Math.max(0, right  - left),
    height: Math.max(0, bottom - top),
  }
}
