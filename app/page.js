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
        <h1 className="text-4xl font-bold mb-12 text-center">ГРЯЗНЫЕ ДЕНЬГИ</h1>
        <div className="bg-white rounded-2xl p-8 w-full max-w-md text-center">
          <div className="text-gray-500 text-lg mb-4">Количество игроков</div>
          <div className="flex items-center justify-center gap-8 mb-8">
            <button className="text-5xl font-bold w-20 h-20 bg-gray-200 rounded-full opacity-50">-</button>
            <span className="text-6xl font-bold">2</span>
            <button className="text-5xl font-bold w-20 h-20 bg-gray-200 rounded-full opacity-50">+</button>
          </div>
          <button className="w-full bg-blue-600 text-white py-5 rounded-2xl text-2xl font-semibold opacity-50">
            НАЧАТЬ ИГРУ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-12 text-center">ГРЯЗНЫЕ ДЕНЬГИ</h1>
      
      <div className="bg-white rounded-2xl p-8 w-full max-w-md text-center">
        <div className="text-gray-500 text-lg mb-4">Количество игроков</div>
        <div className="flex items-center justify-center gap-8 mb-8">
          <button 
            onClick={() => setPlayerCount(Math.max(2, playerCount - 1))}
            className="text-5xl font-bold w-20 h-20 bg-gray-200 rounded-full active:bg-gray-300 transition"
          >
            -
          </button>
          <span className="text-6xl font-bold">{playerCount}</span>
          <button 
            onClick={() => setPlayerCount(Math.min(4, playerCount + 1))}
            className="text-5xl font-bold w-20 h-20 bg-gray-200 rounded-full active:bg-gray-300 transition"
          >
            +
          </button>
        </div>
        
        <button 
          onClick={startGame}
          className="w-full bg-blue-600 text-white py-5 rounded-2xl text-2xl font-semibold active:bg-blue-700 transition"
        >
          НАЧАТЬ ИГРУ
        </button>
      </div>
    </div>
  );
}