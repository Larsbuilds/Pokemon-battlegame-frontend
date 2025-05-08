import { useState, useEffect } from 'react'
import axios from 'axios'

export function usePokemon(name) {
  const [pokemon, setPokemon] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPokemon = async () => {
      if (!name) {
        setError({ response: { status: 404 } })
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`)
        
        // Fetch type data for weaknesses
        const typePromises = response.data.types.map(async (type) => {
          const typeResponse = await axios.get(type.type.url)
          return typeResponse.data.damage_relations.double_damage_from.map(w => ({
            type: w.name,
            multiplier: 2
          }))
        })
        
        const weaknessesArrays = await Promise.all(typePromises)
        const weaknesses = [...new Set(weaknessesArrays.flat().map(JSON.stringify))].map(JSON.parse)

        // Fetch species data for description and additional info
        const speciesResponse = await axios.get(response.data.species.url)
        const description = speciesResponse.data.flavor_text_entries
          .find(entry => entry.language.name === 'en')
          ?.flavor_text
          .replace(/[\n\f]/g, ' ') || 'No description available.'

        // Fetch version data
        const versionResponse = await axios.get('https://pokeapi.co/api/v2/version')
        const versions = versionResponse.data.results
          .filter(version => version.name.includes('red') || version.name.includes('blue'))
          .map(version => ({
            name: version.name,
            url: version.url
          }))

        setPokemon({
          ...response.data,
          weaknesses,
          description,
          category: speciesResponse.data.genera
            .find(genus => genus.language.name === 'en')
            ?.genus || 'Unknown',
          // Additional species data
          egg_groups: speciesResponse.data.egg_groups,
          hatch_counter: speciesResponse.data.hatch_counter,
          gender_rate: speciesResponse.data.gender_rate,
          capture_rate: speciesResponse.data.capture_rate,
          base_happiness: speciesResponse.data.base_happiness,
          habitat: speciesResponse.data.habitat,
          growth_rate: speciesResponse.data.growth_rate,
          generation: speciesResponse.data.generation,
          // Version data
          versions
        })
      } catch (error) {
        setError(error)
        console.error('Error fetching pokemon:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPokemon()
  }, [name])

  return { pokemon, loading, error }
}

export function usePokemonList(page = 1, itemsPerPage = 12) {
  const [pokemon, setPokemon] = useState([])
  const [allPokemon, setAllPokemon] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingAll, setIsLoadingAll] = useState(false)
  const [currentOffset, setCurrentOffset] = useState(0)
  const totalPokemon = 151 // First generation Pokemon count

  // Function to fetch Pokemon details including types
  const fetchPokemonDetails = async (pokemonList) => {
    try {
      const details = await Promise.all(
        pokemonList.map(async (p) => {
          const response = await axios.get(p.url)
          
          // Fetch type data for weaknesses
          const typePromises = response.data.types.map(async (type) => {
            const typeResponse = await axios.get(type.type.url)
            return typeResponse.data.damage_relations.double_damage_from.map(w => w.name)
          })
          
          const weaknessesArrays = await Promise.all(typePromises)
          const weaknesses = [...new Set(weaknessesArrays.flat())] // Remove duplicates

          return {
            ...p,
            id: response.data.id,
            name: response.data.name,
            types: response.data.types.map(type => type.type.name),
            weaknesses,
            number: response.data.id,
            height: response.data.height,
            weight: response.data.weight,
            abilities: response.data.abilities.map(a => a.ability.name),
            sprites: response.data.sprites,
            stats: response.data.stats
          }
        })
      )
      return details
    } catch (error) {
      console.error('Error fetching pokemon details:', error)
      return pokemonList
    }
  }

  // Initial load of first page
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${itemsPerPage}&offset=0`)
        const pokemonWithDetails = await fetchPokemonDetails(res.data.results)
        setPokemon(pokemonWithDetails)
        setCurrentOffset(itemsPerPage)
        setHasMore(currentOffset < totalPokemon)
      } catch (error) {
        setError(error)
        console.error('Error fetching initial pokemon list:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchInitialData()
  }, [itemsPerPage])

  // Background loading of all Pokemon
  useEffect(() => {
    let isMounted = true

    const fetchAllPokemon = async () => {
      if (isLoadingAll || allPokemon.length > 0) return
      
      try {
        setIsLoadingAll(true)
        const res = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${totalPokemon}&offset=0`)
        const pokemonWithDetails = await fetchPokemonDetails(res.data.results)
        if (isMounted) {
          setAllPokemon(pokemonWithDetails)
        }
      } catch (error) {
        console.error('Error fetching all pokemon:', error)
      } finally {
        if (isMounted) {
          setIsLoadingAll(false)
        }
      }
    }
    fetchAllPokemon()

    return () => {
      isMounted = false
    }
  }, [])

  // Load more when scrolling
  useEffect(() => {
    const fetchMoreData = async () => {
      if (page === 1 || loading || !hasMore || currentOffset >= totalPokemon) return

      try {
        setLoading(true)
        const res = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${itemsPerPage}&offset=${currentOffset}`)
        const pokemonWithDetails = await fetchPokemonDetails(res.data.results)
        setPokemon(prev => [...prev, ...pokemonWithDetails])
        setCurrentOffset(prev => prev + itemsPerPage)
        setHasMore(currentOffset + itemsPerPage < totalPokemon)
      } catch (error) {
        setError(error)
        console.error('Error fetching more pokemon:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchMoreData()
  }, [page, itemsPerPage, loading, hasMore, currentOffset])

  return { 
    pokemon: allPokemon.length > 0 ? allPokemon : pokemon, 
    loading, 
    error, 
    hasMore,
    isLoadingAll,
    currentOffset,
    totalPokemon
  }
} 