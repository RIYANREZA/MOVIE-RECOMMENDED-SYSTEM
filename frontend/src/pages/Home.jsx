import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import SearchBar from '../components/SearchBar';
import RecommendationList from '../components/RecommendationList';
import MovieCard from '../components/MovieCard';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { FaFire, FaDatabase, FaExchangeAlt, FaCog } from 'react-icons/fa';

// Curated list of high-popularity titles from TMDB 5000 for the trending row
const TRENDING_TITLES = [
  "Interstellar",
  "Inception",
  "The Dark Knight",
  "Avatar",
  "The Avengers",
  "Deadpool",
  "The Martian",
  "Guardians of the Galaxy",
  "Fight Club",
  "Titanic"
];

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [movieTitles, setMovieTitles] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Load custom API key from localStorage
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('tmdb_api_key') || '';
  });

  const searchSectionRef = useRef(null);
  const recommendationSectionRef = useRef(null);

  // Fetch static movies database on mount
  useEffect(() => {
    fetch('/movies_data.json')
      .then((res) => res.json())
      .then((data) => {
        setMovies(data);
        const titles = data.map(m => m.title);
        setMovieTitles(titles);

        // Filter and arrange trending movies list
        const trending = data.filter(m => 
          TRENDING_TITLES.some(t => t.toLowerCase() === m.title.toLowerCase())
        );
        // Sort according to our trending list order
        trending.sort((a, b) => {
          return TRENDING_TITLES.findIndex(t => t.toLowerCase() === a.title.toLowerCase()) - 
                 TRENDING_TITLES.findIndex(t => t.toLowerCase() === b.title.toLowerCase());
        });
        setTrendingMovies(trending);
      })
      .catch((err) => {
        console.error("Failed to load movies dataset:", err);
        setError("Error loading movie database. Please make sure the data pipeline has run.");
      });
  }, []);

  const handleSearch = (movieTitle) => {
    setError('');
    setLoading(true);
    
    // Scroll to search area first
    searchSectionRef.current?.scrollIntoView({ behavior: 'smooth' });

    // Simulate model search time for a premium UX loading experience
    setTimeout(() => {
      const match = movies.find(
        (m) => m.title.toLowerCase() === movieTitle.toLowerCase()
      );

      if (match) {
        setSelectedMovie(match);
        setRecommendations(match.recommendations);
        
        // Scroll to recommendations list once loaded
        setTimeout(() => {
          recommendationSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        setError(`Movie "${movieTitle}" was not found in our database. Please select from suggestions.`);
        setSelectedMovie(null);
        setRecommendations([]);
      }
      setLoading(false);
    }, 800);
  };

  const handleMovieCardClick = (movie) => {
    // Look up the full movie data (since recommendation lists only contain slim items)
    const fullMovie = movies.find(m => m.id === movie.id);
    if (fullMovie) {
      handleSearch(fullMovie.title);
    }
  };

  const scrollToSearch = () => {
    searchSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-netflix-black min-h-screen flex flex-col font-sans select-none">
      <Navbar apiKey={apiKey} setApiKey={setApiKey} />
      <Hero onStartSearch={scrollToSearch} />

      {/* Main Container */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-6 md:px-12 space-y-24 mt-12">
        
        {/* Search Panel Section */}
        <section 
          ref={searchSectionRef} 
          className="pt-16 scroll-mt-20 flex flex-col items-center justify-center space-y-8"
        >
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-wider text-white">
              Search Recommendations
            </h2>
            <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">
              Type the name of any movie you like, select from autocomplete, and let our cosine similarity model calculate recommendations.
            </p>
          </div>

          <SearchBar movieTitles={movieTitles} onSearch={handleSearch} />

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-netflix-red/10 border border-netflix-red/30 rounded-xl px-6 py-4 text-netflix-red text-sm font-semibold text-center max-w-lg shadow-md"
            >
              {error}
            </motion.div>
          )}
        </section>

        {/* Dynamic Recommendations Section */}
        <section 
          ref={recommendationSectionRef} 
          className="scroll-mt-24 min-h-[300px] flex items-center justify-center"
        >
          {loading || selectedMovie ? (
            <RecommendationList
              recommendations={recommendations}
              loading={loading}
              apiKey={apiKey}
              onMovieClick={handleMovieCardClick}
              selectedMovieName={selectedMovie?.title}
            />
          ) : (
            <div className="text-center text-gray-500 py-12 border border-white/5 bg-netflix-dark/30 rounded-2xl w-full p-8">
              <p className="text-sm md:text-base italic">No active search. Type a movie above to calculate similar content matches.</p>
            </div>
          )}
        </section>

        {/* Trending Section (Netflix horizontal scroll) */}
        <section id="trending-section" className="scroll-mt-24 space-y-6">
          <div className="flex items-center space-x-3">
            <FaFire className="text-netflix-red text-xl md:text-2xl animate-pulse" />
            <h3 className="text-xl md:text-2xl font-black uppercase tracking-wider text-white">
              Trending Popular Movies
            </h3>
          </div>

          <div className="relative">
            {/* Scrollable list */}
            <div className="flex space-x-6 overflow-x-auto pb-6 pt-2 no-scrollbar netflix-scrollbar snap-x snap-mandatory scroll-smooth">
              {trendingMovies.map((movie) => (
                <div 
                  key={movie.id} 
                  className="flex-none w-[170px] sm:w-[200px] md:w-[220px] snap-start"
                >
                  <MovieCard
                    movie={movie}
                    apiKey={apiKey}
                    onClick={handleMovieCardClick}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Algorithm Explainers Section (suitable for resume/CS portfolio) */}
        <section id="algorithm-details" className="pt-8 border-t border-white/5 space-y-8">
          <div className="text-center space-y-2.5">
            <span className="text-xs font-bold text-netflix-red uppercase tracking-widest">Model Technical Summary</span>
            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-wider text-white">
              Recommendation Pipeline Details
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-netflix-dark/40 border border-white/5 rounded-2xl p-6 space-y-4">
              <div className="w-10 h-10 rounded-lg bg-netflix-red/10 text-netflix-red flex items-center justify-center font-bold">
                1
              </div>
              <h4 className="text-white font-extrabold text-base uppercase">Metadata Extraction</h4>
              <p className="text-xs text-gray-400 leading-relaxed font-light">
                Parses raw JSON from TMDB: extracts movie overview, genres, keywords, top 3 actors from credits, and the director. Spaces are collapsed (e.g., "James Cameron" to "JamesCameron") to preserve distinct entity identity.
              </p>
            </div>

            <div className="bg-netflix-dark/40 border border-white/5 rounded-2xl p-6 space-y-4">
              <div className="w-10 h-10 rounded-lg bg-netflix-red/10 text-netflix-red flex items-center justify-center font-bold">
                2
              </div>
              <h4 className="text-white font-extrabold text-base uppercase">Stemming & Bag-of-Words</h4>
              <p className="text-xs text-gray-400 leading-relaxed font-light">
                NLTK PorterStemmer reduces tokens to root forms. A scikit-learn CountVectorizer processes these tags, generating a 5000-dimensional sparse array representing keyword densities across the entire corpus.
              </p>
            </div>

            <div className="bg-netflix-dark/40 border border-white/5 rounded-2xl p-6 space-y-4">
              <div className="w-10 h-10 rounded-lg bg-netflix-red/10 text-netflix-red flex items-center justify-center font-bold">
                3
              </div>
              <h4 className="text-white font-extrabold text-base uppercase">Cosine Similarity Distance</h4>
              <p className="text-xs text-gray-400 leading-relaxed font-light">
                Measures angular distances between high-dimensional sparse movie vectors. The top five movies with the smallest angular separation are precalculated and cached, ensuring instantaneous lookup speed.
              </p>
            </div>

          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
