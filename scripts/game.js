// --- ÉTAT DU JEU ---
let currentWildYokai = null;
let medallium = [];

// --- ÉLÉMENTS DU DOM ---
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

// --- FONCTIONS ---

function scanYokai() {
    elements.status.innerText = "La montre réagit... !";
    elements.scanBtn.classList.add("hidden");
    
    // Simuler un petit délai de recherche pour le suspense
    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * yokaiDatabase.length);
        currentWildYokai = yokaiDatabase[randomIndex];

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
    } else {
        elements.status.innerText = `Zut... ${currentWildYokai.name} a mangé et s'est enfui.`;
    }

    currentWildYokai = null;
    
    setTimeout(() => {
        elements.status.innerText = "Prêt à scanner les environs.";
        elements.scanBtn.classList.remove("hidden");
    }, 2500);
}

function updateMedalliumDisplay() {
    elements.medalliumList.innerHTML = ""; 
    elements.medalliumCount.innerText = medallium.length;

    medallium.forEach(yokai => {
        const medalElement = document.createElement("div");
        medalElement.classList.add("medal");
        medalElement.innerHTML = `${yokai.name}<br>(${yokai.rank})`;
        elements.medalliumList.appendChild(medalElement);
    });
}