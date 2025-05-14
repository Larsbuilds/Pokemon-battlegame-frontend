import { useState, useEffect } from "react";

export const useFetchPlayers = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      const url = "http://localhost:3000/leaderboard";
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Error while fetching players:  ${response.status}`);
        }
        const res = await response.json();
        // console.log(res);
        setData(res);
      } catch (error) {
        console.error(error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  return { data, loading, error };
};

export const checkExistingPlayerByName = (data, name) => {
  let existingPlayer = false;
  data.forEach((player) => {
    if (player.name === name) existingPlayer = true;
  });
  return existingPlayer;
};

export const createPlayer = async (player) => {
  const url = "http://localhost:3000/leaderboard";
  try {
    const create = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: player.name,
      }),
    });
    if (!create.ok) {
      throw new Error(`Error while creating player:  ${create.status}`);
    }
    const res = await create.json();
    return res;
  } catch (error) {
    console.error(error.message);
    return { error: error.message };
  }
};

export const editPlayer = async (player) => {
  const url = "http://localhost:3000/leaderboard";
  if (!player) console.log("Player not defined while editing");

  try {
    const edit = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: player.name,
        scores: player.scores,
        wins: player.wins,
        losses: player.losses,
        totalBattles: player.totalBattles,
        recentBattle: player.recentBattle,
        scoreChange: player.scoreChange,
      }),
    });
    if (!edit.ok) {
      throw new Error(`Error while editing player:  ${edit.status}`);
    }
    const res = await edit.json();
    return res;
  } catch (error) {
    console.error(error.message);
    return { error: error.message };
  }
};
