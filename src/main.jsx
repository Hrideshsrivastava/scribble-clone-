// main.jsx
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import Loginpage from './Loginpage.jsx';

function AppWrapper() {
  const [currentComponent, setCurrentComponent] = useState('Loginpage');

  const renderPage = () => {
    switch (currentComponent) {
      case 'Loginpage':
        return <Loginpage setCurrentComponent={setCurrentComponent} />;
      case 'App':
        return <App />;
      default:
        return <Loginpage setCurrentComponent={setCurrentComponent} />;
    }
  };

  return (
    <React.StrictMode>
      {renderPage()}
    </React.StrictMode>
  );
}

createRoot(document.getElementById('root')).render(<AppWrapper />);
