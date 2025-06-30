import React, { useEffect, useRef, useState } from 'react';
import ChatApp from './ChatApp';
import socket from './Socket';
import ScribbleGame from './scribble';
import Testy from './test';
import Scoreboard from './Scoreboard';




function App() {
  //variable to manage the selected game
  const [selectedGame, setSelectedGame] = useState('Scribble');

  // rendering function to switch between games
  const renderGameComponent = () => {
    switch (selectedGame) {
      case 'Scribble':
        return <ScribbleGame />;

      case 'Testy':
        return <Testy />;  

      default:
        return <ScribbleGame />;
    }
  };

  return (
    <div className="app-container" style ={{width: '100vw'}}> 
      {/* Top Navbar */}
      <nav className="game-navbar">
        <button
          onClick={() => setSelectedGame('Scribble')}
          className={selectedGame === 'Scribble' ? 'active' : ''}
        >
          Scribble
        </button>
        <button
          onClick={() => setSelectedGame('Testy')}
          className={selectedGame === 'Testy' ? 'active' : ''}
        >
          Testing
        </button>
      </nav>

      {/* Main Content */}
      <div className="content-area">
        <div className="chat-pane">
          {/* scoreboard */}
          <Scoreboard players={[{ id: 1, name: 'Player1', score: 10 }, { id: 2, name: 'Player2', score: 20 }]} />
          {/* Chat Application */}
          
          <ChatApp />
        </div>

        <main className="game-pane">
          <div className="game-content-area">
            {renderGameComponent()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;