import React from 'react';
import { motion } from 'framer-motion';
import MovieCard from './MovieCard';

// Skeleton Loader Card for modern UX during searches
const SkeletonCard = () => (
  <div className="bg-netflix-dark rounded-xl overflow-hidden border border-white/5 shadow-card-glow flex flex-col h-full animate-pulse">
    <div className="aspect-[2/3] w-full bg-white/5 flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5" />
    </div>
    <div className="p-4 flex flex-col flex-grow justify-between">
      <div>
        <div className="h-4 bg-white/10 rounded w-3/4 mb-2.5" />
        <div className="h-3 bg-white/5 rounded w-1/2" />
      </div>
      <div className="flex gap-1.5 mt-3">
        <div className="h-4 bg-white/5 rounded w-12" />
        <div className="h-4 bg-white/5 rounded w-12" />
      </div>
    </div>
  </div>
);

export default function RecommendationList({ recommendations, loading, apiKey, onMovieClick, selectedMovieName }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: "spring", 
        stiffness: 70, 
        damping: 15 
      } 
    }
  };

  if (loading) {
    return (
      <div className="w-full">
        <h3 className="text-xl md:text-2xl font-bold tracking-wide text-white uppercase mb-6 flex items-center space-x-2">
          <span className="w-2.5 h-6 bg-netflix-red rounded-sm" />
          <span>Finding Matches...</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Array(5).fill(0).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <h3 className="text-xl md:text-2xl font-black tracking-wider text-white uppercase mb-6 flex items-center space-x-3">
        <span className="w-2.5 h-6 bg-netflix-red rounded-sm shadow-red-glow" />
        <span>Because you liked <span className="text-netflix-red text-glow-red font-black">"{selectedMovieName}"</span></span>
      </h3>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
      >
        {recommendations.map((movie) => (
          <motion.div key={movie.id} variants={itemVariants}>
            <MovieCard
              movie={movie}
              apiKey={apiKey}
              onClick={onMovieClick}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
