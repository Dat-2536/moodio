const STORAGE_KEY = 'emotionai_detection_logs'
const MAX_LOGS = 1000

/**
 * Saves a detection log to localStorage.
 * @param {Object} logData - The metadata of the detection.
 */
export function saveLocalLog({ source, detectedFaces, topEmotion, confidence, latencyMs }) {
  try {
    const logs = getLocalLogs()
    
    const newLog = {
      source,
      detectedFaces,
      topEmotion,
      confidence: confidence > 1 ? confidence / 100 : confidence, // Normalize to 0-1
      latencyMs,
      createdAt: new Date().toISOString()
    }
    
    logs.unshift(newLog)
    
    // Maintain retention policy
    const trimmedLogs = logs.slice(0, MAX_LOGS)
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedLogs))
  } catch (err) {
    console.warn('Failed to save log to localStorage:', err)
  }
}

/**
 * Retrieves all detection logs from localStorage.
 * @returns {Array} List of logs.
 */
export function getLocalLogs() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (err) {
    console.warn('Failed to read logs from localStorage:', err)
    return []
  }
}

/**
 * Computes dashboard statistics from local logs.
 * @param {number} days - Number of days to include in the trend.
 * @returns {Object} Statistics object.
 */
export function computeLocalStats(days = 7) {
  const logs = getLocalLogs()
  const now = new Date()
  const cutoffDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000))
  
  const filteredLogs = logs.filter(log => new Date(log.createdAt) >= cutoffDate)
  
  const totalScans = filteredLogs.length
  const avgConfidence = totalScans > 0 
    ? filteredLogs.reduce((acc, log) => acc + (log.confidence || 0), 0) / totalScans 
    : 0
  const avgLatency = totalScans > 0 
    ? filteredLogs.reduce((acc, log) => acc + (log.latencyMs || 0), 0) / totalScans 
    : 0
    
  // Trend data
  const trend = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000))
    const dateStr = d.toISOString().split('T')[0]
    const count = filteredLogs.filter(log => log.createdAt.startsWith(dateStr)).length
    
    trend.push({
      label: d.toLocaleDateString(undefined, { weekday: 'short' }),
      date: dateStr,
      scans: count
    })
  }
  
  // Emotion distribution
  const emotionCounts = {}
  filteredLogs.forEach(log => {
    if (log.topEmotion) {
      emotionCounts[log.topEmotion] = (emotionCounts[log.topEmotion] || 0) + 1
    }
  })
  
  const emotionDistribution = Object.entries(emotionCounts)
    .map(([emotion, count]) => ({ emotion, count }))
    .sort((a, b) => b.count - a.count)
    
  return {
    total_scans: totalScans,
    avg_confidence: avgConfidence,
    avg_latency_ms: avgLatency,
    trend,
    emotion_distribution: emotionDistribution
  }
}

/**
 * Clears all detection logs from localStorage.
 */
export function clearLocalLogs() {
  localStorage.removeItem(STORAGE_KEY)
}
