import { useState } from "react";
import GuessResults from "./GuessResults";

const GameCard = ({ game, onGuess }) => {
    const [userGuess, setUserGuess] = useState({
        title:'',
        platform: '',
        developer: ''
    })    

    const [lastResults, setLastResults] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [correctAnswers, setCorrectAnswers] = useState(null);
    
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
    }

    const handleInputChange = (field, value) => {
        setUserGuess(prev => ({
            ...prev,
            [field]: value
        }));
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

            {lastResults && (
                <GuessResults 
                lastResults={lastResults}
                correctAnswers={correctAnswers} 
                />
            )}

            <form onSubmit={handleSubmit} className="guess-form">
                    <div className="input-group">
                        <label>Game Title: <span className="points-info">(50 points)</span></label>
                        <input 
                            type="text"
                            value={userGuess.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            placeholder="Guess the game title"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="input-group">
                        <label>Platform:<span className="points-info">(25 points)</span></label>
                        <input 
                        type="text"
                        value={userGuess.platform}
                        onChange={(e) => handleInputChange('platform', e.target.value)}
                        placeholder="Guess the Platform (PS3, PC, XBOX, etc.)"
                        disabled={isSubmitting}
                        />
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
                    </div>

                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Loading Next Game...' : 'Submit Guess'}</button>
                    <p className="hint">Tip: You can fill in one, two, or all three fields!</p>                    
                </form>
        </div>
    )
}

export default GameCard;