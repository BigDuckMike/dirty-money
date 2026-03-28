'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGameState } from '../gameStore';

// Внутренний компонент, который использует useSearchParams
function SetupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { initGame } = useGameState();
  const [names, setNames] = useState([]);

  useEffect(() => {
    const count = parseInt(searchParams?.get('count') || '2');
    setNames(Array(count).fill('').map((_, i) => `Игрок ${i + 1}`));
  }, [searchParams]);

  const updateName = (index, value) => {
    const newNames = [...names];
    newNames[index] = value;
    setNames(newNames);
  };

  const handleContinue = () => {
    initGame(names);
    router.push('/dice');
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-center mb-8">Имена игроков</h1>
      
      <div className="space-y-4 max-w-md mx-auto">
        {names.map((name, index) => (
          <div key={index} className="bg-white rounded-xl p-5">
            <div className="text-gray-500 text-base mb-2">Игрок {index + 1}</div>
            <input
              type="text"
              value={name}
              onChange={(e) => updateName(index, e.target.value)}
              className="w-full text-xl font-semibold border-b-2 border-gray-300 focus:border-blue-500 outline-none py-2"
              placeholder="Введите имя"
            />
          </div>
        ))}
      </div>
      
      <button 
        onClick={handleContinue}
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-8 py-4 rounded-xl text-xl font-semibold w-auto min-w-[220px] active:bg-blue-700 transition"
      >
        ПРОДОЛЖИТЬ
      </button>
    </>
  );
}

// Основной компонент с Suspense
export default function Setup() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen p-4">
        <h1 className="text-3xl font-bold text-center mb-8">Имена игроков</h1>
        <div className="space-y-4 max-w-md mx-auto">
          <div className="bg-white rounded-xl p-5">
            <div className="text-gray-500 text-base mb-2">Загрузка...</div>
            <div className="w-full text-xl font-semibold">Загрузка...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 pb-28">
      <Suspense fallback={<div className="text-center">Загрузка...</div>}>
        <SetupContent />
      </Suspense>
    </div>
  );
}