import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Mapping of movie genres to beautiful dark gradients for fallback poster generation
const getGenreGradient = (genres = []) => {
  const primaryGenre = genres[0] || '';
  switch (primaryGenre.toLowerCase()) {
    case 'action':
      return 'from-red-900 via-orange-950 to-netflix-black';
    case 'adventure':
      return 'from-amber-900 via-yellow-950 to-netflix-black';
    case 'science fiction':
    case 'sci-fi':
    case 'fantasy':
      return 'from-indigo-950 via-blue-900 to-netflix-black';
    case 'drama':
      return 'from-purple-950 via-indigo-950 to-netflix-black';
    case 'horror':
      return 'from-red-950 via-rose-950 to-netflix-black';
    case 'romance':
      return 'from-rose-900 via-pink-950 to-netflix-black';
    case 'comedy':
      return 'from-amber-800 via-orange-900 to-netflix-black';
    case 'thriller':
    case 'mystery':
    case 'crime':
      return 'from-teal-950 via-slate-900 to-netflix-black';
    case 'documentary':
      return 'from-emerald-950 via-zinc-900 to-netflix-black';
    default:
      return 'from-netflix-red/30 via-netflix-dark to-netflix-black';
  }
};

export default function MovieCard({ movie, apiKey, onClick }) {
  const [posterUrl, setPosterUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    if (!apiKey) {
      setPosterUrl(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    axios.get(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}`)
      .then(res => {
        if (isMounted && res.data && res.data.poster_path) {
          setPosterUrl(`https://image.tmdb.org/t/p/w500${res.data.poster_path}`);
        }
        setLoading(false);
      })
      .catch(() => {
        if (isMounted) {
          setPosterUrl(null);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [movie.id, apiKey]);

  const gradientClass = getGenreGradient(movie.genres);

  return (
    <motion.div
      onClick={() => onClick && onClick(movie)}
      whileHover={{ y: -8, scale: 1.03 }}
      className="bg-netflix-dark rounded-xl overflow-hidden border border-white/5 shadow-card-glow hover:border-netflix-red/50 hover:shadow-red-glow transition-all duration-300 cursor-pointer flex flex-col h-full group"
    >
      {/* Poster image container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-netflix-black flex items-center justify-center">
        {loading ? (
          <div className="absolute inset-0 bg-white/5 animate-pulse flex items-center justify-center">
            <span className="text-xs text-gray-500 font-mono">Loading Poster...</span>
          </div>
        ) : posterUrl ? (
          <img
            src={posterUrl}
            alt={movie.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          /* Premium Fallback Poster Graphic */
          <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} p-5 flex flex-col justify-between border-b border-white/10`}>
            {/* Top decorative elements */}
            <div className="flex justify-between items-start">
              <span className="text-[10px] uppercase font-mono tracking-widest text-netflix-red font-bold">
                CineMatch ML
              </span>
              <span className="text-[10px] text-gray-400 font-mono">{movie.year !== 'N/A' ? movie.year : ''}</span>
            </div>

            {/* Title & icon */}
            <div className="my-auto text-center px-2">
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center mx-auto mb-3 bg-white/5 text-netflix-red font-bold font-sans">
                C
              </div>
              <h4 className="text-white text-base md:text-lg font-black uppercase tracking-wide line-clamp-3 leading-tight">
                {movie.title}
              </h4>
            </div>

            {/* Bottom details */}
            <div className="flex flex-col space-y-1.5 text-left">
              <hr className="border-white/10" />
              <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider truncate">
                {movie.genres && movie.genres.slice(0, 2).join(' • ')}
              </div>
            </div>
          </div>
        )}

        {/* Rating Badge Overlay */}
        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center space-x-1 border border-white/10 z-10">
          <FaStar className="text-yellow-400 text-[10px]" />
          <span>{movie.rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Card Info Content */}
      <div className="p-4 flex flex-col flex-grow justify-between bg-netflix-dark">
        <div>
          <h3 className="text-white font-extrabold text-sm md:text-base tracking-wide line-clamp-1 group-hover:text-netflix-red transition-colors duration-200 uppercase">
            {movie.title}
          </h3>
          
          <div className="flex items-center space-x-2 mt-1.5 text-xs text-gray-400 font-medium">
            <span>{movie.year}</span>
            {movie.genres && movie.genres.length > 0 && (
              <>
                <span>•</span>
                <span className="truncate max-w-[120px]">{movie.genres[0]}</span>
              </>
            )}
          </div>
        </div>

        {/* Tiny tag for genre display */}
        {movie.genres && movie.genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {movie.genres.slice(0, 2).map((g) => (
              <span
                key={g}
                className="text-[9px] font-bold text-gray-300 bg-white/5 px-2 py-0.5 rounded border border-white/5"
              >
                {g}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
