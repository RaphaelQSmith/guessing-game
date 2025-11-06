import { useState } from "react";
import GuessResults from "./GuessResults";
import AutocompleteInput from "./AutocompleteInput";

const GameCard = ({ game, onGuess, API_KEY, showNextButton, onNextGame }) => {
    const [userGuess, setUserGuess] = useState({
        title:'',
        platform: '',
        developer: ''
    })    

    const [lastResults, setLastResults] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [correctAnswers, setCorrectAnswers] = useState(null);
    const [showResults, setShowResults] = useState(false);
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSubmitting) return;

        if (!userGuess.title?.trim() && !userGuess.platform?.trim() && !userGuess.developer?.trim()){
            alert('Please fill in at least one field!');
            return;
        }

        setIsSubmitting(true);

        const currentCorrectAnswers = {
            title: game.name,
            platforms: game.platforms || [],
            developers: game.developers || []
        };
        setCorrectAnswers(currentCorrectAnswers);

        console.log('Submitting guess', userGuess)
        const results = onGuess(userGuess);
        console.log('Results from onGuess:', results);

        setUserGuess({title: '', platform: '', developer: ''});
        setLastResults(results);
        setShowResults(true);
        setIsSubmitting(false);
    }

    const handleInputChange = (field, value) => {
        setUserGuess(prev => ({
            ...prev,
            [field]: value
        }));
    }

    const handleSuggestionSelect = (suggestion) => {
        console.log('Selected suggestion:', suggestion)
    }

    const handleNextGameClick = () =>{
        setShowResults(false);
        setLastResults(null);
        setCorrectAnswers(null);
        onNextGame();
    }

    return (
        <div className="game-container">
            <div className="cover-art">
                <img 
                    src={game.background_image}
                    alt={`Game cover`}
                    onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                    }}
                />
                <div className="placeholder" style={{display: 'none'}}>
                    No Image Available
                </div>
            </div>

            {showResults && lastResults && (
              <GuessResults 
                lastResults={lastResults}
                correctAnswers={correctAnswers} 
              />
            )}

            {!showResults ? (
                <form onSubmit={handleSubmit} className="guess-form">
                    <div className="input-group">
                        <label>Game Title: <span className="points-info">(50 points)</span></label>
                        <AutocompleteInput 
                            value={userGuess.title}
                            onChange={(value) => handleInputChange('title', value)}
                            placeholder="Start typing to see suggestions..."
                            disabled={isSubmitting}
                            onSelectSuggestion={handleSuggestionSelect}
                            API_KEY={API_KEY}    
                        />
                        <div className="input-hint">
                            Start typing to see game suggestions with images
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Platform:<span className="points-info">(25 points)</span></label>
                        <input 
                        type="text"
                        value={userGuess.platform}
                        onChange={(e) => handleInputChange('platform', e.target.value)}
                        placeholder="Platform (Playstation, PC, Xbox, etc.) *optional"
                        disabled={isSubmitting}
                        />
                        <div className="input-hint">
                            Common platforms: PC, PlayStation, Xbox, Nintendo Switch
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Developers:<span className="points-info">(25 points)</span></label>
                        <input
                            type="text"
                            value={userGuess.developer}
                            onChange={(e) => handleInputChange('developer', e.target.value)}
                            placeholder="Guess the developer company"
                            disabled={isSubmitting}
                        />
                        <div className="input-hint">
                            Common developers: Nintendo, Rockstar, Ubisoft, Electronic Arts
                        </div>
                    </div>

                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Loading Next Game...' : 'Submit Guess'}
                    </button>
                    <p className="hint">Tip: You can fill in one, two, or all three fields!</p>                    
                </form> ) :(
                    <div className="next-game-section">
                        <button
                            onClick={handleNextGameClick}
                            className="next-game-button"
                        >
                            Next Game →
                        </button>
                        <p className="next-game-hint">
                            Click to continue
                        </p>
                    </div>
                )}
        </div>
    )
}

export default GameCard;