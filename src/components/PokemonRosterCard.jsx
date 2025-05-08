import React, { useState } from 'react';
import PropTypes from 'prop-types';

const PokemonRosterCard = ({ pokemon, onRemove, isDragging, isOpponent = false }) => {
  const [expanded, setExpanded] = useState(false);

  // Detect touch device
  const isTouchDevice = typeof window !== 'undefined' && (
    'ontouchstart' in window || navigator.maxTouchPoints > 0
  );

  // Dynamic shadow and scale based on card type and interaction
  const [hovered, setHovered] = useState(false);
  let boxShadow = isDragging
    ? '0 4px 16px rgba(0,0,0,0.25)'
    : isOpponent
      ? hovered ? '0 0 16px 4px #F44336' : '0 2px 4px rgba(0,0,0,0.1)'
      : hovered ? '0 0 16px 4px #2196F3' : '0 2px 4px rgba(0,0,0,0.1)';
  let scale = hovered ? 1.05 : 1;

  const cardStyle = {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow,
    padding: '0.75rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
    overflow: 'hidden',
    transform: `scale(${scale})`,
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
    transition: 'max-height 0.2s',
    overflow: 'hidden',
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

  // Only show HP and Attack by default
  const defaultStats = pokemon.stats
    ? pokemon.stats.filter(stat => stat.name === 'hp' || stat.name === 'attack')
    : [];
  const allStats = pokemon.stats || [];

  // Handlers for hover/click expand
  const handleMouseEnter = () => {
    setHovered(true);
    if (!isTouchDevice) setExpanded(true);
  };
  const handleMouseLeave = () => {
    setHovered(false);
    if (!isTouchDevice) setExpanded(false);
  };
  const handleClick = () => {
    if (isTouchDevice) setExpanded(e => !e);
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      tabIndex={0}
      aria-expanded={expanded}
    >
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
      {/* Stats: show only HP and Attack by default, all on expand */}
      <div style={statsStyle}>
        {(expanded ? allStats : defaultStats).map((stat) => (
          <div key={stat.name} style={statRowStyle}>
            <span>{stat.name}:</span>
            <span>{stat.value}</span>
          </div>
        ))}
        {/* Show expand/collapse hint on mobile */}
        {isTouchDevice && (
          <div style={{ textAlign: 'center', fontSize: '0.7rem', color: '#888' }}>
            {expanded ? 'Tap to collapse' : 'Tap to show all stats'}
          </div>
        )}
      </div>
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