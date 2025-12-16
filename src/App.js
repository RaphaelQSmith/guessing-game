import React, { useState, useEffect } from 'react';
import './App.css';
import GameCard from './components/GameCard';
import ScoreBoard from './components/ScoreBoard';

function App() {
  const [currentGame, setCurrentGame] = useState(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [usedPages, setUsedPages] = useState(new Set());
  const [showNextButton, setShowNextButton] = useState(false);
  const [hearts, setHearts] = useState(3);
  const [gameOver, setGameOver] = useState(false);

  const API_KEY = process.env.REACT_APP_RAWG_API_KEY;

  const getRandomPage = (totalPages) => {
    const maxPages = Math.min(totalPages, 1000);
    return Math.floor(Math.random() * maxPages) + 1;
  };

  const fetchGame = async (pageNumber) => {
    try {
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
          metacritic: game.metacritic
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
    setGameOver(false);
    
    let game = null;
    let currentAttempts = 0;
    const maxAttempts = 10;
    
    try {
      const countResponse = await fetch(
        `https://api.rawg.io/api/games?key=${API_KEY}&page_size=1&metacritic=70,100`
      );
      const countData = await countResponse.json();
      const totalCount = countData.count;
      const totalPages = Math.ceil(totalCount / 20);
      
      let randomPage;
      
      do {
        randomPage = getRandomPage(totalPages);
        currentAttempts++;
        
        game = await fetchGame(randomPage);
        
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
            metacritic: fallbackGame.metacritic
          });
        }
      }
    } catch (error) {
      console.error('Error loading next game:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetGame = () => {
    setScore(0);
    setHearts(3);
    setGameOver(false);
    setShowNextButton(false);
    loadNextGame();
  };

  useEffect(() => {
    const loadInitialGame = async () => {
      setLoading(true);
      try {
        const countResponse = await fetch(
          `https://api.rawg.io/api/games?key=${API_KEY}&page_size=1&metacritic=70,100`
        );
        const countData = await countResponse.json();
        const totalPages = Math.ceil(countData.count / 20);
        let game = null;
        let currentAttempts = 0;
        const maxAttempts = 5;
        
        do {
          const randomPage = getRandomPage(totalPages);
          currentAttempts++;
          game = await fetchGame(randomPage);
        } while (currentAttempts < maxAttempts && (!game || !game.metacritic));
        
        if (game && game.metacritic) {
          setCurrentGame(game);
          setUsedPages(new Set([getRandomPage(totalPages)]));
        } else {
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
              metacritic: fallbackGame.metacritic
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
    if (!currentGame || gameOver) return;

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

    if (points === 0) {
      const newHearts = hearts - 1;
      setHearts(newHearts);
      
      if (newHearts <= 0) {
        setGameOver(true);
      }
    } else {
      setScore(score + points);
    }

    setShowNextButton(true);
    return { points, results, gameOver: hearts <= 1 && points === 0 };
  };

  const handleNextGame = () => {
    if (gameOver) {
      resetGame();
    } else {
      loadNextGame();
    }
  };

  if (loading) {
    return <div className="loading">Loading game...</div>;
  }

  if (!currentGame) {
    return <div className="loading">No game data available. Try again.</div>;
  }

  return (
    <div className="App">
      <header className="header">
        <h1>Game Guesser</h1>
        <div className="header-info">
          <ScoreBoard score={score} hearts={hearts} gameOver={gameOver} onReset={resetGame} />
        </div>
      </header>

      <GameCard 
        key={currentGame.id}
        game={currentGame} 
        onGuess={handleGuess}
        API_KEY={API_KEY}
        showNextButton={showNextButton}
        onNextGame={handleNextGame}
        hearts={hearts}
        gameOver={gameOver}
      />
    </div>
  );
}

export default App;