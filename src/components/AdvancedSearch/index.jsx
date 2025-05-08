import { useState } from 'react';
import TypeFilter from './TypeFilter';
import AbilitySelect from './AbilitySelect';
import PhysicalCharacteristics from './PhysicalCharacteristics';

export default function AdvancedSearch({ onSearch }) {
  const [filters, setFilters] = useState({
    types: {},
    ability: '',
    height: null,
    weight: null,
    numberRange: null
  });

  const handleTypeFilterChange = (typeStates) => {
    setFilters(prev => ({
      ...prev,
      types: typeStates
    }));
  };

  const handleAbilityChange = (ability) => {
    setFilters(prev => ({
      ...prev,
      ability
    }));
  };

  const handleHeightChange = (height) => {
    setFilters(prev => ({
      ...prev,
      height: prev.height === height ? null : height
    }));
  };

  const handleWeightChange = (weight) => {
    setFilters(prev => ({
      ...prev,
      weight: prev.weight === weight ? null : weight
    }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleReset = () => {
    setFilters({
      types: {},
      ability: '',
      height: null,
      weight: null,
      numberRange: null
    });
  };

  return (
    <div className="bg-gray-700/95 backdrop-blur-sm rounded-lg shadow-lg p-6 space-y-8">
      <h2 className="text-2xl font-bold text-white">Advanced Search</h2>
      
      {/* Type & Weakness Filter */}
      <TypeFilter onFilterChange={handleTypeFilterChange} />

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

      {/* Search Actions */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={handleReset}
          className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Reset
        </button>
        <button
          onClick={handleSearch}
          className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          Search
        </button>
      </div>
    </div>
  );
} 