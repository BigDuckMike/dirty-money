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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-xl">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h2 className="text-3xl font-bold mb-12 text-center">{currentPlayer.name}</h2>
      
      <div className="bg-white rounded-3xl p-10 w-full max-w-md text-center">
        <div className={`dice-value text-9xl font-bold mb-10 ${rolling ? 'animate-pulse' : ''}`}>
          {result !== null ? result : '?'}
        </div>
        
        {!showContinue ? (
          <button 
            onClick={roll} 
            disabled={rolling}
            className="w-full bg-blue-600 text-white py-5 rounded-2xl text-2xl font-semibold disabled:opacity-50 active:bg-blue-700 transition"
          >
            {rolling ? 'БРОСАЕМ...' : 'ПРОСИТЬ КУБИК'}
          </button>
        ) : (
          <button 
            onClick={handleContinue}
            className="w-full bg-green-600 text-white py-5 rounded-2xl text-2xl font-semibold active:bg-green-700 transition"
          >
            ПРОДОЛЖИТЬ
          </button>
        )}
      </div>
    </div>
  );
}