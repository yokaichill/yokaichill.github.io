const SAVE_KEY = 'yokaichill_save_v2';

/**
 * Structure de sauvegarde complète
 */
function buildSaveData(state) {
    return {
        version: 2,
        lastSaved: Date.now(),
        medallium: state.medallium,
        team: state.team,
        inventory: state.inventory,
        money: state.money,
        watchLevel: state.watchLevel,
        currentMainZone: state.currentMainZone,
        currentSubZone: state.currentSubZone,
        unlockedZones: state.unlockedZones,
        stats: state.stats
    };
}

export function saveGame(data) {
try {
        const jsonString = JSON.stringify(data);
        const uint8array = new TextEncoder().encode(jsonString);
        const binString = Array.from(uint8array, (byte) => String.fromCodePoint(byte)).join("");
        const base64Save = btoa(binString);
        
        localStorage.setItem('myGameSave', base64Save);
    } catch (e) {
        console.error("Erreur de sauvegarde :", e);
    }
}

export function loadGame() {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(atob(raw));
    } catch (e) {
        console.error("Sauvegarde corrompue :", e);
        return null;
    }
}

export function exportSave(state) {
    saveGame(state);
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return;
    const blob = new Blob([raw], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `yokaichill_${new Date().toISOString().split('T')[0]}.yck`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

export async function importSave(file) {
    try {
        const content = await file.text();
        const data = JSON.parse(atob(content.trim()));
        if (!data.medallium || !data.version) throw new Error("Format invalide");
        localStorage.setItem(SAVE_KEY, content.trim());
        return data;
    } catch (e) {
        console.error("Import échoué :", e);
        return null;
    }
}

export function hardReset() {
    // Supprime toutes les clés yokaichill
    Object.keys(localStorage)
        .filter(k => k.startsWith('yokaichill'))
        .forEach(k => localStorage.removeItem(k));
}