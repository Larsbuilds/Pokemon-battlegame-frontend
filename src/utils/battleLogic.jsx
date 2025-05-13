import { switchEnemy } from "./switchPokemon";

// Type effectiveness chart
const TYPE_EFFECTIVENESS = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5 },
  fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
  ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
  poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
  flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
  rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
  fairy: { fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 }
};

// Calculate type effectiveness multiplier
const calculateTypeEffectiveness = (attackerTypes, defenderTypes) => {
  let multiplier = 1;
  
  // For each attacker type
  attackerTypes.forEach(attackerType => {
    // For each defender type
    defenderTypes.forEach(defenderType => {
      // Handle both string types and object types
      const attackerTypeName = typeof attackerType === 'string' ? attackerType : attackerType.type.name;
      const defenderTypeName = typeof defenderType === 'string' ? defenderType : defenderType.type.name;
      const effectiveness = TYPE_EFFECTIVENESS[attackerTypeName]?.[defenderTypeName] || 1;
      multiplier *= effectiveness;
    });
  });
  
  return multiplier;
};

// Calculate damage with all factors
const calculateDamage = (attacker, defender) => {
  // Base stats
  const attack = attacker.stats[1].base_stat; // Attack stat
  const defense = defender.stats[2].base_stat; // Defense stat
  
  // Random factor between 0.85 and 1.00
  const randomFactor = 0.85 + Math.random() * 0.15;
  
  // Critical hit chance (5%)
  const isCritical = Math.random() < 0.05;
  const criticalMultiplier = isCritical ? 1.5 : 1;
  
  // Type effectiveness
  const typeMultiplier = calculateTypeEffectiveness(attacker.types, defender.types);
  
  // Calculate final damage
  const damage = Math.floor(
    ((attack / defense) * 50 * typeMultiplier * criticalMultiplier * randomFactor) + 10
  );
  
  return {
    damage,
    isCritical,
    typeMultiplier
  };
};

export function startBattle({
  playerActivePokemon,
  setPlayerActivePokemon,
  setPlayerPokemon,
  oppActivePokemon,
  opponentPokemon,
  setOppActivePokemon,
  setOpponentPokemon,
  switchPokemon,
  playerPokemon,
  recordBattle,
  onBattleMessage,
}) {
  if (!playerActivePokemon || !oppActivePokemon) return;

  // Player's attack
  const playerAttack = calculateDamage(playerActivePokemon, oppActivePokemon);
  const newOppHp = oppActivePokemon.currHP - playerAttack.damage;

  setOppActivePokemon((prev) => ({
    ...prev,
    currHP: newOppHp < 0 ? 0 : newOppHp,
  }));

  setOpponentPokemon((prevTeam) =>
    prevTeam.map((pokemon) =>
      pokemon.id === oppActivePokemon.id
        ? { ...pokemon, currHP: newOppHp < 0 ? 0 : newOppHp }
        : pokemon
    )
  );

  // Create battle message with type effectiveness
  let battleMessage = `${playerActivePokemon.name} does ${playerAttack.damage} damage to ${oppActivePokemon.name}`;
  if (playerAttack.isCritical) {
    battleMessage += " (Critical Hit!)";
  }
  if (playerAttack.typeMultiplier > 1) {
    battleMessage += " (Super Effective!)";
  } else if (playerAttack.typeMultiplier < 1) {
    battleMessage += " (Not Very Effective...)";
  }
  onBattleMessage?.(battleMessage);

  // Check if opponent's team is defeated
  const isOpponentDefeated = opponentPokemon.every(pokemon => pokemon.currHP <= 0);
  if (isOpponentDefeated) {
    onBattleMessage?.("Battle won! Opponent team defeated.");
    recordBattle(true); // Record victory
    return;
  }

  if (newOppHp <= 0) {
    onBattleMessage?.(`${oppActivePokemon.name} defeated.`);
    switchEnemy({ opponentPokemon, oppActivePokemon, setOppActivePokemon });
    return;
  }

  // Opponent's attack
  const oppAttack = calculateDamage(oppActivePokemon, playerActivePokemon);
  const newPlayerHp = playerActivePokemon.currHP - oppAttack.damage;

  setPlayerActivePokemon((prev) => ({
    ...prev,
    currHP: newPlayerHp < 0 ? 0 : newPlayerHp,
  }));

  setPlayerPokemon((prevTeam) =>
    prevTeam.map((pokemon) =>
      pokemon.id === playerActivePokemon.id
        ? { ...pokemon, currHP: newPlayerHp < 0 ? 0 : newPlayerHp }
        : pokemon
    )
  );

  // Create opponent's battle message
  let oppBattleMessage = `${oppActivePokemon.name} does ${oppAttack.damage} damage to ${playerActivePokemon.name}`;
  if (oppAttack.isCritical) {
    oppBattleMessage += " (Critical Hit!)";
  }
  if (oppAttack.typeMultiplier > 1) {
    oppBattleMessage += " (Super Effective!)";
  } else if (oppAttack.typeMultiplier < 1) {
    oppBattleMessage += " (Not Very Effective...)";
  }
  onBattleMessage?.(oppBattleMessage);

  // Check if player's team is defeated
  const isPlayerDefeated = playerPokemon.every(pokemon => pokemon.currHP <= 0);
  if (isPlayerDefeated) {
    onBattleMessage?.("Battle lost! Player team defeated.");
    recordBattle(false); // Record defeat
    return;
  }

  if (newPlayerHp <= 0) {
    onBattleMessage?.(`${playerActivePokemon.name} defeated.`);
    switchPokemon({
      playerPokemon,
      playerActivePokemon,
      setPlayerActivePokemon,
    });
  }
}
