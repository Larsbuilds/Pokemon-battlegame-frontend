import React from 'react';
import PropTypes from 'prop-types';

const PokemonRosterCard = ({ pokemon, onRemove, isDragging, isOpponent = false }) => {
  const cardStyle = {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: isDragging ? '0 4px 8px rgba(0,0,0,0.2)' : '0 2px 4px rgba(0,0,0,0.1)',
    padding: '0.75rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
    overflow: 'hidden',
  };

  const imageStyle = {
    width: '80%',
    height: 'auto',
    objectFit: 'contain',
    marginBottom: '0.25rem',
  };

  const nameStyle = {
    fontSize: '1rem',
    fontWeight: 'bold',
    marginBottom: '0.25rem',
    textTransform: 'capitalize',
    textAlign: 'center',
  };

  const typeStyle = {
    display: 'flex',
    gap: '0.25rem',
    marginBottom: '0.25rem',
    flexWrap: 'wrap',
    justifyContent: 'center',
  };

  const typeBadgeStyle = (type) => ({
    padding: '0.15rem 0.35rem',
    borderRadius: '8px',
    fontSize: '0.7rem',
    color: 'white',
    backgroundColor: getTypeColor(type),
  });

  const removeButtonStyle = {
    position: 'absolute',
    top: '0.25rem',
    right: '0.25rem',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    border: 'none',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '0.9rem',
    color: '#666',
    transition: 'background-color 0.2s',
    zIndex: 2,
  };

  const statsStyle = {
    width: '100%',
    marginTop: '0.25rem',
    fontSize: '0.7rem',
  };

  const statRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.15rem',
  };

  const getTypeColor = (type) => {
    const colors = {
      normal: '#A8A878',
      fire: '#F08030',
      water: '#6890F0',
      electric: '#F8D030',
      grass: '#78C850',
      ice: '#98D8D8',
      fighting: '#C03028',
      poison: '#A040A0',
      ground: '#E0C068',
      flying: '#A890F0',
      psychic: '#F85888',
      bug: '#A8B820',
      rock: '#B8A038',
      ghost: '#705898',
      dragon: '#7038F8',
      dark: '#705848',
      steel: '#B8B8D0',
      fairy: '#EE99AC',
    };
    return colors[type] || '#777';
  };

  return (
    <div style={cardStyle}>
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(pokemon.id);
          }}
          style={removeButtonStyle}
          title={isOpponent ? "Replace Pokemon" : "Remove Pokemon"}
        >
          ×
        </button>
      )}
      <img
        src={pokemon.sprite}
        alt={pokemon.name}
        style={imageStyle}
      />
      <div style={nameStyle}>{pokemon.name}</div>
      <div style={typeStyle}>
        {pokemon.types.map((type) => (
          <span key={type} style={typeBadgeStyle(type)}>
            {type}
          </span>
        ))}
      </div>
      {pokemon.stats && (
        <div style={statsStyle}>
          {pokemon.stats.map((stat) => (
            <div key={stat.name} style={statRowStyle}>
              <span>{stat.name}:</span>
              <span>{stat.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

PokemonRosterCard.propTypes = {
  pokemon: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    sprite: PropTypes.string.isRequired,
    types: PropTypes.arrayOf(PropTypes.string).isRequired,
    stats: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    })),
  }).isRequired,
  onRemove: PropTypes.func.isRequired,
  isDragging: PropTypes.bool,
  isOpponent: PropTypes.bool,
};

export default PokemonRosterCard; 