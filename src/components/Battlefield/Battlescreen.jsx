import { useState, useEffect, useContext } from "react";
import gPokeballs from "../../assets/pokeballs.png";
import Arena from "./Arena";
import PlayerOverview from "./PlayerOverview";
import ActionButtons from "./ActionButtons";
import { useBattle } from "../../context/BattleContext";
import ActivePokemon from "./ActivePokemon";
import HealthBar from "./HealthBar";
import { startBattle } from "../../utils/battleLogic.jsx";
import { switchPokemon } from "../../utils/switchPokemon.jsx";

const Battlescreen = () => {
  const {
    opponentPokemon,
    battleData,
    playerPokemon,
    setPlayerPokemon,
    setOpponentPokemon,
  } = useBattle();

  const [playerActivePokemon, setPlayerActivePokemon] = useState(null);
  const [oppActivePokemon, setOppActivePokemon] = useState(null);
  const [showMsg, setShowMsg] = useState(false);

  useEffect(() => {
    if (playerActivePokemon) {
      setShowMsg(true);
      const timer = setTimeout(() => {
        setShowMsg(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [playerActivePokemon]);

  console.log("PLAYER ", playerPokemon);

  useEffect(() => {
    if (playerPokemon?.length > 0) {
      setPlayerActivePokemon(playerPokemon[0]);
    }
    if (opponentPokemon?.length > 0) {
      setOppActivePokemon(opponentPokemon[0]);
    }
  }, []);

  // console.log("Opponent", opponentPokemon);
  // console.log("Player", playerPokemon);

  return (
    <div className="bg-cyan-950 p-4">
      <div
        style={{
          backgroundImage: `url(${gPokeballs})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className=" h-full w-full flex flex-col justify-center items-center relative"
      >
        {showMsg && (
          <div
            key={playerActivePokemon?.id}
            className="absolute -translate-y-1/2 bg-white rounded-md p-2 font-bold animate-riseFade z-[9999] shadow-xl"
          >
            <p>Go, {playerActivePokemon?.name.toUpperCase()} !!!</p>
          </div>
        )}
        <div className="z-50 absolute w-[1120px] flex items-center justify-between px-8">
          <PlayerOverview
            player={1}
            pokemon={playerPokemon}
            playerActivePokemon={playerActivePokemon}
            oppActivePokemon={oppActivePokemon}
          />
          <div className="flex-1 flex justify-center">
            <div className="flex flex-col h-[65vh] relative">
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
          <PlayerOverview
            player={2}
            pokemon={opponentPokemon}
            playerActivePokemon={playerActivePokemon}
            oppActivePokemon={oppActivePokemon}
          />
        </div>
        <Arena />
        <ActionButtons
          switchPokemon={switchPokemon}
          playerPokemon={playerPokemon}
          playerActivePokemon={playerActivePokemon}
          setPlayerActivePokemon={setPlayerActivePokemon}
          startBattle={() =>
            startBattle({
              playerActivePokemon,
              setPlayerActivePokemon,
              setPlayerPokemon,
              oppActivePokemon,
              opponentPokemon,
              setOppActivePokemon,
              setOpponentPokemon,
              switchPokemon,
              playerPokemon,
            })
          }
        />
      </div>
    </div>
  );
};

export default Battlescreen;
