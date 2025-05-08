import React from 'react';
import { Droppable } from 'react-beautiful-dnd';

const CustomDroppable = ({ droppableId, direction = 'horizontal', children }) => {
  return (
    <Droppable droppableId={droppableId} direction={direction}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {children(provided, snapshot)}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default CustomDroppable; 