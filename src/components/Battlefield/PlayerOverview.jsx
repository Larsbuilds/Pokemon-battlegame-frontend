import gP1 from "../../assets/p1.png";
import gP2 from "../../assets/p2.png";

const PlayerOverview = ({ player, pokemon }) => {
  console.log(pokemon);
  return (
    <div className="relative -top-8">
      <img
        className="rounded-full shadow-2xl relative top-8 mx-auto"
        src={player === 1 ? gP1 : gP2}
      ></img>
      <div className="bg-white rounded-lg p-4">
        <div className="mt-8 grid grid-cols-2 w-full items-center gap-1">
          {pokemon?.map((e) => (
            <div key={e.id} className="">
              <img
                className="w-[75px] mx-auto"
                src={e.sprites?.other?.[`official-artwork`].front_default}
                alt={e.name}
              />
            </div>
          ))}
        </div>
        <div className="w-full">
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
