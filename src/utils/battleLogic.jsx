import { switchEnemy } from "./switchPokemon";
import { useBattle } from "../context/BattleContext";

export function startBattle({
  playerActivePokemon,
  setPlayerActivePokemon,
  setPlayerPokemon,
  oppActivePokemon,
  opponentPokemon,
  setOppActivePokemon,
  setOpponentPokemon,
  switchPokemon,
  playerPokemon,
  recordBattle,
}) {
  if (!playerActivePokemon || !oppActivePokemon) return;

  const playerDamage =
    playerActivePokemon.stats[1].base_stat +
    Math.floor(Math.random() * 10) +
    10;

  const newOppHp = oppActivePokemon.currHP - playerDamage;

  setOppActivePokemon((prev) => ({
    ...prev,
    currHP: newOppHp < 0 ? 0 : newOppHp,
  }));

  setOpponentPokemon((prevTeam) =>
    prevTeam.map((pokemon) =>
      pokemon.id === oppActivePokemon.id
        ? { ...pokemon, currHP: newOppHp < 0 ? 0 : newOppHp }
        : pokemon
    )
  );

  console.log(
    `${playerActivePokemon.name} does ${playerDamage} damage to ${oppActivePokemon.name}`
  );

  // Check if opponent's team is defeated
  const isOpponentDefeated = opponentPokemon.every(pokemon => pokemon.currHP <= 0);
  if (isOpponentDefeated) {
    console.log("Battle won! Opponent team defeated.");
    recordBattle(true); // Record victory
    return;
  }

  if (newOppHp <= 0) {
    console.log(`${oppActivePokemon.name} defeated.`);
    switchEnemy({ opponentPokemon, oppActivePokemon, setOppActivePokemon });
    return;
  }

  // OPPONENT ATTACK
  const oppDamage =
    oppActivePokemon.stats[1].base_stat + Math.floor(Math.random() * 10) + 10;

  const newPlayerHp = playerActivePokemon.currHP - oppDamage;

  setPlayerActivePokemon((prev) => ({
    ...prev,
    currHP: newPlayerHp < 0 ? 0 : newPlayerHp,
  }));

  setPlayerPokemon((prevTeam) =>
    prevTeam.map((pokemon) =>
      pokemon.id === playerActivePokemon.id
        ? { ...pokemon, currHP: newPlayerHp < 0 ? 0 : newPlayerHp }
        : pokemon
    )
  );

  console.log(
    `${oppActivePokemon.name} does ${oppDamage} damage to ${playerActivePokemon.name}`
  );

  // Check if player's team is defeated
  const isPlayerDefeated = playerPokemon.every(pokemon => pokemon.currHP <= 0);
  if (isPlayerDefeated) {
    console.log("Battle lost! Player team defeated.");
    recordBattle(false); // Record defeat
    return;
  }

  if (newPlayerHp <= 0) {
    console.log(`${playerActivePokemon.name} defeated.`);
    switchPokemon({
      playerPokemon,
      playerActivePokemon,
      setPlayerActivePokemon,
    });
  }
}
