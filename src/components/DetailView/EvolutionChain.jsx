import React from 'react'
import { Link } from 'react-router-dom'
import { useEvolutionChain } from '../../hooks/useEvolutionChain'
import OptimizedImage from '../OptimizedImage'
import TypeBadge from '../TypeBadge'
import LoadingSpinner from '../LoadingSpinner'
import ErrorMessage from '../ErrorMessage'

export function EvolutionChain({ pokemonId }) {
  const { evolutionChain, loading, error } = useEvolutionChain(pokemonId)

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message="Failed to load evolution chain" />
  if (!evolutionChain) return null

  const renderEvolutionChain = (chain) => {
    return (
      <div 
        key={chain.id} 
        className="flex items-center"
        data-testid={`evolution-chain-item-${chain.name}`}
      >
        {/* Pokemon Card - Contains image and details */}
        <Link 
          to={`/pokemon/${chain.name}`}
          className="flex flex-col items-center group transition-transform hover:scale-105"
          data-testid={`evolution-link-${chain.name}`}
        >
          <div className="relative w-40 h-40">
            {/* White circle background */}
            <div className="absolute inset-0 rounded-full bg-white border-2 border-gray-200"></div>
            <OptimizedImage
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${chain.id}.png`}
              alt={chain.name}
              className="w-full h-full p-2"
              data-testid={`pokemon-sprite-${chain.name}`}
            />
          </div>
          <div className="mt-4 text-center">
            <div className="text-xl font-bold capitalize text-white group-hover:text-blue-300 transition-colors">
              {chain.name}
            </div>
            <div className="text-lg text-gray-300">#{chain.id.padStart(4, '0')}</div>
            <div className="flex gap-2 mt-2 justify-center">
              {chain.types?.map(type => (
                <TypeBadge 
                  key={type} 
                  type={type}
                  data-testid={`type-badge-${type}`}
                />
              ))}
            </div>
          </div>
        </Link>

        {/* Evolution Chain Continuation - Only rendered if this Pokemon evolves */}
        {chain.evolvesTo.length > 0 && (
          <>
            {/* Evolution Arrow Section - Contains level requirement and arrow */}
            <div className="mx-8 flex flex-col items-center justify-center">
              {/* Level Requirement Badge - Only shown if evolution has level details */}
              {chain.evolvesTo[0]?.evolutionDetails && (
                <div 
                  className="bg-gray-700/80 rounded-lg px-3 py-1.5 text-white text-sm mb-2"
                  data-testid={`level-badge-${chain.name}`}
                >
                  Level {chain.evolvesTo[0].evolutionDetails.min_level || '?'}
                </div>
              )}
              {/* Evolution Arrow */}
              <div className="text-white text-3xl">→</div>
            </div>

            {/* Next Evolution(s) Container - Handles multiple evolution paths */}
            <div className="flex items-center">
              {chain.evolvesTo.map((evolution, index) => (
                <React.Fragment key={evolution.id}>
                  {/* Additional Arrow for Multiple Evolutions - Only shown between multiple options */}
                  {index > 0 && (
                    <div className="mx-8 flex flex-col items-center justify-center">
                      {evolution.evolutionDetails && (
                        <div 
                          className="bg-gray-700/80 rounded-lg px-3 py-1.5 text-white text-sm mb-2"
                          data-testid={`level-badge-${evolution.name}`}
                        >
                          Level {evolution.evolutionDetails.min_level || '?'}
                        </div>
                      )}
                      <div className="text-white text-3xl">→</div>
                    </div>
                  )}
                  {/* Recursively render the next evolution in the chain */}
                  {renderEvolutionChain(evolution)}
                </React.Fragment>
              ))}
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div 
      className="bg-gray-800 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.1)_25%,rgba(0,0,0,0.1)_50%,transparent_50%,transparent_75%,rgba(0,0,0,0.1)_75%)] bg-[length:10px_10px] rounded-xl p-8"
      data-testid="evolution-chain-container"
    >
      <h2 className="text-3xl font-bold mb-8 text-white">Evolution Chain</h2>
      <div className="flex justify-center">
        {renderEvolutionChain(evolutionChain)}
      </div>
    </div>
  )
} 