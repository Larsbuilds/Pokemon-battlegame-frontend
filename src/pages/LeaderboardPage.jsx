import React, { useState, useEffect } from "react";
import { useBattle } from "../context/BattleContext";

const LeaderboardPage = () => {
  const { playerStats, battleHistory, leaderboard, allGlobalPlayers } =
    useBattle();
  const [sortBy, setSortBy] = useState("score");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [variant, setVariant] = useState(false);

  useEffect(() => {
    // Reset loading state when data changes
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [playerStats, leaderboard, battleHistory]);

  const entriesPerPage = 10;
  const totalPages = Math.ceil(leaderboard.length / entriesPerPage);

  // Sort the leaderboard based on the selected criteria
  const sortedLeaderboard = [...leaderboard].sort((a, b) => {
    switch (sortBy) {
      case "rank":
        return a.rank - b.rank;
      case "score":
        return b.score - a.score;
      case "winRate":
        return b.winRate - a.winRate;
      default:
        return b.score - a.score;
    }
  });

  const currentEntries = sortedLeaderboard.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const handleSort = (criteria) => {
    setSortBy(criteria);
    setCurrentPage(1);
  };

  const LoadingSpinner = () => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          border: "4px solid #f3f3f3",
          borderTop: "4px solid #3498db",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );

  // Styles
  const pageStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "2rem",
    backgroundColor: "#f5f5f5",
    minHeight: "100vh",
  };

  const sectionStyle = {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "2rem",
    marginBottom: "2rem",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  };

  const statsGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1rem",
    marginBottom: "2rem",
  };

  const statCardStyle = {
    backgroundColor: "#f8f9fa",
    padding: "1.5rem",
    borderRadius: "8px",
    textAlign: "center",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "1rem",
  };

  const thStyle = {
    backgroundColor: "#f8f9fa",
    padding: "1rem",
    textAlign: "left",
    borderBottom: "2px solid #dee2e6",
    cursor: "pointer",
  };

  const tdStyle = {
    padding: "1rem",
    borderBottom: "1px solid #dee2e6",
  };

  const paginationStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "0.5rem",
    marginTop: "2rem",
  };

  const buttonStyle = {
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#007bff",
    color: "white",
    cursor: "pointer",
    transition: "background-color 0.2s",
  };

  if (isLoading) {
    return (
      <div style={pageStyle}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div style={pageStyle}>
        <div
          style={{
            backgroundColor: "#ffebee",
            color: "#c62828",
            padding: "1rem",
            borderRadius: "4px",
            marginBottom: "1rem",
          }}
        >
          {error}
          <button
            onClick={() => setError(null)}
            style={{
              marginLeft: "1rem",
              padding: "0.25rem 0.5rem",
              backgroundColor: "#c62828",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {variant ? (
        <div style={pageStyle}>
          {/* User Profile Section */}
          <div style={sectionStyle}>
            <h2 style={{ marginBottom: "1rem", color: "#333" }}>
              Your Profile
            </h2>
            <div style={statsGridStyle}>
              <div style={statCardStyle}>
                <h3 style={{ marginBottom: "0.5rem", color: "#666" }}>
                  Total Score
                </h3>
                <p
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "#333",
                  }}
                >
                  {playerStats.score}
                </p>
              </div>
              <div style={statCardStyle}>
                <h3 style={{ marginBottom: "0.5rem", color: "#666" }}>
                  Win Rate
                </h3>
                <p
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "#333",
                  }}
                >
                  {playerStats.winRate.toFixed(1)}%
                </p>
              </div>
              <div style={statCardStyle}>
                <h3 style={{ marginBottom: "0.5rem", color: "#666" }}>
                  Total Battles
                </h3>
                <p
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "#333",
                  }}
                >
                  {playerStats.totalBattles}
                </p>
              </div>
              <div style={statCardStyle}>
                <h3 style={{ marginBottom: "0.5rem", color: "#666" }}>
                  Wins/Losses
                </h3>
                <p
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "#333",
                  }}
                >
                  {playerStats.wins}/{playerStats.losses}
                </p>
              </div>
            </div>
          </div>

          {/* Leaderboard Section */}
          <div style={sectionStyle}>
            <h2 style={{ marginBottom: "1rem", color: "#333" }}>
              Global Leaderboard
            </h2>
            <p style={{ color: "#666", marginBottom: "1rem" }}>
              Showing {currentEntries.length} of {leaderboard.length} players
            </p>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th
                    style={{
                      ...thStyle,
                      backgroundColor:
                        sortBy === "rank" ? "#e3f2fd" : thStyle.backgroundColor,
                    }}
                    onClick={() => handleSort("rank")}
                  >
                    Rank {sortBy === "rank" && "↓"}
                  </th>
                  <th style={thStyle}>Player</th>
                  <th
                    style={{
                      ...thStyle,
                      backgroundColor:
                        sortBy === "score"
                          ? "#e3f2fd"
                          : thStyle.backgroundColor,
                    }}
                    onClick={() => handleSort("score")}
                  >
                    Score {sortBy === "score" && "↓"}
                  </th>
                  <th
                    style={{
                      ...thStyle,
                      backgroundColor:
                        sortBy === "winRate"
                          ? "#e3f2fd"
                          : thStyle.backgroundColor,
                    }}
                    onClick={() => handleSort("winRate")}
                  >
                    Win Rate {sortBy === "winRate" && "↓"}
                  </th>
                  <th style={thStyle}>Total Battles</th>
                </tr>
              </thead>
              <tbody>
                {currentEntries.map((entry) => (
                  <tr
                    key={entry.playerId}
                    style={{
                      backgroundColor:
                        entry.playerId === playerStats.playerId
                          ? "#e3f2fd"
                          : "transparent",
                    }}
                  >
                    <td style={tdStyle}>{entry.rank}</td>
                    <td style={tdStyle}>{entry.playerName}</td>
                    <td style={tdStyle}>{entry.score}</td>
                    <td style={tdStyle}>{entry.winRate.toFixed(1)}%</td>
                    <td style={tdStyle}>{entry.totalBattles}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={paginationStyle}>
                <button
                  style={{
                    ...buttonStyle,
                    backgroundColor: currentPage === 1 ? "#ccc" : "#007bff",
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  }}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span style={{ padding: "0.5rem 1rem" }}>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  style={{
                    ...buttonStyle,
                    backgroundColor:
                      currentPage === totalPages ? "#ccc" : "#007bff",
                    cursor:
                      currentPage === totalPages ? "not-allowed" : "pointer",
                  }}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Battle History Section */}
          <div style={sectionStyle}>
            <h2 style={{ marginBottom: "1rem", color: "#333" }}>
              Recent Battles
            </h2>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Date</th>
                  <th style={thStyle}>Opponent</th>
                  <th style={thStyle}>Result</th>
                  <th style={thStyle}>Score Change</th>
                </tr>
              </thead>
              <tbody>
                {battleHistory.slice(0, 10).map((battle, index) => (
                  <tr key={index}>
                    <td style={tdStyle}>
                      {new Date(battle.date).toLocaleDateString()}
                    </td>
                    <td style={tdStyle}>{battle.opponent}</td>
                    <td style={tdStyle}>
                      <span
                        style={{
                          color:
                            battle.result === "win" ? "#28a745" : "#dc3545",
                          fontWeight: "bold",
                        }}
                      >
                        {battle.result.toUpperCase()}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <span
                        style={{
                          color: battle.scoreChange > 0 ? "#28a745" : "#dc3545",
                          fontWeight: "bold",
                        }}
                      >
                        {battle.scoreChange > 0 ? "+" : ""}
                        {battle.scoreChange}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div style={pageStyle}>
          {/* User Profile Section */}
          <div style={sectionStyle}>
            <h2 style={{ marginBottom: "1rem", color: "#333" }}>
              Your Profile
            </h2>
            <div style={statsGridStyle}>
              <div style={statCardStyle}>
                <h3 style={{ marginBottom: "0.5rem", color: "#666" }}>
                  Total Score
                </h3>
                <p
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "#333",
                  }}
                >
                  {playerStats.score}
                </p>
              </div>
              <div style={statCardStyle}>
                <h3 style={{ marginBottom: "0.5rem", color: "#666" }}>
                  Win Rate
                </h3>
                <p
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "#333",
                  }}
                >
                  {playerStats.winRate.toFixed(1)}%
                </p>
              </div>
              <div style={statCardStyle}>
                <h3 style={{ marginBottom: "0.5rem", color: "#666" }}>
                  Total Battles
                </h3>
                <p
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "#333",
                  }}
                >
                  {playerStats.totalBattles}
                </p>
              </div>
              <div style={statCardStyle}>
                <h3 style={{ marginBottom: "0.5rem", color: "#666" }}>
                  Wins/Losses
                </h3>
                <p
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "#333",
                  }}
                >
                  {playerStats.wins}/{playerStats.losses}
                </p>
              </div>
            </div>
          </div>

          {/* Leaderboard Section */}
          <div style={sectionStyle}>
            <h2 style={{ marginBottom: "1rem", color: "#333" }}>
              Global Leaderboard
            </h2>
            <p style={{ color: "#666", marginBottom: "1rem" }}>
              Showing {allGlobalPlayers.length} of {allGlobalPlayers.length}{" "}
              players
            </p>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th
                    style={{
                      ...thStyle,
                      backgroundColor:
                        sortBy === "rank" ? "#e3f2fd" : thStyle.backgroundColor,
                    }}
                    onClick={() => handleSort("rank")}
                  >
                    Rank {sortBy === "rank" && "↓"}
                  </th>
                  <th style={thStyle}>Player</th>
                  <th
                    style={{
                      ...thStyle,
                      backgroundColor:
                        sortBy === "score"
                          ? "#e3f2fd"
                          : thStyle.backgroundColor,
                    }}
                    onClick={() => handleSort("score")}
                  >
                    Score {sortBy === "score" && "↓"}
                  </th>
                  <th
                    style={{
                      ...thStyle,
                      backgroundColor:
                        sortBy === "winRate"
                          ? "#e3f2fd"
                          : thStyle.backgroundColor,
                    }}
                    onClick={() => handleSort("winRate")}
                  >
                    Win Rate {sortBy === "winRate" && "↓"}
                  </th>
                  <th style={thStyle}>Total Battles</th>
                </tr>
              </thead>
              <tbody>
                {allGlobalPlayers.map((entry) => (
                  <tr
                    key={entry.id}
                    style={{
                      backgroundColor:
                        entry.id === playerStats.playerId
                          ? "#e3f2fd"
                          : "transparent",
                    }}
                  >
                    <td style={tdStyle}>
                      {allGlobalPlayers.indexOf(entry) + 1}
                    </td>
                    <td style={tdStyle}>{entry.name}</td>
                    <td style={tdStyle}>{entry.scores}</td>
                    {entry.totalBattles > 0 ? (
                      <td style={tdStyle}>
                        {((entry.wins / entry.totalBattles) * 100).toFixed(1)}%
                      </td>
                    ) : (
                      <td style={tdStyle}>{0}%</td>
                    )}

                    <td style={tdStyle}>{entry.totalBattles}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={paginationStyle}>
                <button
                  style={{
                    ...buttonStyle,
                    backgroundColor: currentPage === 1 ? "#ccc" : "#007bff",
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  }}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span style={{ padding: "0.5rem 1rem" }}>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  style={{
                    ...buttonStyle,
                    backgroundColor:
                      currentPage === totalPages ? "#ccc" : "#007bff",
                    cursor:
                      currentPage === totalPages ? "not-allowed" : "pointer",
                  }}
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Battle History Section */}
          <div style={sectionStyle}>
            <h2 style={{ marginBottom: "1rem", color: "#333" }}>
              Recent Battles
            </h2>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Date</th>
                  <th style={thStyle}>Opponent</th>
                  <th style={thStyle}>Result</th>
                  <th style={thStyle}>Score Change</th>
                </tr>
              </thead>
              <tbody>
                {battleHistory.slice(0, 10).map((battle, index) => (
                  <tr key={index}>
                    <td style={tdStyle}>
                      {new Date(battle.date).toLocaleDateString()}
                    </td>
                    <td style={tdStyle}>{battle.opponent}</td>
                    <td style={tdStyle}>
                      <span
                        style={{
                          color:
                            battle.result === "win" ? "#28a745" : "#dc3545",
                          fontWeight: "bold",
                        }}
                      >
                        {battle.result.toUpperCase()}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <span
                        style={{
                          color: battle.scoreChange > 0 ? "#28a745" : "#dc3545",
                          fontWeight: "bold",
                        }}
                      >
                        {battle.scoreChange > 0 ? "+" : ""}
                        {battle.scoreChange}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default LeaderboardPage;
