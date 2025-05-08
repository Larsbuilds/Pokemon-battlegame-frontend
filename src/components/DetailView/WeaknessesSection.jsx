import React, { useRef } from 'react'

export function WeaknessesSection({ weaknesses }) {
  const badgeRefs = useRef([])

  if (!weaknesses || weaknesses.length === 0) {
    return (
      <div data-testid="weaknesses-container" className="p-6">
        <h2 className="text-2xl font-bold mb-4">Weaknesses</h2>
        <p>No weaknesses found</p>
      </div>
    )
  }

  const handleKeyDown = (event, index) => {
    if (event.key === 'ArrowRight') {
      const nextIndex = (index + 1) % weaknesses.length
      badgeRefs.current[nextIndex]?.focus()
    } else if (event.key === 'ArrowLeft') {
      const prevIndex = (index - 1 + weaknesses.length) % weaknesses.length
      badgeRefs.current[prevIndex]?.focus()
    }
  }

  return (
    <div data-testid="weaknesses-container" className="p-6">
      <h2 className="text-2xl font-bold mb-4">Weaknesses</h2>
      <div className="flex flex-wrap gap-2">
        {weaknesses.map((weakness, index) => (
          <button
            key={weakness.type}
            ref={el => (badgeRefs.current[index] = el)}
            data-testid={`weakness-badge-${weakness.type}`}
            className="rounded-full text-white font-medium px-3 py-1 text-sm capitalize hover:shadow-md transition-shadow"
            style={{ backgroundColor: `var(--pokemon-type-${weakness.type})` }}
            onKeyDown={e => handleKeyDown(e, index)}
            tabIndex={0}
          >
            <div className="relative group">
              <span>{weakness.type}</span>
              <div
                data-testid={`multiplier-tooltip-${weakness.type}`}
                className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-800 text-white text-xs rounded px-2 py-1 pointer-events-none whitespace-nowrap z-10"
              >
                {weakness.multiplier}x
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
} 