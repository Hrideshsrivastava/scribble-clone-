import React, { useEffect, useState } from 'react';

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u']);

function Hints({ word, revealInterval = 15000 }) {
  const [revealedIndices, setRevealedIndices] = useState([]);

  useEffect(() => {
    const vowelIndices = word
      .split('')
      .map((char, i) => (VOWELS.has(char.toLowerCase()) ? i : null))
      .filter((i) => i !== null);

    const remaining = new Set(vowelIndices);

    const interval = setInterval(() => {
      if (remaining.size === 0) {
        clearInterval(interval);
        return;
      }

      const choices = Array.from(remaining);
      const randomIndex = choices[Math.floor(Math.random() * choices.length)];
      remaining.delete(randomIndex);

      setRevealedIndices((prev) => [...prev, randomIndex]);
    }, revealInterval);

    return () => clearInterval(interval);
  }, [word, revealInterval]);

  return (
    <div style={{ fontSize: '2rem', letterSpacing: '10px', textAlign: 'center' }}>
      {word
        .split('')
        .map((char, i) =>
          revealedIndices.includes(i) ? char : '_'
        )
        .join(' ')}
    </div>
  );
}

export default Hints;