import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import GameCard from './components/GameCard';
import ScoreBoard from './components/ScoreBoard';

function App() {
  const [currentGame, setCurrentGame] = useState(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  const API_KEY = process.env.REACT_APP_RAWG_API_KEY;
 
 useEffect(() => {
    const fetchRandomGame = async () => {
      setLoading(true);
      try {
        const randomPage = Math.floor(Math.random() * 50) + 1;
        const response = await fetch(
          `https://api.rawg.io/api/games?key=${API_KEY}&page=${randomPage}&page_size=1`
        );
        const data = await response.json();
                
        if (data.results && data.results.length > 0) {
          const game = data.results[0];
          
          // Get detailed info
          const detailResponse = await fetch(
            `https://api.rawg.io/api/games/${game.id}?key=${API_KEY}`
          );
          const gameDetails = await detailResponse.json();
          
          setCurrentGame({
            name: game.name || 'Unknown Game',
            background_image: game.background_image,
            platforms: game.platforms?.map(p => p.platform?.name).filter(Boolean) || [],
            developers: gameDetails.developers?.map(d => d.name).filter(Boolean) || []
          });
        }
      } catch (error) {
        console.error('Error fetching game:', error);
      } finally {
        setLoading(false);
  }
};

    fetchRandomGame();
  }, [API_KEY]);

  const handleGuess = (userGuess) => {
    if (!currentGame) return; 

    let points = 0;

    // Check title
    if (userGuess.title.toLowerCase().trim() === currentGame.name.toLowerCase().trim()) {
      points += 50;
    }

    // Check platform
   const platforms = currentGame.platforms || [];
    const platformGuess = userGuess.platform.toLowerCase().trim();
    if (platformGuess && platforms.some(p => 
      p.toLowerCase().includes(platformGuess) ||
      platformGuess.includes(p.toLowerCase())
    )) {
      points += 25;
    }

    // Check developer - with safe array access
    const developers = currentGame.developers || [];
    const developerGuess = userGuess.developer.toLowerCase().trim();
    if (developerGuess && developers.some(d => 
      d.toLowerCase().includes(developerGuess) ||
      developerGuess.includes(d.toLowerCase())
    )) {
      points += 25;
    }
    setScore(score + points);
    
    // Fetch new game
    const fetchNewGame = async () => {
      setLoading(true);
      try {
        const randomPage = Math.floor(Math.random() * 50) + 1;
        const response = await fetch(
          `https://api.rawg.io/api/games?key=${API_KEY}&page=${randomPage}&page_size=1`
        );
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
          const game = data.results[0];
          const detailResponse = await fetch(
            `https://api.rawg.io/api/games/${game.id}?key=${API_KEY}`
          );
          const gameDetails = await detailResponse.json();
          
          setCurrentGame({
            name: game.name || 'Unknown Game',
            background_image: game.background_image,
            platforms: game.parent_platforms?.map(p => p.platform.name).filter(Boolean) || [],
            developers: gameDetails.developers?.map(d => d.name).filter(Boolean) || []
          });
        }
      } catch (error) {
        console.error('Error fetching new game:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewGame();
  };

  if (loading){
    return <div className="loading">Loading game...</div>
  }

  if (!currentGame){
    return <div className='Loading'>No game data available. Try again.</div>
  }

  return (
    <div className="App">
      <header className="app-header">
        <h1>Guessing Game</h1>
        <ScoreBoard score={score} />
      </header>

      <GameCard
        game={currentGame}
        onGuess={handleGuess} 
      />
     
    </div>
  );
}

export default App;
