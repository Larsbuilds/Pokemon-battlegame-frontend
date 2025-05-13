import { useBattle } from "../../context/BattleContext";
import { useRef, useEffect } from "react";

const ActivePokemon = ({
  playerPkmn,
  oppPkmn,
  playerAnimation,
  opponentAnimation,
}) => {
  const playerRef = useRef(null);
  const opponentRef = useRef(null);

  useEffect(() => {
    const playerEl = playerRef.current;
    const opponentEl = opponentRef.current;
    if (!playerEl || !playerAnimation?.type) return;

    const cleanup = () => {
      playerEl.classList.remove("animate-attack-left", "animate-faint");
      opponentEl?.classList.remove("animate-hit");
      playerEl.removeEventListener("animationend", cleanup);
    };

    if (playerAnimation.type === "attack") {
      playerEl.classList.add("animate-attack-left");
      opponentEl?.classList.add("animate-hit");
    } else if (playerAnimation.type === "faint") {
      playerEl.classList.add("animate-faint");
    }

    playerEl.addEventListener("animationend", cleanup);
  }, [playerAnimation?.id]);

  useEffect(() => {
    const oppEl = opponentRef.current;
    const playerEl = playerRef.current;
    if (!oppEl || !opponentAnimation?.type) return;

    const cleanup = () => {
      oppEl.classList.remove("animate-attack-right", "animate-faint");
      playerEl?.classList.remove("animate-hit");
      oppEl.removeEventListener("animationend", cleanup);
    };

    if (opponentAnimation.type === "attack") {
      oppEl.classList.add("animate-attack-right");
      playerEl?.classList.add("animate-hit");
    } else if (opponentAnimation.type === "faint") {
      oppEl.classList.add("animate-faint");
    }

    oppEl.addEventListener("animationend", cleanup);
  }, [opponentAnimation?.id]);

  if (!playerPkmn || !oppPkmn) return null;

  return (
    <>
      <style>{`
        @keyframes attack-right {
          0% { transform: scale(2) translateX(0); }
          50% { transform: scale(2) translateX(-50px); }
          100% { transform: scale(2) translateX(0); }
        }

        @keyframes attack-left {
          0% { transform: scale(1.8) translateX(0); }
          50% { transform: scale(1.8) translateX(50px); }
          100% { transform: scale(1.8) translateX(0); }
        }

        @keyframes faint {
          0% { opacity: 1; transform: translateY(0) rotate(0); }
          15% { transform: translateY(-10px) rotate(-10deg); }
          30% { transform: translateY(10px) rotate(10deg); }
          45% { transform: translateY(-10px) rotate(-10deg); }
          65% { opacity: 0; transform: translateY(20px) rotate(0); }
          100% { opacity: 0; transform: translateY(20px) rotate(0); }
        }

        @keyframes hit {
          0%, 100% { opacity: 1; transform: scale(1); }
          25% { opacity: 0.3; transform: scale(1.05); }
          35% { opacity: 1;  }
          45% { opacity: 0.3;  }
          50% { opacity: 1; transform: scale(0.95); }
          75% { opacity: 0.6; transform: scale(1); }
        }

        .animate-attack-left {
          animation: attack-left 0.4s ease-in-out;
        }

        .animate-attack-right {
          animation: attack-right 0.4s ease-in-out;
        }

        .animate-faint {
          animation: faint 1.5s ease-in-out forwards;
        }

        .animate-hit {
          animation: hit 01.5s ease-in-out;
        }
      `}</style>

      <div className="flex gap-[12vw] mt-40 justify-end items-end">
        <img
          className="scale-[2] object-contain"
          ref={playerRef}
          src={playerPkmn?.sprites?.other?.showdown?.back_default}
          alt={playerPkmn.name}
        ></img>
        <img
          className="scale-[1.8] object-contain relative -top-10"
          ref={opponentRef}
          src={oppPkmn?.sprites?.other?.showdown?.front_default}
          alt={oppPkmn.name}
        ></img>
      </div>
    </>
  );
};

export default ActivePokemon;
