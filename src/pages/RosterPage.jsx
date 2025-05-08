import React, { useState, useEffect } from 'react';
import { useRoster } from '../context/RosterContext';
import { useBattle } from '../context/BattleContext';
import PokemonRosterCard from '../components/PokemonRosterCard';
import { useNavigate, Link } from 'react-router-dom';

const RosterPage = () => {
  const { roster, removeFromRoster, MAX_ROSTER_SIZE } = useRoster();
  const { 
    opponentPokemon, 
    generateOpponentTeam, 
    replaceOpponentPokemon,
    addPlayerPokemon,
    playerPokemon,
    removePlayerPokemon,
    updateBattleData
  } = useBattle();
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

    // Clear existing player Pokemon in battle context
    playerPokemon.forEach((_, index) => {
      removePlayerPokemon(index);
    });

    // Clear existing opponent Pokemon in battle context
    opponentPokemon.forEach((_, index) => {
      replaceOpponentPokemon(index);
    });

    // Copy roster to battle context
    roster.forEach(pokemon => {
      addPlayerPokemon(pokemon);
    });

    // Copy opponent team from roster page to battle context
    opponentPokemon.forEach(pokemon => {
      updateBattleData(pokemon.id, {
        images: pokemon.sprites,
        sounds: pokemon.cries,
        stats: pokemon.stats,
        moves: pokemon.moves
      });
    });

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
    paddingTop: '130%', // Increased for more height for stats
  };

  const cardStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    transform: 'scale(0.95)',
    transition: 'transform 0.2s ease-in-out',
    overflow: 'visible',
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
    fontSize: '2.5rem',
    flexDirection: 'column',
    cursor: 'pointer',
    transition: 'background 0.2s, box-shadow 0.2s, transform 0.2s',
    position: 'absolute',
    top: 0,
    left: 0,
    padding: '0.75rem',
    boxSizing: 'border-box',
  };

  const plusTextStyle = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '0.2rem',
    lineHeight: 1,
    color: '#2196F3',
    userSelect: 'none',
  };

  const plusLabelStyle = {
    fontSize: '0.9rem',
    color: '#1976D2',
    marginTop: '0.2rem',
    userSelect: 'none',
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
    pointerEvents: 'none',
  };

  const battleButtonStyle = {
    backgroundColor: roster.length === MAX_ROSTER_SIZE ? '#27ae60' : '#b2dfdb',
    color: 'white',
    padding: '1.2rem 2.2rem',
    borderRadius: '12px',
    border: 'none',
    fontSize: '1.3rem',
    fontWeight: 'bold',
    letterSpacing: '0.05em',
    cursor: roster.length === MAX_ROSTER_SIZE ? 'pointer' : 'not-allowed',
    transition: 'all 0.3s',
    whiteSpace: 'nowrap',
    pointerEvents: 'auto',
    transform: 'none',
    outline: roster.length === MAX_ROSTER_SIZE ? '3px solid #145a32' : 'none',
    textShadow: roster.length === MAX_ROSTER_SIZE ? '0 2px 8px #145a32' : 'none',
  };

  // Helper to ensure stats are always present and formatted
  const getStats = (pokemon) => {
    if (pokemon.stats && Array.isArray(pokemon.stats)) {
      // If stats are already in correct format
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

      <div style={containerStyle} className="flex flex-col lg:flex-row gap-8 p-4 max-w-[1600px] mx-auto h-auto lg:h-[calc(100vh-100px)]">
        {/* My Roster Section */}
        <div style={rosterSectionStyle}>
          <h1 style={{ ...titleStyle, color: '#1976D2' }}>My Roster</h1>
          <div style={cardsContainerStyle}>
            {roster.map((pokemon) => (
              <div key={`roster-${pokemon.id}`} style={cardWrapperStyle}>
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
                    isOpponent={false}
                  />
                </div>
              </div>
            ))}
            {/* Empty slots */}
            {Array.from({ length: MAX_ROSTER_SIZE - roster.length }).map((_, index) => (
              <div key={`empty-${index}`} style={cardWrapperStyle}>
                <Link to="/" style={{ textDecoration: 'none', display: 'block', width: '100%', height: '100%' }}>
                  <div style={emptySlotStyle} title="Add a Pokémon">
                    <span style={plusTextStyle}>+</span>
                    <span style={plusLabelStyle}>Add Pokémon</span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Battle Button - now absolutely centered and normal orientation */}
        <div style={battleButtonContainerStyle}>
          <button
            onClick={handleBattle}
            style={battleButtonStyle}
            disabled={roster.length !== MAX_ROSTER_SIZE}
            className={`transition-all duration-300 shadow-md ${
              roster.length === MAX_ROSTER_SIZE 
                ? 'hover:shadow-[0_0_32px_8px_#27ae60]' 
                : ''
            }`}
          >
            Battle!
          </button>
        </div>

        {/* Opponent Section */}
        <div style={opponentSectionStyle}>
          <h2 style={{ ...titleStyle, color: '#D32F2F' }}>Opponent Team</h2>
          <div style={cardsContainerStyle}>
            {opponentPokemon.slice(0, MAX_ROSTER_SIZE).map((pokemon, index) => (
              <div key={`opponent-${index}-${pokemon.id}`} style={cardWrapperStyle}>
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
            {/* Empty slots for opponent team */}
            {Array.from({ length: MAX_ROSTER_SIZE - opponentPokemon.length }).map((_, index) => (
              <div key={`opponent-empty-${index}`} style={cardWrapperStyle}>
                <div style={{
                  ...emptySlotStyle,
                  border: '2px dashed #F44336',
                  color: '#F44336',
                  backgroundColor: 'rgba(244, 67, 54, 0.1)',
                }}>
                  <span style={{
                    ...plusTextStyle,
                    color: '#F44336',
                  }}>?</span>
                  <span style={{
                    ...plusLabelStyle,
                    color: '#D32F2F',
                  }}>Opponent</span>
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