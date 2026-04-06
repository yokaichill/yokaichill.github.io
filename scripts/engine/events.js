// Bus d'événements minimaliste pour découpler game.js et ui.js
const listeners = {};

export function on(event, callback) {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(callback);
}

export function emit(event, ...args) {
    (listeners[event] ?? []).forEach(cb => cb(...args));
}