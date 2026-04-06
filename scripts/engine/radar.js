const RADAR_KEY = "yokaichill_radar";
const RADAR_DURATION = 15 * 60 * 1000; // 15 minutes

/**
 * Récupère l'état radar depuis le localStorage
 */
export function getRadarState(mainZoneKey, subZoneKey) {
    const key = `${RADAR_KEY}_${mainZoneKey}_${subZoneKey}`;
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

/**
 * Sauvegarde l'état radar pour une sous-zone
 */
export function saveRadarState(mainZoneKey, subZoneKey, yokaiList) {
    const key = `${RADAR_KEY}_${mainZoneKey}_${subZoneKey}`;
    const expiresAt = Date.now() + RADAR_DURATION;
    localStorage.setItem(key, JSON.stringify({ yokai: yokaiList, expiresAt }));
    return expiresAt;
}

/**
 * Supprime un Yo-Kai du radar après combat (fuite ou capture)
 */
export function removeYokaiFromRadar(mainZoneKey, subZoneKey, yokaiId) {
    const key = `${RADAR_KEY}_${mainZoneKey}_${subZoneKey}`;
    const raw = localStorage.getItem(key);
    if (!raw) return;
    try {
        const state = JSON.parse(raw);
        state.yokai = state.yokai.filter(y => y.id !== yokaiId);
        localStorage.setItem(key, JSON.stringify(state));
    } catch { /* */ }
}

/**
 * Formate le temps restant en mm:ss
 */
export function formatTimeRemaining(ms) {
    if (ms <= 0) return "00:00";
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}