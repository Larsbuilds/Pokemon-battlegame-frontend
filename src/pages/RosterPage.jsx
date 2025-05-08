import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useRoster } from '../context/RosterContext';
import PokemonRosterCard from '../components/PokemonRosterCard';

const RosterPage = () => {
  const { roster, removeFromRoster, reorderRoster, MAX_ROSTER_SIZE } = useRoster();
  const [error, setError] = useState(null);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    
    if (sourceIndex !== destinationIndex) {
      reorderRoster(sourceIndex, destinationIndex);
    }
  };

  const handleRemove = (pokemonId) => {
    try {
      removeFromRoster(pokemonId);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="roster-page" style={{ padding: '2rem' }}>
      <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>My Roster</h1>
      
      {error && (
        <div style={{
          backgroundColor: '#ffebee',
          color: '#c62828',
          padding: '1rem',
          borderRadius: '4px',
          marginBottom: '1rem',
        }}>
          {error}
        </div>
      )}

      <div style={{
        backgroundColor: '#f5f5f5',
        padding: '1rem',
        borderRadius: '8px',
        minHeight: '200px',
      }}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="roster" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  minHeight: '150px',
                }}
              >
                {roster.map((pokemon, index) => (
                  <Draggable
                    key={pokemon.id}
                    draggableId={pokemon.id.toString()}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <PokemonRosterCard
                          pokemon={pokemon}
                          onRemove={handleRemove}
                          isDragging={snapshot.isDragging}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                
                {/* Empty slots */}
                {Array.from({ length: MAX_ROSTER_SIZE - roster.length }).map((_, index) => (
                  <div
                    key={`empty-${index}`}
                    style={{
                      width: '150px',
                      height: '200px',
                      border: '2px dashed #ccc',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#666',
                    }}
                  >
                    Empty Slot
                  </div>
                ))}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

export default RosterPage; 