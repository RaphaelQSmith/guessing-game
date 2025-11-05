const GuessResults = ({ lastResults, correctAnswers }) => {
  if (!lastResults) {
    return null;
  };

  console.log('Rendering GuessResults with:', lastResults)

  return (
    <div className="results-feedback">
      <h3>Last Guess Results:</h3>
      <p>Points earned: <strong>{lastResults.points}</strong></p>

      {correctAnswers && (
        <div className="correct-answers">
          <h4>Correct Answers:</h4>
          <div className="answer-details">
            <div className="answer-item">
              <strong>Title:</strong> {correctAnswers.title}
            </div>
            <div className="answer-item">
              <strong>Platforms:</strong> {correctAnswers.platforms.join(', ')}
            </div>
            <div className="answer-item">
              <strong>Developers:</strong> {correctAnswers.developers.join(', ')}
            </div>
          </div>
        </div>
      )}


      <div className="result-details">
        {lastResults.results.title && <span className="correct">✓ Title Correct!</span>}
        {lastResults.results.platform && <span className="correct">✓ Platform Correct!</span>}
        {lastResults.results.developer && <span className="correct">✓ Developer Correct!</span>}
        {lastResults.points === 0 && <span className="incorrect">No correct answers this round</span>}
      </div>
      <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '10px'}}>
        Loading next game...
      </p>
    </div>
  );
};

export default GuessResults;