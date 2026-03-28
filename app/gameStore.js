'use client';

import { useState, useEffect } from 'react';

const INITIAL_PLAYER = {
  name: '',
  dirty: 3000,
  clean: 0,
  bitcoin: 0,
  laundered: 0,
  debt: 0,
  stars: 0,
  active: true
};

const INITIAL_STATE = {
  bitcoinRate: 200,
  players: {},
  playerOrder: [],
  currentPlayerId: null,
  gameStarted: false,
  winner: null
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
  // Уведомляем всех подписчиков
  listeners.forEach(listener => listener(globalGameState));
}

// Загрузка сохранённых данных при старте
if (typeof window !== 'undefined') {
  const saved = localStorage.getItem('dirtyMoneyGame');
  if (saved) {
    globalGameState = JSON.parse(saved);
  }
}

export function useGameState() {
  const [state, setState] = useState(globalGameState);

  useEffect(() => {
    // Подписываемся на изменения
    const unsubscribe = subscribe(newState => {
      setState(newState);
    });
    return unsubscribe;
  }, []);

  const initGame = (playerNames) => {
    const players = {};
    const playerOrder = [];
    playerNames.forEach((name, index) => {
      const id = index + 1;
      players[id] = { ...INITIAL_PLAYER, name: name || `Игрок ${id}` };
      playerOrder.push(id);
    });
    
    setGlobalState({
      ...INITIAL_STATE,
      players,
      playerOrder,
      currentPlayerId: playerOrder[0],
      gameStarted: true,
      winner: null
    });
  };

  const updateBitcoinRate = (delta) => {
    const newRate = Math.max(0, state.bitcoinRate + delta);
    setGlobalState({ ...state, bitcoinRate: newRate });
  };

  const checkWinner = (players) => {
    for (const [id, player] of Object.entries(players)) {
      if (player.active && player.laundered >= 6000) {
        return parseInt(id);
      }
    }
    return null;
  };

  const updatePlayer = (playerId, field, delta) => {
    const player = state.players[playerId];
    if (!player || !player.active) return;
    
    // Для текстовых полей (имя) передаём строку
    if (field === 'name') {
      setGlobalState({
        ...state,
        players: {
          ...state.players,
          [playerId]: { ...player, name: delta }
        }
      });
      return;
    }
    
    let newValue = (player[field] || 0) + delta;
    
    // Для звёзд ограничиваем от 0 до 5
    if (field === 'stars') {
      newValue = Math.min(5, Math.max(0, newValue));
    } 
    // Для всех денежных полей проверяем, чтобы не уходили в минус
    else if (field === 'dirty' || field === 'clean' || field === 'bitcoin' || field === 'laundered' || field === 'debt') {
      if (newValue < 0) return;
    }
    
    const newPlayers = {
      ...state.players,
      [playerId]: { ...player, [field]: newValue }
    };
    
    // Проверка победы
    const winner = checkWinner(newPlayers);
    if (winner) {
      setGlobalState({ ...state, players: newPlayers, winner });
    } else {
      setGlobalState({ ...state, players: newPlayers });
    }
  };

  const updatePlayerName = (playerId, newName) => {
    updatePlayer(playerId, 'name', newName);
  };

  const launderMoney = (playerId) => {
  const player = state.players[playerId];
  if (!player || player.clean < 100) return;
  
  // Считаем, сколько раз по 100 мы можем отмыть
  // (на случай, если захотим добавить кнопку "Отмыть всё")
  const amount = 100; // пока только по 100
  
  const newClean = player.clean - amount;
  const newLaundered = player.laundered + amount;
  
  let newDirty = player.dirty;
  
  // Бонус: при отмыве 1000, добавляем 1000 грязных
  // Проверяем, достигли ли нового порога в 1000 отмытых
  const oldLaundered = player.laundered;
  const oldThreshold = Math.floor(oldLaundered / 1000);
  const newThreshold = Math.floor(newLaundered / 1000);
  
  // Если перешагнули через тысячу (или несколько тысяч)
  if (newThreshold > oldThreshold) {
    const bonus = (newThreshold - oldThreshold) * 1000;
    newDirty += bonus;
  }
  
  const updatedPlayer = {
    ...player,
    clean: newClean,
    laundered: newLaundered,
    dirty: newDirty
  };
  
  const newPlayers = {
    ...state.players,
    [playerId]: updatedPlayer
  };
  
  const winner = checkWinner(newPlayers);
  if (winner) {
    setGlobalState({ ...state, players: newPlayers, winner });
  } else {
    setGlobalState({ ...state, players: newPlayers });
  }
};

  const buyBitcoin = (playerId) => {
    const player = state.players[playerId];
    const cost = state.bitcoinRate;
    if (!player || player.dirty < cost) return;
    
    const newDirty = player.dirty - cost;
    const newBitcoin = player.bitcoin + 1;
    
    const updatedPlayer = {
      ...player,
      dirty: newDirty,
      bitcoin: newBitcoin
    };
    
    const newPlayers = {
      ...state.players,
      [playerId]: updatedPlayer
    };
    
    const winner = checkWinner(newPlayers);
    if (winner) {
      setGlobalState({ ...state, players: newPlayers, winner });
    } else {
      setGlobalState({ ...state, players: newPlayers });
    }
  };

  const sellBitcoin = (playerId) => {
    const player = state.players[playerId];
    const value = state.bitcoinRate;
    if (!player || player.bitcoin < 1) return;
    
    const newBitcoin = player.bitcoin - 1;
    const newClean = player.clean + value;
    
    const updatedPlayer = {
      ...player,
      bitcoin: newBitcoin,
      clean: newClean
    };
    
    const newPlayers = {
      ...state.players,
      [playerId]: updatedPlayer
    };
    
    const winner = checkWinner(newPlayers);
    if (winner) {
      setGlobalState({ ...state, players: newPlayers, winner });
    } else {
      setGlobalState({ ...state, players: newPlayers });
    }
  };

  const rob = (activePlayerId, targetPlayerId, dirtyAmount, cleanAmount) => {
  const active = state.players[activePlayerId];
  const target = state.players[targetPlayerId];
  
  if (!active || !target || active.dirty < 200) return;
  
  let newActiveDirty = active.dirty - 200; // Списываем 200 грязных за ограбление
  let newActiveClean = active.clean;
  let newTargetDirty = target.dirty;
  let newTargetClean = target.clean;
  
  // Кража грязных
  if (dirtyAmount > 0 && target.dirty >= dirtyAmount) {
    newTargetDirty -= dirtyAmount;
    newActiveDirty += dirtyAmount;
  }
  
  // Кража чистых
  if (cleanAmount > 0 && target.clean >= cleanAmount) {
    newTargetClean -= cleanAmount;
    newActiveClean += cleanAmount;
  }
  
  const updatedActive = {
    ...active,
    dirty: newActiveDirty,
    clean: newActiveClean
  };
  
  const updatedTarget = {
    ...target,
    dirty: newTargetDirty,
    clean: newTargetClean
  };
  
  const newPlayers = {
    ...state.players,
    [activePlayerId]: updatedActive,
    [targetPlayerId]: updatedTarget
  };
  
  const winner = checkWinner(newPlayers);
  if (winner) {
    setGlobalState({ ...state, players: newPlayers, winner });
  } else {
    setGlobalState({ ...state, players: newPlayers });
  }
};

  const endTurn = () => {
    if (state.winner) return;
    
    const currentIndex = state.playerOrder.findIndex(id => id === state.currentPlayerId);
    const nextIndex = (currentIndex + 1) % state.playerOrder.length;
    const nextPlayerId = state.playerOrder[nextIndex];
    
    setGlobalState({ ...state, currentPlayerId: nextPlayerId });
  };

  const surrender = (playerId) => {
  const player = state.players[playerId];
  if (!player) return;
  
  // Помечаем игрока неактивным
  const newPlayers = { 
    ...state.players, 
    [playerId]: { ...player, active: false } 
  };
  
  // Удаляем из порядка ходов
  const newOrder = state.playerOrder.filter(id => id !== playerId);
  
  // Проверка на победителя (если остался 1 игрок)
  if (newOrder.length === 1) {
    setGlobalState({
      ...state,
      players: newPlayers,
      playerOrder: newOrder,
      winner: newOrder[0]
    });
    return;
  }
  
  // Определяем следующего игрока
  let nextPlayerId;
  const currentIndex = state.playerOrder.findIndex(id => id === playerId);
  
  // Если сдаётся текущий игрок
  if (playerId === state.currentPlayerId) {
    // Берём следующего по кругу
    nextPlayerId = state.playerOrder[(currentIndex + 1) % state.playerOrder.length];
  } else {
    // Если сдаётся не текущий игрок, текущий остаётся
    nextPlayerId = state.currentPlayerId;
  }
  
  setGlobalState({
    ...state,
    players: newPlayers,
    playerOrder: newOrder,
    currentPlayerId: nextPlayerId
  });
};

  const resetGame = () => {
    if (confirm('Начать новую игру? Все текущие данные будут потеряны.')) {
      setGlobalState(INITIAL_STATE);
    }
  };

  return {
    gameState: state,
    initGame,
    updateBitcoinRate,
    updatePlayer,
    updatePlayerName,
    launderMoney,
    buyBitcoin,
    sellBitcoin,
    rob,
    endTurn,
    surrender,
    resetGame
  };
}