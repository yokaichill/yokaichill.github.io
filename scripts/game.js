import { ZONES } from './resources/zones/zones.js';
import { saveGame, loadGame, exportSave, importSave, hardReset as resetAll } from './save.js';
import * as ZoneManager from './engine/zoneManager.js';
import * as Radar from './engine/radar.js';
import * as MedalliumEngine from './engine/medallium.js';
import * as Combat from './engine/combat.js';
import { emit } from './engine/events.js';

// ─── État Global ─────────────────────────────────────────────────────────────

export const STATE = {
    medallium: [],
    team: [],
    inventory: [],
    money: 0,
    watchLevel: 1,
    currentMainZone: 'CENTRE_VILLE',
    currentSubZone:  'RACCOURCI_ACADEMIE',
    unlockedZones:   {},
    stats: {
        battlesWon: 0,
        yokaiFriended: 0,
        yokaiCriminalsCaught: 0
    },
    // Runtime (non sauvegardé)
    radarYokai:  [],
    radarTimer:  null,
    radarExpiry: null,
    inCombat:    false,
    currentEnemy: null,
};

// ─── Autosave ─────────────────────────────────────────────────────────────────

let autoSaveInterval = null;

function startAutoSave() {
    if (autoSaveInterval) clearInterval(autoSaveInterval);
    autoSaveInterval = setInterval(() => saveGame(STATE), 60_000);
}

// ─── Chargement ───────────────────────────────────────────────────────────────

function applyLoadedData(data) {
    if (!data) return;
    STATE.medallium       = data.medallium       ?? [];
    STATE.team            = data.team            ?? [];
    STATE.inventory       = data.inventory       ?? [];
    STATE.money           = data.money           ?? 0;
    STATE.watchLevel      = data.watchLevel      ?? 1;
    STATE.currentMainZone = data.currentMainZone ?? 'CENTRE_VILLE';
    STATE.currentSubZone  = data.currentSubZone  ?? 'RACCOURCI_ACADEMIE';
    STATE.unlockedZones   = data.unlockedZones   ?? {};
    STATE.stats           = data.stats           ?? STATE.stats;
}

// ─── Radar ────────────────────────────────────────────────────────────────────

export function initRadar() {
    const { currentMainZone, currentSubZone } = STATE;
    const saved = Radar.getRadarState(currentMainZone, currentSubZone);
    const now = Date.now();

    if (saved && now < saved.expiresAt) {
        STATE.radarYokai  = saved.yokai;
        STATE.radarExpiry = saved.expiresAt;
        startRadarTimer();
        emit('radar:updated');
    } else {
        spawnRadarYokai();
    }
}

function spawnRadarYokai() {
    const { currentMainZone, currentSubZone } = STATE;
    const subZone = ZoneManager.getSubZone(currentMainZone, currentSubZone);
    if (!subZone) return;

    const count = Math.floor(Math.random() * 3) + 1;
    STATE.radarYokai  = ZoneManager.getRandomYokaiFromPool(subZone.yokaiPool, count);
    STATE.radarExpiry = Radar.saveRadarState(currentMainZone, currentSubZone, STATE.radarYokai);

    STATE.radarYokai.forEach(y => {
        if (MedalliumEngine.registerYokai(STATE.medallium, y)) {
            emit('toast', `Nouveau Yo-Kai repéré : ${y.name} !`, 'info');
            emit('medallium:updated');
        }
    });

    startRadarTimer();
    emit('radar:updated');
}

function startRadarTimer() {
    if (STATE.radarTimer) clearInterval(STATE.radarTimer);
    STATE.radarTimer = setInterval(() => {
        const remaining = STATE.radarExpiry - Date.now();
        if (remaining <= 0) {
            clearInterval(STATE.radarTimer);
            spawnRadarYokai();
            return;
        }
        emit('radar:tick', Radar.formatTimeRemaining(remaining));
    }, 1000);
}

// ─── Changement de zone ───────────────────────────────────────────────────────

export function changeZone(mainZoneKey, subZoneKey) {
    if (STATE.inCombat) return;

    const zone = ZONES[mainZoneKey];
    if (!zone?.unlocked) {
        emit('toast', `Zone verrouillée : ${zone?.unlockCondition ?? '?'}`, 'warning');
        return;
    }
    const sub = zone.subZones?.[subZoneKey];
    if (!sub?.unlocked) {
        emit('toast', 'Sous-zone non accessible.', 'warning');
        return;
    }

    STATE.currentMainZone = mainZoneKey;
    STATE.currentSubZone  = subZoneKey;
    saveGame(STATE);

    if (STATE.radarTimer) clearInterval(STATE.radarTimer);
    emit('zone:changed');
    initRadar();
}

// ─── Combat ───────────────────────────────────────────────────────────────────

export function startCombat(yokai) {
    if (STATE.inCombat) return;
    if (STATE.team.length === 0) {
        emit('toast', "Aucun Yo-Kai dans ton équipe !", 'warning');
        return;
    }
    STATE.inCombat     = true;
    STATE.currentEnemy = Combat.initCombatStats(yokai);
    emit('combat:open', STATE.currentEnemy);
}

export function doAttack(technique) {
    if (!STATE.inCombat || !STATE.currentEnemy) return;
    const ally = Combat.initCombatStats(STATE.team[0]);
    const { damage, elementMult } = Combat.calculateDamage(ally, technique, STATE.currentEnemy);

    STATE.currentEnemy.currentHp = Math.max(0, STATE.currentEnemy.currentHp - damage);
    Combat.chargeOrbe(ally);

    emit('combat:hp_updated', STATE.currentEnemy);

    const effectiveness = elementMult > 1 ? '⚡ Très efficace !'
                        : elementMult < 1 ? '🛡️ Pas très efficace...' : '';
    emit('combat:log', `${ally.name} utilise ${technique.name} → ${damage} dégâts. ${effectiveness}`);

    if (STATE.currentEnemy.currentHp <= 0) {
        endCombat('victory');
    } else {
        enemyTurn();
    }
}

export function doFlee() {
    if (!STATE.inCombat) return;
    if (Math.random() < 0.6) {
        emit('combat:log', "Tu t'es enfui !");
        endCombat('flee');
    } else {
        emit('combat:log', "Impossible de fuir !");
        enemyTurn();
    }
}

function enemyTurn() {
    const enemy = STATE.currentEnemy;
    const ally  = STATE.team[0];
    if (!enemy || !ally) return;
    const technique = enemy.techniques?.[0];
    if (!technique) return;
    const playerCombat = Combat.initCombatStats(ally);
    const { damage } = Combat.calculateDamage(enemy, technique, playerCombat);
    emit('combat:log', `${enemy.name} utilise ${technique.name} → ${damage} dégâts sur ton équipe.`);
}

function endCombat(result) {
    STATE.inCombat = false;

    if (result === 'victory') {
        const rewards = Combat.getCombatRewards(STATE.currentEnemy);
        STATE.money += rewards.money;
        STATE.stats.battlesWon++;

        Radar.removeYokaiFromRadar(STATE.currentMainZone, STATE.currentSubZone, STATE.currentEnemy.id);
        STATE.radarYokai = STATE.radarYokai.filter(y => y.id !== STATE.currentEnemy.id);

        const befriended = Combat.tryBefriend(STATE.currentEnemy);
        if (befriended) {
            emit('combat:friend_request', STATE.currentEnemy);
        } else {
            emit('toast', `+${rewards.money} 💰  •  +${rewards.exp} EXP`, 'success');
            saveGame(STATE);
        }

        emit('radar:updated');
        emit('money:updated');
    }

    emit('combat:close');
    STATE.currentEnemy = null;
}

// ─── Accepter un ami Yo-Kai ───────────────────────────────────────────────────

export function acceptFriend(yokai) {
    STATE.team.push({ ...yokai, currentHp: yokai.baseStats.hp });
    STATE.stats.yokaiFriended++;
    emit('toast', `${yokai.name} a rejoint ton équipe !`, 'success');
    emit('team:updated');
    saveGame(STATE);
}

// ─── API publique (appelée depuis le HTML via YKC.*) ─────────────────────────

globalThis.YKC = {
    changeZone,
    startCombat,
    doAttack,
    doFlee,
    acceptFriend,
    exportSave: () => exportSave(STATE),
    importSave: async (file) => {
        const data = await importSave(file);
        if (data) {
            applyLoadedData(data);
            emit('render:all');
            emit('toast', 'Sauvegarde importée !', 'success');
        } else {
            emit('toast', 'Fichier invalide.', 'error');
        }
    },
    hardReset: () => {
        if (confirm('⚠️ Toute ta progression sera perdue. Es-tu sûr ?')) {
            resetAll();
            location.reload();
        }
    }
};


function init() {
    const saved = loadGame();
    applyLoadedData(saved);
    startAutoSave();
    emit('render:all');
    initRadar();
}

setTimeout(init, 0);