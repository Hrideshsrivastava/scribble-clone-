import React, { useEffect, useRef, useState } from 'react';
import ChatApp from './ChatApp';
import socket from './Socket';
import ScribbleGame from './scribble';
import Testy from './test';
import Scoreboard from './Scoreboard';
import Timer from './Timer';
import Hints from './Hints';


function App() {
  
  const [user, setUser] = useState({ id: "", name: "", avatar: "", score: 0 });
  const [host, setHost] = useState(false);
  const [clockRunning, setClockRunning] = useState(false);

  //manage host selection 
  

// Keep track of the latest user in a ref and host information  
useEffect(() => {
  const handlePlayerInfo = (player) => {
    console.log("👤 Player info received:", player);
    setUser(player);
    socket.emit('host-id');
  };

  const handleHostId = (hostId) => {
    console.log("👤 Host ID received:", hostId);
    if (latestUserRef.current && hostId === latestUserRef.current.id) {
      setHost(true);
    } else {
      setHost(false);
    }
  };

  const handleStartClock = () => {
    console.log("⏰ Clock started!");
    setClockRunning(true);

   

    
  };

  socket.on('player-info', handlePlayerInfo);
  socket.on('host-id', handleHostId);
  socket.on('start-clock', handleStartClock);
  socket.emit('request-player-info');

  return () => {
    socket.off('player-info', handlePlayerInfo);
    socket.off('host-id', handleHostId);
    socket.off('start-clock', handleStartClock);
    // cleanup on unmount
  };
}, []);

//keep track of the latest word in a ref so it's always fresh inside event handlers
const [latestWord, setLatestWord] = useState('');


 

// Keep track of the current drawer in a ref so it's always fresh inside event handlers
    const [currentDrawerId, setCurrentDrawerId] = useState('');

  useEffect(() => {
  const handleDrawer = (id) => {
    console.log('🧑‍🎨 New drawer:', id);
    setCurrentDrawerId(id);
  };

  const handleWord = (word) => {
    console.log('📦 Word received:', word);
    setLatestWord(word);
  };

  socket.on('current-drawer', handleDrawer);
  socket.on('correct-word', handleWord);

  return () => {
    socket.off('current-drawer', handleDrawer);
    socket.off('correct-word', handleWord);
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

      {currentDrawerId === user.id ? (
  <h3>Your word: {latestWord}</h3>
) : (
  <Hints word={latestWord} />
)}

    {host && (
    <>
      
       
      <button
        onClick={() => socket.emit('sribble-started')}
       // className={selectedGame === 'Testy' ? 'active' : ''}
      >
        start game
      </button>
    </>
  )}
</nav>

      {/* Main Content */}
      <div className="content-area">
        <div className="chat-pane">
          {/* scoreboard */}
          {clockRunning &&  <Timer initialSeconds={60}
              onComplete={() => {
              console.log("⏰ Time's up!");
    
              setClockRunning(false);}}
/>}
         
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