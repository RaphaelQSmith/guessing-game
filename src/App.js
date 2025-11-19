import React, { useState, useEffect } from 'react';
import './App.css';
import GameCard from './components/GameCard';
import ScoreBoard from './components/ScoreBoard';

function App() {
  const [currentGame, setCurrentGame] = useState(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [totalGames, setTotalGames] = useState(0);
  const [usedPages, setUsedPages] = useState(new Set());
  const [showNextButton, setShowNextButton] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const API_KEY = process.env.REACT_APP_RAWG_API_KEY;

  const getRandomPage = (totalPages) => {
    const maxPages = Math.min(totalPages, 1000);
    return Math.floor(Math.random() * maxPages) + 1;
  };

  const fetchGame = async (pageNumber) => {
    try {
      // Add metacritic parameter to filter games with score 70+
      const response = await fetch(
        `https://api.rawg.io/api/games?key=${API_KEY}&page=${pageNumber}&page_size=1&metacritic=70,100`
      );
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const game = data.results[0];
        const detailResponse = await fetch(
          `https://api.rawg.io/api/games/${game.id}?key=${API_KEY}`
        );
        const gameDetails = await detailResponse.json();
        
        return {
          id: game.id,
          name: game.name || 'Unknown Game',
          background_image: game.background_image,
          platforms: game.platforms?.map(p => p.platform?.name).filter(Boolean) || [],
          developers: gameDetails.developers?.map(d => d.name).filter(Boolean) || [],
          released: game.released,
          rating: game.rating,
          metacritic: game.metacritic // Include metacritic score
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching game:', error);
      return null;
    }
  };

  const loadNextGame = async () => {
    setLoading(true);
    setShowNextButton(false);
    let game = null;
    let currentAttempts = 0;
    const maxAttempts = 10; // Prevent infinite loops
    
    try {
      // Get count of games with metacritic 70+
      const countResponse = await fetch(
        `https://api.rawg.io/api/games?key=${API_KEY}&page_size=1&metacritic=70,100`
      );
      const countData = await countResponse.json();
      const totalCount = countData.count;
      const totalPages = Math.ceil(totalCount / 20);
      
      let randomPage;
      
      // Try to find a valid game
      do {
        randomPage = getRandomPage(totalPages);
        currentAttempts++;
        setAttempts(currentAttempts);
        
        game = await fetchGame(randomPage);
        
        // If we found a game with metacritic score, break the loop
        if (game && game.metacritic) {
          break;
        }
      } while (currentAttempts < maxAttempts && (!game || !game.metacritic));
      
      if (game && game.metacritic) {
        setCurrentGame(game);
        setUsedPages(prev => {
          const newSet = new Set(prev);
          newSet.add(randomPage);
          if (newSet.size > 100) {
            const array = Array.from(newSet);
            return new Set(array.slice(-100));
          }
          return newSet;
        });
      } else {
        // Fallback: if we can't find a game with metacritic, try without filter
        console.log('No high-rated games found, falling back to any game');
        const fallbackResponse = await fetch(
          `https://api.rawg.io/api/games?key=${API_KEY}&page=${getRandomPage(100)}&page_size=1`
        );
        const fallbackData = await fallbackResponse.json();
        
        if (fallbackData.results && fallbackData.results.length > 0) {
          const fallbackGame = fallbackData.results[0];
          const detailResponse = await fetch(
            `https://api.rawg.io/api/games/${fallbackGame.id}?key=${API_KEY}`
          );
          const gameDetails = await detailResponse.json();
          
          setCurrentGame({
            id: fallbackGame.id,
            name: fallbackGame.name || 'Unknown Game',
            background_image: fallbackGame.background_image,
            platforms: fallbackGame.platforms?.map(p => p.platform?.name).filter(Boolean) || [],
            developers: gameDetails.developers?.map(d => d.name).filter(Boolean) || [],
            released: fallbackGame.released,
            rating: fallbackGame.rating,
            metacritic: fallbackGame.metacritic || 'N/A'
          });
        }
      }
    } catch (error) {
      console.error('Error loading next game:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadInitialGame = async () => {
      setLoading(true);
      try {
        // Get count of games with metacritic 70+
        const countResponse = await fetch(
          `https://api.rawg.io/api/games?key=${API_KEY}&page_size=1&metacritic=70,100`
        );
        const countData = await countResponse.json();
        const totalCount = countData.count;
        setTotalGames(totalCount);

        const totalPages = Math.ceil(totalCount / 20);
        let game = null;
        let currentAttempts = 0;
        const maxAttempts = 5;
        
        // Try to find a valid game with metacritic score
        do {
          const randomPage = getRandomPage(totalPages);
          currentAttempts++;
          game = await fetchGame(randomPage);
        } while (currentAttempts < maxAttempts && (!game || !game.metacritic));
        
        if (game && game.metacritic) {
          setCurrentGame(game);
          setUsedPages(new Set([getRandomPage(totalPages)]));
        } else {
          // Fallback to any game
          const fallbackResponse = await fetch(
            `https://api.rawg.io/api/games?key=${API_KEY}&page=${getRandomPage(100)}&page_size=1`
          );
          const fallbackData = await fallbackResponse.json();
          
          if (fallbackData.results && fallbackData.results.length > 0) {
            const fallbackGame = fallbackData.results[0];
            const detailResponse = await fetch(
              `https://api.rawg.io/api/games/${fallbackGame.id}?key=${API_KEY}`
            );
            const gameDetails = await detailResponse.json();
            
            setCurrentGame({
              id: fallbackGame.id,
              name: fallbackGame.name || 'Unknown Game',
              background_image: fallbackGame.background_image,
              platforms: fallbackGame.platforms?.map(p => p.platform?.name).filter(Boolean) || [],
              developers: gameDetails.developers?.map(d => d.name).filter(Boolean) || [],
              released: fallbackGame.released,
              rating: fallbackGame.rating,
              metacritic: fallbackGame.metacritic || 'N/A'
            });
          }
        }
      } catch (error) {
        console.error('Error loading initial game:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialGame();
  }, [API_KEY]);

  const handleGuess = (userGuess) => {
    if (!currentGame) return;

    let points = 0;
    const results = {
      title: false,
      developer: false
    };

    if (userGuess.title && userGuess.title.trim() && userGuess.title.toLowerCase().trim() === currentGame.name.toLowerCase().trim()) {
      points += 75;
      results.title = true;
    }

    const developers = currentGame.developers || [];
    const developerGuess = userGuess.developer ? userGuess.developer.toLowerCase().trim() : '';
    if (developerGuess && developers.some(d => 
      d.toLowerCase().includes(developerGuess) ||
      developerGuess.includes(d.toLowerCase())
    )) {
      points += 25;
      results.developer = true;
    }
    
    setScore(score + points);
    setShowNextButton(true);

    return { points, results };
  };

  const handleNextGame = () => {
    loadNextGame();
  };

  if (loading) {
    return (
      <div className="loading">
        Loading quality game... ({totalGames.toLocaleString()} highly-rated games available)
        {attempts > 0 && <div style={{fontSize: '0.9rem', color: '#a0aec0', marginTop: '10px'}}>Searching for great games... ({attempts})</div>}
      </div>
    );
  }

  if (!currentGame) {
    return (
      <div className="loading">
        No quality games available right now. Try again.
        <button 
          onClick={() => window.location.reload()} 
          style={{marginTop: '20px', padding: '10px 20px', background: '#4299e1', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'}}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="header">
        <h1>Game Guesser</h1>
        <div className="header-info">
          <ScoreBoard score={score} />
        </div>
      </header>

      <GameCard 
        key={currentGame.id}
        game={currentGame} 
        onGuess={handleGuess}
        API_KEY={API_KEY}
        showNextButton={showNextButton}
        onNextGame={handleNextGame}
      />
    </div>
  );
}

export default App;