'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGameState } from '../gameStore';

export default function Setup() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const count = parseInt(searchParams.get('count') || '2');
  const { initGame } = useGameState();
  const [isClient, setIsClient] = useState(false);
  const [names, setNames] = useState([]);

  useEffect(() => {
    setIsClient(true);
    setNames(Array(count).fill('').map((_, i) => `Игрок ${i + 1}`));
  }, [count]);

  const updateName = (index, value) => {
    const newNames = [...names];
    newNames[index] = value;
    setNames(newNames);
  };

  const handleContinue = () => {
    initGame(names);
    router.push('/dice');
  };

  if (!isClient) {
    return (
      <div className="min-h-screen p-4">
        <h1 className="text-2xl font-bold text-center mb-6">Имена игроков</h1>
        <div className="space-y-3 max-w-sm mx-auto">
          {[1, 2].map((_, index) => (
            <div key={index} className="bg-white rounded-xl p-4 opacity-50">
              <div className="text-gray-500 text-sm mb-1">Игрок {index + 1}</div>
              <div className="w-full text-lg font-semibold">Игрок {index + 1}</div>
            </div>
          ))}
        </div>
        <button className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-8 py-3 rounded-xl text-lg font-semibold opacity-50">
          ПРОДОЛЖИТЬ
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Имена игроков</h1>
      
      <div className="space-y-3 max-w-sm mx-auto">
        {names.map((name, index) => (
          <div key={index} className="bg-white rounded-xl p-4">
            <div className="text-gray-500 text-sm mb-1">Игрок {index + 1}</div>
            <input
              type="text"
              value={name}
              onChange={(e) => updateName(index, e.target.value)}
              className="w-full text-lg font-semibold border-b border-gray-300 focus:border-blue-500 outline-none py-1"
              placeholder="Введите имя"
            />
          </div>
        ))}
      </div>
      
      <button 
        onClick={handleContinue}
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-8 py-3 rounded-xl text-lg font-semibold w-auto min-w-[200px]"
      >
        ПРОДОЛЖИТЬ
      </button>
    </div>
  );
}