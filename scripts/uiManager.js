const VIEW_KEY = 'yokaichill_last_view';

export function showView(viewId) {
    document.querySelectorAll('.view').forEach(view => {
        view.classList.add('hidden');
    });

    const target = document.getElementById(`${viewId}-view`);
    if (target) {
        target.classList.remove('hidden');
    }

    localStorage.setItem(VIEW_KEY, viewId);

    const menu = document.getElementById('main-menu');
    if (menu) menu.classList.add('hidden');
}

export function restoreLastView() {
    const lastView = localStorage.getItem(VIEW_KEY);
    if (lastView) {
        showView(lastView);
    }
}

export function toggleMenu() {
    const menu = document.getElementById('main-menu');
    const trigger = document.getElementById('menu-trigger');
    if (menu) {
        const isNowOpen = menu.classList.toggle('hidden') === false;
        if (trigger) trigger.setAttribute('aria-expanded', isNowOpen ? 'true' : 'false');
    }
}