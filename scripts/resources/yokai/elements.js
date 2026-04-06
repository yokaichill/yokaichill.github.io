export const ELEMENTS = {
    FIRE:      { 
        id: "FIRE",      
        name: "Feu",     
        elements_icon: "./assets/images/elements/fire_icon.webp", 
        color: "#FF6B35",
        weakTo: ["WATER"], 
        strongAgainst: ["ICE", "EARTH"] 
    },
    WATER:     { 
        id: "WATER",     
        name: "Eau",     
        elements_icon: "./assets/images/elements/water_icon.webp", 
        color: "#4FC3F7",
        weakTo: ["LIGHTNING"], 
        strongAgainst: ["FIRE", "EARTH"] },
    WIND:      { 
        id: "WIND",      
        name: "Vent",    
        elements_icon: "./assets/images/elements/wind_icon.webp", 
        color: "#80DEEA",
        weakTo: ["EARTH"], 
        strongAgainst: ["FIRE", "LIGHTNING"] },
    EARTH:     { 
        id: "EARTH",     
        name: "Terre",   
        elements_icon: "./assets/images/elements/earth_icon.webp", 
        color: "#A5D6A7",
        weakTo: ["WIND", "ICE"], 
        strongAgainst: ["LIGHTNING", "WATER"] },
    LIGHTNING: { 
        id: "LIGHTNING", 
        name: "Foudre",  
        elements_icon: "./assets/images/elements/lightning_icon.webp", 
        color: "#FFD600",
        weakTo: ["EARTH"], 
        strongAgainst: ["WATER", "WIND"] },
    ICE:       { 
        id: "ICE",       
        name: "Glace",   
        elements_icon: "./assets/images/elements/ice_icon.webp", 
        color: "#B3E5FC",
        weakTo: ["FIRE"], 
        strongAgainst: ["EARTH", "WIND"] },
    NONE:      { 
        id: "NONE",      
        name: "Neutre",  
        elements_icon: "./assets/images/elements/none_icon.webp", 
        color: "#BDBDBD",
        weakTo: [], 
        strongAgainst: [] }
};