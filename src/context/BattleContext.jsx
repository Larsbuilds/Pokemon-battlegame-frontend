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
        localStorage.setItem("playerTeam", JSON.stringify(playerPokemon));
        // Verify the save
        const saved = localStorage.getItem("playerTeam");
        console.log(
          "Verified saved playerTeam:",
          saved ? JSON.parse(saved) : null
        );
      }

      if (opponentPokemon.length > 0) {
        localStorage.setItem("opponentTeam", JSON.stringify(opponentPokemon));
        // Verify the save
        const saved = localStorage.getItem("opponentTeam");
        console.log(
          "Verified saved opponentTeam:",
          saved ? JSON.parse(saved) : null
        );
      }
    } catch (error) {
      console.error("Error saving teams:", error);
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

  const addPlayerPokemon = (pokemon) => {
    if (playerPokemon.length < MAX_ROSTER_SIZE) {
      // Debug: Log incoming Pokemon data
      console.log("Incoming Pokemon data:", pokemon);

      // Store player Pokemon in the same structure as opponent Pokemon from PokeAPI
      const pokemonWithBattleData = {
        id: pokemon.id,
        name: pokemon.name,
        sprites: pokemon.sprites,
        cries: pokemon.cries,
        types: pokemon.types,
        stats: pokemon.stats,
        moves: pokemon.moves,
        abilities: pokemon.abilities,
        currHP:
          pokemon.stats.find((stat) => stat.stat.name === "hp")?.base_stat || 0,
      };

      // Debug: Log formatted Pokemon data
      console.log("Formatted Pokemon data:", pokemonWithBattleData);

      setPlayerPokemon((prev) => {
        const newState = [...prev, pokemonWithBattleData];
        console.log("Updated player Pokemon state:", newState);
        return newState;
      });

      // Update battle data for the new Pokemon
      updateBattleData(pokemon.id, {
        images: pokemon.sprites,
        sounds: pokemon.cries,
        stats: pokemon.stats,
        moves: pokemon.moves,
        currHP: pokemonWithBattleData.currHP,
      });
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
    clearTeams: () => {
      setPlayerPokemon([]);
      setOpponentPokemon([]);
    },
  };

  return (
    <BattleContext.Provider value={value}>{children}</BattleContext.Provider>
  );
};
