'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGameState } from '../gameStore';

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
      <h1 className="setup-title">Имена игроков</h1>
      
      <div className="space-y-4 max-w-md mx-auto">
        {names.map((name, index) => (
          <div key={index} className="player-name-card">
            <div className="player-name-label">Игрок {index + 1}</div>
            <input
              type="text"
              value={name}
              onChange={(e) => updateName(index, e.target.value)}
              className="player-name-input"
              placeholder="Введите имя"
            />
          </div>
        ))}
      </div>
      
      <button 
        onClick={handleContinue}
        className="continue-btn"
      >
        ПРОДОЛЖИТЬ
      </button>
    </>
  );
}

export default function Setup() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen p-4">
        <h1 className="setup-title">Имена игроков</h1>
        <div className="space-y-4 max-w-md mx-auto">
          <div className="player-name-card">
            <div className="player-name-label">Загрузка...</div>
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