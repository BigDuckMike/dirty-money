'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGameState } from '../../gameStore';
import Stars from '../../components/Stars';

function Counter({ label, value, step, onUpdate, unit = '' }) {
  return (
    <div className="counter">
      <div className="counter-label">
        {label}: {value} {unit}
      </div>
      <div className="counter-buttons">
        <button onClick={() => onUpdate(-step)}>-{step}</button>
        <button onClick={() => onUpdate(step)}>+{step}</button>
      </div>
    </div>
  );
}

export default function PlayerPage() {
  const [isClient, setIsClient] = useState(false);
  const { id } = useParams();
  const router = useRouter();
  const playerId = parseInt(id);
  
  const { gameState, updatePlayer } = useGameState();
  const playerData = gameState.players[playerId];
  const bitcoinRate = gameState.bitcoinRate;

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!playerData) {
    return <div className="text-center mt-10">Игрок не найден</div>;
  }

  // Пока не загрузился клиент, показываем заглушку
  if (!isClient) {
    return (
      <div>
        <button className="back-btn opacity-50" disabled>← Назад</button>
        <div className="counter">
          <div className="counter-label">USD ГРЯЗНЫЕ: 3000</div>
          <div className="counter-buttons">
            <button disabled>-100</button>
            <button disabled>+100</button>
          </div>
        </div>
        <div className="counter">
          <div className="counter-label">USD ЧИСТЫЕ: 0</div>
          <div className="counter-buttons">
            <button disabled>-100</button>
            <button disabled>+100</button>
          </div>
        </div>
        <div className="stars-container">
          <div className="stars-label">ЗВЁЗДЫ ЗА РЕПУТАЦИЮ</div>
          <div className="stars-row">
            {[0, 1, 2, 3, 4].map((index) => (
              <span key={index} className="star star-grey">★</span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => router.push('/')} className="back-btn">
        ← Назад
      </button>

      <Counter
        label="USD ГРЯЗНЫЕ"
        value={playerData.dirty}
        step={100}
        onUpdate={(delta) => updatePlayer(playerId, 'dirty', delta)}
      />

      <Counter
        label="USD ЧИСТЫЕ"
        value={playerData.clean}
        step={100}
        onUpdate={(delta) => updatePlayer(playerId, 'clean', delta)}
      />

      <Counter
        label="БИТКОИН"
        value={playerData.bitcoin}
        step={1}
        onUpdate={(delta) => updatePlayer(playerId, 'bitcoin', delta)}
        unit={`(курс: ${bitcoinRate} USD)`}
      />

      <Counter
        label="ОТМЫТО ДЕНЕГ"
        value={playerData.laundered}
        step={100}
        onUpdate={(delta) => updatePlayer(playerId, 'laundered', delta)}
      />

      <Counter
        label="ДОЛГ"
        value={playerData.debt}
        step={100}
        onUpdate={(delta) => updatePlayer(playerId, 'debt', delta)}
      />

      <Stars
        count={playerData.stars || 0}
        onUpdate={(delta) => updatePlayer(playerId, 'stars', delta)}
      />
    </div>
  );
}