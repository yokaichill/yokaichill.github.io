import { ELEMENTS } from '../resources/yokai/elements.js';

/**
 * Calcule le multiplicateur élémentaire entre attaque et défenseur
 */
export function getElementMultiplier(attackElement, defenderElement) {
    if (!attackElement || !defenderElement || defenderElement.id === 'NONE') return 1.0;
    if (attackElement.strongAgainst?.includes(defenderElement.id)) return 1.5;
    if (defenderElement.strongAgainst?.includes(attackElement.id)) return 0.5;
    return 1.0;
}

/**
 * Calcule les dégâts d'une attaque
 */
export function calculateDamage(attacker, technique, defender) {
    const base = technique.type === 'attack'
        ? attacker.currentStats.strength
        : attacker.currentStats.spirit;

    const def = defender.currentStats.defense;
    const elementMult = getElementMultiplier(technique.element, defender.element);
    const variance = 0.9 + Math.random() * 0.2; // ±10%

    const damage = Math.max(1, Math.floor(
        ((base * 2 + technique.power) / (def + 1)) * elementMult * variance
    ));
    return { damage, elementMult };
}

/**
 * Initialise les stats de combat d'un Yo-Kai (HP courants etc.)
 */
export function initCombatStats(yokai) {
    return {
        ...yokai,
        currentStats: {
            hp: yokai.baseStats.hp,
            strength: yokai.baseStats.strength,
            spirit: yokai.baseStats.spirit,
            defense: yokai.baseStats.defense,
            speed: yokai.baseStats.speed
        },
        currentHp: yokai.baseStats.hp,
        orbeCharge: 0  // 0-100, l'Amûltime se charge pendant le combat
    };
}

/**
 * Charge l'orbe de l'Amûltime (augmente à chaque action)
 */
export function chargeOrbe(combatant, amount = 10) {
    combatant.orbeCharge = Math.min(100, combatant.orbeCharge + amount);
    return combatant.orbeCharge >= 100;
}

/**
 * Calcule le taux de capture effectif (influencé par HP restants)
 */
export function calculateCatchChance(yokai, baseRate) {
    const hpRatio = yokai.currentHp / yokai.baseStats.hp;
    // Plus le Yo-Kai a peu de HP, plus la chance augmente
    const bonus = (1 - hpRatio) * 0.3;
    return Math.min(0.95, baseRate + bonus);
}

/**
 * Détermine les récompenses de fin de combat
 */
export function getCombatRewards(defeatedYokai) {
    const [minMoney, maxMoney] = defeatedYokai.moneyYield;
    const money = Math.floor(minMoney + Math.random() * (maxMoney - minMoney));
    const exp = defeatedYokai.expYield;
    return { exp, money };
}

/**
 * Calcule si un Yo-Kai tente de devenir ami
 */
export function tryBefriend(yokai) {
    return Math.random() < yokai.catchRate;
}