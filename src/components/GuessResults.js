const GuessResults = ({ lastResults }) => {
  if (!lastResults) return null;

  return (
    <div className="results-feedback">
      <h3>Last Guess Results:</h3>
      <p>Points earned: <strong>{lastResults.points}</strong></p>
      <div className="result-details">
        {lastResults.results.title && <span className="correct">✓ Title Correct!</span>}
        {lastResults.results.platform && <span className="correct">✓ Platform Correct!</span>}
        {lastResults.results.developer && <span className="correct">✓ Developer Correct!</span>}
        {lastResults.points === 0 && <span className="incorrect">No correct answers this round</span>}
      </div>
    </div>
  );
};

export default GuessResults;