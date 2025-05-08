import React from 'react';
import PropTypes from 'prop-types';

const PokemonRosterCard = ({ pokemon, onRemove, isDragging }) => {
  return (
    <div 
      className={`pokemon-roster-card ${isDragging ? 'dragging' : ''}`}
      style={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '1rem',
        margin: '0.5rem',
        backgroundColor: 'white',
        boxShadow: isDragging ? '0 4px 8px rgba(0,0,0,0.2)' : '0 2px 4px rgba(0,0,0,0.1)',
        cursor: 'move',
        transition: 'all 0.2s ease',
        width: '150px',
      }}
    >
      <div className="pokemon-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <h3 className="text-lg font-bold capitalize">{pokemon.name}</h3>
        <button 
          onClick={() => onRemove(pokemon.id)}
          className="text-red-500 hover:text-red-700 transition-colors"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.2rem',
            padding: '0.2rem',
          }}
        >
          ×
        </button>
      </div>
      <img 
        src={pokemon.sprite} 
        alt={pokemon.name}
        style={{
          width: '100px',
          height: '100px',
          objectFit: 'contain',
          margin: '0 auto',
          display: 'block',
        }}
      />
      <div className="pokemon-types" style={{ display: 'flex', gap: '0.25rem', justifyContent: 'center', marginTop: '0.5rem' }}>
        {pokemon.types.map(type => (
          <span 
            key={type}
            style={{
              backgroundColor: `var(--type-${type.toLowerCase()})`,
              color: 'white',
              padding: '0.2rem 0.5rem',
              borderRadius: '4px',
              fontSize: '0.8rem',
            }}
          >
            {type}
          </span>
        ))}
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
  }).isRequired,
  onRemove: PropTypes.func.isRequired,
  isDragging: PropTypes.bool,
};

export default PokemonRosterCard; 