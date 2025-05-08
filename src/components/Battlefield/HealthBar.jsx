const HealthBar = ({ playerPkmn, oppPkmn }) => {
  if (!playerPkmn || !oppPkmn) return null;
  return (
    <div className="bg-white rounded-md flex gap-4 px-4 py-2 justify-between">
      <div className="w-full">
        <p className="font-bold text-center">{oppPkmn.name}</p>
        <div className="bg-red-400 h-[10px] mt-1 rounded-full drop-shadow-xl"></div>
      </div>
      <p className="font-bold text-2xl">VS</p>
      <div className="w-full">
        <p className="font-bold text-center">{oppPkmn.name}</p>
        <div className="bg-red-400 h-[10px] mt-1 *:rounded-full drop-shadow-xl"></div>
      </div>
    </div>
  );
};

export default HealthBar;
