'use client';

import { useState } from 'react';

export default function Dice({ onRollComplete }) {
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState(null);
  const [showContinue, setShowContinue] = useState(false);

  const roll = () => {
    setRolling(true);
    setShowContinue(false);
    
    let rolls = 0;
    const interval = setInterval(() => {
      const randomValue = Math.floor(Math.random() * 6) + 1;
      setResult(randomValue);
      rolls++;
      if (rolls > 15) {
        clearInterval(interval);
        setRolling(false);
        setShowContinue(true);
        if (onRollComplete) onRollComplete(randomValue);
      }
    }, 50);
  };

  return (
    <div className="dice-container">
      <div className={`dice-value ${rolling ? 'rolling' : ''}`}>
        {result !== null ? result : '?'}
      </div>
      {!showContinue ? (
        <button onClick={roll} className="dice-button" disabled={rolling}>
          {rolling ? 'Бросаем...' : 'ПРОСИТЬ КУБИК'}
        </button>
      ) : (
        <button onClick={() => onRollComplete?.(result)} className="continue-button">
          ПРОДОЛЖИТЬ
        </button>
      )}
    </div>
  );
}