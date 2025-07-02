import React, { useState, useEffect, useRef } from 'react';

function Timer({ initialSeconds = 60, onComplete }) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const intervalRef = useRef(null);

  // Format MM:SS
  const formatTime = (s) => {
    const m = String(Math.floor(s / 60)).padStart(2, '0');
    const sec = String(s % 60).padStart(2, '0');
    return `${m}:${sec}`;
  };

  useEffect(() => {
    setSecondsLeft(initialSeconds);

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          if (onComplete) onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [initialSeconds, onComplete]);

  return (
    <div style={{ fontSize: '2rem', textAlign: 'center', fontWeight: 'bold' }}>
      ⏳ {formatTime(secondsLeft)}
    </div>
  );
}

export default Timer;
