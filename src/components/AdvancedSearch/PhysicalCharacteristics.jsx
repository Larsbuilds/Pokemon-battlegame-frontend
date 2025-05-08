import { memo } from 'react';

const heightCategories = [
  { id: 'small', label: 'Small', maxHeight: 0.5, tooltip: 'Up to 0.5m' },
  { id: 'medium', label: 'Medium', maxHeight: 1.5, tooltip: '0.5m - 1.5m' },
  { id: 'large', label: 'Large', maxHeight: Infinity, tooltip: 'Over 1.5m' }
];

const weightCategories = [
  { id: 'light', label: 'Light', maxWeight: 10, tooltip: 'Up to 10kg' },
  { id: 'medium', label: 'Medium', maxWeight: 50, tooltip: '10kg - 50kg' },
  { id: 'heavy', label: 'Heavy', maxWeight: Infinity, tooltip: 'Over 50kg' }
];

function PhysicalCharacteristics({ 
  selectedHeight, 
  selectedWeight, 
  onHeightChange, 
  onWeightChange 
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Height Filter */}
      <div>
        <h3 className="text-2xl font-semibold text-white mb-4">Height</h3>
        <div className="grid grid-cols-3 gap-4">
          {heightCategories.map((category) => (
            <div key={category.id} className="group relative">
              <button
                onClick={() => onHeightChange(category.id)}
                className={`w-full aspect-square bg-white rounded-lg p-4 transition-all duration-300
                  ${selectedHeight === category.id 
                    ? 'ring-2 ring-pokemon-blue shadow-lg scale-105' 
                    : 'hover:ring-2 hover:ring-pokemon-blue/50 hover:scale-105'}`}
                aria-pressed={selectedHeight === category.id}
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="w-12 h-12 mb-2">
                    {/* Enhanced height silhouette SVG */}
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      className={`w-full h-full transition-transform duration-300 group-hover:scale-110 ${
                        selectedHeight === category.id ? 'text-pokemon-blue' : 'text-gray-600'
                      }`}
                    >
                      {/* Body */}
                      <path
                        d="M12 2C12 2 8 6 8 10C8 14 12 18 12 18C12 18 16 14 16 10C16 6 12 2 12 2Z"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {/* Head */}
                      <circle cx="12" cy="6" r="2" />
                      {/* Feet */}
                      <path
                        d="M9 18L10 22M15 18L14 22"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className={`text-sm font-medium transition-colors duration-200 ${
                    selectedHeight === category.id ? 'text-pokemon-blue' : 'text-gray-600'
                  }`}>
                    {category.label}
                  </span>
                </div>
              </button>
              {/* Tooltip */}
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-800 text-white text-xs rounded px-2 py-1 pointer-events-none whitespace-nowrap z-10">
                {category.tooltip}
                {/* Tooltip arrow */}
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weight Filter */}
      <div>
        <h3 className="text-2xl font-semibold text-white mb-4">Weight</h3>
        <div className="grid grid-cols-3 gap-4">
          {weightCategories.map((category) => (
            <div key={category.id} className="group relative">
              <button
                onClick={() => onWeightChange(category.id)}
                className={`w-full aspect-square bg-white rounded-lg p-4 transition-all duration-300
                  ${selectedWeight === category.id 
                    ? 'ring-2 ring-pokemon-blue shadow-lg scale-105' 
                    : 'hover:ring-2 hover:ring-pokemon-blue/50 hover:scale-105'}`}
                aria-pressed={selectedWeight === category.id}
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="w-12 h-12 mb-2">
                    {/* Enhanced weight dots SVG */}
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      className={`w-full h-full transition-transform duration-300 group-hover:scale-110 ${
                        selectedWeight === category.id ? 'text-pokemon-blue' : 'text-gray-600'
                      }`}
                    >
                      {/* Weight dots with connecting lines */}
                      <circle cx="12" cy="12" r="2" />
                      <circle cx="8" cy="12" r="2" />
                      <circle cx="16" cy="12" r="2" />
                      <line x1="8" y1="12" x2="16" y2="12" strokeWidth="1" />
                    </svg>
                  </div>
                  <span className={`text-sm font-medium transition-colors duration-200 ${
                    selectedWeight === category.id ? 'text-pokemon-blue' : 'text-gray-600'
                  }`}>
                    {category.label}
                  </span>
                </div>
              </button>
              {/* Tooltip */}
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-800 text-white text-xs rounded px-2 py-1 pointer-events-none whitespace-nowrap z-10">
                {category.tooltip}
                {/* Tooltip arrow */}
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default memo(PhysicalCharacteristics); 