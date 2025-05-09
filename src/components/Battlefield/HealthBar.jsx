import { useEffect, useState } from "react";

const HealthBar = ({ playerPkmn, oppPkmn }) => {
  if (!playerPkmn || !oppPkmn) return null;

  const calculateHealthBar = (poke) => {
    if (!poke || poke.stats[0].base_stat <= 0) return 0;
    const maxHealth = poke.stats[0].base_stat;
    return (poke.currHP / maxHealth) * 100;
  };

  const oppHealthBarWidth = calculateHealthBar(oppPkmn);
  const playerHealthBarWidth = calculateHealthBar(playerPkmn);

  return (
    <div className="bg-white rounded-md flex gap-4 px-4 py-2 justify-between">
      <div className="w-full">
        <p className="font-bold text-center">{playerPkmn.name.toUpperCase()}</p>
        <div
          style={{ width: `${playerHealthBarWidth}%` }}
          className={`bg-red-400 h-[10px] mt-1 rounded-full drop-shadow-xl`}
        ></div>
      </div>
      <p className="font-bold text-2xl">VS</p>
      <div className="w-full">
        <p className="font-bold text-center">{oppPkmn.name.toUpperCase()}</p>
        <div
          style={{ width: `${oppHealthBarWidth}%` }}
          className={`bg-red-400 h-[10px] mt-1 rounded-full drop-shadow-xl`}
        ></div>
      </div>
    </div>
  );
};

export default HealthBar;
