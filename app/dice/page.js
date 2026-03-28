'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameState } from '../gameStore';

export default function DicePage() {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const { gameState } = useGameState();
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState(null);
  const [showContinue, setShowContinue] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const currentPlayer = gameState.currentPlayerId 
    ? gameState.players[gameState.currentPlayerId] 
    : null;

  useEffect(() => {
    if (isClient && (!gameState.gameStarted || !currentPlayer)) {
      router.push('/');
    }
  }, [isClient, gameState.gameStarted, currentPlayer, router]);

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
      }
    }, 50);
  };

  const handleContinue = () => {
    router.push('/game');
  };

  if (!isClient || !currentPlayer) {
    return (
      <div className="dice-container">
        <div className="text-center text-xl">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="dice-container">
      <h2 className="dice-player-name">{currentPlayer.name}</h2>
      
      <div className="dice-card">
        <div className={`dice-value ${rolling ? 'animate-pulse' : ''}`}>
          {result !== null ? result : '?'}
        </div>
        
        {!showContinue ? (
          <button 
            onClick={roll} 
            disabled={rolling}
            className="dice-button"
          >
            {rolling ? 'БРОСАЕМ...' : 'Бросить кубик!'}
          </button>
        ) : (
          <button 
            onClick={handleContinue}
            className="dice-continue-btn"
          >
            ПРОДОЛЖИТЬ
          </button>
        )}
      </div>
    </div>
  );
}