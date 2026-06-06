import os
import json
from flask import Flask, send_from_directory, jsonify

from backend_ml.movie_recommender import main as prepare_data

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.abspath(os.path.join(BASE_DIR, '..', 'frontend'))
FRONTEND_DIST = os.path.join(FRONTEND_DIR, 'dist')
FRONTEND_PUBLIC = os.path.join(FRONTEND_DIR, 'public')

MOVIES_JSON_LOCATIONS = [
    os.path.join(FRONTEND_PUBLIC, 'movies_data.json'),
    os.path.join(BASE_DIR, 'movies_data.json'),
    os.path.join(FRONTEND_DIST, 'movies_data.json')
]

app = Flask(__name__, static_folder=FRONTEND_DIST if os.path.exists(FRONTEND_DIST) else None)

def find_movies_json():
    for p in MOVIES_JSON_LOCATIONS:
        if os.path.exists(p):
            return p
    return None

@app.route('/api/movies')
def api_movies():
    p = find_movies_json()
    if not p:
        # attempt to generate data (may take a while)
        prepare_data()
        p = find_movies_json()
        if not p:
            return jsonify({"error": "movies data not available"}), 500
    with open(p, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return jsonify(data)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    # Serve frontend static files if built
    dist = os.path.abspath(FRONTEND_DIST)
    index = os.path.join(dist, 'index.html')
    if path and os.path.exists(os.path.join(dist, path)):
        return send_from_directory(dist, path)
    if os.path.exists(index):
        return send_from_directory(dist, 'index.html')
    return jsonify({"message": "Frontend build not found. Run `npm run build` in frontend and redeploy."}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=True)
