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
  const [showRobberyModal, setShowRobberyModal] = useState(false);
  const router = useRouter();
  const { 
    gameState, 
    updateBitcoinRate, 
    updatePlayer, 
    launderMoney, 
    buyBitcoin, 
    sellBitcoin, 
    rob, 
    endTurn, 
    surrender 
  } = useGameState();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Защита: если игра не начата или нет данных, перенаправляем на главную
  useEffect(() => {
    if (isClient && (!gameState.gameStarted || !gameState.currentPlayerId)) {
      router.push('/');
    }
  }, [isClient, gameState.gameStarted, gameState.currentPlayerId, router]);

  // Если ещё не на клиенте или нет данных, показываем загрузку
  if (!isClient || !gameState.gameStarted || !gameState.currentPlayerId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-xl">Загрузка...</div>
      </div>
    );
  }

  const currentPlayer = gameState.players[gameState.currentPlayerId];
  
  // Проверка победы
  if (gameState.winner) {
    const winnerName = gameState.players[gameState.winner]?.name || `Игрок ${gameState.winner}`;
    return <VictoryScreen winnerName={winnerName} />;
  }

  if (!currentPlayer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-xl">Игрок не найден</div>
      </div>
    );
  }

  const bitcoinRate = gameState.bitcoinRate;
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
      <div className="player-header">
        <div className="player-name">{currentPlayer.name}</div>
        <div className="player-laundered">
          ОТМЫТО: {currentPlayer.laundered} / 6000
        </div>
      </div>

      {/* Курс биткоина */}
      <div className="bitcoin-rate">
        <div className="bitcoin-rate-label">КУРС БИТКОИНА</div>
        <div className="bitcoin-rate-value">{bitcoinRate} USD</div>
        <div className="bitcoin-rate-buttons">
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

      {/* Кнопки действий */}
      <div className="game-actions">
        <button 
          onClick={() => setShowRobberyModal(true)}
          disabled={!canRob}
          className={`action-button-large ${canRob ? 'action-button-red' : 'action-button-gray'}`}
        >
          ОГРАБИТЬ {!canRob && '(нужно 200 грязных)'}
        </button>
        
        <div className="game-actions-row">
          <button 
            onClick={handleEndTurn}
            className="action-button-large action-button-blue"
          >
            ЗАВЕРШИТЬ ХОД
          </button>
          <button 
            onClick={handleSurrender}
            className="action-button-large action-button-gray"
          >
            СДАТЬСЯ
          </button>
        </div>
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