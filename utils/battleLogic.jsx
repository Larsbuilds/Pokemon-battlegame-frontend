export function startBattle({
  playerActivePokemon,
  setPlayerActivePokemon,
  setPlayerPokemon,
  oppActivePokemon,
  setOppActivePokemon,
  setOpponentPokemon,
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

  if (newOppHp <= 0) {
    console.log("Defeat!");
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

  if (newPlayerHp <= 0) {
    console.log("Defeat!");
  }
}
