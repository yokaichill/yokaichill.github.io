export const YOKAI_ASSETS_PATH = "assets/img/yokai/";

export const yokai = {};

const EVOLUTION_LVL_MID = 25;
const EVOLUTION_LVL_HIGH = 40;

yokai.jibanyan = {
    id: "jibanyan",
    name: "Jibanyan",
    tribe: "Charming",
    rank: "D",
    bst: { hp: 60, atk: 45, def: 40, spr: 40, spe: 80 },
    catchRate: 0.6,
    evolve: function () {
        return { 1: { target: yokai.thornyan, level: EVOLUTION_LVL_MID } };
    }
};

yokai.komasan = {
    id: "komasan",
    name: "Komasan",
    tribe: "Charming",
    rank: "D",
    bst: { hp: 55, atk: 40, def: 45, spr: 65, spe: 50 },
    catchRate: 0.6,
    evolve: function () {
        return { 1: { target: yokai.komane, level: EVOLUTION_LVL_MID } };
    }
};

yokai.whisper = {
    id: "whisper",
    name: "Whisper",
    tribe: "Slippery",
    rank: "C",
    bst: { hp: 80, atk: 30, def: 60, spr: 70, spe: 60 },
    catchRate: 0.8
};

export const yokaiDatabase = Object.values(yokai);