import React from 'react'

export function BasicInfo({ pokemon }) {
  if (!pokemon) return null

  // Convert height from decimeters to feet and inches
  const heightInFeet = Math.floor(pokemon.height * 0.328084)
  const heightInInches = Math.round((pokemon.height * 0.328084 - heightInFeet) * 12)
  const heightString = `${heightInFeet}'${heightInInches.toString().padStart(2, '0')}"`

  // Convert weight from hectograms to pounds
  const weightInLbs = (pokemon.weight * 0.220462).toFixed(1)

  // Get the English genus (category)
  const category = pokemon.genera?.find(g => g.language.name === 'en')?.genus || 'Unknown'

  return (
    <div
      className="grid grid-cols-2 gap-6 p-6 bg-sky-400 rounded-lg text-white"
      data-testid="basic-info-container"
    >
      <div>
        <h3 className="text-xl font-semibold mb-2">Height</h3>
        <p className="text-2xl">{heightString}</p>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Category</h3>
        <p className="text-2xl capitalize">{category}</p>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Weight</h3>
        <p className="text-2xl">{weightInLbs} lbs</p>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Abilities</h3>
        <div className="flex items-center gap-2" data-testid="abilities-container">
          {pokemon.abilities?.map(ability => (
            <span
              key={ability.ability.name}
              className="text-2xl capitalize"
              data-testid="ability-text"
            >
              {ability.ability.name}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Gender</h3>
        <div className="flex gap-4 text-2xl" data-testid="gender-container">
          <span>♂</span>
          <span>♀</span>
        </div>
      </div>
    </div>
  )
} 