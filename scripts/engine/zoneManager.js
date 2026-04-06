import { YOKAI_DATABASE } from '../data.js';
import { ZONES } from '../resources/zones/zones.js';

/**
 * Retourne la liste des clés de zones principales déverrouillées
 */
export function getUnlockedMainZones() {
    return Object.entries(ZONES)
        .filter(([, zone]) => zone.unlocked)
        .map(([key, zone]) => ({ key, name: zone.name }));
}

/**
 * Retourne les sous-zones déverrouillées d'une zone principale
 */
export function getUnlockedSubZones(mainZoneKey) {
    const zone = ZONES[mainZoneKey];
    if (!zone || !zone.subZones) return [];
    return Object.entries(zone.subZones)
        .filter(([, sub]) => sub.unlocked)
        .map(([key, sub]) => ({ key, name: sub.name }));
}

/**
 * Retourne l'objet sous-zone complet
 */
export function getSubZone(mainZoneKey, subZoneKey) {
    return ZONES[mainZoneKey]?.subZones?.[subZoneKey] ?? null;
}

/**
 * Tire aléatoirement count Yo-Kai depuis un pool d'IDs
 */
export function getRandomYokaiFromPool(pool, count) {
    if (!pool || pool.length === 0) return [];
    const selected = [];
    for (let i = 0; i < count; i++) {
        const randomId = pool[Math.floor(Math.random() * pool.length)];
        const yokai = YOKAI_DATABASE.find(y => y.id === randomId);
        if (yokai && !selected.find(s => s.id === yokai.id)) {
            selected.push({ ...yokai });
        }
    }
    return selected;
}

/**
 * Déverrouille une zone principale
 */
export function unlockMainZone(mainZoneKey) {
    if (ZONES[mainZoneKey]) {
        ZONES[mainZoneKey].unlocked = true;
        Object.keys(ZONES[mainZoneKey].subZones).forEach(subKey => {
            ZONES[mainZoneKey].subZones[subKey].unlocked = true;
        });
    }
}

/**
 * Déverrouille une sous-zone spécifique
 */
export function unlockSubZone(mainZoneKey, subZoneKey) {
    if (ZONES[mainZoneKey]?.subZones?.[subZoneKey]) {
        ZONES[mainZoneKey].subZones[subZoneKey].unlocked = true;
    }
}