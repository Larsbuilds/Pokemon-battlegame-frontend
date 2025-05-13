import { useState, useEffect } from "react";
import gPokeballs from "../../assets/pokeballs.png";
import Arena from "./Arena";
import PlayerOverview from "./PlayerOverview";
import ActionButtons from "./ActionButtons";
import { useBattle } from "../../context/BattleContext";
import ActivePokemon from "./ActivePokemon";
import HealthBar from "./HealthBar";
import { startBattle } from "../../utils/battleLogic.jsx";
import { switchPokemon } from "../../utils/switchPokemon.jsx";
import BattleResultModal from "../BattleResultModal";

const Battlescreen = () => {
  const {
    opponentPokemon,
    playerPokemon,
    setPlayerPokemon,
    setOpponentPokemon,
    recordBattle,
    calculateScoreChange,
  } = useBattle();

  const [playerActivePokemon, setPlayerActivePokemon] = useState(null);
  const [oppActivePokemon, setOppActivePokemon] = useState(null);
  const [showMsg, setShowMsg] = useState(false);
  const [battleResult, setBattleResult] = useState(null);
  const [battleMessage, setBattleMessage] = useState("");

  useEffect(() => {
    if (playerActivePokemon) {
      setShowMsg(true);
      const timer = setTimeout(() => {
        setShowMsg(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [playerActivePokemon]);

  useEffect(() => {
    if (playerPokemon?.length > 0) {
      setPlayerActivePokemon(playerPokemon[0]);
    }
    if (opponentPokemon?.length > 0) {
      setOppActivePokemon(opponentPokemon[0]);
    }
  }, []);

  const handleBattleEnd = (isWin) => {
    const scoreChange = calculateScoreChange(playerPokemon, opponentPokemon, isWin);
    setBattleResult({ isWin, scoreChange });
    recordBattle(isWin);
  };

  const handleBattleMessage = (message) => {
    setBattleMessage(message);
    // Clear message after 3 seconds
    setTimeout(() => setBattleMessage(""), 3000);
  };

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
        {battleMessage && (
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 bg-white/90 rounded-md p-3 font-bold animate-riseFade z-[9999] shadow-xl text-center min-w-[200px]">
            <p>{battleMessage}</p>
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
              recordBattle: handleBattleEnd,
              onBattleMessage: handleBattleMessage,
            })
          }
        />
      </div>
      {battleResult && (
        <BattleResultModal
          isWin={battleResult.isWin}
          scoreChange={battleResult.scoreChange}
        />
      )}
    </div>
  );
};

export default Battlescreen;
