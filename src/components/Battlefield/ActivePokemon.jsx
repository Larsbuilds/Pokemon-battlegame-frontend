import { useBattle } from "../../context/BattleContext";

const ActivePokemon = ({ playerPkmn, oppPkmn }) => {
  if (!playerPkmn || !oppPkmn) return null;

  return (
    <div className="flex gap-[8vw] relative mt-44">
      <img
        className="size-[160px]"
        src={playerPkmn?.sprites?.other?.showdown?.back_default}
        alt={playerPkmn.name}
      ></img>
      <img
        className="size-[150px] relative -top-10"
        src={oppPkmn?.sprites?.other?.showdown?.front_default}
        alt={oppPkmn.name}
      ></img>
    </div>
  );
};

export default ActivePokemon;
