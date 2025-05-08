import { useState, useEffect, useContext } from "react";
import gPokeballs from "../../assets/pokeballs.png";
import Arena from "./Arena";
import PlayerOverview from "./PlayerOverview";
import ActionButtons from "./ActionButtons";
import { useBattle } from "../../context/BattleContext";

const Battlescreen = () => {
  const { opponentPokemon, battleData } = useBattle();

  const [playerPokemon, setPlayerPokemon] = useState([]);
  const [oppPokemon, setOppPokemon] = useState([]);
  const [playerActivePokemon, SetPlayerActivePokemon] = useState(null);
  const [oppActivePokemon, SetOppActivePokemon] = useState(null);

  useEffect(() => {
    if (opponentPokemon.length > 0) {
      const updated = opponentPokemon.map((e) => ({
        ...e,
        currLife: e.stats[0].base_stat,
      }));
      setPlayerPokemon(updated);
      console.log("Player ", playerPokemon);
    }
  }, []);

  console.log("Opponent", opponentPokemon);
  console.log("BattleData", battleData);

  return (
    <div className="bg-cyan-950 p-4">
      <div
        style={{
          backgroundImage: `url(${gPokeballs})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className=" h-full w-full flex flex-col justify-center items-center align-middle"
      >
        <div className="z-50 absolute w-[1120px] flex justify-between">
          <PlayerOverview player={1} pokemon={opponentPokemon} />
          <PlayerOverview player={2} pokemon={opponentPokemon} />
        </div>
        {/* <div className="z-50 absolute h-[566px] flex align-bottom">
          
        </div> */}
        <Arena />
        <ActionButtons />
      </div>
    </div>
  );
};

export default Battlescreen;
