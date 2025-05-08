import { memo } from 'react';
import TypeBadge from '../TypeBadge';

const typeColors = {
  bug: '#92BC2C',
  dark: '#595761',
  dragon: '#0C69C8',
  electric: '#F2D94E',
  fairy: '#EE90E6',
  fighting: '#D3425F',
  fire: '#FBA54C',
  flying: '#A1BBEC',
  ghost: '#5F6DBC',
  grass: '#5FBD58',
  ground: '#DA7C4D',
  ice: '#75D0C1',
  normal: '#A0A29F',
  poison: '#B763CF',
  psychic: '#FA8581',
  rock: '#C9BB8A',
  steel: '#5695A3',
  water: '#539DDF'
};

const allTypes = Object.keys(typeColors);

const TypeToggleButton = memo(({ selected, type, onClick, label }) => (
  <button
    onClick={onClick}
    aria-pressed={selected}
    aria-label={`Toggle ${label} for ${type}`}
    className={`
      w-6 h-6 rounded-full border-2 transition-all duration-200
      flex items-center justify-center text-sm font-medium
      ${selected 
        ? 'bg-pokemon-blue border-pokemon-blue text-white' 
        : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'
      }
    `}
  >
    {label}
  </button>
));

const TypeButton = memo(({ type, color }) => (
  <div
    className="h-10 rounded-lg flex items-center justify-center text-white font-semibold shadow-sm"
    style={{ backgroundColor: color }}
  >
    {type.charAt(0).toUpperCase() + type.slice(1)}
  </div>
));

function TypeFilter({ typeStates, onTypeToggle }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold text-white">Type & Weakness</h3>
        <div className="flex items-center space-x-2 text-white">
          <span>T = Type</span>
          <span>W = Weakness</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {allTypes.map(type => (
          <div key={type} className="flex items-center space-x-2">
            <div className="flex-1">
              <TypeButton type={type} color={typeColors[type]} />
            </div>
            <div className="flex space-x-2">
              <TypeToggleButton
                type={type}
                label="T"
                selected={typeStates[type]?.isType}
                onClick={() => onTypeToggle(type, 'isType')}
              />
              <TypeToggleButton
                type={type}
                label="W"
                selected={typeStates[type]?.isWeakness}
                onClick={() => onTypeToggle(type, 'isWeakness')}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(TypeFilter); 