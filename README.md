# CineMatch: ML-Powered Movie Recommendation System

CineMatch is a modern, responsive, and visually stunning Netflix-inspired Movie Recommendation System. Built as a full-stack project, it uses a Python Machine Learning data pipeline to process raw film metadata and calculate similarity metrics, which are consumed by a React.js (Vite + Tailwind CSS + Framer Motion) frontend. 

The application uses a serverless static architecture where recommendations and search terms are pre-calculated by the Python ML pipeline and served as a local static dataset, providing instant auto-suggestions, search results, and recommendations with **0 server latency**.

---

## 🚀 Key Features

1. **Netflix-Inspired Premium Design**: A sleek dark mode UI utilizing deep carbon background tones (`#0B0B0B`), signature primary red colors (`#E50914`), modern typography, glassmorphism overlays, and premium card layouts.
2. **Instant Search & Autocomplete**: Search bar with real-time dropdown auto-suggestions for all 4803 movies as you type, supporting arrow-key keyboard navigation and mouse interactions.
3. **Precomputed Recommendation Engine**: Staggered spring-animated grid cards displaying the top 5 similar movies for any selection, complete with release year, ratings, and genre tags.
4. **Official TMDB Poster Fetching**: Dynamic loading of official high-resolution movie poster graphics directly from TMDB's imagery server.
5. **Dynamic Fallback SVG Poster Generator**: If no TMDB API key is specified, or a network request fails, CineMatch dynamically generates beautiful, custom-styled gradient card covers matching the movie's primary genre.
6. **Built-in Key Configuration**: A settings panel in the navigation bar allows users to input their own TMDB API key, which is saved locally in the browser's `localStorage` for future sessions.
7. **Curated Trending Row**: A snapping, horizontally scrollable list showing curated popular films (such as *Interstellar*, *Inception*, and *The Dark Knight*) that users can click to instantly get matching suggestions.

---

## 🛠️ Technology Stack

### Frontend Architecture
- **React.js (Vite)**: Component-based reactive UI rendering.
- **Tailwind CSS v4**: Utility styling, theme configurations, custom shadows, and glassmorphism definitions.
- **Framer Motion**: Smooth entry transitions, stagger layout variants, and hover scaling animations.
- **Axios**: Network requests to fetch official movie posters from TMDB.
- **React Icons**: Movie, database, settings, and interface iconography.

### Machine Learning Pipeline (Python)
- **Pandas & NumPy**: Data loading, cleaning, and matrix manipulations.
- **Scikit-Learn**: Vectorizing textual labels and calculating cosine similarity distances.
- **NLTK (Natural Language Toolkit)**: Stemming words to their root representations using `PorterStemmer`.
- **Pickle**: Serializing processed datasets and models as Python artifacts.

---

## 📐 Machine Learning Pipeline Details

The recommender model uses **Content-Based Filtering** to match movies. The Python script (`movie_recommender.py`) executes the following operations:

1. **Data Ingestion & Merging**: Reads the TMDB 5000 Movies and Credits datasets, joining them on the movie `title` key.
2. **Metadata Feature Selection**: Keeps critical features: `movie_id`, `title`, `overview`, `genres`, `keywords`, `cast`, and `crew`.
3. **JSON Parsing & Cleaning**: Converts stringified JSON columns into flat lists. It extracts:
   - Primary `genres` and `keywords`.
   - Top 3 billing actors from `cast`.
   - The movie's Director from `crew` (job = "Director").
4. **Token Collapse**: Removes spacing from names and multi-word terms (e.g. `"Science Fiction"` to `"ScienceFiction"`, `"James Cameron"` to `"JamesCameron"`). This ensures entities are treated as a single token during classification.
5. **Stemming (Porter Stemmer)**: Standardizes words by converting them to their linguistic root (e.g., `loving`, `loved` -> `love`).
6. **Vectorization**: Transforms combined text tags into a 5000-dimensional bag-of-words vector space using `CountVectorizer` (excluding English stop words).
7. **Similarity Computation**: Computes a cosine similarity matrix representing the angular separation between all 4803 movies.
8. **Static Exporter**: Maps each movie to its metadata and its calculated top 5 nearest-neighbor movies, exporting it as `movies_data.json` directly into the React app's public assets folder.

---

## 📂 Project Structure

```
movie-recommendation-system/
├── frontend/
│   ├── dist/                     # Compiled production assets
│   ├── public/
│   │   └── movies_data.json      # Static recommendations lookup table
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Netflix logo, navigation, and API settings
│   │   │   ├── Hero.jsx          # Cinematic banner, text intro, and CTAs
│   │   │   ├── SearchBar.jsx     # Dropdown suggestions & keyboard nav
│   │   │   ├── MovieCard.jsx     # Poster renderer and custom gradient generator
│   │   │   ├── RecommendationList.jsx # Loading skeletons, staggers
│   │   │   └── Footer.jsx        # Stack listings and Kaggle details
│   │   ├── pages/
│   │   │   └── Home.jsx          # Search and trending layout coordinator
│   │   ├── App.jsx               # Navigation mount
│   │   ├── index.css             # Tailwind imports and custom animations
│   │   └── main.jsx
│   ├── index.html                # Entrypoint, SEO keywords and preconnects
│   ├── postcss.config.js         # PostCSS plugins Configuration
│   ├── tailwind.config.js        # Custom theme variables
│   └── package.json              # Client dependencies
├── backend_ml/
│   ├── dataset/                  # Raw TMDB dataset csv files
│   │   ├── tmdb_5000_movies.csv
│   │   └── tmdb_5000_credits.csv
│   ├── movie_recommender.py      # ML data training & export script
│   ├── movies.pkl                # Serialized dictionary of movies
│   └── similarity.pkl            # Serialized cosine similarity matrix
├── .gitignore                    # Prevents tracking large datasets/pickles
└── README.md                     # Documentation
```

---

## ⚙️ Installation & Local Setup

### Prerequisite Environment
- Python 3.8+ (with `pip`)
- Node.js v18+ (with `npm`)

### 1. Set Up the Machine Learning Pipeline
1. Navigate to the `backend_ml` directory:
   ```bash
   cd backend_ml
   ```
2. Install Python dependencies:
   ```bash
   pip install pandas numpy scikit-learn nltk
   ```
3. Run the recommender training script. This script checks for the TMDB CSV files locally. If they do not exist, it will automatically download them from verified repository mirrors:
   ```bash
   python movie_recommender.py
   ```
   *This generates `movies.pkl`, `similarity.pkl` locally, and exports `movies_data.json` to `../frontend/public/movies_data.json`.*

### 2. Set Up the React Frontend
1. Navigate to the `frontend` directory:
   ```bash
   cd ../frontend
   ```
2. Install client dependencies:
   ```bash
   npm install
   ```
3. Start the Vite local development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

---

## 🎨 Design Theme Reference

- **Primary Accent**: `#E50914` (Netflix Red)
- **Background**: `#0B0B0B` (Rich Cinematic Charcoal Black)
- **Card/Secondary**: `#141414` (Deep Grey-Black)
- **Glow Accents**: `rgba(229, 9, 20, 0.6)`
- **Fonts**: `Outfit` (Primary headings, tracking-wide), `Inter` (Body copy, high legibility)

---

## 📦 Deployment Guide

### Deploying Frontend to Vercel (Recommended)
Because this application runs entirely client-side using pre-calculated JSON data, it can be deployed directly to static hosts.
1. Install the Vercel CLI or import the repository on the [Vercel Dashboard](https://vercel.com).
2. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run dev` or `npm run build`
   - **Output Directory**: `dist`
3. If you want to pre-configure a default TMDB API Key, add a new Environment Variable in the Vercel Dashboard:
   - **Name**: `VITE_TMDB_API_KEY`
   - **Value**: `[your_32_character_hex_key]`
4. Deploy! The application will load `movies_data.json` static file on mount and work instantly.
