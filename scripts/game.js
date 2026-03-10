import { yokaiDatabase } from './yokaiDictionary.js';
import { preloadYokaiImage, getImageUrl } from './yokaiImageManager.js';
import { saveGame, loadGame, exportSave, importSave, hardReset } from './save.js';
import { showView, toggleMenu, restoreLastView } from './uiManager.js';

let currentWildYokai = null;
export const medallium = [];

const elements = {
    status:        document.getElementById("radar-status"),
    wildYokaiDiv:  document.getElementById("wild-yokai"),
    scanBtn:       document.getElementById("scan-btn"),
    yokaiName:     document.getElementById("yokai-name"),
    yokaiRank:     document.getElementById("yokai-rank"),
    yokaiTribe:    document.getElementById("yokai-tribe"),
    yokaiImg:      document.getElementById("yokai-img"),
    medalliumCount: document.getElementById("medallium-count"),
    medalliumList:  document.getElementById("medallium-list"),
    medalliumEmpty: document.getElementById("medallium-empty"),
    searchInput:    document.getElementById("search-yokai"),
};

async function scanYokai() {
    elements.status.innerText = "La montre réagit... !";
    elements.scanBtn.classList.add("hidden");

    const randomYokai = yokaiDatabase[Math.floor(Math.random() * yokaiDatabase.length)];
    const finalImageUrl = await preloadYokaiImage(randomYokai.id);

    setTimeout(() => {
        currentWildYokai = randomYokai;

        elements.yokaiName.innerText = currentWildYokai.name;
        elements.yokaiRank.innerText = `Rang ${currentWildYokai.rank}`;
        elements.yokaiTribe.innerText = currentWildYokai.tribe;
        elements.yokaiImg.src = finalImageUrl;

        elements.status.innerText = `Un ${currentWildYokai.name} sauvage apparaît !`;
        elements.wildYokaiDiv.classList.remove("hidden");
    }, 800);
}

function attemptBefriend() {
    if (!currentWildYokai) return;

    const isCaught = Math.random() < currentWildYokai.catchRate;
    elements.wildYokaiDiv.classList.add("hidden");

    if (isCaught) {
        elements.status.innerText = `Bingo ! ${currentWildYokai.name} te donne son médaillon !`;
        medallium.push(currentWildYokai);
        updateMedalliumDisplay();
        saveGame(medallium);
    } else {
        elements.status.innerText = `Zut... ${currentWildYokai.name} s'est enfui.`;
    }

    currentWildYokai = null;
    setTimeout(() => {
        elements.status.innerText = "Prêt à scanner les environs.";
        elements.scanBtn.classList.remove("hidden");
    }, 2500);
}

function ignoreYokai() {
    if (!currentWildYokai) return;
    elements.status.innerText = `Tu t'es enfui de ${currentWildYokai.name}...`;
    elements.wildYokaiDiv.classList.add("hidden");
    currentWildYokai = null;
    setTimeout(() => {
        elements.status.innerText = "Prêt à scanner les environs.";
        elements.scanBtn.classList.remove("hidden");
    }, 1500);
}

export function updateMedalliumDisplay() {
    if (!elements.medalliumList || !elements.medalliumCount) return;

    elements.medalliumList.innerHTML = "";
    elements.medalliumCount.innerText = medallium.length;

    const searchTerm = elements.searchInput?.value.toLowerCase() || "";
    const filtered = medallium.filter(y => y.name.toLowerCase().includes(searchTerm));

    if (elements.medalliumEmpty) {
        elements.medalliumEmpty.classList.toggle("hidden", filtered.length > 0);
    }

    filtered.forEach(yokai => {
        const slot = document.createElement("div");
        slot.classList.add("medal-slot");

        slot.innerHTML = `
            <div class="medal-circle tribe-${yokai.tribe.toLowerCase()}">
                <img src="${getImageUrl(yokai.id)}" alt="${yokai.name}" loading="lazy">
            </div>
            <span class="medal-name">${yokai.name}</span>
            <span class="medal-rank">Rang ${yokai.rank}</span>
        `;
        elements.medalliumList.appendChild(slot);
    });
}

globalThis.scanYokai      = scanYokai;
globalThis.attemptBefriend = attemptBefriend;
globalThis.ignoreYokai    = ignoreYokai;
globalThis.showView       = showView;
globalThis.toggleMenu     = toggleMenu;
globalThis.exportSave     = () => exportSave(medallium);
globalThis.importSave     = (e) => importSave(e, medallium, updateMedalliumDisplay);
globalThis.hardReset      = () => hardReset(medallium, updateMedalliumDisplay);

elements.searchInput?.addEventListener("input", updateMedalliumDisplay);

loadGame(medallium, updateMedalliumDisplay);
restoreLastView();