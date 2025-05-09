export const switchPokemon = ({
  playerPokemon,
  playerActivePokemon,
  setPlayerActivePokemon,
}) => {
  if (
    !playerPokemon ||
    !Array.isArray(playerPokemon) ||
    playerPokemon.length === 0
  ) {
    console.error("playerPokemon is not defined or empty");
    return;
  }
  if (!playerPokemon || playerPokemon.length === 0) return; // Verhindern, dass bei fehlendem Pokémon weitergearbeitet wird
  const alivePkmn = playerPokemon.filter((e) => e.currHP > 0);
  // console.log("Alive ", alivePkmn);

  if (alivePkmn.length === 0) {
    console.log("No alive Pokémon left to switch to.");
    return;
  }

  const currIndex = alivePkmn.findIndex(
    (poke) => poke.id === playerActivePokemon.id
  );

  let nextIndex = (currIndex + 1) % alivePkmn.length;

  setPlayerActivePokemon(alivePkmn[nextIndex]);
  // console.log("Next Pokemon Nr", nextIndex);
};

export const switchEnemy = ({
  opponentPokemon,
  oppActivePokemon,
  setOppActivePokemon,
}) => {
  console.log(oppActivePokemon);
  const alivePkmn = opponentPokemon.filter((e) => e.currHP > 0);
  // console.log("Alive ", alivsePkmn);

  const currIndex = alivePkmn.findIndex(
    (poke) => poke.id === oppActivePokemon.id
  );

  let nextIndex = (currIndex + 1) % alivePkmn.length;

  setOppActivePokemon(alivePkmn[nextIndex]);
  // console.log("Next Pokemon Nr", nextIndex);
};
