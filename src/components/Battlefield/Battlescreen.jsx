import { useState, useEffect, useContext } from "react";
import gPokeballs from "../../assets/pokeballs.png";
import Arena from "./Arena";
import PlayerOverview from "./PlayerOverview";
import ActionButtons from "./ActionButtons";
import { useBattle } from "../../context/BattleContext";
import ActivePokemon from "./ActivePokemon";
import HealthBar from "./HealthBar";

const Battlescreen = () => {
  const { opponentPokemon, battleData, playerPokemon } = useBattle();

  const [playerActivePokemon, setPlayerActivePokemon] = useState(null);
  const [oppActivePokemon, setOppActivePokemon] = useState(null);

  const switchPokemon = () => {
    const currIndex = playerPokemon.findIndex(
      (poke) => poke.id === playerActivePokemon.id
    );

    let nextIndex = (currIndex + 1) % playerPokemon.length;
    setPlayerActivePokemon(playerPokemon[nextIndex]);
    console.log("Next Pokemon Nr", nextIndex);
  };

  useEffect(() => {
    if (playerPokemon?.length > 0) {
      setPlayerActivePokemon(playerPokemon[0]);
    }
    if (opponentPokemon?.length > 0) {
      setOppActivePokemon(opponentPokemon[0]);
    }
  }, [playerPokemon, opponentPokemon]);

  console.log("Opponent", opponentPokemon);
  console.log("Player", playerPokemon);

  return (
    <div className="bg-cyan-950 p-4">
      <div
        style={{
          backgroundImage: `url(${gPokeballs})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className=" h-full w-full flex flex-col justify-center items-center"
      >
        <div className="z-50 absolute w-[1120px] flex items-center justify-between px-8">
          <PlayerOverview player={1} pokemon={playerPokemon} />
          <div className="flex-1 flex justify-center">
            <div className="flex flex-col h-[65vh]">
              <HealthBar
                playerPkmn={playerActivePokemon}
                oppPkmn={oppActivePokemon}
              />
              <ActivePokemon
                playerPkmn={playerActivePokemon}
                oppPkmn={oppActivePokemon}
              />
            </div>
          </div>
          <PlayerOverview player={2} pokemon={opponentPokemon} />
        </div>
        <Arena />
        <ActionButtons
          switchPokemon={switchPokemon}
          // oppActivePokemon={oppActivePokemon}
          // setOppActivePokemon={setOppActivePokemon}
          // playerActivePokemon={playerActivePokemon}
          // setPlayerActivePokemon={setPlayerActivePokemon}
        />
      </div>
    </div>
  );
};

export default Battlescreen;
