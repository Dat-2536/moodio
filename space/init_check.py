import sys
import os

# Add parent dir to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from ai.database import init_db

try:
    print("Attempting to initialize database...")
    init_db()
    db_path = os.path.join(os.path.dirname(__file__), 'emotionai_stats.db')
    if os.path.exists(db_path):
        print(f"Success! Database created at: {db_path}")
    else:
        print("Database file still not found after init_db().")
except Exception as e:
    print(f"Error during manual init: {e}")
