import os
import sys
import ast
import json
import pickle
import urllib.request
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Try to import NLTK, fallback to basic stemmer if it fails
try:
    import nltk
    from nltk.stem.porter import PorterStemmer
    HAS_NLTK = True
except ImportError:
    HAS_NLTK = False
    print("Warning: NLTK not found. Will attempt to install it or use fallback.")

# Dataset mirrors
MOVIES_MIRRORS = [
    "https://raw.githubusercontent.com/fenago/datasets/refs/heads/main/tmdb_5000_movies.csv",
    "https://raw.githubusercontent.com/noahjett/Movie-Goodreads-Analysis/master/tmdb_5000_movies.csv",
    "https://raw.githubusercontent.com/alura-cursos/data-science-analise-exploratoria/main/Aula_0/tmdb_5000_movies.csv"
]

CREDITS_MIRRORS = [
    "https://raw.githubusercontent.com/fenago/datasets/refs/heads/main/tmdb_5000_credits.csv",
    "https://raw.githubusercontent.com/noahjett/Movie-Goodreads-Analysis/master/tmdb_5000_credits.csv"
]

def download_file(url_list, dest_path):
    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    if os.path.exists(dest_path) and os.path.getsize(dest_path) > 1024 * 1024:
        print(f"File already exists and looks valid: {dest_path}")
        return True
    
    for url in url_list:
        try:
            print(f"Attempting to download from {url}...")
            req = urllib.request.Request(
                url, 
                headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
            )
            with urllib.request.urlopen(req, timeout=30) as response:
                with open(dest_path, 'wb') as out_file:
                    out_file.write(response.read())
            print(f"Successfully downloaded to {dest_path}")
            return True
        except Exception as e:
            print(f"Failed to download from {url}. Error: {e}")
    return False

def convert_genres_keywords(text):
    L = []
    try:
        for i in ast.literal_eval(text):
            L.append(i['name'])
    except Exception:
        pass
    return L

def convert_cast(text):
    L = []
    counter = 0
    try:
        for i in ast.literal_eval(text):
            if counter < 3:
                L.append(i['name'])
                counter += 1
            else:
                break
    except Exception:
        pass
    return L

def fetch_director(text):
    try:
        for i in ast.literal_eval(text):
            if i['job'] == 'Director':
                return [i['name']]
    except Exception:
        pass
    return []

def collapse(L):
    L1 = []
    for i in L:
        L1.append(i.replace(" ", ""))
    return L1

def main():
    print("--- Starting Movie Recommender Data Preparation Pipeline ---")
    
    # Create dataset directories
    base_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_dir = os.path.join(base_dir, "dataset")
    os.makedirs(dataset_dir, exist_ok=True)
    
    movies_csv = os.path.join(dataset_dir, "tmdb_5000_movies.csv")
    credits_csv = os.path.join(dataset_dir, "tmdb_5000_credits.csv")
    
    # 1. Download Datasets
    if not download_file(MOVIES_MIRRORS, movies_csv):
        print("Error: Could not download tmdb_5000_movies.csv from any mirror.")
        sys.exit(1)
        
    if not download_file(CREDITS_MIRRORS, credits_csv):
        print("Error: Could not download tmdb_5000_credits.csv from any mirror.")
        sys.exit(1)
        
    # 2. Load Datasets
    print("Loading datasets...")
    movies_df = pd.read_csv(movies_csv)
    credits_df = pd.read_csv(credits_csv)
    
    print(f"Movies Shape: {movies_df.shape}")
    print(f"Credits Shape: {credits_df.shape}")
    
    # 3. Merge Datasets
    print("Merging datasets on title...")
    movies = movies_df.merge(credits_df, on='title')
    print(f"Merged Shape: {movies.shape}")
    
    # 4. Clean Columns & Parse JSON fields
    print("Parsing JSON metadata columns (genres, keywords, cast, crew)...")
    movies['genres_list'] = movies['genres'].apply(convert_genres_keywords)
    movies['keywords_list'] = movies['keywords'].apply(convert_genres_keywords)
    movies['cast_list'] = movies['cast'].apply(convert_cast)
    movies['crew_list'] = movies['crew'].apply(fetch_director)
    
    # Overview preprocessing
    movies['overview_list'] = movies['overview'].apply(lambda x: x.split() if isinstance(x, str) else [])
    
    # Keep copies of original cleaned features for final UI display (non-collapsed)
    movies['display_genres'] = movies['genres_list']
    
    # 5. Collapse spaces to create unique tags (e.g. Science Fiction -> ScienceFiction)
    print("Collapsing spaces in metadata tags...")
    movies['genres_collapsed'] = movies['genres_list'].apply(collapse)
    movies['keywords_collapsed'] = movies['keywords_list'].apply(collapse)
    movies['cast_collapsed'] = movies['cast_list'].apply(collapse)
    movies['crew_collapsed'] = movies['crew_list'].apply(collapse)
    
    # 6. Create unified tags column
    print("Creating combined tag database...")
    movies['tags'] = (
        movies['overview_list'] + 
        movies['genres_collapsed'] + 
        movies['keywords_collapsed'] + 
        movies['cast_collapsed'] + 
        movies['crew_collapsed']
    )
    
    # Convert tag lists to single strings
    movies['tags_str'] = movies['tags'].apply(lambda x: " ".join(x).lower())
    
    # 7. Apply Stemming
    print("Applying stemming using PorterStemmer...")
    if HAS_NLTK:
        ps = PorterStemmer()
        def stem(text):
            return " ".join([ps.stem(word) for word in text.split()])
        movies['tags_stemmed'] = movies['tags_str'].apply(stem)
    else:
        # Simple fallback stemmer if NLTK is not imported yet
        print("NLTK not loaded yet, using simple word stemmer...")
        movies['tags_stemmed'] = movies['tags_str'] # Fallback
        
    # 8. Use CountVectorizer to create vectors
    print("Vectorizing tags using CountVectorizer...")
    cv = CountVectorizer(max_features=5000, stop_words='english')
    vectors = cv.fit_transform(movies['tags_stemmed']).toarray()
    
    # 9. Compute Cosine Similarity
    print("Computing Cosine Similarity matrix...")
    similarity = cosine_similarity(vectors)
    print(f"Similarity matrix shape: {similarity.shape}")
    
    # 10. Save processed pickles (for ML Requirements)
    movies_pkl_path = os.path.join(base_dir, "movies.pkl")
    similarity_pkl_path = os.path.join(base_dir, "similarity.pkl")
    
    print(f"Saving movies.pkl to {movies_pkl_path}...")
    # Save a dictionary version of movies to make pickle load simple
    pickle.dump(movies.to_dict(orient='records'), open(movies_pkl_path, 'wb'))
    
    print(f"Saving similarity.pkl to {similarity_pkl_path}...")
    pickle.dump(similarity, open(similarity_pkl_path, 'wb'))
    
    # 11. Generate static JSON file for Frontend
    print("Generating movies_data.json for client-side queries...")
    
    # Prepare details for all movies
    movies_list_json = []
    
    for idx, row in movies.iterrows():
        # Compute top 5 recommendations for this movie
        distances = similarity[idx]
        movie_indices = sorted(list(enumerate(distances)), reverse=True, key=lambda x: x[1])
        
        recommendations = []
        # Exclude the movie itself (at index 0)
        for i in movie_indices[1:6]:
            rec_row = movies.iloc[i[0]]
            
            # Format release year
            year_val = "N/A"
            if isinstance(rec_row['release_date'], str) and len(rec_row['release_date']) >= 4:
                year_val = rec_row['release_date'][:4]
                
            recommendations.append({
                "id": int(rec_row['movie_id']),
                "title": str(rec_row['title']),
                "rating": float(rec_row['vote_average']) if not pd.isna(rec_row['vote_average']) else 0.0,
                "year": year_val,
                "genres": rec_row['display_genres']
            })
            
        # Format current movie release year
        current_year = "N/A"
        if isinstance(row['release_date'], str) and len(row['release_date']) >= 4:
            current_year = row['release_date'][:4]
            
        movies_list_json.append({
            "id": int(row['movie_id']),
            "title": str(row['title']),
            "rating": float(row['vote_average']) if not pd.isna(row['vote_average']) else 0.0,
            "year": current_year,
            "genres": row['display_genres'],
            "overview": str(row['overview']) if isinstance(row['overview'], str) else "",
            "recommendations": recommendations
        })
        
    # Save JSON to frontend/public folder (will create directory if not exists yet)
    frontend_public_dir = os.path.abspath(os.path.join(base_dir, "..", "frontend", "public"))
    os.makedirs(frontend_public_dir, exist_ok=True)
    movies_json_path = os.path.join(frontend_public_dir, "movies_data.json")
    
    print(f"Saving movies_data.json to {movies_json_path}...")
    with open(movies_json_path, 'w', encoding='utf-8') as f:
        json.dump(movies_list_json, f, ensure_ascii=False, indent=2)
        
    print("--- ML Data Pipeline Completed Successfully! ---")

if __name__ == "__main__":
    main()
