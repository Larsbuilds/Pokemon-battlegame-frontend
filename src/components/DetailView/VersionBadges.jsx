import React, { useRef } from 'react'

export function VersionBadges({ versions }) {
  const badgeRefs = useRef([])

  if (!versions || versions.length === 0) {
    return <div data-testid="version-badges-container" className="flex gap-2" />
  }

  const handleKeyDown = (event, index) => {
    if (event.key === 'ArrowRight') {
      const nextIndex = (index + 1) % versions.length
      badgeRefs.current[nextIndex]?.focus()
    } else if (event.key === 'ArrowLeft') {
      const prevIndex = (index - 1 + versions.length) % versions.length
      badgeRefs.current[prevIndex]?.focus()
    }
  }

  return (
    <div data-testid="version-badges-container" className="flex gap-2">
      {versions.map((version, index) => {
        // Handle both data structures: { name, url } and { version: { name, url } }
        const versionName = version.version?.name || version.name
        const versionKey = version.key || versionName

        return (
          <button
            key={versionKey}
            ref={el => (badgeRefs.current[index] = el)}
            data-testid={`version-badge-${versionName}`}
            className="bg-gray-100 text-gray-800 text-sm font-medium rounded-full px-3 py-1 capitalize hover:bg-gray-200 transition-colors"
            onKeyDown={e => handleKeyDown(e, index)}
            tabIndex={0}
          >
            {versionName}
          </button>
        )
      })}
    </div>
  )
} 