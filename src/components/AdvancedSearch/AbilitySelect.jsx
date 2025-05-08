import React, { useState, useEffect, useRef } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import pokeballIcon from '../../assets/pokeball-icon.svg';

const formatAbilityName = (name) => {
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const AbilitySelect = ({ onAbilityChange }) => {
  const [abilities, setAbilities] = useState([]);
  const [selectedAbility, setSelectedAbility] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const debouncedSearch = useDebounce(searchTerm, 300);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchAbilities = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('https://pokeapi.co/api/v2/ability?limit=1000');
        if (!response.ok) throw new Error('Failed to fetch abilities');
        const data = await response.json();
        setAbilities(data.results);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAbilities();
  }, []);

  const filteredAbilities = abilities.filter(ability =>
    ability.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const handleAbilitySelect = (ability) => {
    setSelectedAbility(ability.name);
    setSearchTerm(ability.name);
    setIsOpen(false);
    onAbilityChange?.(ability.name);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setSelectedAbility('');
    setSearchTerm('');
    onAbilityChange?.('');
  };

  const handleDropdownToggle = () => {
    if (!isOpen) {
      // When opening the dropdown, reset the search term
      setSearchTerm('');
      setHighlightedIndex(-1);
    }
    setIsOpen(!isOpen);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredAbilities.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredAbilities.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredAbilities.length) {
          handleAbilitySelect(filteredAbilities[highlightedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div 
        onClick={handleDropdownToggle}
        className="w-full h-12 px-4 bg-gray-800 text-white rounded-lg flex items-center justify-between hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
      >
        <div className="flex items-center">
          <img src={pokeballIcon} alt="" className="w-6 h-6 mr-2" />
          <span>{selectedAbility ? formatAbilityName(selectedAbility) : 'Select an ability'}</span>
        </div>
        <div className="flex items-center">
          {selectedAbility && (
            <button
              onClick={handleClear}
              className="mr-2 p-1 hover:bg-gray-700 rounded-full"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <svg 
            className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
          <div className="p-2">
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search abilities..."
              className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {isLoading && (
            <div className="p-4 text-center text-gray-400">Loading abilities...</div>
          )}

          {error && (
            <div className="p-4 text-center text-red-400">{error}</div>
          )}

          {!isLoading && !error && (
            <div className="max-h-60 overflow-y-auto">
              {filteredAbilities.length === 0 ? (
                <div className="p-4 text-center text-gray-400">No abilities found</div>
              ) : (
                filteredAbilities.map((ability, index) => (
                  <button
                    key={ability.name}
                    onClick={() => handleAbilitySelect(ability)}
                    className={`w-full px-4 py-2 text-left text-white hover:bg-gray-700 ${
                      selectedAbility === ability.name ? 'bg-gray-700' : ''
                    } ${highlightedIndex === index ? 'bg-gray-700' : ''}`}
                  >
                    {formatAbilityName(ability.name)}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AbilitySelect; 