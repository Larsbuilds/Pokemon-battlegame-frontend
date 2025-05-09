import { useBattle } from "../../context/BattleContext";

const ActivePokemon = ({ playerPkmn, oppPkmn }) => {
  if (!playerPkmn || !oppPkmn) return null;

  return (
    <div className="flex gap-[12vw] relative mt-44">
      <img
        className="w-[120px]"
        src={playerPkmn?.sprites?.other?.showdown?.back_default}
        alt={playerPkmn.name}
      ></img>
      <img
        className="w-[100px]  relative -top-10"
        src={oppPkmn?.sprites?.other?.showdown?.front_default}
        alt={oppPkmn.name}
      ></img>
    </div>
  );
};

export default ActivePokemon;
