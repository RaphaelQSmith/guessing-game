import React, { useState } from 'react';
import GuessResults from './GuessResults';
import AutocompleteInput from './AutocompleteInput';

const GameCard = ({ game, onGuess, API_KEY, showNextButton, onNextGame, hearts, gameOver }) => {
  const [userGuess, setUserGuess] = useState({
    title: '',
    developer: ''
  });
  const [lastResults, setLastResults] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting || gameOver) return;
    
    if (!userGuess.title?.trim() && !userGuess.developer?.trim()) {
      alert('Please fill in at least one field!');
      return;
    }

    setIsSubmitting(true);
    
    const currentCorrectAnswers = {
      title: game.name,
      developers: game.developers || []
    };
    setCorrectAnswers(currentCorrectAnswers);
    
    const results = onGuess(userGuess);
    
    setUserGuess({ title: '', developer: '' });
    setLastResults(results);
    setShowResults(true);
    setIsSubmitting(false);
  };

  const handleInputChange = (field, value) => {
    if (!gameOver) {
      setUserGuess(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    if (!gameOver) {
      console.log('Selected suggestion:', suggestion);
    }
  };

  const handleNextGameClick = () => {
    setShowResults(false);
    setLastResults(null);
    setCorrectAnswers(null);
    onNextGame();
  };

  const getReleaseYear = (releaseDate) => {
    if (!releaseDate) return null;
    return new Date(releaseDate).getFullYear();
  };

  const getMetacriticColor = (score) => {
    if (!score) return '#a0a0b0';
    if (score >= 90) return '#60c060'; // Green for exceptional
    if (score >= 80) return '#f0c060'; // Yellow for great
    if (score >= 70) return '#f09060'; // Orange for good
    return '#f06060'; // Red for poor
  };

  return (
    <div className="game-container">
      <div className="cover-art">
        <img 
          src={game.background_image} 
          alt="Game cover"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'block';
          }}
        />
        <div className="placeholder" style={{display: 'none'}}>
          No Image Available
        </div>
      </div>

      {/* Game Info Section - Combined Metacritic and Year */}
      <div className="game-info">
        <div className="info-section">
          <h3>Platforms</h3>
          <div className="platforms-list">
            {game.platforms && game.platforms.length > 0 ? (
              game.platforms.map((platform, index) => (
                <span key={index} className="platform-tag">
                  {platform}
                </span>
              ))
            ) : (
              <span className="no-info">No platform information</span>
            )}
          </div>
        </div>
        
        <div className="info-section">
          <h3>Details</h3>
          <div className="details-container">
            {game.released && (
              <div className="detail-item">
                <span className="detail-label">Released</span>
                <span className="detail-value">{getReleaseYear(game.released)}</span>
              </div>
            )}
            {game.metacritic && (
              <div className="detail-item">
                <span className="detail-label">Metacritic</span>
                <span 
                  className="detail-value metacritic-score"
                  style={{ color: getMetacriticColor(game.metacritic) }}
                >
                  {game.metacritic}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {showResults && lastResults && (
        <GuessResults 
          lastResults={lastResults} 
          correctAnswers={correctAnswers}
          hearts={hearts}
          gameOver={gameOver}
        />
      )}

      {!showResults ? (
        <form onSubmit={handleSubmit} className="guess-form">
          <div className="input-group">
            <label>Game Title: <span className="points-info">(75 points)</span></label>
            <AutocompleteInput
              value={userGuess.title}
              onChange={(value) => handleInputChange('title', value)}
              placeholder={gameOver ? "Game Over - Click Next Game" : "Start typing to see suggestions..."}
              disabled={isSubmitting || gameOver}
              onSelectSuggestion={handleSuggestionSelect}
              API_KEY={API_KEY}
            />
            <div className="input-hint">
              {gameOver ? "Game Over! Click 'Play Again' to restart." : "Start typing to see game suggestions with images"}
            </div>
          </div>

          <div className="input-group">
            <label>Developer: <span className="points-info">(25 points)</span></label>
            <input
              type="text"
              value={userGuess.developer}
              onChange={(e) => handleInputChange('developer', e.target.value)}
              placeholder={gameOver ? "Game Over - Click Next Game" : "e.g., Nintendo, Rockstar, Ubisoft (optional)"}
              disabled={isSubmitting || gameOver}
            />
            <div className="input-hint">
              {gameOver ? "Better luck next time!" : "Common developers: Nintendo, Rockstar, Ubisoft, Electronic Arts"}
            </div>
          </div>

          <div className="submit-button-container">
            <button 
              type="submit" 
              disabled={isSubmitting || gameOver} 
              className={`submit-button ${gameOver ? 'submit-button-disabled' : ''}`}
            >
              {gameOver ? 'Game Over' : (isSubmitting ? 'Checking Answers...' : 'Submit Guess')}
            </button>
          </div>
          
          <p className="hint">
            {gameOver 
              ? "Game Over! Your final score was " + (lastResults?.points || 0) + " points."
              : `Tip: You have ${hearts} lives remaining. Use them wisely!`
            }
          </p>
        </form>
      ) : (
        <div className="next-game-section">
          <button 
            onClick={handleNextGameClick}
            className="next-game-button"
          >
            {gameOver ? 'Play Again' : 'Next Game →'}
          </button>
          <p className="next-game-hint">
            {gameOver 
              ? "Start a new game with 3 lives and score reset to 0"
              : `Continuing with ${hearts} lives remaining`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default GameCard;