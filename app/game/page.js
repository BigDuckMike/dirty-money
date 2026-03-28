'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameState } from '../gameStore';
import RobberyModal from '../components/RobberyModal';
import Stars from '../components/Stars';
import VictoryScreen from '../components/VictoryScreen';

function Counter({ label, value, step, onUpdate, unit = '', extraInfo = '' }) {
  return (
    <div className="counter">
      <div className="counter-label">
        {label}: {value} {unit}
        {extraInfo && <span className="extra-info">{extraInfo}</span>}
      </div>
      <div className="counter-buttons">
        <button onClick={() => onUpdate(-step)}>-{step}</button>
        <button onClick={() => onUpdate(step)}>+{step}</button>
      </div>
    </div>
  );
}

export default function GamePage() {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const { gameState, updateBitcoinRate, updatePlayer, launderMoney, buyBitcoin, sellBitcoin, rob, endTurn, surrender } = useGameState();
  const [showRobberyModal, setShowRobberyModal] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const currentPlayer = gameState.currentPlayerId ? gameState.players[gameState.currentPlayerId] : null;
  const bitcoinRate = gameState.bitcoinRate;
  const winner = gameState.winner;

  // Проверка победы
  if (winner) {
    const winnerName = gameState.players[winner]?.name || `Игрок ${winner}`;
    return <VictoryScreen winnerName={winnerName} />;
  }

  if (!isClient || !currentPlayer) {
    return <div className="min-h-screen flex items-center justify-center">Загрузка...</div>;
  }

  const bitcoinValueUSD = (currentPlayer.bitcoin || 0) * bitcoinRate;
  const canRob = currentPlayer.dirty >= 200;

  const handleRob = (targetId, dirtyAmount, cleanAmount) => {
    rob(gameState.currentPlayerId, targetId, dirtyAmount, cleanAmount);
    setShowRobberyModal(false);
  };

  const handleSurrender = () => {
    if (confirm(`${currentPlayer.name}, вы уверены, что хотите сдаться?`)) {
      surrender(gameState.currentPlayerId);
    }
  };

  const handleEndTurn = () => {
    endTurn();
    router.push('/dice');
  };

  return (
    <div className="min-h-screen p-4 pb-24">
      {/* Шапка с именем и отмытыми деньгами */}
      <div className="bg-white rounded-xl p-4 mb-4 shadow">
        <div className="text-center">
          <div className="text-2xl font-bold">{currentPlayer.name}</div>
          <div className="text-sm text-gray-500 mt-1">
            ОТМЫТО: {currentPlayer.laundered} / 6000
          </div>
        </div>
      </div>

      {/* Курс биткоина */}
      <div className="bitcoin-rate">
        <div className="text-gray-500 text-sm">КУРС БИТКОИНА</div>
        <div className="bitcoin-rate-value">{bitcoinRate} USD</div>
        <div className="counter-buttons" style={{ justifyContent: 'center' }}>
          <button onClick={() => updateBitcoinRate(-100)}>-100</button>
          <button onClick={() => updateBitcoinRate(100)}>+100</button>
        </div>
      </div>

      {/* Грязные деньги */}
      <Counter
        label="USD ГРЯЗНЫЕ"
        value={currentPlayer.dirty}
        step={100}
        onUpdate={(delta) => updatePlayer(gameState.currentPlayerId, 'dirty', delta)}
      />

      {/* Чистые деньги с кнопкой отмыть */}
      <div className="counter">
        <div className="counter-label">
          USD ЧИСТЫЕ: {currentPlayer.clean}
        </div>
        <div className="counter-buttons" style={{ gap: '0.5rem' }}>
          <button onClick={() => updatePlayer(gameState.currentPlayerId, 'clean', -100)}>-100</button>
          <button onClick={() => updatePlayer(gameState.currentPlayerId, 'clean', 100)}>+100</button>
          <button 
            onClick={() => launderMoney(gameState.currentPlayerId)}
            className="bg-green-600 text-white px-4"
            disabled={currentPlayer.clean < 100}
          >
            ОТМЫТЬ 100
          </button>
        </div>
      </div>

      {/* Биткоин с кнопками купить/продать */}
      <div className="counter">
        <div className="counter-label">
          БИТКОИН: {currentPlayer.bitcoin} BTC
          <span className="extra-info">= {bitcoinValueUSD} USD (курс: {bitcoinRate} USD/BTC)</span>
        </div>
        <div className="counter-buttons" style={{ gap: '0.5rem' }}>
          <button onClick={() => buyBitcoin(gameState.currentPlayerId)}>КУПИТЬ 1</button>
          <button onClick={() => sellBitcoin(gameState.currentPlayerId)}>ПРОДАТЬ 1</button>
        </div>
      </div>

      {/* Долг */}
      <Counter
        label="ДОЛГ"
        value={currentPlayer.debt}
        step={100}
        onUpdate={(delta) => updatePlayer(gameState.currentPlayerId, 'debt', delta)}
      />

      {/* Звёзды */}
      <Stars
        count={currentPlayer.stars || 0}
        onUpdate={(delta) => updatePlayer(gameState.currentPlayerId, 'stars', delta)}
      />

      {/* Кнопка ограбления */}
      <button 
        onClick={() => setShowRobberyModal(true)}
        disabled={!canRob}
        className={`w-full py-3 rounded-xl text-white font-semibold mt-4 ${
          canRob ? 'bg-red-600' : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        ОГРАБИТЬ {!canRob && '(нужно 200 грязных)'}
      </button>

      {/* Кнопки завершения хода и сдачи */}
      <div className="flex gap-3 mt-4">
        <button 
          onClick={handleEndTurn}
          className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold"
        >
          ЗАВЕРШИТЬ ХОД
        </button>
        <button 
          onClick={handleSurrender}
          className="flex-1 bg-gray-600 text-white py-3 rounded-xl font-semibold"
        >
          СДАТЬСЯ
        </button>
      </div>

      {/* Модальное окно ограбления */}
      {showRobberyModal && (
        <RobberyModal
          activePlayer={gameState.currentPlayerId}
          players={gameState.players}
          onRob={handleRob}
          onClose={() => setShowRobberyModal(false)}
        />
      )}
    </div>
  );
}