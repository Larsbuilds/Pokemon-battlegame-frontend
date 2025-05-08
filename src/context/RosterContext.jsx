import React, { createContext, useContext, useState, useEffect } from 'react';

const RosterContext = createContext();

export const useRoster = () => {
  const context = useContext(RosterContext);
  if (!context) {
    throw new Error('useRoster must be used within a RosterProvider');
  }
  return context;
};

export const RosterProvider = ({ children }) => {
  const [roster, setRoster] = useState(() => {
    const savedRoster = localStorage.getItem('pokemonRoster');
    return savedRoster ? JSON.parse(savedRoster) : [];
  });
  const MAX_ROSTER_SIZE = 6;

  // Save roster to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('pokemonRoster', JSON.stringify(roster));
  }, [roster]);

  const addToRoster = (pokemon) => {
    if (roster.length >= MAX_ROSTER_SIZE) {
      throw new Error('Roster is full!');
    }
    if (roster.some(p => p.id === pokemon.id)) {
      throw new Error('Pokemon already in roster!');
    }
    setRoster(prev => [...prev, pokemon]);
  };

  const removeFromRoster = (pokemonId) => {
    setRoster(prev => prev.filter(p => p.id !== pokemonId));
  };

  const reorderRoster = (startIndex, endIndex) => {
    const result = Array.from(roster);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    setRoster(result);
  };

  const value = {
    roster,
    addToRoster,
    removeFromRoster,
    reorderRoster,
    MAX_ROSTER_SIZE,
  };

  return (
    <RosterContext.Provider value={value}>
      {children}
    </RosterContext.Provider>
  );
}; 