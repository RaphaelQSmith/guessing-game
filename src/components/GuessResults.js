import React from 'react';

const GuessResults = ({ lastResults, correctAnswers, hearts, gameOver }) => {
  if (!lastResults) {
    return null;
  }

  return (
    <div className={`results-feedback ${gameOver ? 'results-game-over' : ''}`}>
      <h3>{gameOver ? 'Game Over!' : 'Guess Results'}</h3>
      
      {gameOver ? (
        <div className="game-over-content">
          <p>You've used all your lives!</p>
          <p>Final score: <strong>{lastResults.points}</strong></p>
          <p>Click "Play Again" to start over with 3 lives</p>
        </div>
      ) : (
        <p>Points earned this round: <strong>{lastResults.points}</strong></p>
      )}
      
      {correctAnswers && (
        <div className="correct-answers">
          <h4>Correct Answers:</h4>
          <div className="answer-details">
            <div className="answer-item">
              <strong>Title:</strong> {correctAnswers.title}
            </div>
            <div className="answer-item">
              <strong>Developers:</strong> {correctAnswers.developers.join(', ')}
            </div>
          </div>
        </div>
      )}

      <div className="result-details">
        <h4>Your Results:</h4>
        <div className="result-items">
          {lastResults.results.title && <span className="correct">✓ Title Correct!</span>}
          {lastResults.results.developer && <span className="correct">✓ Developer Correct!</span>}
          {lastResults.points === 0 && !gameOver && <span className="incorrect">No correct answers - Lost a life!</span>}
          {gameOver && <span className="incorrect">❌ Out of lives!</span>}
        </div>
      </div>

      {!gameOver && (
        <div className="hearts-remaining">
          <p>Lives remaining: {hearts}/3</p>
        </div>
      )}
    </div>
  );
};

export default GuessResults;