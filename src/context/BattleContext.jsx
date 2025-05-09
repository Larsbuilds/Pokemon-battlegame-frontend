import React, { createContext, useContext, useState, useEffect } from "react";
import { useRoster } from "./RosterContext";

const BattleContext = createContext();

export const useBattle = () => {
  const context = useContext(BattleContext);
  if (!context) {
    throw new Error("useBattle must be used within a BattleProvider");
  }
  return context;
};

export const BattleProvider = ({ children }) => {
  const { MAX_ROSTER_SIZE } = useRoster();
  const [opponentPokemon, setOpponentPokemon] = useState([]);
  const [playerPokemon, setPlayerPokemon] = useState([]);
  const [battleData, setBattleData] = useState({});
  const [playerName, setPlayerName] = useState(() => {
    const savedName = localStorage.getItem("playerName");
    return savedName || "";
  });

  // Load battle data and teams from localStorage on initial render
  useEffect(() => {
    try {
      const savedBattleData = localStorage.getItem("pokemonBattleData");
      const savedOpponentTeam = localStorage.getItem("opponentTeam");
      const savedPlayerTeam = localStorage.getItem("playerTeam");
      const savedName = localStorage.getItem("playerName");

      if (savedBattleData) {
        setBattleData(JSON.parse(savedBattleData));
      }
      if (savedOpponentTeam) {
        setOpponentPokemon(JSON.parse(savedOpponentTeam));
      }
      if (savedPlayerTeam) {
        setPlayerPokemon(JSON.parse(savedPlayerTeam));
      }
      if (savedName) {
        setPlayerName(savedName);
      }
    } catch (error) {
      console.error("Error loading battle data:", error);
    }
  }, []);

  // Save player name to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("playerName", playerName);
  }, [playerName]);

  // Save battle data to localStorage whenever it changes
  useEffect(() => {
    try {
      // Only store essential battle data
      const essentialBattleData = Object.entries(battleData).reduce(
        (acc, [id, data]) => {
          acc[id] = {
            stats: data.stats,
            moves: data.moves?.slice(0, 4), // Only store first 4 moves
            abilities: data.abilities,
            sprites: data.images,
            currHP: data.currHP,
          };
          return acc;
        },
        {}
      );

      localStorage.setItem(
        "pokemonBattleData",
        JSON.stringify(essentialBattleData)
      );
    } catch (error) {
      console.error("Error saving battle data:", error);
    }
  }, [battleData]);

  // Save teams to localStorage
  useEffect(() => {
    try {
      console.log("Saving to localStorage - playerPokemon:", playerPokemon);
      console.log("Saving to localStorage - opponentPokemon:", opponentPokemon);

      if (playerPokemon.length > 0) {
        const playerTeamString = JSON.stringify(playerPokemon);
        localStorage.setItem("playerTeam", playerTeamString);
        // Verify the save
        const saved = localStorage.getItem("playerTeam");
        const parsed = saved ? JSON.parse(saved) : null;
        console.log(
          "Verified saved playerTeam:",
          parsed,
          "Length:",
          parsed ? parsed.length : 0
        );
      }

      if (opponentPokemon.length > 0) {
        // Store only essential data for opponent Pokemon
        const essentialOpponentTeam = opponentPokemon.map((pokemon) => ({
          id: pokemon.id,
          name: pokemon.name,
          sprites: {
            front_default: pokemon.sprites.front_default,
            other: {
              "official-artwork": {
                front_default:
                  pokemon.sprites.other?.["official-artwork"]?.front_default ||
                  pokemon.sprites.front_default,
              },
            },
          },
          types: pokemon.types,
          stats: pokemon.stats,
          currHP: pokemon.currHP,
        }));

        const opponentTeamString = JSON.stringify(essentialOpponentTeam);
        localStorage.setItem("opponentTeam", opponentTeamString);
        // Verify the save
        const saved = localStorage.getItem("opponentTeam");
        const parsed = saved ? JSON.parse(saved) : null;
        console.log(
          "Verified saved opponentTeam:",
          parsed,
          "Length:",
          parsed ? parsed.length : 0
        );
      }
    } catch (error) {
      console.error("Error saving teams:", error);
      if (error.name === "QuotaExceededError") {
        localStorage.clear();
        // Try saving again after clearing
        if (playerPokemon.length > 0) {
          localStorage.setItem("playerTeam", JSON.stringify(playerPokemon));
        }
        if (opponentPokemon.length > 0) {
          localStorage.setItem("opponentTeam", JSON.stringify(opponentPokemon));
        }
      }
    }
  }, [playerPokemon, opponentPokemon]);

  const updateBattleData = (pokemonId, data) => {
    setBattleData((prev) => ({
      ...prev,
      [pokemonId]: {
        ...prev[pokemonId],
        ...data,
      },
    }));
  };

  const clearTeams = () => {
    setPlayerPokemon([]);
    setOpponentPokemon([]);
    setBattleData({});
    localStorage.removeItem("playerTeam");
    localStorage.removeItem("opponentTeam");
    localStorage.removeItem("pokemonBattleData");
  };

  const addPlayerPokemon = (pokemon) => {
    if (playerPokemon.length < MAX_ROSTER_SIZE) {
      // Debug: Log incoming Pokemon data
      console.log("Incoming Pokemon data:", pokemon);

      // Store the full sprites object as provided
      const essentialPokemonData = {
        id: pokemon.id,
        name: pokemon.name,
        sprites: pokemon.sprites, // <-- keep full sprites object
        types: pokemon.types,
        stats: pokemon.stats,
        currHP:
          pokemon.currHP ||
          pokemon.stats.find((stat) => stat.stat?.name === "hp")?.base_stat ||
          0,
      };

      // Debug: Log formatted Pokemon data
      console.log("Formatted Pokemon data:", essentialPokemonData);

      // Update player Pokemon state and localStorage in one operation
      setPlayerPokemon((prev) => {
        const newPlayerPokemon = [...prev, essentialPokemonData];
        try {
          // Save to localStorage immediately
          localStorage.setItem("playerTeam", JSON.stringify(newPlayerPokemon));
          console.log("Updated player team:", newPlayerPokemon);
        } catch (error) {
          console.error("Error saving to localStorage:", error);
          // If we hit storage limit, clear old data and try again
          if (error.name === "QuotaExceededError") {
            localStorage.clear();
            localStorage.setItem(
              "playerTeam",
              JSON.stringify(newPlayerPokemon)
            );
          }
        }
        return newPlayerPokemon;
      });

      // Update battle data for the new Pokemon with minimal data
      setBattleData((prev) => {
        const newBattleData = {
          ...prev,
          [pokemon.id]: {
            images: essentialPokemonData.sprites,
            stats: essentialPokemonData.stats,
            currHP: essentialPokemonData.currHP,
          },
        };
        try {
          localStorage.setItem(
            "pokemonBattleData",
            JSON.stringify(newBattleData)
          );
        } catch (error) {
          console.error("Error saving battle data:", error);
          if (error.name === "QuotaExceededError") {
            localStorage.clear();
            localStorage.setItem(
              "pokemonBattleData",
              JSON.stringify(newBattleData)
            );
          }
        }
        return newBattleData;
      });

      // Verify the save
      const savedPlayerTeam = localStorage.getItem("playerTeam");
      const parsedTeam = savedPlayerTeam ? JSON.parse(savedPlayerTeam) : null;
      console.log("Verified player team save:", parsedTeam);
    }
  };

  const removePlayerPokemon = (index) => {
    setPlayerPokemon((prev) => prev.filter((_, i) => i !== index));
  };

  const updatePlayerPokemon = (index, updatedPokemon) => {
    const pokemonWithBattleData = {
      ...updatedPokemon,
      currHP:
        updatedPokemon.currHP ||
        updatedPokemon.stats.find((stat) => stat.stat.name === "hp")
          ?.base_stat ||
        0,
      sprites: updatedPokemon.sprites,
      cries: updatedPokemon.cries,
      stats: updatedPokemon.stats,
      moves: updatedPokemon.moves,
    };
    setPlayerPokemon((prev) => {
      const newTeam = [...prev];
      newTeam[index] = pokemonWithBattleData;
      return newTeam;
    });
    // Update battle data for the updated Pokemon
    updateBattleData(updatedPokemon.id, {
      images: updatedPokemon.sprites,
      sounds: updatedPokemon.cries,
      stats: updatedPokemon.stats,
      moves: updatedPokemon.moves,
      currHP: pokemonWithBattleData.currHP,
    });
  };

  const updatePokemonHP = (pokemonId, newHP) => {
    setBattleData((prev) => ({
      ...prev,
      [pokemonId]: {
        ...prev[pokemonId],
        currHP: newHP,
      },
    }));
  };

  const getPowerLevel = (totalStats) => {
    if (totalStats >= 500) return "strong";
    if (totalStats >= 300) return "medium";
    return "weak";
  };

  const replaceOpponentPokemon = async (index) => {
    try {
      const currentPokemon = opponentPokemon[index];
      const currentPowerLevel = getPowerLevel(
        currentPokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)
      );

      const newPokemon = await fetchRandomPokemon(1, currentPowerLevel);
      if (newPokemon.length > 0) {
        const pokemonWithHP = {
          ...newPokemon[0],
          currHP:
            newPokemon[0].stats.find((stat) => stat.stat.name === "hp")
              ?.base_stat || 0,
        };
        const updatedTeam = [...opponentPokemon];
        updatedTeam[index] = pokemonWithHP;
        setOpponentPokemon(updatedTeam);

        // Update battle data for the new Pokemon
        updateBattleData(pokemonWithHP.id, {
          images: pokemonWithHP.sprites,
          sounds: pokemonWithHP.cries,
          stats: pokemonWithHP.stats,
          moves: pokemonWithHP.moves,
          currHP: pokemonWithHP.currHP,
        });
      }
    } catch (error) {
      console.error("Error replacing opponent Pokemon:", error);
    }
  };

  const generateOpponentTeam = async () => {
    // Only generate new team if we don't have one
    if (opponentPokemon.length === 0) {
      try {
        const strongPokemon = await fetchRandomPokemon(2, "strong");
        const mediumPokemon = await fetchRandomPokemon(2, "medium");
        const weakPokemon = await fetchRandomPokemon(2, "weak");

        const team = [...strongPokemon, ...mediumPokemon, ...weakPokemon]
          .map((pokemon) => ({
            ...pokemon,
            currHP:
              pokemon.stats.find((stat) => stat.stat.name === "hp")
                ?.base_stat || 0,
          }))
          .slice(0, MAX_ROSTER_SIZE); // Ensure we don't exceed MAX_ROSTER_SIZE

        setOpponentPokemon(team);

        // Store battle data for each opponent Pokemon
        team.forEach((pokemon) => {
          updateBattleData(pokemon.id, {
            images: pokemon.sprites,
            sounds: pokemon.cries,
            stats: pokemon.stats,
            moves: pokemon.moves,
            currHP: pokemon.currHP,
          });
        });
      } catch (error) {
        console.error("Error generating opponent team:", error);
      }
    }
  };

  const fetchRandomPokemon = async (count, powerLevel) => {
    const pokemon = [];
    const baseStats = {
      strong: { min: 500, max: 700 },
      medium: { min: 300, max: 500 },
      weak: { min: 100, max: 300 },
    };

    while (pokemon.length < count) {
      // Only use Pokemon from the first 151
      const randomId = Math.floor(Math.random() * 151) + 1;
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${randomId}`
        );
        const data = await response.json();

        const totalStats = data.stats.reduce(
          (sum, stat) => sum + stat.base_stat,
          0
        );
        const { min, max } = baseStats[powerLevel];

        if (totalStats >= min && totalStats <= max) {
          pokemon.push(data);
        }
      } catch (error) {
        console.error("Error fetching Pokemon:", error);
      }
    }
    return pokemon;
  };

  const setPlayerNameAndSave = (name) => {
    setPlayerName(name);
  };

  // Set the entire player team at once
  const setPlayerTeam = (pokemonArray) => {
    // Ensure each pokemon has a full sprites object and essential data
    const formattedTeam = pokemonArray.map((pokemon) => ({
      id: pokemon.id,
      name: pokemon.name,
      sprites: pokemon.sprites,
      types: pokemon.types,
      stats: pokemon.stats,
      currHP:
        pokemon.currHP ||
        pokemon.stats.find((stat) => stat.stat?.name === "hp")?.base_stat ||
        0,
    }));
    setPlayerPokemon(formattedTeam);
    try {
      localStorage.setItem("playerTeam", JSON.stringify(formattedTeam));
      console.log("Set full player team:", formattedTeam);
    } catch (error) {
      console.error("Error saving full player team to localStorage:", error);
      if (error.name === "QuotaExceededError") {
        localStorage.clear();
        localStorage.setItem("playerTeam", JSON.stringify(formattedTeam));
      }
    }
    // Optionally update battleData for each
    setBattleData((prev) => {
      const newBattleData = { ...prev };
      formattedTeam.forEach((pokemon) => {
        newBattleData[pokemon.id] = {
          images: pokemon.sprites,
          stats: pokemon.stats,
          currHP: pokemon.currHP,
        };
      });
      try {
        localStorage.setItem(
          "pokemonBattleData",
          JSON.stringify(newBattleData)
        );
      } catch (error) {
        console.error("Error saving battle data:", error);
        if (error.name === "QuotaExceededError") {
          localStorage.clear();
          localStorage.setItem(
            "pokemonBattleData",
            JSON.stringify(newBattleData)
          );
        }
      }
      return newBattleData;
    });
  };

  // Set the entire opponent team at once
  const setOpponentTeam = (pokemonArray) => {
    // Ensure each pokemon has a full sprites object and essential data
    const formattedTeam = pokemonArray.map((pokemon) => ({
      id: pokemon.id,
      name: pokemon.name,
      sprites: {
        front_default: pokemon.sprites.front_default,
        other: {
          "official-artwork": {
            front_default:
              pokemon.sprites.other?.["official-artwork"]?.front_default ||
              pokemon.sprites.front_default,
          },
          showdown: {
            front_default:
              pokemon.sprites.other?.showdown?.front_default ||
              pokemon.sprites.front_default,
            back_default:
              pokemon.sprites.other?.showdown?.back_default ||
              pokemon.sprites.front_default,
          },
        },
      },
      types: pokemon.types,
      stats: pokemon.stats,
      currHP:
        pokemon.currHP ||
        pokemon.stats.find((stat) => stat.stat?.name === "hp")?.base_stat ||
        0,
    }));
    setOpponentPokemon(formattedTeam);
    try {
      localStorage.setItem("opponentTeam", JSON.stringify(formattedTeam));
      console.log("Set full opponent team:", formattedTeam);
    } catch (error) {
      console.error("Error saving full opponent team to localStorage:", error);
      if (error.name === "QuotaExceededError") {
        localStorage.clear();
        localStorage.setItem("opponentTeam", JSON.stringify(formattedTeam));
      }
    }
    // Update battle data for each opponent Pokemon
    setBattleData((prev) => {
      const newBattleData = { ...prev };
      formattedTeam.forEach((pokemon) => {
        newBattleData[pokemon.id] = {
          images: pokemon.sprites,
          stats: pokemon.stats,
          currHP: pokemon.currHP,
        };
      });
      try {
        localStorage.setItem(
          "pokemonBattleData",
          JSON.stringify(newBattleData)
        );
      } catch (error) {
        console.error("Error saving battle data:", error);
        if (error.name === "QuotaExceededError") {
          localStorage.clear();
          localStorage.setItem(
            "pokemonBattleData",
            JSON.stringify(newBattleData)
          );
        }
      }
      return newBattleData;
    });
  };

  const value = {
    opponentPokemon,
    playerPokemon,
    battleData,
    playerName,
    setPlayerNameAndSave,
    updateBattleData,
    generateOpponentTeam,
    replaceOpponentPokemon,
    addPlayerPokemon,
    removePlayerPokemon,
    updatePlayerPokemon,
    updatePokemonHP,
    clearTeams,
    setPlayerTeam,
    setOpponentTeam,
  };

  return (
    <BattleContext.Provider value={value}>{children}</BattleContext.Provider>
  );
};
