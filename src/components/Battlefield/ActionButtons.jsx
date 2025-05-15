import gSwords from "../../assets/icon_swords.svg";
import gSwitch from "../../assets/icon_switch.svg";

const ActionButtons = ({
  oppActivePokemon,
  playerActivePokemon,
  switchPokemon,
  startBattle,
  playerPokemon,
  setPlayerActivePokemon,
  blockFighting,
}) => {
  console.log("Player in ActionB ", playerPokemon);
  return (
    <div className="flex gap-4 relative -top-5">
      <button
        onClick={() =>
          switchPokemon({
            playerPokemon,
            playerActivePokemon,
            setPlayerActivePokemon,
          })
        }
        className="bg-white  hover:bg-blue-200 hover:-translate-y-1 hover:drop-shadow-2xl py-2 px-3 rounded-md drop-shadow-sm flex gap-2"
      >
        <img src={gSwitch}></img>
        <p>Switch Pokemon</p>
      </button>
      <button
        onClick={() => {
          console.log("⚔️ startBattle triggered");
          startBattle();
        }}
        disabled={blockFighting ? true : false}
        className="bg-red-400 hover:bg-blue-200 hover:-translate-y-1 hover:drop-shadow-2xl py-2 px-3 rounded-md drop-shadow-sm flex gap-2 disabled:bg-slate-500 disabled:text-slate-300"
      >
        <img src={gSwords}></img>
        <p>Attack!</p>
      </button>
    </div>
  );
};

export default ActionButtons;
