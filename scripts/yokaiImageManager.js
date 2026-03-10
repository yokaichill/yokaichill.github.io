import { YOKAI_ASSETS_PATH } from './yokaiDictionary.js';

export function getImageUrl(id) {
    if (!id) return `${YOKAI_ASSETS_PATH}placeholder.png`;
    return `${YOKAI_ASSETS_PATH}${id}.png`;
}

export function preloadYokaiImage(id) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = getImageUrl(id);
        img.onload = () => resolve(img.src);
        img.onerror = () => resolve(`${YOKAI_ASSETS_PATH}placeholder.png`);
    });
}