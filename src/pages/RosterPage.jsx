import React, { useState, useEffect } from "react";
import { useRoster } from "../context/RosterContext";
import { useBattle } from "../context/BattleContext";
import PokemonRosterCard from "../components/PokemonRosterCard";
import NameInputPopup from "../components/NameInputPopup";
import { useNavigate, Link } from "react-router-dom";
import { checkExistingPlayerByName } from "../hooks/useFetch";

const RosterPage = () => {
  const { roster, removeFromRoster, MAX_ROSTER_SIZE } = useRoster();
  const {
    opponentPokemon,
    generateOpponentTeam,
    replaceOpponentPokemon,
    playerName,
    setPlayerNameAndSave,
    clearTeams,
    setPlayerTeam,
    setOpponentTeam,
    setPresentPlayer,
    allGlobalPlayers,
  } = useBattle();
  const [error, setError] = useState(null);
  const [showNamePopup, setShowNamePopup] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const navigate = useNavigate();
  const [battleReady, setBattleReady] = useState(false);
  const [existingNameAccept, setExistingNameAccept] = useState(false);
  useEffect(() => {
    if (opponentPokemon.length === 0) {
      generateOpponentTeam();
    }
    // Show name popup if no name is set
    if (!playerName) {
      setShowNamePopup(true);
    }
  }, [generateOpponentTeam, playerName, opponentPokemon.length]);

  useEffect(() => {
    if (battleReady) {
      navigate("/battle");
    }
  }, [battleReady, navigate]);

  const handleExistingNameSubmit = () => {
    setExistingNameAccept(true);
  };
  const handleNameSubmit = (name) => {
    if (
      !checkExistingPlayerByName(allGlobalPlayers, name) ||
      existingNameAccept
    ) {
      setPlayerNameAndSave(name);
      setShowNamePopup(false);
      setShowWarning(false);
      setPresentPlayer(name);
      setExistingNameAccept(false);
    } else {
      setShowWarning(true);
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

  const handleOpponentRemove = (index) => {
    replaceOpponentPokemon(index);
  };

  // Helper to fetch minimal sprite data from PokeAPI
  const fetchMinimalPokemonData = async (pokemon) => {
    // If all required sprite fields are present, return as is
    if (
      pokemon.sprites &&
      pokemon.sprites.front_default &&
      pokemon.sprites.other &&
      pokemon.sprites.other["official-artwork"]?.front_default &&
      pokemon.sprites.other.showdown?.front_default &&
      pokemon.sprites.other.showdown?.back_default
    ) {
      return {
        id: pokemon.id,
        name: pokemon.name,
        sprites: pokemon.sprites,
        types: pokemon.types,
        stats: pokemon.stats,
        currHP:
          pokemon.currHP ||
          pokemon.stats.find((stat) => stat.stat?.name === "hp")?.base_stat ||
          0,
      };
    }
    // Otherwise, fetch from PokeAPI
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemon.id}`
    );
    const data = await response.json();
    return {
      id: data.id,
      name: data.name,
      sprites: {
        front_default: data.sprites.front_default,
        other: {
          "official-artwork": {
            front_default:
              data.sprites.other["official-artwork"]?.front_default ||
              data.sprites.front_default,
          },
          showdown: {
            front_default:
              data.sprites.other.showdown?.front_default ||
              data.sprites.front_default,
            back_default:
              data.sprites.other.showdown?.back_default ||
              data.sprites.front_default,
          },
        },
      },
      types: data.types,
      stats: data.stats,
      currHP:
        data.stats.find((stat) => stat.stat?.name === "hp")?.base_stat || 0,
    };
  };

  const handleBattle = async () => {
    if (roster.length !== MAX_ROSTER_SIZE) {
      setError("You need 6 Pokemon in your roster to start a battle!");
      return;
    }

    // Debug: Log roster data before battle
    console.log("Roster Pokemon before battle:", roster);

    // Store opponent team before clearing
    const currentOpponentTeam = [...opponentPokemon];

    // Clear existing Pokemon in battle context
    clearTeams();

    // Wait for state to clear
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Build minimal, complete player team array
    const formattedPokemon = await Promise.all(
      roster.map((pokemon) => fetchMinimalPokemonData(pokemon))
    );

    // Add all Pokemon at once using setPlayerTeam
    setPlayerTeam(formattedPokemon);

    // Restore opponent team using setOpponentTeam
    setOpponentTeam(currentOpponentTeam);

    // Wait for state updates to complete
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Verify the data is in localStorage
    const savedPlayerTeam = localStorage.getItem("playerTeam");
    const parsedPlayerTeam = savedPlayerTeam
      ? JSON.parse(savedPlayerTeam)
      : null;
    console.log("Saved player team in localStorage:", parsedPlayerTeam);

    if (!parsedPlayerTeam || parsedPlayerTeam.length !== MAX_ROSTER_SIZE) {
      console.error("Player team not properly saved to localStorage");
      setError("Failed to save player team. Please try again.");
      return;
    }

    // Set battle ready flag
    setBattleReady(true);
  };

  const sectionStyle = {
    backgroundColor: "#f5f5f5",
    padding: "1.5rem",
    borderRadius: "12px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    flex: "1",
    minWidth: "0",
    display: "flex",
    flexDirection: "column",
  };

  const rosterSectionStyle = {
    ...sectionStyle,
    backgroundColor: "#E3F2FD",
    border: "2px solid #2196F3",
  };

  const opponentSectionStyle = {
    ...sectionStyle,
    backgroundColor: "#FFEBEE",
    border: "2px solid #F44336",
  };

  const cardsContainerStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "0.5rem",
    padding: "0.5rem",
    height: "100%",
    position: "relative",
  };

  const cardWrapperStyle = {
    position: "relative",
    width: "100%",
    paddingTop: "130%", // Increased for more height for stats
  };

  const cardStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    transform: "scale(0.95)",
    transition: "transform 0.2s ease-in-out",
    overflow: "visible",
  };

  const titleStyle = {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "1rem",
    textAlign: "center",
    color: "#333",
  };

  const containerStyle = {
    display: "flex",
    flexDirection: "row",
    gap: "2rem",
    padding: "1rem",
    maxWidth: "1600px",
    margin: "0 auto",
    height: "calc(100vh - 100px)", // Adjust based on your header/navigation height
  };

  const emptySlotStyle = {
    width: "100%",
    height: "100%",
    border: "2px dashed #2196F3",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#2196F3",
    backgroundColor: "rgba(33, 150, 243, 0.1)",
    fontSize: "2.5rem",
    flexDirection: "column",
    cursor: "pointer",
    transition: "background 0.2s, box-shadow 0.2s, transform 0.2s",
    position: "absolute",
    top: 0,
    left: 0,
    padding: "0.75rem",
    boxSizing: "border-box",
  };

  const plusTextStyle = {
    fontSize: "2.5rem",
    fontWeight: "bold",
    marginBottom: "0.2rem",
    lineHeight: 1,
    color: "#2196F3",
    userSelect: "none",
  };

  const plusLabelStyle = {
    fontSize: "0.9rem",
    color: "#1976D2",
    marginTop: "0.2rem",
    userSelect: "none",
  };

  const battleButtonContainerStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 10,
    pointerEvents: "none",
  };

  const battleButtonStyle = {
    backgroundColor: roster.length === MAX_ROSTER_SIZE ? "#27ae60" : "#b2dfdb",
    color: "white",
    padding: "1.2rem 2.2rem",
    borderRadius: "12px",
    border: "none",
    fontSize: "1.3rem",
    fontWeight: "bold",
    letterSpacing: "0.05em",
    cursor: roster.length === MAX_ROSTER_SIZE ? "pointer" : "not-allowed",
    transition: "all 0.3s",
    whiteSpace: "nowrap",
    pointerEvents: "auto",
    transform: "none",
    outline: roster.length === MAX_ROSTER_SIZE ? "3px solid #145a32" : "none",
    textShadow:
      roster.length === MAX_ROSTER_SIZE ? "0 2px 8px #145a32" : "none",
  };

  return (
    <div
      className="roster-page"
      style={{ position: "relative", minHeight: "100vh" }}
    >
      {showNamePopup && (
        <NameInputPopup
          onSubmit={handleNameSubmit}
          initialName={playerName}
          showWarning={showWarning}
          acceptExisting={handleExistingNameSubmit}
          existingNameAccept={existingNameAccept}
        />
      )}

      {error && (
        <div
          style={{
            backgroundColor: "#ffebee",
            color: "#c62828",
            padding: "1rem",
            borderRadius: "4px",
            marginBottom: "1rem",
            maxWidth: "1600px",
            margin: "0 auto 1rem",
          }}
        >
          {error}
        </div>
      )}

      <div
        style={containerStyle}
        className="flex flex-col lg:flex-row gap-8 p-4 max-w-[1600px] mx-auto h-auto lg:h-[calc(100vh-100px)]"
      >
        {/* My Roster Section */}
        <div style={rosterSectionStyle}>
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1rem",
              padding: "0.5rem 2.5rem 0.5rem 0.5rem",
              borderRadius: "8px",
              transition: "background-color 0.3s ease",
              minHeight: "56px",
              maxWidth: "100%",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(33, 150, 243, 0.1)";
              const editButton = e.currentTarget.querySelector("button");
              if (editButton) {
                editButton.style.opacity = "1";
                editButton.style.transform = "translateX(0)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              const editButton = e.currentTarget.querySelector("button");
              if (editButton) {
                editButton.style.opacity = "0";
                editButton.style.transform = "translateX(-10px)";
              }
            }}
            onClick={() => setShowNamePopup(true)}
          >
            <h1
              style={{
                ...titleStyle,
                color: "#1976D2",
                margin: 0,
                transition: "all 0.3s ease",
                flex: 1,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                userSelect: "none",
              }}
            >
              {playerName ? `${playerName}'s Roster` : "My Roster"}
            </h1>
            <button
              tabIndex={-1}
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: "#2196F3",
                cursor: "pointer",
                padding: "8px",
                opacity: 0,
                transition: "all 0.3s ease",
                transform: "translateX(-10px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                marginLeft: "12px",
                pointerEvents: "none",
              }}
              aria-hidden="true"
              title="Edit name"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
          </div>
          <div style={cardsContainerStyle}>
            {roster.map((pokemon) => (
              <div key={`roster-${pokemon.id}`} style={cardWrapperStyle}>
                <div style={cardStyle}>
                  <PokemonRosterCard
                    pokemon={{
                      id: pokemon.id,
                      name: pokemon.name,
                      sprite:
                        pokemon.sprites?.other?.["official-artwork"]
                          ?.front_default ||
                        pokemon.sprites?.front_default ||
                        pokemon.sprite,
                      types: Array.isArray(pokemon.types)
                        ? pokemon.types.map((type) =>
                            typeof type === "string" ? type : type.type.name
                          )
                        : [],
                      stats: pokemon.stats
                        .filter(
                          (stat) =>
                            stat.stat?.name === "hp" ||
                            stat.stat?.name === "attack"
                        )
                        .map((stat) => ({
                          name: stat.stat?.name || stat.name,
                          value: stat.base_stat || stat.value,
                        })),
                    }}
                    onRemove={handleRemove}
                    isDragging={false}
                    isOpponent={false}
                  />
                </div>
              </div>
            ))}
            {/* Empty slots */}
            {Array.from({ length: MAX_ROSTER_SIZE - roster.length }).map(
              (_, index) => (
                <div key={`empty-${index}`} style={cardWrapperStyle}>
                  <Link
                    to="/"
                    style={{
                      textDecoration: "none",
                      display: "block",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <div style={emptySlotStyle} title="Add a Pokémon">
                      <span style={plusTextStyle}>+</span>
                      <span style={plusLabelStyle}>Add Pokémon</span>
                    </div>
                  </Link>
                </div>
              )
            )}
          </div>
        </div>

        {/* Battle Button - now absolutely centered and normal orientation */}
        <div style={battleButtonContainerStyle}>
          <button
            onClick={handleBattle}
            style={battleButtonStyle}
            disabled={roster.length !== MAX_ROSTER_SIZE}
            className={`transition-all duration-300 shadow-md ${
              roster.length === MAX_ROSTER_SIZE
                ? "hover:shadow-[0_0_32px_8px_#27ae60]"
                : ""
            }`}
          >
            Battle!
          </button>
        </div>

        {/* Opponent Section */}
        <div style={opponentSectionStyle}>
          <h2 style={{ ...titleStyle, color: "#D32F2F" }}>Opponent Team</h2>
          <div style={cardsContainerStyle}>
            {opponentPokemon.slice(0, MAX_ROSTER_SIZE).map((pokemon, index) => (
              <div
                key={`opponent-${index}-${pokemon.id}`}
                style={cardWrapperStyle}
              >
                <div style={cardStyle}>
                  <PokemonRosterCard
                    pokemon={{
                      id: pokemon.id,
                      name: pokemon.name,
                      sprite:
                        pokemon.sprites?.other?.["official-artwork"]
                          ?.front_default ||
                        pokemon.sprites?.front_default ||
                        pokemon.sprite,
                      types: Array.isArray(pokemon.types)
                        ? pokemon.types.map((type) =>
                            typeof type === "string" ? type : type.type.name
                          )
                        : [],
                      stats: pokemon.stats
                        .filter(
                          (stat) =>
                            stat.stat?.name === "hp" ||
                            stat.stat?.name === "attack"
                        )
                        .map((stat) => ({
                          name: stat.stat?.name || stat.name,
                          value: stat.base_stat || stat.value,
                        })),
                    }}
                    onRemove={() => handleOpponentRemove(index)}
                    isDragging={false}
                    isOpponent={true}
                  />
                </div>
              </div>
            ))}
            {/* Empty slots for opponent team */}
            {Array.from({
              length: MAX_ROSTER_SIZE - opponentPokemon.length,
            }).map((_, index) => (
              <div key={`opponent-empty-${index}`} style={cardWrapperStyle}>
                <div
                  style={{
                    ...emptySlotStyle,
                    border: "2px dashed #F44336",
                    color: "#F44336",
                    backgroundColor: "rgba(244, 67, 54, 0.1)",
                  }}
                >
                  <span
                    style={{
                      ...plusTextStyle,
                      color: "#F44336",
                    }}
                  >
                    ?
                  </span>
                  <span
                    style={{
                      ...plusLabelStyle,
                      color: "#D32F2F",
                    }}
                  >
                    Opponent
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RosterPage;
