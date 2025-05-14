import { useState, useEffect, useRef } from "react";
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
    score,
    wins,
    losses,
  } = useBattle();

  const [playerActivePokemon, setPlayerActivePokemon] = useState(null);
  const [oppActivePokemon, setOppActivePokemon] = useState(null);
  const [showMsg, setShowMsg] = useState(false);
  const [battleResult, setBattleResult] = useState(null);
  const [battleMessage, setBattleMessage] = useState("");

  const [playerAnimation, setPlayerAnimation] = useState(null);
  const [opponentAnimation, setOpponentAnimation] = useState(null);
  const [blockFighting, setBlockFighting] = useState(false);

  //Battle Message Queue
  const [battleMessageList, setBattleMessageList] = useState([]);
  const [messageQueue, setMessageQueue] = useState([]);
  const [currentMessage, setCurrentMessage] = useState(null);
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const messageTimeoutRef = useRef(null);

  //handle pokemon switch messages
  useEffect(() => {
    if (playerActivePokemon) {
      setShowMsg(true);
      const timer = setTimeout(() => {
        setShowMsg(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [playerActivePokemon]);

  //Initial fighting pokemon
  useEffect(() => {
    if (playerPokemon?.length > 0) {
      setPlayerActivePokemon(playerPokemon[0]);
    }
    if (opponentPokemon?.length > 0) {
      setOppActivePokemon(opponentPokemon[0]);
    }
  }, []);

  //display battle messages

  useEffect(() => {
    if (messageQueue.length > 0 && !currentMessage) {
      const nextMsg = messageQueue[0];
      setCurrentMessage(nextMsg);
      setIsMessageVisible(true);

      messageTimeoutRef.current = setTimeout(() => {
        setIsMessageVisible(false);

        setTimeout(() => {
          setCurrentMessage(null);
          setMessageQueue((prevQueue) => prevQueue.slice(1));
        }, 500);
      }, 2000);
    }

    return () => {
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }
    };
  }, [messageQueue, currentMessage]);

  const handleBattleEnd = (isWin) => {
    const scoreChange = calculateScoreChange(
      playerPokemon,
      opponentPokemon,
      isWin
    );
    setBattleResult({ isWin, scoreChange });
    recordBattle(isWin);
  };

  const handleBattleMessage = (message) => {
    setMessageQueue((prevQueue) => {
      if (prevQueue.some((msg) => msg.text === message)) {
        return prevQueue;
      }
      return [...prevQueue, { id: crypto.randomUUID(), text: message }];
    });
  };

  return (
    <div className="bg-cyan-950 h-full p-4">
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
            className="absolute -ml-96 -translate-y-1/3 bg-white rounded-md p-2 font-bold animate-riseFade z-[9999] shadow-xl"
          >
            <p>Go, {playerActivePokemon?.name.toUpperCase()} !!!</p>
          </div>
        )}
        {currentMessage && (
          <div
            key={currentMessage.id}
            className={`absolute left-1/2 -translate-x-1/2 bg-white/90 rounded-md p-3 font-bold z-[9999] shadow-xl text-center min-w-[200px]
      transition-opacity duration-500 ${
        isMessageVisible ? "opacity-100 animate-riseFade" : "opacity-0"
      }`}
          >
            {console.log("Rendering message:", currentMessage)}
            <p>{currentMessage.text}</p>
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
                playerAnimation={playerAnimation}
                opponentAnimation={opponentAnimation}
              />
            </div>
          </div>
          <PlayerOverview
            player={2}
            pokemon={opponentPokemon}
            playerActivePokemon={playerActivePokemon}
            oppActivePokemon={oppActivePokemon}
            score={score}
            wins={wins}
            losses={losses}
          />
        </div>
        <Arena />
        <ActionButtons
          switchPokemon={switchPokemon}
          playerPokemon={playerPokemon}
          playerActivePokemon={playerActivePokemon}
          setPlayerActivePokemon={setPlayerActivePokemon}
          blockFighting={blockFighting}
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
              setPlayerAnimation,
              setOpponentAnimation,
              setBlockFighting,
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
