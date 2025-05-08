import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds
const cache = new Map()

export function usePokemonCache() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getPokemon = useCallback(async (name) => {
    // Check if we have a cached version
    const cached = cache.get(name)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data
    }

    try {
      setLoading(true)
      setError(null)
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`)
      const data = response.data

      // Cache the result
      cache.set(name, {
        data,
        timestamp: Date.now()
      })

      return data
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const clearCache = useCallback(() => {
    cache.clear()
  }, [])

  return {
    getPokemon,
    clearCache,
    loading,
    error
  }
} 