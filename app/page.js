'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [playerCount, setPlayerCount] = useState(2);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const startGame = () => {
    router.push(`/setup?count=${playerCount}`);
  };

  // Пока не загрузился клиент, показываем заглушку
  if (!isClient) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold mb-8">ГРЯЗНЫЕ ДЕНЬГИ</h1>
        <div className="bg-white rounded-xl p-6 w-full max-w-sm text-center">
          <div className="text-gray-500 mb-2">Количество игроков</div>
          <div className="flex items-center justify-center gap-6 mb-6">
            <button className="text-3xl font-bold w-12 h-12 bg-gray-200 rounded-full opacity-50">-</button>
            <span className="text-4xl font-bold">2</span>
            <button className="text-3xl font-bold w-12 h-12 bg-gray-200 rounded-full opacity-50">+</button>
          </div>
          <button className="w-full bg-blue-600 text-white py-3 rounded-xl text-lg font-semibold opacity-50">
            НАЧАТЬ ИГРУ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-8">ГРЯЗНЫЕ ДЕНЬГИ</h1>
      
      <div className="bg-white rounded-xl p-6 w-full max-w-sm text-center">
        <div className="text-gray-500 mb-2">Количество игроков</div>
        <div className="flex items-center justify-center gap-6 mb-6">
          <button 
            onClick={() => setPlayerCount(Math.max(2, playerCount - 1))}
            className="text-3xl font-bold w-12 h-12 bg-gray-200 rounded-full"
          >
            -
          </button>
          <span className="text-4xl font-bold">{playerCount}</span>
          <button 
            onClick={() => setPlayerCount(Math.min(4, playerCount + 1))}
            className="text-3xl font-bold w-12 h-12 bg-gray-200 rounded-full"
          >
            +
          </button>
        </div>
        
        <button 
          onClick={startGame}
          className="w-full bg-blue-600 text-white py-3 rounded-xl text-lg font-semibold"
        >
          НАЧАТЬ ИГРУ
        </button>
      </div>
    </div>
  );
}