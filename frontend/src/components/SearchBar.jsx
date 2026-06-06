import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function SearchBar({ movieTitles, onSearch }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  
  const containerRef = useRef(null);

  // Close suggestions dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update suggestions when query changes
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const filtered = movieTitles
      .filter((title) => title.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5); // Limit suggestions to 5 items

    setSuggestions(filtered);
    setIsOpen(true);
    setActiveIndex(-1);
  }, [query, movieTitles]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setIsOpen(false);
    }
  };

  const handleSuggestionClick = (title) => {
    setQuery(title);
    onSearch(title);
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        const selected = suggestions[activeIndex];
        setQuery(selected);
        onSearch(selected);
        setIsOpen(false);
      } else {
        handleSubmit();
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto z-40">
      <form onSubmit={handleSubmit} className="flex items-center w-full relative">
        <div className="relative flex-grow">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => query && setIsOpen(true)}
            placeholder="Type a movie name (e.g., Interstellar, Avatar)..."
            className="w-full bg-netflix-dark/60 text-white placeholder-gray-400 font-medium text-sm md:text-base pl-12 pr-10 py-4 rounded-l-xl md:rounded-l-2xl outline-none border border-white/10 focus:border-netflix-red/50 focus:bg-netflix-dark/95 backdrop-blur-xl transition-all duration-300 shadow-lg"
          />
          
          {/* Search Icon */}
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base md:text-lg" />
          
          {/* Clear Button */}
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <FaTimes size={16} />
            </button>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!query.trim()}
          className="bg-netflix-red hover:bg-red-700 disabled:bg-red-950/65 text-white font-bold text-sm md:text-base px-6 md:px-8 py-4 rounded-r-xl md:rounded-r-2xl border border-netflix-red/80 hover:border-transparent transition-all duration-300 flex items-center justify-center cursor-pointer shadow-lg active:scale-95 disabled:cursor-not-allowed"
        >
          <span>Match</span>
        </button>
      </form>

      {/* Auto Suggestions Dropdown */}
      <AnimatePresence>
        {isOpen && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 w-full mt-2 bg-netflix-dark border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50 backdrop-blur-xl"
          >
            <ul className="py-2">
              {suggestions.map((title, index) => (
                <li
                  key={title}
                  onClick={() => handleSuggestionClick(title)}
                  className={`px-5 py-3.5 text-sm md:text-base text-gray-200 cursor-pointer flex items-center space-x-3 transition-colors duration-200 ${
                    activeIndex === index
                      ? 'bg-netflix-red/20 text-white border-l-4 border-netflix-red pl-4'
                      : 'hover:bg-white/5 border-l-4 border-transparent'
                  }`}
                >
                  <FaSearch className="text-xs text-gray-500" />
                  <span className="font-medium">{title}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
