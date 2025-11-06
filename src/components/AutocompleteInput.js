import React, { useState, useEffect, useRef } from 'react';
import './AutocompleteInput.css';

const AutocompleteInput = ({ 
  value, 
  onChange, 
  placeholder, 
  disabled,
  onSelectSuggestion,
  API_KEY 
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Fetch suggestions from RAWG API
  const fetchSuggestions = async (searchTerm) => {
    if (!searchTerm || searchTerm.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.rawg.io/api/games?key=${API_KEY}&search=${encodeURIComponent(searchTerm)}&page_size=5`
      );
      const data = await response.json();
      
      if (data.results) {
        setSuggestions(data.results.map(game => ({
          id: game.id,
          name: game.name,
          released: game.released,
          background_image: game.background_image
        })));
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Debounce the search to avoid too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchSuggestions(value);
    }, 300); // 300ms delay

    return () => clearTimeout(timeoutId);
  }, [value]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target) &&
          suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    onChange(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    onChange(suggestion.name);
    setShowSuggestions(false);
    setSuggestions([]);
    if (onSelectSuggestion) {
      onSelectSuggestion(suggestion);
    }
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  return (
    <div className="autocomplete-container">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        placeholder={placeholder}
        disabled={disabled}
        className="autocomplete-input"
      />
      
      {loading && (
        <div className="suggestions-loading">Loading suggestions...</div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div ref={suggestionsRef} className="suggestions-list">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="suggestion-item"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="suggestion-content">
                
                <div className="suggestion-text">
                  <div className="suggestion-title">{suggestion.name}</div>
                  {suggestion.released && (
                    <div className="suggestion-meta">
                      Released: {new Date(suggestion.released).getFullYear()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showSuggestions && suggestions.length === 0 && value.length >= 2 && !loading && (
        <div className="suggestions-list">
          <div className="suggestion-item no-results">
            No games found matching "{value}"
          </div>
        </div>
      )}
    </div>
  );
};

export default AutocompleteInput;