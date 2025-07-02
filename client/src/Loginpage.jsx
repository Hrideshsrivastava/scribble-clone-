import React, { useEffect, useState } from "react";
import socket from './Socket';// Backend address
import Spline from "@splinetool/react-spline";
import AvatarPicker from "./avatarpicker";
import Image from "./Image";

function Loginpage({ setCurrentComponent }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (username && password) {
      console.log("🔗 Connecting to socket server at:", import.meta.env.VITE_SERVER);
      console.log("🔼 Sending login", { username, password });
      socket.emit("login", { username, password });
    } else {
      setError("Please enter both username and password.");
    }
  };

  useEffect(() => {
    socket.on("login-success", () => {
      console.log("✅ Login successful");
      socket.emit('request-player-info'); // ✅ safe to do now
      socket.emit('request-player-list'); // Optional: refresh list too
      setCurrentComponent("App");
      
    });

    socket.on("login-error", (msg) => {
      setError(msg);
    });

    return () => {
      socket.off("login-success");
      socket.off("login-error");
    };
   }, [setCurrentComponent]);

 
  return (
  <>
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <Spline
        scene="https://prod.spline.design/XtgcVveEegtC4K69/scene.splinecode"
        style={{ position: 'absolute', top: 0, left: 0 }}
      />

      <div
        className="login-container"
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -20%)',
          backgroundColor: '#f1f1f1',
          padding: '20px',
          borderRadius: '10px',
          zIndex: 10,
          width: '40vw',
          flexDirection: 'row',
          display: 'flex',
        }}
      >
        <form onSubmit={handleLogin}>
        <Image />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="🪟 + ."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        {error && <p className="error">{error}</p>}
        <button type="submit">Login</button>
      </form>
      </div>
    </div>
  </>
);

}

export default Loginpage;
