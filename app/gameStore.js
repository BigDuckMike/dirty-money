'use client';

import { useState, useEffect } from 'react';

const INITIAL_STATE = {
  bitcoinRate: 200,
  players: {
    1: { dirty: 3000, clean: 0, bitcoin: 0, laundered: 0, debt: 0, stars: 0 },
    2: { dirty: 3000, clean: 0, bitcoin: 0, laundered: 0, debt: 0, stars: 0 },
    3: { dirty: 3000, clean: 0, bitcoin: 0, laundered: 0, debt: 0, stars: 0 },
    4: { dirty: 3000, clean: 0, bitcoin: 0, laundered: 0, debt: 0, stars: 0 }
  }
};

let globalGameState = { ...INITIAL_STATE };
let listeners = [];

function subscribe(listener) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter(l => l !== listener);
  };
}

function setGlobalState(newState) {
  globalGameState = { ...newState };
  if (typeof window !== 'undefined') {
    localStorage.setItem('dirtyMoneyGame', JSON.stringify(globalGameState));
  }
  listeners.forEach(listener => listener(globalGameState));
}

if (typeof window !== 'undefined') {
  const saved = localStorage.getItem('dirtyMoneyGame');
  if (saved) {
    globalGameState = JSON.parse(saved);
  }
}

export function useGameState() {
  const [state, setState] = useState(globalGameState);

  useEffect(() => {
    return subscribe(newState => setState(newState));
  }, []);

  const updateBitcoinRate = (delta) => {
    const newRate = Math.max(0, state.bitcoinRate + delta);
    setGlobalState({
      ...state,
      bitcoinRate: newRate
    });
  };

  const updatePlayer = (playerId, field, delta) => {
    const player = state.players[playerId];
    let newValue = (player[field] || 0) + delta;
    
    if (field === 'stars') {
      newValue = Math.min(5, Math.max(0, newValue));
    } else {
      if (newValue < 0) return;
    }
    
    setGlobalState({
      ...state,
      players: {
        ...state.players,
        [playerId]: {
          ...player,
          [field]: newValue
        }
      }
    });
  };

  const resetGame = () => {
    if (confirm('Начать новую игру? Все текущие данные будут потеряны.')) {
      setGlobalState(INITIAL_STATE);
    }
  };

  return {
    gameState: state,
    updateBitcoinRate,
    updatePlayer,
    resetGame
  };
}