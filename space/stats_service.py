import time
from .database import save_log, get_dashboard_stats, init_db

# Throttling state
last_webcam_log_time = 0

def extract_top_result(result):
    """
    Extracts the most confident face from the recognition result.
    """
    if not result:
        return 0, None, None
        
    # Handle the format used in main.py: {'faces': [...]}
    faces = result.get('faces', [])
    if faces:
        # Find face with max confidence
        top_face = max(faces, key=lambda x: x.get('confidence', 0))
        return len(faces), top_face.get('emotion'), top_face.get('confidence')
        
    # Handle direct prediction format: {'emotion': '...', 'confidence': ...}
    if 'emotion' in result:
        return 1, result.get('emotion'), result.get('confidence')
        
    return 0, None, None

def safe_save_detection_log(source, result, latency_ms):
    """
    Safely logs detection metadata without blocking or crashing the main process.
    """
    global last_webcam_log_time
    
    current_time = time.time()
    
    # Throttle webcam logs
    if source == 'webcam':
        if current_time - last_webcam_log_time < 1.0:
            return
        last_webcam_log_time = current_time
    
    try:
        detected_faces, top_emotion, confidence = extract_top_result(result)
        
        # Normalize confidence to 0-1
        if confidence is not None and confidence > 1.0:
            confidence = confidence / 100.0
            
        save_log(source, detected_faces, top_emotion, confidence, latency_ms)
    except Exception as e:
        # Log error to console but don't re-raise
        print(f"Stats Log Error: {e}")

def get_stats(range_type='week'):
    days = 7 if range_type == 'week' else 30
    return get_dashboard_stats(days)

# Initialize DB on import
try:
    init_db()
except Exception as e:
    print(f"Database Init Error: {e}")
