import { useState, useCallback } from 'react'
import { FaSearch, FaSlidersH } from 'react-icons/fa'
import AdvancedSearchPanel from './AdvancedSearchPanel'

const initialFilters = {
  types: Object.keys({
    bug: '#92BC2C',
    dragon: '#0C69C8',
    fairy: '#EE90E6',
    fire: '#FBA54C',
    ghost: '#5F6DBC',
    ground: '#E0C068',
    normal: '#A8A878',
    psychic: '#F85888',
    steel: '#B8B8D0',
    dark: '#705848',
    electric: '#F8D030',
    fighting: '#C03028',
    flying: '#A890F0',
    grass: '#78C850',
    ice: '#98D8D8',
    poison: '#A040A0',
    rock: '#B8A038',
    water: '#6890F0'
  }).reduce((acc, type) => ({
    ...acc,
    [type]: { isType: false, isWeakness: false }
  }), {}),
  ability: '',
  height: null,
  weight: null,
  numberRange: { min: '', max: '' }
}

export default function SearchBar({ 
  onSearch, 
  onFilterChange,
  placeholder = "Enter a Pokemon name or number (e.g., 'Pikachu' or '25')"
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [isAdvancedSearchExpanded, setIsAdvancedSearchExpanded] = useState(false)
  const [filters, setFilters] = useState(initialFilters)

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    onSearch(value)
  }

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters)
    onFilterChange(newFilters)
  }, [onFilterChange])

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg 
            className={`h-5 w-5 transition-colors duration-200 ${isFocused ? 'text-pokemon-blue' : 'text-gray-400'}`}
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor"
            aria-hidden="true"
          >
            <path 
              fillRule="evenodd" 
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>
        <input
          type="search"
          id="pokemon-search"
          name="pokemon-search"
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full pl-10 pr-24 py-3 rounded-lg border border-gray-300 
            focus:outline-none focus:ring-2 focus:ring-pokemon-blue focus:border-transparent 
            transition-all duration-200 shadow-sm hover:shadow-md
            [&::-webkit-search-cancel-button]:appearance-none 
            [&::-webkit-search-decoration]:appearance-none 
            [&::-webkit-search-results-button]:appearance-none 
            [&::-webkit-search-results-decoration]:appearance-none
            bg-white/80 backdrop-blur-sm"
          aria-label="Search Pokemon"
          autoComplete="off"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center space-x-2">
          <button
            onClick={() => setIsAdvancedSearchExpanded(!isAdvancedSearchExpanded)}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            aria-label="Toggle advanced search"
          >
            <FaSlidersH />
          </button>
          {searchTerm && (
            <button
              onClick={() => handleSearchChange({ target: { value: '' } })}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              aria-label="Clear search"
            >
              <svg 
                className="h-5 w-5" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                  clipRule="evenodd" 
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      <AdvancedSearchPanel
        isExpanded={isAdvancedSearchExpanded}
        onToggleExpand={setIsAdvancedSearchExpanded}
        onFilterChange={handleFilterChange}
        filters={filters}
      />
    </div>
  )
} 