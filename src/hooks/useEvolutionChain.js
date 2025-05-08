import { useState, useEffect } from 'react'
import axios from 'axios'

export function useEvolutionChain(pokemonId) {
  const [evolutionChain, setEvolutionChain] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchEvolutionChain = async () => {
      try {
        setLoading(true)
        setError(null)

        // Check if we have a cached version
        const cacheKey = `evolution_chain_${pokemonId}`
        const cachedData = localStorage.getItem(cacheKey)
        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData)
          // Check if cache is still valid (5 minutes)
          if (Date.now() - timestamp < 5 * 60 * 1000) {
            setEvolutionChain(data)
            setLoading(false)
            return
          }
        }

        // Fetch species data first to get evolution chain URL
        const speciesResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`)
        const evolutionChainUrl = speciesResponse.data.evolution_chain.url

        // Fetch evolution chain data
        const chainResponse = await axios.get(evolutionChainUrl)
        const chainData = chainResponse.data.chain

        // Transform the chain data into a more usable format
        const transformedChain = transformChainData(chainData)
        
        // Cache the transformed data
        localStorage.setItem(cacheKey, JSON.stringify({
          data: transformedChain,
          timestamp: Date.now()
        }))
        
        setEvolutionChain(transformedChain)
      } catch (error) {
        setError(error)
        console.error('Error fetching evolution chain:', error)
      } finally {
        setLoading(false)
      }
    }

    if (pokemonId) {
      fetchEvolutionChain()
    }
  }, [pokemonId])

  return { evolutionChain, loading, error }
}

// Helper function to transform the chain data
function transformChainData(chain) {
  const transformChain = (chainData) => {
    const species = chainData.species
    const evolvesTo = chainData.evolves_to.map(evolution => ({
      id: evolution.species.url.split('/').slice(-2, -1)[0],
      name: evolution.species.name,
      evolutionDetails: evolution.evolution_details[0] || null,
      evolvesTo: transformChain(evolution).evolvesTo
    }))
    
    return {
      id: species.url.split('/').slice(-2, -1)[0],
      name: species.name,
      evolvesTo: evolvesTo
    }
  }

  return transformChain(chain)
} 