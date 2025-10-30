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
        </div>
    )
}

export default GameCard;