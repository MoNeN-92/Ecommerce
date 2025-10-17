// frontend/components/SearchBar.jsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const SearchBar = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ecommerce-production-3c82.up.railway.app/api';

  // Debounce search
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      
      debounceRef.current = setTimeout(() => {
        fetchSuggestions(searchQuery.trim());
      }, 300);

      return () => {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }
      };
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const fetchSuggestions = async (query) => {
    setLoading(true);
    try {
      // ✅ Fixed: Use correct backend endpoint
      const url = `${API_URL}/products/search?q=${encodeURIComponent(query)}`;
      console.log('🔍 Fetching suggestions from:', url);
      
      const response = await fetch(url);
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          console.log('✅ Found', result.data.length, 'products');
          setSuggestions(result.data.slice(0, 5)); // Show max 5 suggestions
          setShowSuggestions(result.data.length > 0);
        }
      }
    } catch (error) {
      console.error('❌ Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e, selectedSuggestion = null) => {
    e.preventDefault();
    const query = selectedSuggestion || searchQuery.trim();
    
    if (query) {
      console.log('🔍 Searching for:', query);
      router.push(`/products?search=${encodeURIComponent(query)}`);
      setSearchQuery('');
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter') {
        handleSearch(e);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > -1 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSearch(e, suggestions[selectedIndex].name);
        } else {
          handleSearch(e);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    setSelectedIndex(-1);
  };

  const handleSuggestionClick = (suggestion) => {
    const fakeEvent = { preventDefault: () => {} };
    handleSearch(fakeEvent, suggestion.name);
  };

  const handleInputFocus = () => {
    if (searchQuery.length >= 2 && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const highlightText = (text, query) => {
    if (!query) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="bg-yellow-200 font-semibold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md mx-4">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          placeholder="ძებნა..."
          className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-500"
          autoComplete="off"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </button>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`flex items-center space-x-3 px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors ${
                selectedIndex === index 
                  ? 'bg-blue-50 border-blue-200' 
                  : 'hover:bg-gray-50'
              }`}
            >
              {suggestion.image_url && (
                <img
                  src={suggestion.image_url}
                  alt={suggestion.name}
                  className="w-10 h-10 object-cover rounded-md flex-shrink-0"
                  onError={(e) => {
                    e.target.src = '/placeholder-product.png';
                  }}
                />
              )}
              
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate">
                  {highlightText(suggestion.name, searchQuery)}
                </div>
                
                {suggestion.category && (
                  <div className="text-sm text-gray-500 truncate">
                    {suggestion.category.name}
                  </div>
                )}
                
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm font-semibold text-blue-600">
                    ₾{parseFloat(suggestion.price).toFixed(2)}
                  </span>
                  
                  {suggestion.stock !== undefined && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      suggestion.stock > 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {suggestion.stock > 0 ? `მარაგში: ${suggestion.stock}` : 'არ არის'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {/* View All Results */}
          <div className="border-t border-gray-200 bg-gray-50">
            <button
              onClick={(e) => handleSearch(e)}
              className="w-full px-4 py-3 text-left text-blue-600 hover:bg-blue-50 font-medium transition-colors"
            >
              ყველა შედეგის ნახვა "{searchQuery}" -სთვის
            </button>
          </div>
        </div>
      )}
      
      {/* No Results */}
      {showSuggestions && suggestions.length === 0 && searchQuery.length >= 2 && !loading && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="px-4 py-8 text-center text-gray-500">
            <div className="text-4xl mb-2">🔍</div>
            <p>"{searchQuery}" -სთვის შედეგი არ მოიძებნა</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;