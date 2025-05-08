import React from 'react'

export function AdditionalInfo({ pokemon }) {
  // Convert capture rate to percentage
  const captureRate = ((pokemon.capture_rate / 255) * 100).toFixed(1)
  
  // Convert base happiness to percentage
  const happiness = ((pokemon.base_happiness / 255) * 100).toFixed(1)

  return (
    <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Additional Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Breeding Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Breeding</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Egg Groups</span>
              <span className="font-medium capitalize">
                {pokemon.egg_groups?.map(group => group.name).join(', ') || 'Unknown'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Egg Cycles</span>
              <span className="font-medium">{pokemon.hatch_counter || 'Unknown'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Gender Rate</span>
              <span className="font-medium">
                {pokemon.gender_rate === -1 ? 'Genderless' : 
                 `${((1 - pokemon.gender_rate) * 100).toFixed(1)}% ♂ / ${(pokemon.gender_rate * 100).toFixed(1)}% ♀`}
              </span>
            </div>
          </div>
        </div>

        {/* Habitat & Growth */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Habitat & Growth</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Habitat</span>
              <span className="font-medium capitalize">
                {pokemon.habitat?.name || 'Unknown'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Growth Rate</span>
              <span className="font-medium capitalize">
                {pokemon.growth_rate?.name || 'Unknown'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Base Experience</span>
              <span className="font-medium">{pokemon.base_experience || 'Unknown'}</span>
            </div>
          </div>
        </div>

        {/* Capture & Happiness */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Capture & Happiness</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Capture Rate</span>
              <span className="font-medium">{captureRate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Base Happiness</span>
              <span className="font-medium">{happiness}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Generation</span>
              <span className="font-medium capitalize">
                {pokemon.generation?.name || 'Unknown'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 