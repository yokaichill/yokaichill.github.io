const SAVE_KEY = 'yokaichill_save_data';

export function saveGame(medallium) {
    const gameData = { medallium, lastSaved: Date.now() };
    localStorage.setItem(SAVE_KEY, btoa(JSON.stringify(gameData)));
    console.log("Jeu sauvegardé !");
}

export function loadGame(medallium, updateMedalliumDisplay) {
    const savedString = localStorage.getItem(SAVE_KEY);
    if (!savedString) return console.log("Aucune sauvegarde trouvée.");

    try {
        const gameData = JSON.parse(atob(savedString));
        if (gameData.medallium) {
            medallium.length = 0;
            medallium.push(...gameData.medallium);
        }
        updateMedalliumDisplay();
        console.log("Sauvegarde chargée !");
    } catch (e) {
        console.error("Sauvegarde corrompue.", e);
        alert("Erreur de lecture de la sauvegarde locale.");
    }
}

export function exportSave(medallium, updateMedalliumDisplayFn) {
    saveGame(medallium);
    const savedString = localStorage.getItem(SAVE_KEY);
    if (!savedString) return alert("Rien à exporter !");

    const blob = new Blob([savedString], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `yokaichill_save_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

export async function importSave(event, medallium, updateMedalliumDisplay) {
    const file = event.target.files[0];
    if (!file) return;
    try {
        const fileContent = await file.text();
        const testParse = JSON.parse(atob(fileContent.trim()));
        if (testParse.medallium) {
            localStorage.setItem(SAVE_KEY, fileContent.trim());
            loadGame(medallium, updateMedalliumDisplay);
            alert("Sauvegarde importée !");
        } else {
            alert("Fichier invalide : pas de données Yokaichill.");
        }
    } catch (e) {
        alert("Fichier invalide.");
        console.error(e);
    }
    event.target.value = "";
}

export function hardReset(medallium, updateMedalliumDisplay) {
    if (confirm("⚠️ Tu vas perdre tous tes Yo-kai. Es-tu sûr ?")) {
        localStorage.removeItem(SAVE_KEY);
        medallium.length = 0;
        updateMedalliumDisplay();
        alert("Partie effacée !");
    }
}