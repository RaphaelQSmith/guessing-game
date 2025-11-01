import { useState } from "react";

const GameCard = ({game, onGuess}) => {
    const [userGuess, setUserGuess] = useState({
        title:'',
        platform: '',
        developers: ''
    })    

    const handleSubmit = (e) => {
        e.preventDefault();
        onGuess(userGuess);
        setUserGuess({title: '', platforms: [''], developers: ['']});
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
            
            <form onSubmit={handleSubmit} className="guess-form">
                    <div className="input-group">
                        <label>Game Title:</label>
                        <input 
                            type="text"
                            value={userGuess.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            placeholder="Guess the game title"
                        />
                    </div>
                    <div className="input-group">
                        <label>Platform:</label>
                        <input 
                        type="text"
                        value={userGuess.platform}
                        onChange={(e) => handleInputChange('platform', e.target.value)}
                        placeholder="Guess the Platform (PS3, PC, XBOX, etc.)"
                        />
                    </div>

                    <div className="input-group">
                        <label>Developers:</label>
                        <input
                            type="text"
                            value={userGuess.developer}
                            onChange={(e) => handleInputChange('developer', e.target.value)}
                            placeholder="Guess the developer company"
                        />
                    </div>
                        <button type="submit">Submit Guess</button>                    
                </form>
        </div>
    )
}

export default GameCard;