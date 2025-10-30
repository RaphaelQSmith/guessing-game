import './App.css';
import {useState, useEffect} from 'react';
import GameCard from './components/GameCard';
import ScoreBoard from './components/ScoreBoard'


function App() {
  const [currentGame, setCurrentGame] = useState(null);
  const [score, setScore] = useState(0);
  const [gameHistory, setGameHistory] = useState([])
  const [loading, setLoading] = useState(true);

  const API_KEY = process.env.REACT_APP_RAWG_API_KEY;;
  const API_URL= `https://api.rawg.io/api/games?key=${API_KEY}`  

  const fetchRandomGame = async () => {
    setLoading(true);

    try{
      //get a random page to distribute load
      const randomPage = Math.floor(Math.random() * 50) +1;
      const response = await fetch(`${API_URL}&page=${randomPage}&page_size=1`)
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const game = data.results[0];
        
        //Fetch detailed game info (including developers)
        const detailResponse = await fetch(`https://api.rawg.io/api/games/${game.id}?key=${API_KEY}`);
        const gameDetails = await detailResponse.json();
        
        setCurrentGame({
          ...game,
          developers: gameDetails.developers || []
        });
      }
    }catch (error){
      console.error('Error fetching game:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomGame();
  }, []);

  const handleGuess = (userGuess) => {
    const correctAnswers = {
      title: currentGame.name.toLowerCase(),
      platforms: currentGame.parent_platforms?.map(p => p.platform.name.toLowerCase())
      || [],
      developers: currentGame.developers?.map(d=> d.name.toLowerCase()) || []
    }

    let points = 0;
    const results = {};

    // Check title
    if (userGuess.title.toLowerCase() === correctAnswers.title) {
      points += 50;
      results.title = true
    }

    // Check Platform
    const guessedPlatforms = userGuess.platforms.map(p => p.toLowerCase())
    const correctPlatforms = correctAnswers.platforms;
    const platformMatches = guessedPlatforms.filter(platform => correctPlatforms.some(correct=> correct.includes(platform) || platform.includes(correct)))
  
    if (platformMatches.length > 0){
      points += platformMatches.length * 10;
      results.platforms = platformMatches;
    }

    // Check for developers, partially or exact
    const guessedDevelopers = userGuess.developers.map(d=> d.toLowerCase());
    const correctDevelopers = correctAnswers.developers;
    const developerMatches = guessedDevelopers.filter(dev => 
      correctDevelopers.some(correct => correct.includes(dev) || dev.includes(correct))
    );

    if (developerMatches.length > 0 ) {
      points += developerMatches.length * 15;
      results.developers = developerMatches;
    }

    setScore(prev => prev+points);
    setGameHistory(prev => [...prev, {
      game:currentGame,
      userGuess,
      results,
      pointsEarned:points
    }])

    // Load next game
    fetchRandomGame();
  }

  if (loading){
    return <div className="loading">Loading game...</div>
  }

  return (
    <div className="App">
      <header className="app-header">
        <h1>Guessing Game</h1>
        <ScoreBoard score={score} />
      </header>

      {currentGame &&(
        <GameCard
          game={currentGame}
          onGuess={handleGuess} 
          />
      )}  
  
      <div className='game-history'>
        <h3>Recent Games</h3>
        {gameHistory.slice(-5).map((history, index)=>(
          <div key={index} className='history-item'>
            <span>{history.game.name}</span>
            <span>+{history.pointsEarned} points</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
