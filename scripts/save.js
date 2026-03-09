/* global medallium, updateMedalliumDisplay */ // Dit à SonarLint que ces variables viennent de game.js

const SAVE_KEY = 'yokaichill_save_data';

// 1. Sauvegarde Interne (Automatique)
function saveGame() {
    const gameData = {
        medallium: medallium,
        lastSaved: Date.now() // CORRECTION 1: Plus moderne que new Date().getTime()
    };
    
    const jsonString = JSON.stringify(gameData);
    const encodedSave = btoa(jsonString);
    
    localStorage.setItem(SAVE_KEY, encodedSave);
    console.log("Jeu sauvegardé (Base64) !");
}

// 2. Chargement Interne (Automatique au démarrage)
function loadGame() {
    const savedString = localStorage.getItem(SAVE_KEY);
    
    if (savedString) {
        try {
            const decodedString = atob(savedString);
            const gameData = JSON.parse(decodedString);
            
            if (gameData.medallium) {
                // CORRECTION 2: On vide le tableau et on le remplit proprement au lieu de l'écraser
                medallium.length = 0; 
                medallium.push(...gameData.medallium);
            }
            console.log("Sauvegarde chargée avec succès !");
            updateMedalliumDisplay();
        } catch (error) {
            console.error("Erreur critique : La sauvegarde est corrompue.", error);
            alert("Erreur de lecture de la sauvegarde locale.");
        }
    } else {
        console.log("Aucune sauvegarde trouvée, nouvelle partie.");
    }
}

// 3. Exporter la sauvegarde (Fichier .txt)
function exportSave() {
    saveGame();
    const savedString = localStorage.getItem(SAVE_KEY);
    
    if (!savedString) return alert("Rien à exporter !");

    const blob = new Blob([savedString], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    const date = new Date().toISOString().split('T')[0];
    a.download = `yokaichill_save_${date}.txt`;
    
    document.body.appendChild(a);
    a.click();
    
    a.remove(); // CORRECTION 3: Syntaxe moderne pour supprimer l'élément
    URL.revokeObjectURL(url);
}

// 4. Importer la sauvegarde (Depuis le fichier .txt)
// CORRECTION 5: Utilisation de async/await et file.text()
async function importSave(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
        const fileContent = await file.text(); // Remplace le vieux FileReader
        const decodedString = atob(fileContent.trim());
        const testParse = JSON.parse(decodedString);
        
        // CORRECTION 4: Condition plus propre (vérifie juste que ça existe)
        if (testParse.medallium) {
            localStorage.setItem(SAVE_KEY, fileContent.trim());
            loadGame();
            alert("Sauvegarde importée avec succès !");
        } else {
            alert("Le fichier ne contient pas de données Yokaichill.");
        }
    } catch (error) {
        alert("Fichier invalide. Assure-toi d'importer un fichier .txt de sauvegarde valide.");
        console.error(error);
    }
    
    event.target.value = "";
}

// 5. Hard Reset
function hardReset() {
    if (confirm("⚠️ ATTENTION : Tu vas perdre tous tes Yo-kai et recommencer à zéro. Es-tu sûr ?")) {
        localStorage.removeItem(SAVE_KEY);
        medallium.length = 0;
        updateMedalliumDisplay();
        alert("Partie effacée. Bon courage pour tout recommencer !");
    }
}