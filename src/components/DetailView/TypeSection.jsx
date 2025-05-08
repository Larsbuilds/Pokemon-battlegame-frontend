import React from 'react';
import PropTypes from 'prop-types';
import TypeBadge from '../TypeBadge';

export const TypeSection = ({ types }) => {
  if (!types || types.length === 0) {
    return <div data-testid="type-section">No types available</div>;
  }

  return (
    <div data-testid="type-section" className="flex flex-wrap gap-2">
      {types.map((type, index) => (
        <TypeBadge key={index} type={type.type.name} />
      ))}
    </div>
  );
};

TypeSection.propTypes = {
  types: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }).isRequired,
    })
  ),
};

export default TypeSection; 