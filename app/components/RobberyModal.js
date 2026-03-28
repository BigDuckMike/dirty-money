'use client';

import { useState } from 'react';

export default function RobberyModal({ activePlayer, players, onRob, onClose }) {
  const [step, setStep] = useState('select');
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [dirtyAmount, setDirtyAmount] = useState(0);
  const [cleanAmount, setCleanAmount] = useState(0);

  const activePlayerData = players[activePlayer];
  const canRob = activePlayerData?.dirty >= 200;

  const handleSelectTarget = (targetId) => {
    setSelectedTarget(targetId);
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
      setStep('select');
      setSelectedTarget(null);
      setDirtyAmount(0);
      setCleanAmount(0);
    }
  };

  if (!canRob) {
    return (
      <div className="modal-overlay">
        <div className="modal">
          <h3 className="modal-title">Недостаточно средств</h3>
          <p className="text-center mb-4">Для ограбления нужно 200 грязных денег.</p>
          <button 
            onClick={onClose}
            className="modal-btn modal-btn-secondary w-full"
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
        <div className="modal-large">
          <h3 className="modal-title">Кого грабим?</h3>
          <p className="modal-subtitle">Стоимость ограбления: 200 грязных</p>
          
          <div className="players-list">
            {Object.entries(players).map(([id, player]) => {
              if (parseInt(id) === activePlayer || !player.active) return null;
              return (
                <div
                  key={id}
                  className="modal-player-card"
                  onClick={() => handleSelectTarget(parseInt(id))}
                >
                  <div className="modal-player-name">{player.name}</div>
                  <div className="modal-player-money">
                    Грязные: {player.dirty} | Чистые: {player.clean}
                  </div>
                </div>
              );
            })}
          </div>
          
          <button 
            onClick={handleCancel}
            className="modal-btn modal-btn-secondary w-full mt-4"
          >
            ПЕРЕДУМАЛ
          </button>
        </div>
      </div>
    );
  }

  const targetPlayer = players[selectedTarget];
  
  return (
    <div className="modal-overlay">
      <div className="modal-large">
        <h3 className="modal-title">Грабим {targetPlayer?.name}</h3>
        <p className="modal-subtitle">У активного игрока списано 200 грязных</p>
        
        <div className="robbery-amount-control">
          <label className="robbery-label">Сколько ГРЯЗНЫХ украсть?</label>
          <div className="amount-controls">
            <button 
              onClick={() => setDirtyAmount(Math.max(0, dirtyAmount - 100))}
              className="amount-btn"
            >-</button>
            <input
              type="number"
              value={dirtyAmount}
              onChange={(e) => setDirtyAmount(Math.max(0, parseInt(e.target.value) || 0))}
              className="amount-input"
              step={100}
            />
            <button 
              onClick={() => setDirtyAmount(dirtyAmount + 100)}
              className="amount-btn"
            >+</button>
          </div>
          <div className="amount-max">
            Максимум: {targetPlayer?.dirty}
          </div>
        </div>
        
        <div className="robbery-amount-control">
          <label className="robbery-label">Сколько ЧИСТЫХ украсть?</label>
          <div className="amount-controls">
            <button 
              onClick={() => setCleanAmount(Math.max(0, cleanAmount - 100))}
              className="amount-btn"
            >-</button>
            <input
              type="number"
              value={cleanAmount}
              onChange={(e) => setCleanAmount(Math.max(0, parseInt(e.target.value) || 0))}
              className="amount-input"
              step={100}
            />
            <button 
              onClick={() => setCleanAmount(cleanAmount + 100)}
              className="amount-btn"
            >+</button>
          </div>
          <div className="amount-max">
            Максимум: {targetPlayer?.clean}
          </div>
        </div>
        
        <div className="modal-buttons-large">
          <button 
            onClick={handleConfirmRob}
            disabled={dirtyAmount === 0 && cleanAmount === 0}
            className={`modal-btn ${dirtyAmount > 0 || cleanAmount > 0 ? 'modal-btn-primary' : 'modal-btn-secondary'}`}
          >
            ОГРАБИТЬ
          </button>
          <button 
            onClick={handleCancel}
            className="modal-btn modal-btn-secondary"
          >
            НАЗАД
          </button>
        </div>
      </div>
    </div>
  );
}