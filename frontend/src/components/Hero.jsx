import React from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaInfoCircle } from 'react-icons/fa';

export default function Hero({ onStartSearch }) {
  return (
    <div className="relative w-full h-[85vh] md:h-[95vh] flex items-center justify-start overflow-hidden bg-netflix-black">
      {/* Background Cinematic Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40 transition-transform duration-10000 scale-105"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1600&q=80')` 
        }}
      />
      
      {/* Gradients to blend banner */}
      <div className="absolute inset-0 bg-gradient-to-r from-netflix-black via-netflix-black/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-transparent to-netflix-black/30" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl px-6 md:px-12 mt-16 flex flex-col space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center space-x-2 bg-netflix-red/25 border border-netflix-red/50 px-3 py-1 rounded-full text-netflix-red text-xs md:text-sm font-bold w-fit uppercase tracking-widest"
        >
          <span>Machine Learning Recommender</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-7xl font-black tracking-tight text-white leading-tight uppercase"
        >
          Discover Your Next <br />
          <span className="text-netflix-red text-glow-red">Favorite Movie</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-sm md:text-lg text-gray-300 max-w-2xl leading-relaxed font-light"
        >
          Enter a movie you love and CineMatch uses high-dimensional vector representations 
          (Bag of Words, Stemming, and Cosine Similarity) to instantly calculate 
          textual matches across genres, cast list, director, and plot overview. 
          Get instant, mathematically-backed recommendations.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap gap-4 pt-2"
        >
          <button
            onClick={onStartSearch}
            className="flex items-center space-x-3 bg-netflix-red hover:bg-red-700 text-white font-bold px-6 py-3.5 rounded-lg shadow-lg hover:shadow-red-650/40 hover:scale-105 transition-all duration-300 cursor-pointer text-sm md:text-base"
          >
            <FaPlay className="text-xs md:text-sm" />
            <span>Search Recommendations</span>
          </button>
          
          <button
            onClick={() => document.getElementById('algorithm-details')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center space-x-3 bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3.5 rounded-lg border border-white/15 hover:scale-105 transition-all duration-300 cursor-pointer text-sm md:text-base"
          >
            <FaInfoCircle className="text-sm" />
            <span>How it Works</span>
          </button>
        </motion.div>
      </div>

      {/* Floating tag indicating model metrics */}
      <div className="absolute bottom-10 right-6 md:right-12 z-15 hidden sm:flex flex-col space-y-1 bg-white/5 border border-white/10 backdrop-blur-md rounded-xl p-4 text-xs font-mono shadow-xl">
        <span className="text-netflix-red font-bold uppercase tracking-wider text-[10px]">Model Information</span>
        <div className="text-gray-400">Dataset: <span className="text-white">TMDB 5000 Movies</span></div>
        <div className="text-gray-400">Features: <span className="text-white">Genres, Cast, Crew, Plot</span></div>
        <div className="text-gray-400">Algorithm: <span className="text-white">Cosine Similarity</span></div>
      </div>
    </div>
  );
}
