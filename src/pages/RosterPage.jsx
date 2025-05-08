import React, { useState, useEffect } from 'react';
import { useRoster } from '../context/RosterContext';
import { useBattle } from '../context/BattleContext';
import PokemonRosterCard from '../components/PokemonRosterCard';
import { useNavigate } from 'react-router-dom';

const RosterPage = () => {
  const { roster, removeFromRoster, MAX_ROSTER_SIZE } = useRoster();
  const { opponentPokemon, generateOpponentTeam, replaceOpponentPokemon } = useBattle();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    generateOpponentTeam();
  }, [generateOpponentTeam]);

  const handleRemove = (pokemonId) => {
    try {
      removeFromRoster(pokemonId);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleOpponentRemove = (index) => {
    replaceOpponentPokemon(index);
  };

  const handleBattle = () => {
    if (roster.length !== MAX_ROSTER_SIZE) {
      setError('You need 6 Pokemon in your roster to start a battle!');
      return;
    }
    navigate('/battle');
  };

  const sectionStyle = {
    backgroundColor: '#f5f5f5',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    flex: '1',
    minWidth: '0',
    display: 'flex',
    flexDirection: 'column',
  };

  const rosterSectionStyle = {
    ...sectionStyle,
    backgroundColor: '#E3F2FD',
    border: '2px solid #2196F3',
  };

  const opponentSectionStyle = {
    ...sectionStyle,
    backgroundColor: '#FFEBEE',
    border: '2px solid #F44336',
  };

  const cardsContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '0.5rem',
    padding: '0.5rem',
    height: '100%',
    position: 'relative',
  };

  const cardWrapperStyle = {
    position: 'relative',
    width: '100%',
    paddingTop: '100%', // Creates a square aspect ratio
  };

  const cardStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    transform: 'scale(0.95)', // Slightly smaller to create overlap effect
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
      transform: 'scale(1)',
      zIndex: 1,
    },
  };

  const titleStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    textAlign: 'center',
    color: '#333',
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'row',
    gap: '2rem',
    padding: '1rem',
    maxWidth: '1600px',
    margin: '0 auto',
    height: 'calc(100vh - 100px)', // Adjust based on your header/navigation height
    '@media (max-width: 1200px)': {
      flexDirection: 'column',
      height: 'auto',
    },
  };

  const emptySlotStyle = {
    width: '100%',
    height: '100%',
    border: '2px dashed #2196F3',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#2196F3',
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    fontSize: '0.9rem',
  };

  const battleButtonContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 10,
    pointerEvents: 'none', // allow click-through except for button
  };

  const battleButtonStyle = {
    backgroundColor: roster.length === MAX_ROSTER_SIZE ? '#2196F3' : '#ccc',
    color: 'white',
    padding: '1.2rem 2.2rem',
    borderRadius: '8px',
    border: 'none',
    fontSize: '1.2rem',
    cursor: roster.length === MAX_ROSTER_SIZE ? 'pointer' : 'not-allowed',
    transition: 'all 0.3s',
    boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
    transform: 'rotate(90deg)',
    whiteSpace: 'nowrap',
    pointerEvents: 'auto', // allow button to be clickable
  };

  // Helper to ensure stats are always present and formatted
  const getStats = (pokemon) => {
    if (pokemon.stats && Array.isArray(pokemon.stats)) {
      // Already in correct format
      if (pokemon.stats.length && typeof pokemon.stats[0] === 'object' && 'name' in pokemon.stats[0]) {
        return pokemon.stats;
      }
      // If stats are just numbers, map them
      const statNames = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'];
      return pokemon.stats.map((value, i) => ({ name: statNames[i] || `stat${i+1}`, value }));
    }
    // Fallback: no stats
    return [];
  };

  return (
    <div className="roster-page" style={{ position: 'relative', minHeight: '100vh' }}>
      {error && (
        <div style={{
          backgroundColor: '#ffebee',
          color: '#c62828',
          padding: '1rem',
          borderRadius: '4px',
          marginBottom: '1rem',
          maxWidth: '1600px',
          margin: '0 auto 1rem',
        }}>
          {error}
        </div>
      )}

      <div style={containerStyle}>
        {/* My Roster Section */}
        <div style={rosterSectionStyle}>
          <h1 style={{ ...titleStyle, color: '#1976D2' }}>My Roster</h1>
          <div style={cardsContainerStyle}>
            {roster.map((pokemon) => (
              <div key={pokemon.id} style={cardWrapperStyle}>
                <div style={cardStyle}>
                  <PokemonRosterCard
                    pokemon={{
                      id: pokemon.id,
                      name: pokemon.name,
                      sprite: pokemon.sprite,
                      types: pokemon.types,
                      stats: getStats(pokemon)
                    }}
                    onRemove={handleRemove}
                    isDragging={false}
                  />
                </div>
              </div>
            ))}
            
            {/* Empty slots */}
            {Array.from({ length: MAX_ROSTER_SIZE - roster.length }).map((_, index) => (
              <div key={`empty-${index}`} style={cardWrapperStyle}>
                <div style={emptySlotStyle}>
                  Empty Slot
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Battle Button - now absolutely centered and rotated */}
        <div style={battleButtonContainerStyle}>
          <button
            onClick={handleBattle}
            style={battleButtonStyle}
            disabled={roster.length !== MAX_ROSTER_SIZE}
          >
            Battle!
          </button>
        </div>

        {/* Opponent Section */}
        <div style={opponentSectionStyle}>
          <h2 style={{ ...titleStyle, color: '#D32F2F' }}>Opponent Team</h2>
          <div style={cardsContainerStyle}>
            {opponentPokemon.map((pokemon, index) => (
              <div key={pokemon.id} style={cardWrapperStyle}>
                <div style={cardStyle}>
                  <PokemonRosterCard
                    pokemon={{
                      id: pokemon.id,
                      name: pokemon.name,
                      sprite: pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default,
                      types: pokemon.types.map(t => t.type.name),
                      stats: pokemon.stats.map(stat => ({
                        name: stat.stat.name,
                        value: stat.base_stat
                      }))
                    }}
                    onRemove={() => handleOpponentRemove(index)}
                    isDragging={false}
                    isOpponent={true}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RosterPage; 