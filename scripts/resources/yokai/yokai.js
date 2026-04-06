import { TRIBES } from './tribes.js';
import { RANKS } from './ranks.js';
import { ELEMENTS } from './elements.js';
import { PERSONALITIES } from './personalities.js';

export const YOKAI_DATABASE = [
    {
        id: 1,
        name: "Jibanyan",
        tribe: TRIBES.CUTE,
        rank: RANKS.D,
        element: ELEMENTS.FIRE,
        personality: PERSONALITIES.ROUGH,
        catchRate: 0.6,
        description: "Un chat Yo-Kai fougueux hanté par un souvenir douloureux. Il défie inlassablement les camions.",
        baseStats: {
            hp: 140,
            strength: 55,
            spirit: 40,
            defense: 30,
            speed: 70
        },
        techniques: [
            {
                name: "Férogriffe",
                type: "attack",
                power: 60,
                element: ELEMENTS.FIRE,
                description: "Une griffe enflammée qui brûle l'ennemi."
            }
        ],
        soultimate: {
            name: "Cat's Tornade",
            power: 130,
            element: ELEMENTS.FIRE,
            description: "Jibanyan tourbillonne dans une tempête de feu dévastatrice !"
        },
        expYield: 40,
        moneyYield: [15, 35]
    },
    {
        id: 2,
        name: "Komasan",
        tribe: TRIBES.BRAVE,
        rank: RANKS.D,
        element: ELEMENTS.EARTH,
        personality: PERSONALITIES.KIND,
        catchRate: 0.6,
        description: "Un chien-lion de campagne timide qui découvre la ville avec émerveillement.",
        baseStats: {
            hp: 160,
            strength: 40,
            spirit: 65,
            defense: 50,
            speed: 45
        },
        techniques: [
            {
                name: "Tourbillon sacré",
                type: "support",
                power: 0,
                element: ELEMENTS.EARTH,
                description: "Soigne légèrement tous les alliés."
            }
        ],
        soultimate: {
            name: "Spirale Sacrée",
            power: 100,
            element: ELEMENTS.EARTH,
            description: "Une spirale lumineuse qui guérit et protège l'équipe !"
        },
        expYield: 38,
        moneyYield: [10, 30]
    },
    {
        id: 3,
        name: "Whisper",
        tribe: TRIBES.ELUSIVE,
        rank: RANKS.C,
        element: ELEMENTS.WIND,
        personality: PERSONALITIES.CALM,
        catchRate: 0.8,
        description: "Un Yo-Kai fantôme qui se prend pour un expert alors qu'il consulte sa Yo-Kai Pad à tout moment.",
        baseStats: {
            hp: 120,
            strength: 30,
            spirit: 80,
            defense: 40,
            speed: 90
        },
        techniques: [
            {
                name: "Souffle érudit",
                type: "attack",
                power: 50,
                element: ELEMENTS.WIND,
                description: "Un souffle de vent magique chargé de savoir."
            }
        ],
        soultimate: {
            name: "Encyclopédie du chaos",
            power: 110,
            element: ELEMENTS.WIND,
            description: "Whisper lance toutes ses connaissances sur l'ennemi... pas très efficace."
        },
        expYield: 55,
        moneyYield: [20, 50]
    },
    {
        id: 4,
        name: "Octorgone",
        tribe: TRIBES.BRAVE,
        rank: RANKS.S,
        element: ELEMENTS.WATER,
        personality: PERSONALITIES.ROUGH,
        catchRate: 0.1,
        description: "Un Yo-Kai pieuvre d'une puissance redoutable. On dit qu'il peut briser les rochers d'un tentacule.",
        baseStats: {
            hp: 240,
            strength: 120,
            spirit: 80,
            defense: 90,
            speed: 40
        },
        techniques: [
            {
                name: "Torrent encré",
                type: "attack",
                power: 90,
                element: ELEMENTS.WATER,
                description: "Un jet d'encre explosif qui aveugle et blesse."
            }
        ],
        soultimate: {
            name: "Maëlstrom Ultime",
            power: 200,
            element: ELEMENTS.WATER,
            description: "Un tourbillon marin colossal qui engloutit tous les ennemis !"
        },
        expYield: 120,
        moneyYield: [80, 150]
    }
];