import { ZONES } from './resources/zones/zones.js';
import { STATE, changeZone, startCombat, doAttack, doFlee, acceptFriend, initRadar } from './game.js';
import { on } from './engine/events.js';

// ─── Navigation ───────────────────────────────────────────────────────────────

const VIEWS = ['zone', 'medallium', 'team', 'inventory', 'save'];

function showView(name) {
    VIEWS.forEach(v => {
        document.getElementById(`view-${v}`)?.classList.toggle('hidden', v !== name);
    });
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === name);
    });
}

/**
 * Retourne le HTML approprié pour une icône (Image ou Émoji)
 * @param {Object} attr - L'objet tribu, élément ou rang
 * @returns {string} HTML string
 */
function getIconHTML(attr) {
    if (!attr) return '';
    
    // Priorité aux nouvelles clés d'images, sinon repli sur l'émoji
    const iconPath = attr.yokai_tribe_image || attr.rank_icon || attr.elements_icon || attr.icon || attr.emoji;
    
    if (!iconPath) return '';

    if (iconPath.includes('.') || iconPath.includes('/')) {
        return `<img src="${iconPath}" class="icon-asset" alt="${attr.name}" onerror="this.style.display='none'">`;
    }
    
    return `<span>${iconPath}</span>`;
}

// ─── Zone ─────────────────────────────────────────────────────────────────────

function renderZone() {
    const zone = ZONES[STATE.currentMainZone];
    const sub  = zone?.subZones?.[STATE.currentSubZone];

    document.getElementById('zone-main-name').textContent = zone?.name ?? '—';
    document.getElementById('zone-sub-name').textContent  = sub?.name  ?? '—';

    const mainSel = document.getElementById('sel-main-zone');
    mainSel.innerHTML = '';
    Object.entries(ZONES).forEach(([key, z]) => {
        const opt = document.createElement('option');
        opt.value     = key;
        opt.textContent = z.unlocked ? z.name : `🔒 ${z.name}`;
        opt.disabled = !z.unlocked;
        opt.selected = key === STATE.currentMainZone;
        mainSel.appendChild(opt);
    });

    renderSubZoneSelector();
}

function renderSubZoneSelector() {
    const subSel = document.getElementById('sel-sub-zone');
    subSel.innerHTML = '';
    const zone = ZONES[STATE.currentMainZone];
    if (!zone?.subZones) return;

    Object.entries(zone.subZones).forEach(([key, sub]) => {
        const opt = document.createElement('option');
        opt.value       = key;
        opt.textContent = sub.unlocked ? sub.name : `🔒 ${sub.name}`;
        opt.disabled    = !sub.unlocked;
        opt.selected    = key === STATE.currentSubZone;
        subSel.appendChild(opt);
    });
}

// ─── Radar ────────────────────────────────────────────────────────────────────

function renderRadar() {
    const container = document.getElementById('radar-yokai-list');
    container.innerHTML = '';

    if (STATE.radarYokai.length === 0) {
        container.innerHTML = '<p class="radar-empty">Aucun Yo-Kai détecté.</p>';
        return;
    }

    STATE.radarYokai.forEach(yokai => {
        const card = document.createElement('div');
        card.className = 'yokai-encounter-card';
        card.innerHTML = `
            <div class="yokai-enc-info">
                <span class="yokai-enc-name">${yokai.name}</span>
                
                <span class="badge rank" style="background:${yokai.rank?.color ?? '#888'}">
                    ${getIconHTML(yokai.rank)}
                </span>
                
                <span class="badge tribe" style="background:${yokai.tribe?.color ?? '#888'}">
                    ${getIconHTML(yokai.tribe)} ${yokai.tribe?.name ?? ''}
                </span>
                
                <span class="badge element" style="background:${yokai.element?.color ?? '#888'}">
                    ${getIconHTML(yokai.element)} ${yokai.element?.name ?? 'Neutre'}
                </span>
                
            </div>
            <button class="fight-btn">⚔️ Combattre</button>
        `;
        card.querySelector('.fight-btn').addEventListener('click', () => startCombat(yokai));
        container.appendChild(card);
    });
}

function updateRadarTimer(timeStr) {
    const el = document.getElementById('radar-timer');
    if (el) el.textContent = `Prochain scan : ${timeStr}`;
}

// ─── Médallium ────────────────────────────────────────────────────────────────

function renderMedallium() {
    const list  = document.getElementById('medallium-list');
    const count = document.getElementById('medallium-count');
    list.innerHTML = '';
    count.textContent = STATE.medallium.length;

    if (STATE.medallium.length === 0) {
        list.innerHTML = '<p class="empty-msg">Aucun Yo-Kai rencontré pour l\'instant.</p>';
        return;
    }

    STATE.medallium.forEach(yokai => {
        const medal = document.createElement('div');
        medal.className = 'medal';
        medal.style.setProperty('--tribe-color', yokai.tribe?.color ?? '#F4A261');
        medal.innerHTML = `
            <span class="medal-emoji">${getIconHTML(yokai.tribe)}</span>
            <span class="medal-name">${yokai.name}</span>
            <span class="medal-rank" style="color:${yokai.rank?.color ?? '#fff'}">${getIconHTML(yokai.rank)}</span>
        `;
        medal.addEventListener('click', () => showYokaiDetail(yokai));
        list.appendChild(medal);
    });
}

function showYokaiDetail(yokai) {
    const panel = document.getElementById('yokai-detail-panel');
    panel.innerHTML = `
        <div class="detail-header" style="--tribe-color:${yokai.tribe?.color ?? '#457B9D'}">
            <button class="close-btn" id="close-detail">✕</button>
            <div class="detail-tribe-badge">${getIconHTML(yokai.tribe)} ${yokai.tribe?.name ?? ''}</div>
            <h2 class="detail-name">${yokai.name}</h2>
            <div class="detail-badges">
                <span class="badge rank" style="background:${yokai.rank?.color ?? '#888'}">${getIconHTML(yokai.rank)} Rang ${yokai.rank?.id ?? '?'}</span>
                <span class="badge element" style="background:${yokai.element?.color ?? '#888'}">${getIconHTML(yokai.element)} ${yokai.element?.name ?? 'Neutre'}</span>
            </div>
        </div>
        <div class="detail-body">
            <p class="detail-desc">${yokai.description ?? ''}</p>
            ${yokai.baseStats ? `
            <div class="stats-grid">
                <div class="stat-item"><span>❤️ PV</span><strong>${yokai.baseStats.hp}</strong></div>
                <div class="stat-item"><span>⚔️ Force</span><strong>${yokai.baseStats.strength}</strong></div>
                <div class="stat-item"><span>✨ Esprit</span><strong>${yokai.baseStats.spirit}</strong></div>
                <div class="stat-item"><span>🛡️ Défense</span><strong>${yokai.baseStats.defense}</strong></div>
                <div class="stat-item"><span>💨 Vitesse</span><strong>${yokai.baseStats.speed}</strong></div>
            </div>` : ''}
            ${yokai.soultimate ? `
            <div class="soultimate-box">
                <h4>Amûltime : ${yokai.soultimate.name}</h4>
                <p>${yokai.soultimate.description}</p>
            </div>` : ''}
        </div>
    `;
    panel.classList.remove('hidden');
    document.getElementById('close-detail').addEventListener('click', () => panel.classList.add('hidden'));
}

// ─── Équipe ───────────────────────────────────────────────────────────────────

function renderTeam() {
    const container = document.getElementById('team-list');
    container.innerHTML = '';

    for (let i = 0; i < 6; i++) {
        const slot  = document.createElement('div');
        slot.className = 'team-slot';
        const yokai = STATE.team[i];

        if (yokai) {
            slot.innerHTML = `
                <div class="team-slot-inner" style="--tribe-color:${yokai.tribe?.color ?? '#ccc'}">
                    <span class="slot-emoji">${getIconHTML(yokai.tribe)}</span>
                    <span class="slot-name">${yokai.name}</span>
                    <span class="slot-rank" style="color:${yokai.rank?.color ?? '#333'}">${getIconHTML(yokai.rank)}</span>
                    <button class="release-btn" data-idx="${i}">🔓</button>
                </div>
            `;
            slot.querySelector('.release-btn').addEventListener('click', (e) => {
                const idx = parseInt(e.currentTarget.dataset.idx);
                if (confirm(`Relâcher ${STATE.team[idx].name} ?`)) {
                    STATE.team.splice(idx, 1);
                    renderTeam();
                }
            });
        } else {
            slot.innerHTML = `<div class="team-slot-empty">— Vide —</div>`;
        }
        container.appendChild(slot);
    }
}

// ─── Inventaire & Argent ──────────────────────────────────────────────────────

function renderInventory() {
    const container = document.getElementById('inventory-list');
    container.innerHTML = STATE.inventory.length === 0
        ? '<p class="empty-msg">Inventaire vide.</p>'
        : STATE.inventory.map(item => `<div class="item-card">${item.name}</div>`).join('');
}

function renderMoney() {
    const el = document.getElementById('money-display');
    if (el) el.textContent = `${STATE.money} 💰`;
}

// ─── Combat ───────────────────────────────────────────────────────────────────

function openCombatPanel(enemy) {
    const panel = document.getElementById('combat-panel');
    panel.classList.remove('hidden');

    document.getElementById('combat-enemy-name').textContent = enemy.name;
    updateCombatHP(enemy);
    document.getElementById('combat-log').innerHTML = `<p>Un ${enemy.name} sauvage apparaît !</p>`;

    const ally         = STATE.team[0];
    const techContainer = document.getElementById('combat-techniques');
    techContainer.innerHTML = '';

    if (ally?.techniques) {
        ally.techniques.forEach(tech => {
            const btn = document.createElement('button');
            btn.className   = 'tech-btn';
            // Utilisation de getIconHTML pour les éléments des techniques
            btn.innerHTML = `${getIconHTML(tech.element)} ${tech.name} (${tech.power})`;
            btn.addEventListener('click', () => doAttack(tech));
            techContainer.appendChild(btn);
        });
    }
}

function updateCombatHP(enemy) {
    document.getElementById('combat-enemy-hp').textContent =
        `❤️ ${enemy.currentHp} / ${enemy.baseStats.hp}`;
    const pct = Math.max(0, enemy.currentHp / enemy.baseStats.hp * 100);
    const bar = document.getElementById('combat-hp-bar');
    if (bar) bar.style.width = pct + '%';
}

function addCombatLog(msg) {
    const log = document.getElementById('combat-log');
    const p   = document.createElement('p');
    p.textContent = msg;
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
}

function closeCombatPanel() {
    document.getElementById('combat-panel').classList.add('hidden');
}

// ─── Demande d'amitié ─────────────────────────────────────────────────────────

function showFriendRequest(yokai) {
    const overlay = document.getElementById('friend-request-overlay');
    document.getElementById('friend-request-name').textContent = yokai.name;
    overlay.classList.remove('hidden');

    document.getElementById('friend-accept').onclick = () => {
        overlay.classList.add('hidden');
        acceptFriend(yokai);
    };
    document.getElementById('friend-refuse').onclick = () => {
        overlay.classList.add('hidden');
    };
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function showToast(msg, type = 'info') {
    const toast = document.createElement('div');
    toast.className   = `toast toast-${type}`;
    toast.textContent = msg;
    document.getElementById('toast-container').appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// ─── Abonnements aux événements du bus ───────────────────────────────────────

on('render:all',            () => { renderZone(); renderMedallium(); renderTeam(); renderInventory(); renderMoney(); });
on('zone:changed',          () => { renderZone(); });
on('radar:updated',         () => { renderRadar(); });
on('radar:tick',            (t) => updateRadarTimer(t));
on('medallium:updated',     () => { renderMedallium(); });
on('team:updated',          () => { renderTeam(); });
on('money:updated',         () => { renderMoney(); });
on('combat:open',           (enemy) => openCombatPanel(enemy));
on('combat:hp_updated',     (enemy) => updateCombatHP(enemy));
on('combat:log',            (msg)   => addCombatLog(msg));
on('combat:close',          () => closeCombatPanel());
on('combat:friend_request', (yokai) => showFriendRequest(yokai));
on('toast',                 (msg, type) => showToast(msg, type));

// ─── Exposition globale pour le HTML ─────────────────────────────────────────

globalThis.showView = showView;

globalThis.onMainZoneChange = () => {
    const key     = document.getElementById('sel-main-zone').value;
    const subKeys = Object.keys(ZONES[key]?.subZones ?? {});
    if (subKeys.length > 0) changeZone(key, subKeys[0]);
};

globalThis.onSubZoneChange = () => {
    const sub = document.getElementById('sel-sub-zone').value;
    changeZone(STATE.currentMainZone, sub);
};