import React, { useState, useEffect, useRef, useCallback } from 'react';

const AutocompleteInput = ({ value, onChange, placeholder, disabled, onSelectSuggestion, API_KEY }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef(null);

  // Wrap fetchSuggestions in useCallback
  const fetchSuggestions = useCallback(async (searchTerm) => {
    if (!searchTerm || searchTerm.trim().length < 2 || !API_KEY) {
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
        const gameSuggestions = data.results.map(game => ({
          id: game.id,
          name: game.name,
          background_image: game.background_image
        }));
        setSuggestions(gameSuggestions);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, [API_KEY]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);

    return () => clearTimeout(timer);
  }, [value, fetchSuggestions]); // Added fetchSuggestions to dependencies

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
    setShowSuggestions(true);
  };

  const handleSelectSuggestion = (suggestion) => {
    onChange(suggestion.name);
    setShowSuggestions(false);
    if (onSelectSuggestion) {
      onSelectSuggestion(suggestion);
    }
  };

  return (
    <div className="autocomplete-wrapper" ref={wrapperRef}>
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={() => setShowSuggestions(true)}
        placeholder={placeholder}
        disabled={disabled}
        className="autocomplete-input"
      />
      
      {showSuggestions && (suggestions.length > 0 || loading) && (
        <ul className="suggestions-list">
          {loading ? (
            <li className="suggestion-loading">Loading suggestions...</li>
          ) : (
            suggestions.map((suggestion) => (
              <li
                key={suggestion.id}
                onClick={() => handleSelectSuggestion(suggestion)}
                className="suggestion-item"
              >
                {suggestion.background_image && (
                  <img
                    src={suggestion.background_image}
                    alt=""
                    className="suggestion-image"
                  />
                )}
                <span>{suggestion.name}</span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteInput;