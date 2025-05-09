import { useEffect, useState } from "react";

const HealthBar = ({ playerPkmn, oppPkmn }) => {
  if (!playerPkmn || !oppPkmn) return null;

  useEffect(() => {
    playerHealth();
    oppHealth;
  }, [playerPkmn.currHP, oppPkmn.currHP]);

  const playerHealth = () => {
    const barLength = (100 / playerPkmn.stats[0].base_stat) * playerPkmn.currHP;
    return `${barLength}`;
  };

  const oppHealth = () => {
    const barLength = (100 / oppPkmn.stats[0].base_stat) * oppPkmn.currHP;
    return `${barLength}`;
  };

  return (
    <div className="bg-white rounded-md flex gap-4 px-4 py-2 justify-between">
      <div className="w-full">
        <p className="font-bold text-center">{playerPkmn.name.toUpperCase()}</p>
        <div
          style={{ width: playerHealth() }}
          className={`bg-red-400 h-[10px] mt-1 rounded-full drop-shadow-xl`}
        ></div>
      </div>
      <p className="font-bold text-2xl">VS</p>
      <div className="w-full">
        <p className="font-bold text-center">{oppPkmn.name.toUpperCase()}</p>
        <div
          style={{ width: oppHealth() }}
          className={`bg-red-400 h-[10px] mt-1 rounded-full drop-shadow-xl`}
        ></div>
      </div>
    </div>
  );
};

export default HealthBar;
