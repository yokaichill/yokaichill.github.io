import { yokaiDatabase } from './data.js';
import { saveGame, loadGame, exportSave, importSave, hardReset } from './save.js';

let currentWildYokai = null;
export let medallium = [];

const elements = {
    status: document.getElementById("radar-status"),
    wildYokaiDiv: document.getElementById("wild-yokai"),
    scanBtn: document.getElementById("scan-btn"),
    yokaiName: document.getElementById("yokai-name"),
    yokaiRank: document.getElementById("yokai-rank"),
    yokaiTribe: document.getElementById("yokai-tribe"),
    medalliumList: document.getElementById("medallium-list"),
    medalliumCount: document.getElementById("medallium-count")
};

function scanYokai() {
    elements.status.innerText = "La montre réagit... !";
    elements.scanBtn.classList.add("hidden");
    setTimeout(() => {
        currentWildYokai = yokaiDatabase[Math.floor(Math.random() * yokaiDatabase.length)];
        elements.yokaiName.innerText = currentWildYokai.name;
        elements.yokaiRank.innerText = `Rang ${currentWildYokai.rank}`;
        elements.yokaiTribe.innerText = currentWildYokai.tribe;
        elements.status.innerText = `Un ${currentWildYokai.name} sauvage apparaît !`;
        elements.wildYokaiDiv.classList.remove("hidden");
    }, 800);
}

function attemptBefriend() {
    const isCaught = Math.random() < currentWildYokai.catchRate;
    elements.wildYokaiDiv.classList.add("hidden");
    if (isCaught) {
        elements.status.innerText = `Bingo ! ${currentWildYokai.name} te donne son médaillon !`;
        medallium.push(currentWildYokai);
        updateMedalliumDisplay();
        saveGame(medallium);
    } else {
        elements.status.innerText = `Zut... ${currentWildYokai.name} a mangé et s'est enfui.`;
    }
    currentWildYokai = null;
    setTimeout(() => {
        elements.status.innerText = "Prêt à scanner les environs.";
        elements.scanBtn.classList.remove("hidden");
    }, 2500);
}

export function updateMedalliumDisplay() {
    elements.medalliumList.innerHTML = "";
    elements.medalliumCount.innerText = medallium.length;
    medallium.forEach(yokai => {
        const el = document.createElement("div");
        el.classList.add("medal");
        el.innerHTML = `${yokai.name}<br>(${yokai.rank})`;
        elements.medalliumList.appendChild(el);
    });
}

// Expose to HTML onclick handlers
globalThis.scanYokai = scanYokai;
globalThis.attemptBefriend = attemptBefriend;
globalThis.exportSave = () => exportSave(medallium);
globalThis.importSave = (e) => importSave(e, medallium, updateMedalliumDisplay);
globalThis.hardReset = () => hardReset(medallium, updateMedalliumDisplay);

loadGame(medallium, updateMedalliumDisplay);