import { useState, useEffect } from "react";
import gBg from "../../assets/bg.png";
import gSwords from "../../assets/icon_swords.svg";
import gSwitch from "../../assets/icon_switch.svg";
import gP1 from "../../assets/p1.png";
import gP2 from "../../assets/p2.png";
import gPokeballs from "../../assets/pokeballs.png";

const Arena = () => {
  return (
    <div
      style={{
        backgroundImage: `url(${gBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className=" h-[566px] w-[944px] mx-auto my-auto rounded-[25px] shadow flex justify-center items-center align-middle"
    ></div>
  );
};

export default Arena;
