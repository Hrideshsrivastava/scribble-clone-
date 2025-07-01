
import React, { useState, useEffect } from "react";
import socket from './Socket';

function Scoreboard() {
  
  const [players, setPlayers] = useState([]);
  

  useEffect(() => {
  const handlePlayerList = (updatedPlayers) => {
    console.log("📋 Updated player list received:", updatedPlayers);
    setPlayers(updatedPlayers.sort((a, b) => b.score - a.score));
  };

  socket.on("player-list", handlePlayerList);

  // Actively request the latest player list
  socket.emit("request-player-list");

  return () => {
    socket.off("player-list", handlePlayerList);
  };
}, []);

  return (
    <div className="scoreboard" style={{ padding: '10px', height: '30%', display: 'flex', flexDirection: 'column' }}>
     <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #ccc', padding: '8px', background: '#f9f9f9', }}>
        
     <h2 style = {{textAlign: 'center'}}>Scoreboard</h2>
      <ul style = {{textAlign: 'center', listStyle: 'none'}} >
        {players.map((player) => (
          <li key={player.id}>
            {player.avatar} {player.name} - Score: {player.score}
          </li>
        ))}
      </ul>
    </div>
     </div>
  );
}
export default Scoreboard;