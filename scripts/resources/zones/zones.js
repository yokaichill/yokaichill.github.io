export const ZONES = {
    CENTRE_VILLE: {
        name: "Centre-ville de Granval",
        unlocked: true,
        subZones: {
            RACCOURCI_ACADEMIE: {
                name: "Raccourci vers l'Académie",
                yokaiPool: [1, 2],
                unlocked: true
            },
            AIRE_LIVRAISON: {
                name: "Aire de livraison",
                yokaiPool: [1, 3],
                unlocked: true
            },
            ARRIERE_COUR: {
                name: "Arrière-cour du vent d'hiver",
                yokaiPool: [2, 3],
                unlocked: true
            },
            BORD_DE_MER: {
                name: "Bord de mer",
                yokaiPool: [1, 2, 3],
                unlocked: true
            },
            VOITURES: {
                name: "Voitures",
                yokaiPool: [1],
                unlocked: true
            },
            CARTONS: {
                name: "Cartons",
                yokaiPool: [2],
                unlocked: true
            },
            POUBELLES: {
                name: "Poubelles",
                yokaiPool: [1, 2],
                unlocked: true
            },
            DISTRIBUTEURS: {
                name: "Distributeurs",
                yokaiPool: [3],
                unlocked: true
            },
            FLEURS_CV: {
                name: "Fleurs",
                yokaiPool: [1, 3],
                unlocked: true
            },
            ARBRES_CV: {
                name: "Arbres",
                yokaiPool: [2, 3],
                unlocked: true
            }
        }
    },
    HAUTS_GRANVAL: {
        name: "Hauts de Granval",
        unlocked: true,
        subZones: {
            ALLEE_SINISTRE: {
                name: "Allée sinistre",
                yokaiPool: [1, 4],
                unlocked: true
            },
            PASSAGE_MATOUS: {
                name: "Passage des Matous",
                yokaiPool: [1, 2],
                unlocked: true
            },
            RUELLE_OBSCURE: {
                name: "Ruelle obscure",
                yokaiPool: [3, 4],
                unlocked: true
            },
            CANAL_ISOLE: {
                name: "Canal isolé",
                yokaiPool: [2, 3],
                unlocked: true
            },
            PARCELLE_FLEURS: {
                name: "Parcelle de fleurs",
                yokaiPool: [1, 2, 3],
                unlocked: true
            },
            FLEUVE_OUEST: {
                name: "Fleuve Ouest",
                yokaiPool: [2, 4],
                unlocked: true
            },
            FLEUVE_EST: {
                name: "Fleuve Est",
                yokaiPool: [3, 4],
                unlocked: true
            }
        }
    },
    COTEAU_FLEURI: {
        name: "Coteau fleuri",
        unlocked: false,
        unlockCondition: "Atteindre le niveau 5 de la Yo-Kai Watch",
        subZones: {
            PRAIRIE: {
                name: "Prairie en fleurs",
                yokaiPool: [1, 2],
                unlocked: false
            },
            RUISSEAU: {
                name: "Ruisseau argenté",
                yokaiPool: [2, 3],
                unlocked: false
            },
            VERGER: {
                name: "Verger abandonné",
                yokaiPool: [1, 3],
                unlocked: false
            },
            COLLINE: {
                name: "Colline du vent",
                yokaiPool: [2, 4],
                unlocked: false
            }
        }
    },
    QUARTIER_BOUTIQUES: {
        name: "Quartier des boutiques",
        unlocked: false,
        unlockCondition: "Vaincre le boss Yo-Kai du Centre-ville",
        subZones: {
            MARCHE: {
                name: "Marché couvert",
                yokaiPool: [1, 2, 3],
                unlocked: false
            },
            GALERIE: {
                name: "Galerie marchande",
                yokaiPool: [2, 3],
                unlocked: false
            },
            ARRIERE_BOUTIQUES: {
                name: "Arrière des boutiques",
                yokaiPool: [1, 4],
                unlocked: false
            },
            PARKING: {
                name: "Parking souterrain",
                yokaiPool: [3, 4],
                unlocked: false
            }
        }
    },
    MONT_SYLVESTRE: {
        name: "Mont Sylvestre",
        unlocked: false,
        unlockCondition: "Atteindre le niveau 10 de la Yo-Kai Watch",
        subZones: {
            ARBRES: {
                name: "Arbres",
                yokaiPool: [2, 3, 4],
                unlocked: false
            },
            HERBE: {
                name: "Herbe",
                yokaiPool: [1, 2],
                unlocked: false
            },
            BAMBOUS: {
                name: "Bambous",
                yokaiPool: [3, 4],
                unlocked: false
            },
            ETANG: {
                name: "Étang",
                yokaiPool: [2, 4],
                unlocked: false
            }
        }
    },
    LA_CORNICHE: {
        name: "La Corniche",
        unlocked: false,
        unlockCondition: "Vaincre le boss Yo-Kai des Hauts de Granval",
        subZones: {
            FALAISE: {
                name: "Falaise du vent",
                yokaiPool: [3, 4],
                unlocked: false
            },
            PLAGE_ROCHEUSE: {
                name: "Plage rocheuse",
                yokaiPool: [2, 3],
                unlocked: false
            },
            PHARE: {
                name: "Abords du phare",
                yokaiPool: [1, 4],
                unlocked: false
            },
            CRIQUE: {
                name: "Crique secrète",
                yokaiPool: [2, 4],
                unlocked: false
            }
        }
    },
    EGOUTS_GRANVAL: {
        name: "Égouts de Granval",
        unlocked: false,
        unlockCondition: "Atteindre le niveau 15 de la Yo-Kai Watch",
        subZones: {
            CONFLUENCE: {
                name: "Confluent des eaux",
                yokaiPool: [3, 4],
                unlocked: false
            },
            GALERIE_PIERRE: {
                name: "Galerie de pierre",
                yokaiPool: [1, 4],
                unlocked: false
            },
            CHAMBRE_POMPE: {
                name: "Chambre des pompes",
                yokaiPool: [2, 4],
                unlocked: false
            }
        }
    },
    TUNNEL_ABANDONNE: {
        name: "Tunnel Abandonné",
        unlocked: false,
        unlockCondition: "Vaincre le boss Yo-Kai du Mont Sylvestre",
        subZones: {
            ENTREE: {
                name: "Entrée du tunnel",
                yokaiPool: [1, 3, 4],
                unlocked: false
            },
            VOIES: {
                name: "Anciennes voies",
                yokaiPool: [2, 4],
                unlocked: false
            },
            PROFONDEURS: {
                name: "Les profondeurs",
                yokaiPool: [4],
                unlocked: false
            }
        }
    },
    LIMBES_ETERNELLES: {
        name: "Limbes éternelles",
        unlocked: false,
        unlockCondition: "Terminer la quête principale",
        subZones: {
            VOILE_BRUME: {
                name: "Voile de brume",
                yokaiPool: [3, 4],
                unlocked: false
            },
            PLAINE_OUBLI: {
                name: "Plaine de l'oubli",
                yokaiPool: [2, 3, 4],
                unlocked: false
            },
            SANCTUAIRE: {
                name: "Sanctuaire des âmes",
                yokaiPool: [4],
                unlocked: false
            }
        }
    }
};