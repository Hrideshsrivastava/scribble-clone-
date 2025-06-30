import React from "react";
import socket from './Socket';

function Scoreboard({ players }) {
  return (
    <div className="scoreboard" style={{ padding: '10px', height: '30%', display: 'flex', flexDirection: 'column' }}>
     <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #ccc', padding: '8px', background: '#f9f9f9', }}>
        
     <h2 style = {{textAlign: 'center'}}>Scoreboard</h2>
      <ul style = {{textAlign: 'center', listStyle: 'none'}} >
        {players.map((player) => (
          <li key={player.id}>
            {player.name} - Score: {player.score}
          </li>
        ))}
      </ul>
    </div>
     </div>
  );
}
export default Scoreboard;