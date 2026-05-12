/**
 * Utility functions for handling face detection results and coordinate scaling.
 */

/**
 * Normalizes backend response to a consistent faces array.
 * Backend currently returns: { status: 'success', faces: [{ emotion, confidence, all_probs, bounding_box: { top, left, width, height } }] }
 * 
 * @param {Object} response - Raw API response
 * @returns {Array} Normalized faces array
 */
export function normalizeFaceResults(response) {
  if (!response || !response.faces) {
    return []
  }

  // Handle case where status might be missing or different, but faces are present
  if (response.status && response.status !== 'success' && response.status !== 'ok') {
    return []
  }

  return response.faces.map((face, index) => {
    // Ensure confidence is normalized to 0-1 if it comes as 0-100
    const rawConfidence = face.confidence || 0
    const normalizedConfidence = rawConfidence > 1 ? rawConfidence / 100 : rawConfidence

    // Resilient bounding box extraction
    const bbox = face.bounding_box || {}
    const left = bbox.left !== undefined ? bbox.left : (bbox.x !== undefined ? bbox.x : 0)
    const top = bbox.top !== undefined ? bbox.top : (bbox.y !== undefined ? bbox.y : 0)
    const width = bbox.width !== undefined ? bbox.width : 0
    const height = bbox.height !== undefined ? bbox.height : 0

    return {
      id: face.face_id !== undefined ? face.face_id : index,
      emotion: face.emotion || 'unknown',
      confidence: normalizedConfidence,
      all_probs: face.all_probs || {},
      // Keep original bounding box (percentages from backend)
      box: {
        x: left,
        y: top,
        width: width,
        height: height
      },
      raw: face
    }
  })
}

/**
 * Calculates the display dimensions of an element using object-fit: contain
 * 
 * @param {number} containerW - Width of the container
 * @param {number} containerH - Height of the container
 * @param {number} mediaW - Natural width of the media (image/video)
 * @param {number} mediaH - Natural height of the media (image/video)
 * @returns {Object} { x, y, width, height } of the media inside the container
 */
export function getContainSize(containerW, containerH, mediaW, mediaH) {
  if (!containerW || !containerH || !mediaW || !mediaH) {
    return { x: 0, y: 0, width: containerW, height: containerH }
  }

  const containerRatio = containerW / containerH
  const mediaRatio = mediaW / mediaH

  let width, height, x, y

  if (containerRatio > mediaRatio) {
    // Container is wider than media
    height = containerH
    width = containerH * mediaRatio
    x = (containerW - width) / 2
    y = 0
  } else {
    // Container is taller than media
    width = containerW
    height = containerW / mediaRatio
    x = 0
    y = (containerH - height) / 2
  }

  return { x, y, width, height }
}

/**
 * Scales a bounding box from percentages to display pixels
 * 
 * @param {Object} box - Normalized box { x, y, width, height } in percentages
 * @param {Object} displayRect - Rect from getContainSize
 * @returns {Object} CSS styles { left, top, width, height } in pixels
 */
export function scaleBoxToDisplay(box, displayRect) {
  return {
    left: `${displayRect.x + (box.x * displayRect.width) / 100}px`,
    top: `${displayRect.y + (box.y * displayRect.height) / 100}px`,
    width: `${(box.width * displayRect.width) / 100}px`,
    height: `${(box.height * displayRect.height) / 100}px`
  }
}
