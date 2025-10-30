import { useState } from "react";

const GameCard = ({game, onGuess}) => {
    const [showForm, setShowForm] = useState(false);
    const [userGuess, setUserGuess] = useState({
        title:'',
        platform: [''],
        developers: ['']
    })    

    const handleSubmit = (e) => {
        e.preventDefault();
        onGuess(userGuess);
        setUserGuess({title: '', platforms: [''], developers: ['']});
        setShowForm(false);
    }

    const addField = (field) => {
        setUserGuess(prev=> ({
            ...prev,
            [field]: [...prev[field], '']
        }))
    }

    const updateField = (field, index, value) => {
        setUserGuess(prev => ({
            ...prev,
            [field]: prev[field].map((item, i) => i === index ? value : item)
        }))
    }


    return (
        <div className="game-card">
            <div className="cover-art">
                <img 
                src={game.background_image}
                alt={`Cover art for ${game.name}`}
                onError={(e) =>{
                    e.target.src = '/placeholder-image.png'
                }}
                />
            </div>

            {!showForm ? (
                <button 
                    className="guess-button"
                    onClick={() => setShowForm(true)}
                >
                    Make Your Guess!
                </button>    
            ) : (
                <form onSubmit={handleSubmit} className="guess-form">
                    <div className="form-group">
                        <label>Game Title:</label>
                        <input 
                        type="text"
                        value={userGuess.title}
                        onChange={(e) => setUserGuess(prev => ({...prev, title: e.target.value}))}
                        placeholder="Enter title"
                        />
                    </div>
                    <div className="form-group">
                        <label>Platform:</label>
                        {userGuess.platform.map((platform, index) =>(
                            
                        <input 
                        key={index}
                        type="text"
                        value={platform}
                        onChange={(e) => updateField('platforms', index, e.target.value)}
                        placeholder="Enter Platform"
                        />
                    ))}
                        <button type="button" onClick={() => addField('platforms')}>
                            Add Another Platform
                        </button>
                    </div>

                    <div className="form-group">
                        <label>Developers:</label>
                        {userGuess.developers.map((developer, index) => (
                        <input
                            key={index}
                            type="text"
                            value={developer}
                            onChange={(e) => updateField('developers', index, e.target.value)}
                            placeholder="Enter developer company"
                        />
                        ))}
                        <button type="button" onClick={() => addField('developers')}>
                        Add Another Developer
                        </button>
                    </div>
                    <div className="form-buttons">
                        <button type="submit">Submit Guess</button>
                        <button type="button" onClick={() => setShowForm(false)}>
                        Cancel
                        </button>
                    </div>
                </form>
            )

            }
        </div>
    )
}

export default GameCard;