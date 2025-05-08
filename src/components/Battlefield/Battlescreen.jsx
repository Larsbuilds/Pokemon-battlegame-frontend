import { useState, useEffect } from "react";
import gPokeballs from "../../assets/pokeballs.png";
import Arena from "./Arena";
import PlayerOverview from "./PlayerOverview";
import ActionButtons from "./ActionButtons";

const Battlescreen = () => {
  return (
    <div className="bg-cyan-950 p-4">
      <div
        style={{
          backgroundImage: `url(${gPokeballs})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className=" h-full w-full flex flex-col justify-center items-center align-middle"
      >
        <div className="z-50 absolute w-[980px] flex justify-between">
          <PlayerOverview player={1} />
          <PlayerOverview player={2} />
        </div>
        {/* <div className="z-50 absolute h-[566px] flex align-bottom">
          
        </div> */}
        <Arena />
        <ActionButtons />
      </div>
    </div>
  );
};

export default Battlescreen;
