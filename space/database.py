import sqlite3
import os
from datetime import datetime, timedelta

DB_PATH = os.path.join(os.path.dirname(__file__), 'emotionai_stats.db')

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS detection_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            source TEXT NOT NULL,
            detected_faces INTEGER NOT NULL DEFAULT 0,
            top_emotion TEXT,
            confidence REAL,
            latency_ms REAL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

def save_log(source, detected_faces, top_emotion, confidence, latency_ms):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO detection_logs (source, detected_faces, top_emotion, confidence, latency_ms)
        VALUES (?, ?, ?, ?, ?)
    ''', (source, detected_faces, top_emotion, confidence, latency_ms))
    conn.commit()
    conn.close()

def get_dashboard_stats(days=7):
    conn = get_connection()
    cursor = conn.cursor()
    
    # Summary metrics
    cursor.execute("SELECT COUNT(*) FROM detection_logs")
    total_scans = cursor.fetchone()[0]
    
    cursor.execute("SELECT AVG(confidence) FROM detection_logs WHERE confidence IS NOT NULL")
    avg_confidence = cursor.fetchone()[0] or 0
    
    cursor.execute("SELECT AVG(latency_ms) FROM detection_logs WHERE latency_ms IS NOT NULL")
    avg_latency = cursor.fetchone()[0] or 0
    
    # Trend data
    # We want last X days
    trend = []
    for i in range(days - 1, -1, -1):
        date = (datetime.now() - timedelta(days=i)).strftime('%Y-%m-%d')
        cursor.execute("SELECT COUNT(*) FROM detection_logs WHERE DATE(created_at) = ?", (date,))
        count = cursor.fetchone()[0]
        
        # Friendly label (Mon, Tue, etc.)
        label = (datetime.now() - timedelta(days=i)).strftime('%a')
        trend.append({
            "label": label,
            "date": date,
            "scans": count
        })
        
    # Emotion distribution
    cursor.execute('''
        SELECT top_emotion as emotion, COUNT(*) as count 
        FROM detection_logs 
        WHERE top_emotion IS NOT NULL 
        GROUP BY top_emotion 
        ORDER BY count DESC
    ''')
    distribution = [dict(row) for row in cursor.fetchall()]
    
    conn.close()
    
    return {
        "total_scans": total_scans,
        "avg_confidence": avg_confidence,
        "avg_latency_ms": avg_latency,
        "trend": trend,
        "emotion_distribution": distribution
    }
