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

  // Debounce search to avoid too many API calls
  useEffect(() => {
    console.log('useEffect triggered, searchQuery:', searchQuery, 'length:', searchQuery.length); // Debug
    
    if (searchQuery.trim().length >= 2) {
      console.log('Search query is >= 2 characters, setting timeout'); // Debug
      
      // Clear previous timeout
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        console.log('Cleared previous timeout'); // Debug
      }
      
      // Set new timeout
      debounceRef.current = setTimeout(() => {
        console.log('Timeout executed, calling fetchSuggestions'); // Debug
        fetchSuggestions(searchQuery.trim());
      }, 300);

      return () => {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }
      };
    } else {
      console.log('Search query too short, clearing suggestions'); // Debug
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const fetchSuggestions = async (query) => {
    console.log('🔍 Fetching suggestions for:', query); // Debug
    setLoading(true);
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/products/search-suggestions?q=${encodeURIComponent(query)}`;
      console.log('API URL:', url); // Debug
      console.log('Environment API URL:', process.env.NEXT_PUBLIC_API_URL); // Debug
      
      const response = await fetch(url);
      console.log('Response status:', response.status); // Debug
      
      if (response.ok) {
        const result = await response.json();
        console.log('API Result:', result); // Debug
        if (result.success) {
          console.log('Setting suggestions:', result.data); // Debug
          setSuggestions(result.data);
          setShowSuggestions(result.data.length > 0);
        } else {
          console.log('API returned success: false'); // Debug
        }
      } else {
        console.log('Response not ok:', response.status, response.statusText); // Debug
      }
    } catch (error) {
      console.error('Search suggestions error:', error);
    } finally {
      setLoading(false);
      console.log('Loading set to false'); // Debug
    }
  };

  const handleSearch = (e, selectedSuggestion = null) => {
    console.log('handleSearch called with:', selectedSuggestion); // Debug
    e.preventDefault();
    const query = selectedSuggestion || searchQuery.trim();
    
    if (query) {
      console.log('Navigating to search with query:', query); // Debug
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setSearchQuery('');
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const handleKeyDown = (e) => {
    console.log('Key pressed:', e.key); // Debug
    
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter') {
        console.log('Enter pressed, no suggestions showing'); // Debug
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
    console.log('Input changed:', e.target.value); // Debug
    setSearchQuery(e.target.value);
    setSelectedIndex(-1);
  };

  const handleSuggestionClick = (suggestion) => {
    console.log('Suggestion clicked:', suggestion.name); // Debug
    const fakeEvent = { preventDefault: () => {} };
    handleSearch(fakeEvent, suggestion.name);
  };

  const handleInputFocus = () => {
    console.log('Input focused, searchQuery:', searchQuery, 'suggestions:', suggestions.length); // Debug
    if (searchQuery.length >= 2 && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        console.log('Clicked outside, closing suggestions'); // Debug
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

  console.log('Render - showSuggestions:', showSuggestions, 'suggestions.length:', suggestions.length); // Debug

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
          className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
        <div 
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
        >
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
              {suggestion.image && (
                <img
                  src={suggestion.image}
                  alt={suggestion.name}
                  className="w-10 h-10 object-cover rounded-md flex-shrink-0"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
              
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate">
                  {highlightText(suggestion.name, searchQuery)}
                </div>
                
                {suggestion.category && (
                  <div className="text-sm text-gray-500 truncate">
                    {suggestion.category}
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