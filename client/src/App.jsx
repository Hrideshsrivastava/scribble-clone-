import React, { useEffect, useRef, useState } from 'react';
import ChatApp from './ChatApp';
import socket from './Socket';
import ScribbleGame from './scribble';
import Testy from './test';
import Scoreboard from './Scoreboard';







function App() {
  
  const [user, setUser] = useState({ id: "", name: "", avatar: "", score: 0 });
  const [host, setHost] = useState(false);
  //manage host selection 
  
useEffect(() => {
  const handlePlayerInfo = (player) => {
    console.log("👤 Player info received:", player);
    setUser(player);
    socket.emit('host-id'); // Ask for current host after joining
  };

  const handleHostId = (hostId) => {
    console.log("👤 Host ID received:", hostId);

    // Check against user.id safely using latestUserRef
    if (latestUserRef.current && hostId === latestUserRef.current.id) {
      console.log("👑 You are now the host!");
      setHost(true);
    } else {
      setHost(false);
    }
  };

  socket.on('player-info', handlePlayerInfo);
  socket.on('host-id', handleHostId);

  socket.emit('request-player-info');

  return () => {
    socket.off('player-info', handlePlayerInfo);
    socket.off('host-id', handleHostId);
  };
}, []);

// Keep latest user in a ref so it's always fresh inside event handlers
const latestUserRef = useRef(user);
useEffect(() => {
  latestUserRef.current = user;
}, [user]);

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
  {host ? (
    <>
      <button
        onClick={() => setSelectedGame('Scribble')}
        //className={selectedGame === 'Scribble' ? 'active' : ''}
      >
        Scribble
      </button>
      <button
        onClick={() => setSelectedGame('Testy')}
       // className={selectedGame === 'Testy' ? 'active' : ''}
      >
        start game
      </button>
    </>
  ) : (
    <span className="waiting-msg">Waiting for host to select a game...</span>
  )}
</nav>

      {/* Main Content */}
      <div className="content-area">
        <div className="chat-pane">
          {/* scoreboard */}
          <Scoreboard />
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