'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameState } from '../gameStore';

export default function DicePage() {
  const router = useRouter();
  const { gameState } = useGameState();
  const [isClient, setIsClient] = useState(false);
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState(null);
  const [showContinue, setShowContinue] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const currentPlayer = gameState.currentPlayerId 
    ? gameState.players[gameState.currentPlayerId] 
    : null;

  // Если нет текущего игрока, перенаправляем на главную
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
        <div className="text-center">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold mb-8">{currentPlayer.name}</h2>
      
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm text-center">
        <div className={`dice-value text-8xl font-bold mb-6 ${rolling ? 'animate-pulse' : ''}`}>
          {result !== null ? result : '?'}
        </div>
        
        {!showContinue ? (
          <button 
            onClick={roll} 
            disabled={rolling}
            className="w-full bg-blue-600 text-white py-4 rounded-xl text-xl font-semibold disabled:opacity-50"
          >
            {rolling ? 'БРОСАЕМ...' : 'ПРОСИТЬ КУБИК'}
          </button>
        ) : (
          <button 
            onClick={handleContinue}
            className="w-full bg-green-600 text-white py-4 rounded-xl text-xl font-semibold"
          >
            ПРОДОЛЖИТЬ
          </button>
        )}
      </div>
    </div>
  );
}