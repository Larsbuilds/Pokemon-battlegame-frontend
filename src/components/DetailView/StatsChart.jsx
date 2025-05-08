import React, { useState, useRef, useEffect } from 'react'

const STAT_COLORS = {
  hp: 'bg-red-500',
  attack: 'bg-orange-500',
  defense: 'bg-yellow-500',
  'special-attack': 'bg-purple-500',
  'special-defense': 'bg-green-500',
  speed: 'bg-blue-500'
}

const STAT_LABELS = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Attack',
  'special-defense': 'Sp. Defense',
  speed: 'Speed'
}

const STAT_DESCRIPTIONS = {
  hp: 'Hit Points - Determines how much damage a Pokémon can take before fainting',
  attack: 'Attack - Determines the power of physical moves',
  defense: 'Defense - Determines how well a Pokémon can withstand physical attacks',
  'special-attack': 'Special Attack - Determines the power of special moves',
  'special-defense': 'Special Defense - Determines how well a Pokémon can withstand special attacks',
  speed: 'Speed - Determines which Pokémon acts first in battle'
}

function StatTooltip({ stat, value, description }) {
  return (
    <div 
      className="absolute z-10 bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-3 rounded-xl text-sm min-w-[300px] max-w-[400px] shadow-lg border border-gray-100 transform transition-all duration-300 ease-out opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
      style={{
        left: 'calc(100% + 1rem)',
        top: '50%',
        transform: 'translateY(-50%)',
      }}
      role="tooltip"
      aria-label={description}
      data-testid={`stat-tooltip-${stat}`}
    >
      <div className="text-gray-600 leading-relaxed">{description}</div>
    </div>
  )
}

function StatsSkeleton() {
  return (
    <div className="space-y-4" data-testid="stats-skeleton">
      <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" data-testid="skeleton-title" />
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex items-center">
          <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" data-testid="skeleton-label" />
          <div className="flex-1 ml-4">
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gray-200 animate-pulse" style={{ width: '60%' }} data-testid="skeleton-bar" />
            </div>
            <div className="h-4 w-8 bg-gray-200 rounded mt-1 animate-pulse" data-testid="skeleton-value" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function StatsChart({ stats, loading }) {
  const [hoveredStat, setHoveredStat] = useState(null)
  const [focusedStat, setFocusedStat] = useState(null)
  const statRefs = useRef({})

  useEffect(() => {
    // Cleanup function to remove event listeners
    return () => {
      Object.values(statRefs.current).forEach(ref => {
        if (ref) {
          ref.removeEventListener('keydown', handleKeyDown)
        }
      })
    }
  }, [])

  const handleKeyDown = (e, statName) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setFocusedStat(focusedStat === statName ? null : statName)
    } else if (e.key === 'Escape') {
      setFocusedStat(null)
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      const statNames = Object.keys(STAT_LABELS)
      const currentIndex = statNames.indexOf(statName)
      const nextIndex = e.key === 'ArrowDown' 
        ? (currentIndex + 1) % statNames.length
        : (currentIndex - 1 + statNames.length) % statNames.length
      const nextStat = statNames[nextIndex]
      statRefs.current[nextStat]?.focus()
    }
  }

  if (loading) return <StatsSkeleton />
  if (!stats) return null

  const maxStat = Math.max(...stats.map(stat => stat.base_stat))

  return (
    <div className="relative" data-testid="stats-chart">
      <h2 className="text-2xl font-bold mb-6">Base Stats</h2>
      <div 
        className="space-y-4"
        role="list"
        aria-label="Pokemon base stats"
      >
        {stats.map(stat => {
          const percentage = (stat.base_stat / maxStat) * 100
          const isHovered = hoveredStat === stat.stat.name
          const isFocused = focusedStat === stat.stat.name
          
          return (
            <div 
              key={stat.stat.name} 
              className="flex items-center group relative"
              onMouseEnter={() => setHoveredStat(stat.stat.name)}
              onMouseLeave={() => setHoveredStat(null)}
              data-testid={`stat-row-${stat.stat.name}`}
            >
              <div 
                className="w-24 text-sm font-medium capitalize cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
                tabIndex="0"
                role="listitem"
                ref={el => {
                  statRefs.current[stat.stat.name] = el
                  if (el) {
                    el.addEventListener('keydown', e => handleKeyDown(e, stat.stat.name))
                  }
                }}
                onFocus={() => setFocusedStat(stat.stat.name)}
                onBlur={() => setFocusedStat(null)}
                data-testid={`stat-label-${stat.stat.name}`}
              >
                {STAT_LABELS[stat.stat.name]}
              </div>
              <div className="flex-1 ml-4 relative">
                <div 
                  className="h-3 bg-gray-100 rounded-full overflow-hidden"
                  role="progressbar"
                  aria-valuenow={stat.base_stat}
                  aria-valuemin="0"
                  aria-valuemax="255"
                  data-testid={`stat-bar-container-${stat.stat.name}`}
                >
                  <div
                    className={`h-full ${STAT_COLORS[stat.stat.name]} transition-all duration-700 ease-out transform origin-left`}
                    style={{ 
                      width: `${percentage}%`,
                      transform: (isHovered || isFocused) ? 'scaleY(1.2)' : 'scaleY(1)',
                      boxShadow: (isHovered || isFocused) ? '0 0 10px rgba(0,0,0,0.2)' : 'none'
                    }}
                    data-testid={`stat-bar-${stat.stat.name}`}
                  />
                </div>
                <div 
                  className={`text-sm mt-1 transition-colors duration-200 ${
                    (isHovered || isFocused) ? 'text-gray-900 font-semibold' : 'text-gray-600'
                  }`}
                  data-testid={`stat-value-${stat.stat.name}`}
                >
                  {stat.base_stat}
                </div>
                {(isHovered || isFocused) && (
                  <StatTooltip
                    stat={stat.stat.name}
                    value={stat.base_stat}
                    description={STAT_DESCRIPTIONS[stat.stat.name]}
                  />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
} 