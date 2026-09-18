import React, { useState } from 'react';
import GuessResults from './GuessResults';
import AutocompleteInput from './AutocompleteInput';

const GameCard = ({
  game,
  onGuess,
  API_KEY,
  showNextButton,
  onNextGame,
  hearts,
  gameOver,
  minDeveloperGuessLength = 3,
  skillReady,
  onSkillChoice,
  activeSkill
}) => {
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
    
    if (isSubmitting || gameOver || skillReady) return;
    
    if (!userGuess.title?.trim() && !userGuess.developer?.trim()) {
      alert('Please fill in at least one field!');
      return;
    }

    const developerTrimmed = (userGuess.developer || '').trim();
    if (developerTrimmed && developerTrimmed.length < minDeveloperGuessLength) {
      alert(`Developer guess must be at least ${minDeveloperGuessLength} letters long.`);
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
    if (skillReady) {
      return;
    }

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
    if (score >= 90) return '#60c060';
    if (score >= 80) return '#f0c060';
    if (score >= 70) return '#f09060';
    return '#f06060';
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
        <div className="placeholder" style={{ display: 'none' }}>
          No Image Available
        </div>
      </div>

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

      {skillReady && (
        <div className="skill-panel">
          <h3>Skill Ready!</h3>
          <p>Choose your reward after 5 correct answers:</p>
          <div className="skill-options">
            <button type="button" className="skill-button skill-heal" onClick={() => onSkillChoice('heal')}>
              Regain 1 Heart
            </button>
            <button type="button" className="skill-button skill-bonus" onClick={() => onSkillChoice('bonus')}>
              +20% Bonus Points
            </button>
          </div>
        </div>
      )}

      {activeSkill === 'bonus' && !gameOver && (
        <div className="active-skill-banner">
          Active skill: +20% bonus on every correct answer
        </div>
      )}

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
              placeholder={gameOver ? "Game Over - Click Play Again" : "Start typing to see suggestions..."}
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
              placeholder={gameOver ? "Game Over - Click Play Again" : "e.g., Nintendo, Rockstar, Ubisoft (optional, min. 3 letters)"}
              disabled={isSubmitting || gameOver}
            />
            <div className="input-hint">
              {gameOver ? "Better luck next time!" : "Developer guesses need at least 3 letters (optional)"}
            </div>
          </div>

          <div className="submit-button-container">
            <button 
              type="submit" 
              disabled={isSubmitting || gameOver || skillReady} 
              className={`submit-button ${gameOver || skillReady ? 'submit-button-disabled' : ''}`}
            >
              {skillReady ? 'Choose Skill' : (gameOver ? 'Game Over' : (isSubmitting ? 'Checking Answers...' : 'Submit Guess'))}
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
            disabled={skillReady}
          >
            {gameOver ? 'Play Again' : (skillReady ? 'Choose skill first' : 'Next Game →')}
          </button>
          <p className="next-game-hint">
            {gameOver 
              ? "Start a new game with 7 lives and score reset to 0"
              : `Continuing with ${hearts} lives remaining`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default GameCard;