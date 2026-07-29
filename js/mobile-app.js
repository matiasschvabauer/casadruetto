// ═══════════════════════════════════════════════════════════════════
// mobile-app.js — Lógica y Funcionalidades para Páginas Móviles (m_*.html)
// ═══════════════════════════════════════════════════════════════════

window.toggleMobileDrawer = function(forceOpen) {
    const drawer = document.getElementById('m-drawer');
    const overlay = document.getElementById('m-overlay');
    if (!drawer || !overlay) return;

    if (forceOpen === true || (!drawer.classList.contains('open') && forceOpen !== false)) {
        drawer.classList.add('open');
        overlay.classList.add('open');
    } else {
        drawer.classList.remove('open');
        overlay.classList.remove('open');
    }
};

window.toggleMobileSearch = function(forceOpen) {
    const modal = document.getElementById('m-search-modal');
    if (!modal) return;

    if (forceOpen === true || (!modal.classList.contains('open') && forceOpen !== false)) {
        modal.classList.add('open');
        const input = document.getElementById('m-search-input');
        if (input) input.focus();
    } else {
        modal.classList.remove('open');
    }
};

window.executeMobileSearch = function(query) {
    if (!query) return;
    window.location.href = 'm_tienda.html?search=' + encodeURIComponent(query);
};
