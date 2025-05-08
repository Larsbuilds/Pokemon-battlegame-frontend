import gP1 from "../../assets/p1.png";
import gP2 from "../../assets/p2.png";

const PlayerOverview = ({ player }) => {
  return (
    <div>
      <div className="bg-white rounded-lg p-4">
        <img
          className="rounded-full shadow-2xl absolute -top-20"
          src={player === 1 ? gP1 : gP2}
        ></img>
        <div className="mt-8">
          POKEMON
          <br />
          POKEMON
          <br />
          POKEMON
          <br />
          POKEMON
          <br />
          POKEMON
          <br />
          POKEMON
          <br />
          <div className="w-full h-[1px] my-4 bg-black"></div>
          <p className="text-center font-semibold">200 Points</p>
          <div className="flex gap-2">
            <p>Won: 1</p>
            <p>Lost: 2</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerOverview;
