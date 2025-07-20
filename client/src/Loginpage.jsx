import React, { useEffect, useState } from "react";
import socket from './Socket';
import Spline from "@splinetool/react-spline";
import Image from "./Image";
import './Login.css'; // <-- IMPORTANT: Imports the new CSS file

function Loginpage({ setCurrentComponent }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (username && password) {
      socket.emit("login", { username, password });
    } else {
      setError("Please enter both username and password.");
    }
  };

  useEffect(() => {
    const handleLoginSuccess = () => {
      console.log("✅ Login successful");
      socket.emit('request-player-info');
      socket.emit('request-player-list');
      setCurrentComponent("App");
    };

    const handleLoginError = (msg) => {
      setError(msg);
    };

    socket.on("login-success", handleLoginSuccess);
    socket.on("login-error", handleLoginError);

    return () => {
      socket.off("login-success", handleLoginSuccess);
      socket.off("login-error", handleLoginError);
    };
  }, [setCurrentComponent]);

  return (
    <>
      {/* This main div centers the form on the page */}
      <div style={{ position: 'relative', width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spline
          scene="https://prod.spline.design/XtgcVveEegtC4K69/scene.splinecode"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        />

        {/* The form now uses CSS classes instead of inline styles */}
        <form onSubmit={handleLogin} className="login-form">
          <Image />

          <div className="form-content">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="login-input"
            />
            <input
              type="text"
              placeholder="Room Code (or Avatar 🪟 + .)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
            />

            {error && <p className="login-error">{error}</p>}

            <button type="submit" className="login-button">
              Let's Go!
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default Loginpage;