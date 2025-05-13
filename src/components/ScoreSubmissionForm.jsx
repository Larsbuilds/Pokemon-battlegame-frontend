import React, { useState } from 'react';
import { useBattle } from '../context/BattleContext';

const ScoreSubmissionForm = ({ onClose }) => {
  const { recordBattle } = useBattle();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (isWin) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await recordBattle(isWin);
      onClose();
    } catch (err) {
      setError('Failed to submit battle result. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formStyle = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    maxWidth: '400px',
    width: '100%',
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '1rem',
    marginTop: '1.5rem',
  };

  const buttonStyle = {
    flex: 1,
    padding: '0.75rem',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.2s',
  };

  const winButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#28a745',
    color: 'white',
  };

  const lossButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#dc3545',
    color: 'white',
  };

  const cancelButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#6c757d',
    color: 'white',
  };

  return (
    <div style={formStyle}>
      <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Submit Battle Result</h3>
      
      {error && (
        <div style={{
          backgroundColor: '#ffebee',
          color: '#c62828',
          padding: '0.75rem',
          borderRadius: '4px',
          marginBottom: '1rem',
        }}>
          {error}
        </div>
      )}

      <p style={{ color: '#6c757d', marginBottom: '1.5rem' }}>
        Select the outcome of your battle to update your statistics and score.
      </p>

      <div style={buttonContainerStyle}>
        <button
          style={winButtonStyle}
          onClick={() => handleSubmit(true)}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Victory'}
        </button>
        <button
          style={lossButtonStyle}
          onClick={() => handleSubmit(false)}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Defeat'}
        </button>
      </div>

      <button
        style={cancelButtonStyle}
        onClick={onClose}
        disabled={isSubmitting}
      >
        Cancel
      </button>
    </div>
  );
};

export default ScoreSubmissionForm; 