const typeColors = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  grass: '#98D850',
  electric: '#F8D030',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dark: '#705848',
  dragon: '#7038F8',
  steel: '#B8B8D0',
  fairy: '#F0B6BC'
};

export default function TypeBadge({ type, multiplier }) {
  const backgroundColor = typeColors[type] || '#777';
  
  return (
    <div className="relative group">
      <span
        style={{ backgroundColor }}
        className="inline-block px-3 py-1 rounded-full text-sm text-white font-medium capitalize
          transform transition-all duration-200 hover:scale-105 hover:shadow-md
          cursor-default select-none"
      >
        {type}
      </span>
      {multiplier && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 
          opacity-0 group-hover:opacity-100 transition-opacity duration-200 
          bg-gray-800 text-white text-xs rounded px-2 py-1 
          pointer-events-none whitespace-nowrap z-10"
        >
          {multiplier}x
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 
            w-2 h-2 bg-gray-800 rotate-45"
          />
        </div>
      )}
    </div>
  );
} 