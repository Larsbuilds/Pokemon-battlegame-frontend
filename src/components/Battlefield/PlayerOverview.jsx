import gP1 from "../../assets/p1.png";
import gP2 from "../../assets/p2.png";
import { useEffect } from "react";

const PlayerOverview = ({
  player,
  pokemon,
  playerActivePokemon,
  oppActivePokemon,
  playerName,
  score,
  wins,
  losses,
}) => {
  const markActivePokemon = (e) => {
    const isActive =
      player === 1
        ? e.id === playerActivePokemon?.id
        : e.id === oppActivePokemon?.id;
    return isActive ? "bg-red-400 rounded-full" : "";
  };

  const markDeadPokemon = (e) => {
    return e.currHP <= 0 ? "opacity-25" : "";
  };
  console.log("Playername ", playerName);
  console.log("Score ", score);
  console.log("wins ", wins);
  console.log("losses ", losses);

  return (
    <div className="relative -top-8">
      <img
        className="rounded-full shadow-2xl relative top-8 mx-auto size-[65%]"
        src={player === 1 ? gP1 : gP2}
      ></img>
      <div className="bg-white rounded-lg p-4">
        <p className="mt-8 font-bold text-center">
          {playerName ? playerName : "POKé TRAINER"}
        </p>
        <div className="grid grid-cols-2 w-full items-center gap-1">
          {pokemon?.map((e, index) => (
            <div key={`${e.id}-${index}`} className="">
              <img
                className={`w-[55px] mx-auto  ${markActivePokemon(
                  e
                )} ${markDeadPokemon(e)}`}
                src={e.sprites?.other?.[`official-artwork`].front_default}
                alt={e.name}
              />
            </div>
          ))}
        </div>
        {player === 1 ? (
          <>
            <div className="w-full">
              <div className="w-full h-[1px] my-4 bg-black"></div>
              <p className="text-center font-semibold">{score}Points</p>
              <div className="flex gap-2">
                <p>Won: {wins}</p>
                <p>Lost: {losses}</p>
              </div>
            </div>
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default PlayerOverview;
