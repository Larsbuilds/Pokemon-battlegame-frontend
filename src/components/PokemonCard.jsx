import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import TypeBadge from './TypeBadge'
import OptimizedImage from './OptimizedImage'
import { usePokemonCache } from '../hooks/usePokemonCache'
import { useRoster } from '../context/RosterContext'

const PokemonCard = ({ name }) => {
  const [pokemon, setPokemon] = useState(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isInRoster, setIsInRoster] = useState(false)
  const { getPokemon } = usePokemonCache()
  const { roster, addToRoster } = useRoster()

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const data = await getPokemon(name)
        setPokemon(data)
        // Small delay to ensure smooth transition
        setTimeout(() => setIsVisible(true), 50)
      } catch (err) {
        console.error('Error fetching pokemon:', err)
      }
    }
    fetchPokemon()

    return () => setIsVisible(false)
  }, [name, getPokemon])

  useEffect(() => {
    if (pokemon) {
      setIsInRoster(roster.some(p => p.id === pokemon.id))
    }
  }, [pokemon, roster])

  const handleAddToRoster = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!pokemon) return

    try {
      const pokemonData = {
        id: pokemon.id,
        name: pokemon.name,
        sprite: pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default,
        types: pokemon.types.map(t => t.type.name)
      }
      await addToRoster(pokemonData)
    } catch (error) {
      console.error('Error adding to roster:', error)
      // You might want to show a toast notification here
    }
  }

  if (!pokemon || !isVisible) {
    return null
  }

  const formattedNumber = `#${String(pokemon.id).padStart(4, '0')}`

  return (
    <Link to={`/pokemon/${name}`} className="block">
      <div className="group bg-white rounded-lg p-4 h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-pokemon-blue/20 border border-transparent">
        {/* Pokemon Number */}
        <div className="text-left font-mono text-gray-500 mb-2 text-sm group-hover:text-pokemon-blue transition-colors duration-300">
          {formattedNumber}
        </div>

        {/* Pokemon Image */}
        <div className="aspect-square flex items-center justify-center mb-4 bg-gray-50 rounded-lg p-2 group-hover:bg-gray-100 transition-colors duration-300 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-pokemon-blue/5 to-pokemon-red/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <OptimizedImage
            src={pokemon.sprites.other['official-artwork'].front_default}
            fallbackSrc={pokemon.sprites.front_default}
            alt={name}
            className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Pokemon Name */}
        <h2 className="text-xl font-bold text-left capitalize mb-3 text-gray-800 group-hover:text-pokemon-blue transition-colors duration-300">
          {name}
        </h2>

        {/* Type Badges */}
        <div className="flex gap-2">
          {pokemon.types.map((type) => (
            <TypeBadge key={type.type.name} type={type.type.name} />
          ))}
        </div>

        {/* Add to Roster Button */}
        <button
          onClick={handleAddToRoster}
          disabled={isInRoster}
          className={`mt-4 w-full py-2 px-4 rounded-lg transition-colors duration-300 ${
            isInRoster
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-pokemon-blue text-white hover:bg-pokemon-blue/80'
          }`}
        >
          {isInRoster ? 'In Roster' : 'Add to Roster'}
        </button>
      </div>
    </Link>
  );
};

PokemonCard.propTypes = {
  name: PropTypes.string.isRequired,
};

export default PokemonCard; 