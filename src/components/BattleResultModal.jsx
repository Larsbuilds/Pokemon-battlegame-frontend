import React from 'react';
import { useNavigate } from 'react-router-dom';

const BattleResultModal = ({ isWin, scoreChange }) => {
  const navigate = useNavigate();

  const modalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  };

  const contentStyle = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    maxWidth: '400px',
    width: '100%',
    textAlign: 'center',
  };

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    color: isWin ? '#28a745' : '#dc3545',
  };

  const scoreStyle = {
    fontSize: '1.5rem',
    marginBottom: '2rem',
    color: scoreChange > 0 ? '#28a745' : '#dc3545',
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
  };

  const buttonStyle = {
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.2s',
  };

  const rosterButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#007bff',
    color: 'white',
  };

  const leaderboardButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#6c757d',
    color: 'white',
  };

  return (
    <div style={modalStyle}>
      <div style={contentStyle}>
        <h2 style={titleStyle}>
          {isWin ? 'Victory!' : 'Defeat!'}
        </h2>
        <p style={scoreStyle}>
          Score Change: {scoreChange > 0 ? '+' : ''}{scoreChange}
        </p>
        <div style={buttonContainerStyle}>
          <button
            style={rosterButtonStyle}
            onClick={() => navigate('/roster')}
          >
            Back to Roster
          </button>
          <button
            style={leaderboardButtonStyle}
            onClick={() => navigate('/leaderboard')}
          >
            View Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default BattleResultModal; 