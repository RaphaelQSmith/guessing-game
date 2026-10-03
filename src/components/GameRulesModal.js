import React from 'react';

const GameRulesModal = ({ onStart }) => (
  <div className="game-rules-overlay">
    <section
      className="game-rules-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="game-rules-title"
      aria-describedby="game-rules-intro"
    >
      <div className="game-rules-kicker">Game Guesser</div>
      <h2 id="game-rules-title">How to play</h2>
      <p id="game-rules-intro" className="game-rules-intro">
        Identify the game from its cover. Every correct detail adds to your score.
      </p>

      <div className="game-rules-list">
        <div className="game-rule">
          <span className="game-rule-value game-rule-highlight">Guess the game</span>
          <p className="game-rule-penalty-cost">75 pts</p>
        </div>
        <div className="game-rule">
          <span className="game-rule-value game-rule-highlight">Guess the developer</span>
          <p className="game-rule-penalty-cost">25 pts</p>
        </div>
        <div className="game-rule">
          <span className="game-rule-value game-rule-highlight">Reveal Platforms</span>
          <p className="game-rule-penalty-cost">-15 pts</p>
        </div>
        <div className="game-rule">
          <span className="game-rule-value game-rule-highlight">Reveal Year + Score</span>
          <p className="game-rule-penalty-cost">-25 pts</p>
        </div>
        <div className="game-rule">
          <span className="game-rule-value">Every 5</span>
          <p>Correct answers unlock a choice: regain one heart or add a stackable +20% points bonus.</p>
        </div>
        <div className="game-rule">
          <span className="game-rule-value">5 hearts</span>
          <p>A guess with no correct answers costs one heart.</p>
        </div>
      </div>

      <p className="game-rules-note">
        Reveal penalties are only applied when you earn points. An incorrect guess never deducts score.
      </p>
      <button type="button" className="game-rules-start" onClick={onStart} autoFocus>
        Start Playing
      </button>
    </section>
  </div>
);

export default GameRulesModal;
