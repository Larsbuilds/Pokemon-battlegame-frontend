import gSwords from "../../assets/icon_swords.svg";
import gSwitch from "../../assets/icon_switch.svg";

const ActionButtons = ({
  // oppActivePokemon,
  // setOppActivePokemon,
  // playerActivePokemon,
  // setPlayerActivePokemon,
  switchPokemon,
}) => {
  return (
    <div className="flex gap-4 relative -top-5">
      <button
        onClick={() => switchPokemon()}
        className="bg-white py-2 px-3 rounded-md drop-shadow-sm flex gap-2"
      >
        <img src={gSwitch}></img>
        <p>Switch Pokemon</p>
      </button>
      <button className="bg-red-400 py-2 px-3 rounded-md drop-shadow-sm flex gap-2">
        <img src={gSwords}></img>
        <p>Attack!</p>
      </button>
    </div>
  );
};

export default ActionButtons;
