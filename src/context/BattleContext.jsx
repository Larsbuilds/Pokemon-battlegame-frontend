import React, { createContext, useContext, useState, useEffect } from "react";

const BattleContext = createContext();

export const useBattle = () => {
  const context = useContext(BattleContext);
  if (!context) {
    throw new Error("useBattle must be used within a BattleProvider");
  }
  return context;
};

export const BattleProvider = ({ children }) => {
  const [opponentPokemon, setOpponentPokemon] = useState([]);
  const [battleData, setBattleData] = useState({});

  // Load battle data and opponent team from localStorage on initial render
  useEffect(() => {
    try {
      const savedBattleData = localStorage.getItem("pokemonBattleData");
      const savedOpponentTeam = localStorage.getItem("opponentTeam");

      if (savedBattleData) {
        setBattleData(JSON.parse(savedBattleData));
      }
      if (savedOpponentTeam) {
        setOpponentPokemon(JSON.parse(savedOpponentTeam));
      }
    } catch (error) {
      console.error("Error loading battle data:", error);
    }
  }, []);

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
            sprites: {
              front_default: data.images?.front_default,
              back_default: data.images?.back_default,
            },
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

  // Save opponent team to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("opponentTeam", JSON.stringify(opponentPokemon));
    } catch (error) {
      console.error("Error saving opponent team:", error);
    }
  }, [opponentPokemon]);

  const updateBattleData = (pokemonId, data) => {
    setBattleData((prev) => ({
      ...prev,
      [pokemonId]: {
        ...prev[pokemonId],
        ...data,
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
        const updatedTeam = [...opponentPokemon];
        updatedTeam[index] = newPokemon[0];
        setOpponentPokemon(updatedTeam);

        // Update battle data for the new Pokemon
        updateBattleData(newPokemon[0].id, {
          images: newPokemon[0].sprites,
          sounds: newPokemon[0].cries,
          stats: newPokemon[0].stats,
          moves: newPokemon[0].moves,
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

        const team = [...strongPokemon, ...mediumPokemon, ...weakPokemon];
        setOpponentPokemon(team);

        // Store battle data for each opponent Pokemon
        team.forEach((pokemon) => {
          updateBattleData(pokemon.id, {
            images: pokemon.sprites,
            sounds: pokemon.cries,
            stats: pokemon.stats,
            moves: pokemon.moves,
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

  const value = {
    opponentPokemon,
    battleData,
    updateBattleData,
    generateOpponentTeam,
    replaceOpponentPokemon,
  };

  return (
    <BattleContext.Provider value={value}>{children}</BattleContext.Provider>
  );
};
