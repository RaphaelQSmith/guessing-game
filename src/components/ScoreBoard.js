import React from 'react';

const ScoreBoard = ({ score, hearts, gameOver, onReset }) => {
  const renderHearts = () => {
    const heartIcons = [];
    for (let i = 0; i < 3; i++) {
      heartIcons.push(
        <span
          key={i}
          className={`heart ${i < hearts ? 'heart-full' : 'heart-empty'}`}
        >
          {i < hearts ? '❤️' : '♡'}
        </span>
      );
    }
    return heartIcons;
  };

  return (
    <div className="score-board">
      <div className="score">Score: {score}</div>
      <div className="hearts-container">
        <div className="hearts-label">Lives:</div>
        <div className="hearts">{renderHearts()}</div>
      </div>
      {gameOver && (
        <div className="game-over-section">
          <div className="game-over-message">Game Over!</div>
          <button className="reset-button" onClick={onReset}>
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default ScoreBoard;