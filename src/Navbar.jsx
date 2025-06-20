import React from 'react';

function Navbar({ onSelectContent }) {
  return (
    <nav style={{ background: '#333', padding: '10px', color: 'white', display: 'flex', justifyContent: 'space-around' }}>
      <button onClick={() => onSelectContent('home')} style={buttonStyle}>Home</button>
      <button onClick={() => onSelectContent('about')} style={buttonStyle}>About</button>
      <button onClick={() => onSelectContent('contact')} style={buttonStyle}>Contact</button>
        
    </nav>
  );
}

// Simple inline style for buttons (you'd typically use CSS modules or a styling library)
const buttonStyle = {
  background: 'none',
  border: '1px solid white',
  color: 'white',
  padding: '8px 15px',
  cursor: 'pointer',
  borderRadius: '5px',
  fontSize: '16px',
};

export default Navbar;