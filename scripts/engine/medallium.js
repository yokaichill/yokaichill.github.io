/**
 * Ajoute un Yo-Kai au médallium si pas déjà présent
 * Retourne true si ajouté, false si déjà connu
 */
export function registerYokai(medallium, yokai) {
    if (medallium.some(y => y.id === yokai.id)) return false;
    medallium.push({ id: yokai.id, name: yokai.name, tribe: yokai.tribe, rank: yokai.rank, element: yokai.element });
    return true;
}

/**
 * Vérifie si un Yo-Kai est connu dans le médallium
 */
export function isKnown(medallium, yokaiId) {
    return medallium.some(y => y.id === yokaiId);
}

/**
 * Retourne le nombre total de Yo-Kai enregistrés
 */
export function getCount(medallium) {
    return medallium.length;
}