import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import PokemonCard from '../components/PokemonCard'
import SearchBar from '../components/SearchBar'
import LoadingSpinner from '../components/LoadingSpinner'
import { usePokemonList } from '../hooks/usePokemon'
import ErrorMessage from '../components/ErrorMessage'
import { useDebounce } from '../hooks/useDebounce'

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

export default function Home() {
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilters, setActiveFilters] = useState(initialFilters)
  const { pokemon, loading, error, hasMore, isLoadingAll, currentOffset, totalPokemon } = usePokemonList(page)
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  const handleSearch = useCallback((term) => {
    setSearchTerm(term)
  }, [])

  const handleFilterChange = useCallback((newFilters) => {
    setActiveFilters(newFilters)
  }, [])

  const filteredPokemon = pokemon.filter(pokemon => {
    if (!pokemon) return false;

    // Search term filter
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      const nameMatch = pokemon.name.toLowerCase().includes(searchLower);
      // Check if search term is a number and match exactly
      const searchNumber = parseInt(debouncedSearchTerm);
      const numberMatch = !isNaN(searchNumber) && pokemon.number === searchNumber;
      if (!nameMatch && !numberMatch) {
        return false;
      }
    }

    // Type filter
    const hasActiveTypeFilters = Object.entries(activeFilters.types).some(([type, state]) => state.isType);
    if (hasActiveTypeFilters) {
      const matchesType = Object.entries(activeFilters.types).some(([type, state]) => 
        state.isType && pokemon.types?.includes(type)
      );
      if (!matchesType) return false;
    }

    // Weakness filter
    const hasActiveWeaknessFilters = Object.entries(activeFilters.types).some(([type, state]) => state.isWeakness);
    if (hasActiveWeaknessFilters) {
      const matchesWeakness = Object.entries(activeFilters.types).some(([type, state]) => 
        state.isWeakness && pokemon.weaknesses?.includes(type)
      );
      if (!matchesWeakness) return false;
    }

    // Ability filter
    if (activeFilters.ability && !pokemon.abilities?.includes(activeFilters.ability)) {
      return false;
    }

    // Height filter
    if (activeFilters.height) {
      const height = pokemon.height / 10; // Convert to meters
      switch (activeFilters.height) {
        case 'small':
          if (height > 0.5) return false;
          break;
        case 'medium':
          if (height <= 0.5 || height > 1.5) return false;
          break;
        case 'large':
          if (height <= 1.5) return false;
          break;
      }
    }

    // Weight filter
    if (activeFilters.weight) {
      const weight = pokemon.weight / 10; // Convert from hectograms to kg
      console.log(`Pokemon: ${pokemon.name}, Weight: ${weight}kg, Filter: ${activeFilters.weight}`); // Debug log
      switch (activeFilters.weight) {
        case 'light':
          if (weight > 10) return false;
          break;
        case 'medium':
          if (weight <= 10 || weight > 50) return false;
          break;
        case 'heavy':
          if (weight <= 50) return false;
          break;
      }
    }

    // Number range filter
    if (activeFilters.numberRange.min && pokemon.number < parseInt(activeFilters.numberRange.min)) {
      return false;
    }
    if (activeFilters.numberRange.max && pokemon.number > parseInt(activeFilters.numberRange.max)) {
      return false;
    }

    return true;
  })

  if (error) {
    return <ErrorMessage message={error.message} />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Pokédex</h1>
      <SearchBar onSearch={handleSearch} onFilterChange={handleFilterChange} />
      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pokemon-blue"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
          {filteredPokemon.map((pokemon) => (
            <PokemonCard key={pokemon.name} name={pokemon.name} />
          ))}
        </div>
      )}
    </div>
  )
} 