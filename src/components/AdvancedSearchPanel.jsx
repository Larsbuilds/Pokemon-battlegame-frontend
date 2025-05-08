import { useCallback, memo } from 'react'
import TypeFilter from './AdvancedSearch/TypeFilter'
import AbilitySelect from './AdvancedSearch/AbilitySelect'
import PhysicalCharacteristics from './AdvancedSearch/PhysicalCharacteristics'

const allTypes = Object.keys({
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
});

const initialFilters = {
  types: allTypes.reduce((acc, type) => ({
    ...acc,
    [type]: { isType: false, isWeakness: false }
  }), {}),
  ability: '',
  height: null,
  weight: null,
  numberRange: { min: '', max: '' }
};

function AdvancedSearchPanel({ 
  onFilterChange,
  isExpanded = false,
  onToggleExpand,
  filters = initialFilters
}) {
  const handleTypeToggle = useCallback((type, filterType) => {
    onFilterChange({
      ...filters,
      types: {
        ...filters.types,
        [type]: {
          ...filters.types[type],
          [filterType]: !filters.types[type][filterType]
        }
      }
    });
  }, [filters, onFilterChange]);

  const handleAbilityChange = useCallback((ability) => {
    onFilterChange({
      ...filters,
      ability
    });
  }, [filters, onFilterChange]);

  const handleHeightChange = useCallback((height) => {
    onFilterChange({
      ...filters,
      height: filters.height === height ? null : height
    });
  }, [filters, onFilterChange]);

  const handleWeightChange = useCallback((weight) => {
    onFilterChange({
      ...filters,
      weight: filters.weight === weight ? null : weight
    });
  }, [filters, onFilterChange]);

  const handleNumberRangeChange = useCallback((field, value) => {
    onFilterChange({
      ...filters,
      numberRange: {
        ...filters.numberRange,
        [field]: value
      }
    });
  }, [filters, onFilterChange]);

  const handleReset = useCallback(() => {
    onFilterChange(initialFilters);
  }, [onFilterChange]);

  if (!isExpanded) return null;

  return (
    <div className="w-full max-w-6xl mx-auto mt-4 p-6 bg-gray-700/95 backdrop-blur-sm rounded-lg shadow-lg">
      <div className="space-y-8">
        {/* Type & Weakness Filter */}
        <TypeFilter 
          typeStates={filters.types}
          onTypeToggle={handleTypeToggle}
        />

        {/* Ability Filter */}
        <div>
          <h3 className="text-2xl font-semibold text-white mb-4">Ability</h3>
          <AbilitySelect onAbilityChange={handleAbilityChange} />
        </div>

        {/* Physical Characteristics */}
        <PhysicalCharacteristics
          selectedHeight={filters.height}
          selectedWeight={filters.weight}
          onHeightChange={handleHeightChange}
          onWeightChange={handleWeightChange}
        />

        {/* Number Range */}
        <div>
          <h3 className="text-2xl font-semibold text-white mb-4">Number Range</h3>
          <div className="flex items-center space-x-4">
            <input
              type="number"
              min="1"
              max="1025"
              value={filters.numberRange.min}
              onChange={(e) => handleNumberRangeChange('min', e.target.value)}
              className="flex-1 h-12 px-4 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pokemon-blue"
              placeholder="1"
            />
            <span className="text-white text-2xl">-</span>
            <input
              type="number"
              min="1"
              max="1025"
              value={filters.numberRange.max}
              onChange={(e) => handleNumberRangeChange('max', e.target.value)}
              className="flex-1 h-12 px-4 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-pokemon-blue"
              placeholder="1025"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Reset
          </button>
          <button
            onClick={() => {}} // TODO: Implement search
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            Search
          </button>
        </div>

        {/* Hide Advanced Search Button */}
        <button
          onClick={onToggleExpand}
          className="w-full mt-4 py-3 bg-blue-600/20 text-white rounded-lg hover:bg-blue-600/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center"
        >
          <span>Hide Advanced Search</span>
          <svg className="w-5 h-5 ml-2 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default memo(AdvancedSearchPanel); 