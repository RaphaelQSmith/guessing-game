import { useState } from "react";
import GuessResults from "./GuessResults";

const GameCard = ({game, onGuess}) => {
    const [userGuess, setUserGuess] = useState({
        title:'',
        platform: '',
        developers: ''
    })    

    const [lastResults, setLastResults] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!userGuess.title?.trim() && !userGuess.platform?.trim() && !userGuess.developer?.trim()){
            alert('Please fill in at least one field!');
            return;
        }
        
        console.log('Submitting guess', userGuess)
        const results = onGuess(userGuess);
        console.log('Results from onGuess:', results);

        setLastResults(results);
        setUserGuess({title: '', platforms: '', developers: ''});
    }

    const handleInputChange = (field, value) =>{
        setUserGuess(prev => ({
            ...prev,
            [field]: value
        }))
    }

    return (
        <div className="game-container">
            <div className="cover-art">
                <img 
                    src={game.background_image}
                    alt={`Game cover`}
                    onError={(e) =>{
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                    }}
                />
                <div className="placeholder" style={{display: 'none'}}>
                    No Image Available
                </div>
            </div>

            <GuessResults lastResults={lastResults} />

            <form onSubmit={handleSubmit} className="guess-form">
                    <div className="input-group">
                        <label>Game Title: <span className="points-info">(50 points)</span></label>
                        <input 
                            type="text"
                            value={userGuess.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            placeholder="Guess the game title"
                        />
                    </div>

                    <div className="input-group">
                        <label>Platform:<span className="points-info">(25 points)</span></label>
                        <input 
                        type="text"
                        value={userGuess.platform}
                        onChange={(e) => handleInputChange('platform', e.target.value)}
                        placeholder="Guess the Platform (PS3, PC, XBOX, etc.)"
                        />
                    </div>

                    <div className="input-group">
                        <label>Developers:<span className="points-info">(25 points)</span></label>
                        <input
                            type="text"
                            value={userGuess.developer}
                            onChange={(e) => handleInputChange('developer', e.target.value)}
                            placeholder="Guess the developer company"
                        />
                    </div>
                    <button type="submit">Submit Guess</button>
                    <p className="hint">Tip: You can fill in one, two, or all three fields!</p>                    
                </form>
        </div>
    )
}

export default GameCard;