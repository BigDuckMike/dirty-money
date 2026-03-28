'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useGameState } from './gameStore';

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const { gameState, updateBitcoinRate, resetGame } = useGameState();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Пока не загрузился клиент, показываем заглушку
  if (!isClient) {
    return (
      <div>
        <div className="bitcoin-rate">
          <div className="text-gray-500 text-sm">КУРС БИТКОИНА</div>
          <div className="bitcoin-rate-value">200 USD</div>
          <div className="counter-buttons" style={{ justifyContent: 'center' }}>
            <button disabled>-100</button>
            <button disabled>+100</button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[1, 2, 3, 4].map(num => (
            <button key={num} className="player-button w-full opacity-50" disabled>
              ИГРОК {num}
            </button>
          ))}
        </div>
        <button className="new-game-btn opacity-50" disabled>
          НОВАЯ ИГРА
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="bitcoin-rate">
        <div className="text-gray-500 text-sm">КУРС БИТКОИНА</div>
        <div className="bitcoin-rate-value">{gameState.bitcoinRate} USD</div>
        <div className="counter-buttons" style={{ justifyContent: 'center' }}>
          <button onClick={() => updateBitcoinRate(-100)}>-100</button>
          <button onClick={() => updateBitcoinRate(100)}>+100</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {[1, 2, 3, 4].map(num => (
          <Link key={num} href={`/player/${num}`}>
            <button className="player-button w-full">
              ИГРОК {num}
            </button>
          </Link>
        ))}
      </div>

      <button onClick={resetGame} className="new-game-btn">
        НОВАЯ ИГРА
      </button>
    </div>
  );
}