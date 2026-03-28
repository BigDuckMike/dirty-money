'use client';

import { useState } from 'react';

export default function RobberyModal({ activePlayer, players, onRob, onClose }) {
  const [step, setStep] = useState('select'); // 'select' или 'steal'
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [dirtyAmount, setDirtyAmount] = useState(0);
  const [cleanAmount, setCleanAmount] = useState(0);

  const handleSelectTarget = (targetId) => {
    setSelectedTarget(targetId);
    // Переходим к выбору сумм
    setStep('steal');
  };

  const handleConfirmRob = () => {
    if (selectedTarget && (dirtyAmount > 0 || cleanAmount > 0)) {
      onRob(selectedTarget, dirtyAmount, cleanAmount);
      onClose();
    }
  };

  const handleCancel = () => {
    if (step === 'select') {
      onClose();
    } else {
      // Возвращаемся к выбору жертвы
      setStep('select');
      setSelectedTarget(null);
      setDirtyAmount(0);
      setCleanAmount(0);
    }
  };

  // Получаем активного игрока для проверки возможности ограбления
  const activePlayerData = players[activePlayer];
  const canRob = activePlayerData?.dirty >= 200;

  if (!canRob) {
    return (
      <div className="modal-overlay">
        <div className="modal">
          <h3 className="text-xl font-bold mb-4">Недостаточно средств</h3>
          <p className="mb-4">Для ограбления нужно 200 грязных денег.</p>
          <button 
            onClick={onClose}
            className="w-full bg-gray-600 text-white py-2 rounded-xl"
          >
            ЗАКРЫТЬ
          </button>
        </div>
      </div>
    );
  }

  if (step === 'select') {
    return (
      <div className="modal-overlay">
        <div className="modal">
          <h3 className="text-xl font-bold mb-4">Кого грабим?</h3>
          <p className="text-sm text-gray-500 mb-4">
            Стоимость ограбления: 200 грязных
          </p>
          <div className="players-list">
            {Object.entries(players).map(([id, player]) => {
              if (parseInt(id) === activePlayer || !player.active) return null;
              return (
                <div
                  key={id}
                  className="player-card"
                  onClick={() => handleSelectTarget(parseInt(id))}
                >
                  <strong>{player.name}</strong>
                  <div className="text-sm text-gray-600">
                    Грязные: {player.dirty} | Чистые: {player.clean}
                  </div>
                </div>
              );
            })}
          </div>
          <button 
            onClick={handleCancel}
            className="w-full mt-4 bg-gray-300 text-gray-700 py-2 rounded-xl"
          >
            ПЕРЕДУМАЛ
          </button>
        </div>
      </div>
    );
  }

  // step === 'steal' - выбор сумм
  const targetPlayer = players[selectedTarget];
  
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3 className="text-xl font-bold mb-2">Грабим {targetPlayer?.name}</h3>
        <p className="text-sm text-gray-500 mb-4">
          У активного игрока списано 200 грязных
        </p>
        
        <div className="robbery-amounts">
          <label className="block mb-3">
            <span className="font-medium">Сколько ГРЯЗНЫХ украсть?</span>
            <div className="flex items-center gap-2 mt-1">
              <button 
                onClick={() => setDirtyAmount(Math.max(0, dirtyAmount - 100))}
                className="bg-gray-200 w-10 h-10 rounded-full text-xl"
              >-</button>
              <input
                type="number"
                value={dirtyAmount}
                onChange={(e) => setDirtyAmount(Math.max(0, parseInt(e.target.value) || 0))}
                className="flex-1 text-center border rounded-lg py-2"
                step={100}
              />
              <button 
                onClick={() => setDirtyAmount(dirtyAmount + 100)}
                className="bg-gray-200 w-10 h-10 rounded-full text-xl"
              >+</button>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Максимум: {targetPlayer?.dirty}
            </div>
          </label>
          
          <label className="block mb-4">
            <span className="font-medium">Сколько ЧИСТЫХ украсть?</span>
            <div className="flex items-center gap-2 mt-1">
              <button 
                onClick={() => setCleanAmount(Math.max(0, cleanAmount - 100))}
                className="bg-gray-200 w-10 h-10 rounded-full text-xl"
              >-</button>
              <input
                type="number"
                value={cleanAmount}
                onChange={(e) => setCleanAmount(Math.max(0, parseInt(e.target.value) || 0))}
                className="flex-1 text-center border rounded-lg py-2"
                step={100}
              />
              <button 
                onClick={() => setCleanAmount(cleanAmount + 100)}
                className="bg-gray-200 w-10 h-10 rounded-full text-xl"
              >+</button>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Максимум: {targetPlayer?.clean}
            </div>
          </label>
        </div>
        
        <div className="modal-buttons">
          <button 
            onClick={handleConfirmRob}
            disabled={dirtyAmount === 0 && cleanAmount === 0}
            className={`flex-1 py-2 rounded-xl font-semibold ${
              dirtyAmount > 0 || cleanAmount > 0
                ? 'bg-red-600 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            ОГРАБИТЬ
          </button>
          <button 
            onClick={handleCancel}
            className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-xl"
          >
            НАЗАД
          </button>
        </div>
      </div>
    </div>
  );
}