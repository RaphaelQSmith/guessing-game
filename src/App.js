import { useState, useEffect } from 'react';
import './App.css';
import GameCard from './components/GameCard';
import ScoreBoard from './components/ScoreBoard';

function App() {
  const [currentGame, setCurrentGame] = useState(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [totalGames, setTotalGames] = useState(0);
  const [usedPages, setUsedPages] = useState(new Set())
  const [showNextButton, setShowNextButton] = useState(false)

  const API_KEY = process.env.REACT_APP_RAWG_API_KEY;

  const getRandomPage = (totalPages) => {
    const maxPages = Math.min(totalPages, 1000);
    return Math.floor(Math.random() * maxPages) +1;
 };
 

 
 const fetchGame = async (pageNumber) => {
      try {
        const response = await fetch(
          `https://api.rawg.io/api/games?key=${API_KEY}&page=${pageNumber}&page_size=1`
        );

        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
          const game = data.results[0];
           console.log('Game data:', game);
          
          // Get detailed info
          const detailResponse = await fetch(
            `https://api.rawg.io/api/games/${game.id}?key=${API_KEY}`
          );
          const gameDetails = await detailResponse.json();
          
          return{
            id: game.id,
            name: game.name || 'Unknown Game',
            background_image: game.background_image,
            platforms: game.platforms?.map(p => p.platform?.name).filter(Boolean) || [],
            developers: gameDetails.developers?.map(d => d.name).filter(Boolean) || []
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
      try {
        const countResponse = await fetch(
          `https://api.rawg.io/api/games?key=${API_KEY}&page_size=1`
        )
        const countData = await countResponse.json();
        const totalCount = countData.count;
        const totalPages = Math.ceil(totalCount / 20);

        let randomPage;
        let attempts = 0;

        do {
          randomPage = getRandomPage(totalPages);
          attempts++;
        } while (usedPages.has(randomPage) && attempts < 10);

        const game = await fetchGame(randomPage);
        
        if (game) {
          setCurrentGame(game);
          setUsedPages(prev => {
            const newSet = new Set(prev);
            newSet.add(randomPage);
            if (newSet.size > 100) {
              const array = Array.from(newSet);
              return new Set(array.slice(-100))
            }
            return newSet;
          })
        
       }
      } catch (error) {
        console.error('Error fetching new game:', error);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() =>{
      const loadInitialGame = async () => {
        setLoading(true);
        try {
          const countResponse = await fetch(
            `https://api.rawg.io/api/games?key=${API_KEY}&page_size=1`
          );
          const countData = await countResponse.json();
          const totalCount = countData.count;
          setTotalGames(totalCount);

          const totalPages = Math.ceil(totalCount / 20);
          const randomPage = getRandomPage(totalPages);
          const game = await fetchGame(randomPage);

          if (game) {
            setCurrentGame(game);
            setUsedPages(new Set([randomPage]));
          }
      } catch (error) {
        console.error('Error fetching new game:', error);
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
        platform: false,
        developer: false
    }

    // Check title
    if (userGuess.title && userGuess.title.trim() && userGuess.title.toLowerCase().trim() === currentGame.name.toLowerCase().trim()) {
      points += 50;
      results.title = true;
      console.log('Title correct!')
    }

    // Check platform
   const platforms = currentGame.platforms || [];
   const platformGuess = userGuess.platform ? userGuess.platform.toLowerCase().trim():'';
    if (platformGuess && platforms.some(p => 
      p.toLowerCase().includes(platformGuess) ||
      platformGuess.includes(p.toLowerCase())
    )) {
      points += 25;
      results.platform = true;
      console.log('Platform correct!')
    }

    // Check developer 
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
  }

  if (loading){
    return <div className="loading">Loading game...({totalGames.toLocaleString()} total games)</div>
  }

  if (!currentGame){
    return <div className='Loading'>No game data available. Try again.</div>
  }

  return (
    <div className="App">
      <header className="header">
        <h1>Guessing Game</h1>
        <div className='header-info'>
          <ScoreBoard score={score} />
          <div className='game-count'> Total Games: {totalGames.toLocaleString()}</div>
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
