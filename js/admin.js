// ═══════════════════════════════════════════════════════════════════
// admin.js — Controlador del Panel de Administración
// ═══════════════════════════════════════════════════════════════════

import { db, useFirebase, localDb } from './firebase-config.js';
import {
    collection,
    getDocs,
    doc,
    setDoc,
    deleteDoc,
    addDoc,
    writeBatch
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";


// Configuración de Cloudinary (para subida de imágenes de productos)
// Reemplaza con los valores de tu propia cuenta/preset cuando los tengas creados.
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/doissrwhj/image/upload";
const CLOUDINARY_PRESET = "druetto_preset";

let productsList = [];
let categoriesList = [];
let ordersList = [];


// ─── Inicialización Dinámica ───
window.addEventListener('authReady', async (e) => {
    const { isLoggedIn } = e.detail;
    
    // Si no está logueado y estamos en una página de admin (excepto login), handleAuthRedirect nos redirigirá
    if (!isLoggedIn && !window.location.pathname.includes('login.html')) {
        return;
    }

    // Inyectar datos del admin en la barra superior
    const adminEmailEl = document.getElementById('admin-email-display');
    if (adminEmailEl) {
        adminEmailEl.innerText = window.getCurrentUserEmail() || 'Administrador';
    }

    // Identificar qué panel estamos controlando
    if (document.getElementById('admin-stats-view')) {
        await initDashboard();
    } else if (document.getElementById('admin-products-table')) {
        await initProductsView();
    } else if (document.getElementById('admin-categories-table')) {
        await initCategoriesView();
    } else if (document.getElementById('admin-config-form')) {
        initConfigView();
    }
});


// ─── A. DASHBOARD VIEW ─────────────────────────────────────────────
async function initDashboard() {
    await loadAllData();

    // Métricas clave
    document.getElementById('stat-active-products').innerText = productsList.length;
    document.getElementById('stat-total-orders').innerText = ordersList.length;

    let totalRevenue = 0;
    ordersList.forEach(o => {
        if (o.status !== 'cancelled') totalRevenue += parseFloat(o.total) || 0;
    });

    document.getElementById('stat-revenue').innerText = `$${totalRevenue.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;

    const avgTicket = ordersList.length > 0 ? totalRevenue / ordersList.length : 0;
    document.getElementById('stat-avg-ticket').innerText = `$${avgTicket.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;

    // Órdenes recientes (Limitar a 5)
    const recContainer = document.getElementById('recent-orders-tbody');
    if (recContainer) {
        recContainer.innerHTML = '';
        const recent = [...ordersList].reverse().slice(0, 5);
        if (recent.length === 0) {
            recContainer.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#888;">No hay órdenes recibidas aún.</td></tr>';
        } else {
            recent.forEach(o => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>#${o.id.substring(0, 6)}</td>
                    <td>${o.client}</td>
                    <td>$${parseFloat(o.total).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</td>
                    <td><span class="status-badge ${o.status || 'pending'}">${o.status || 'Pendiente'}</span></td>
                    <td>${o.date || 'Reciente'}</td>
                `;
                recContainer.appendChild(tr);
            });
        }
    }

    initDashboardCharts();
}

// ─── DASHBOARD CHARTS LOGIC ──────────────────────────────────────────
let revenueChartInstance = null;
let ordersChartInstance = null;
let currentChartDataSets = null;

function computeChartDataFromOrders(orders) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const dayRev = [0, 0, 0, 0, 0, 0];
    const dayOrd = [0, 0, 0, 0, 0, 0];

    const weekRev = [0, 0, 0, 0, 0, 0, 0];
    const weekOrd = [0, 0, 0, 0, 0, 0, 0];

    const monthRev = [0, 0, 0, 0];
    const monthOrd = [0, 0, 0, 0];

    const yearRev = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const yearOrd = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    const getMondayBasedDay = (dateObj) => {
        const d = dateObj.getDay();
        return d === 0 ? 6 : d - 1;
    };

    orders.forEach(o => {
        if (o.status === 'cancelled') return;
        const total = parseFloat(o.total) || 0;
        
        let oDate = null;
        if (o.createdAt) {
            oDate = new Date(o.createdAt);
        } else if (o.date) {
            const parts = o.date.split('/');
            if (parts.length === 3) {
                oDate = new Date(parts[2], parts[1] - 1, parts[0]);
            }
        }
        if (!oDate || isNaN(oDate.getTime())) {
            oDate = new Date();
        }

        if (oDate.getFullYear() === currentYear) {
            const m = oDate.getMonth();
            yearRev[m] += total;
            yearOrd[m] += 1;

            if (m === currentMonth) {
                const dayOfMonth = oDate.getDate();
                let weekIdx = Math.floor((dayOfMonth - 1) / 7);
                if (weekIdx > 3) weekIdx = 3;
                monthRev[weekIdx] += total;
                monthOrd[weekIdx] += 1;
            }

            const diffTime = now - oDate;
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays >= 0 && diffDays < 7) {
                const dayIdx = getMondayBasedDay(oDate);
                weekRev[dayIdx] += total;
                weekOrd[dayIdx] += 1;
            }

            if (oDate.toDateString() === now.toDateString()) {
                const hour = oDate.getHours();
                const slot = Math.min(5, Math.floor(hour / 4));
                dayRev[slot] += total;
                dayOrd[slot] += 1;
            }
        }
    });

    return {
        revenue: {
            day: { labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'], data: dayRev },
            week: { labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'], data: weekRev },
            month: { labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'], data: monthRev },
            year: { labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'], data: yearRev }
        },
        orders: {
            day: { labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'], data: dayOrd },
            week: { labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'], data: weekOrd },
            month: { labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'], data: monthOrd },
            year: { labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'], data: yearOrd }
        }
    };
}

function initDashboardCharts() {
    if (typeof Chart === 'undefined') return;

    currentChartDataSets = computeChartDataFromOrders(ordersList);

    // 1. Gráfico de Facturación
    const revCtx = document.getElementById('revenueChart');
    if (revCtx) {
        if (revenueChartInstance) revenueChartInstance.destroy();
        
        const weekRev = currentChartDataSets.revenue.week;
        revenueChartInstance = new Chart(revCtx, {
            type: 'bar',
            data: {
                labels: weekRev.labels,
                datasets: [{
                    label: 'Facturación ($)',
                    data: weekRev.data,
                    backgroundColor: '#10b981',
                    hoverBackgroundColor: '#059669',
                    borderRadius: 6,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return 'Facturación: $' + context.raw.toLocaleString('es-AR');
                            }
                        }
                    }
                },
                scales: {
                    x: { grid: { display: false }, ticks: { font: { family: 'Montserrat', size: 11 } } },
                    y: {
                        grid: { color: '#f3f4f6' },
                        beginAtZero: true,
                        ticks: {
                            font: { family: 'Montserrat', size: 10 },
                            callback: function(value) { return '$' + value.toLocaleString('es-AR'); }
                        }
                    }
                }
            }
        });
    }

    // 2. Gráfico de Órdenes Totales
    const ordCtx = document.getElementById('ordersChart');
    if (ordCtx) {
        if (ordersChartInstance) ordersChartInstance.destroy();

        const weekOrd = currentChartDataSets.orders.week;
        ordersChartInstance = new Chart(ordCtx, {
            type: 'bar',
            data: {
                labels: weekOrd.labels,
                datasets: [{
                    label: 'Órdenes Totales',
                    data: weekOrd.data,
                    backgroundColor: '#eab308',
                    hoverBackgroundColor: '#ca8a04',
                    borderRadius: 6,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return 'Órdenes: ' + context.raw + ' pedidos';
                            }
                        }
                    }
                },
                scales: {
                    x: { grid: { display: false }, ticks: { font: { family: 'Montserrat', size: 11 } } },
                    y: {
                        grid: { color: '#f3f4f6' },
                        beginAtZero: true,
                        ticks: { font: { family: 'Montserrat', size: 10 }, precision: 0 }
                    }
                }
            }
        });
    }
}

window.updateRevenueChart = function(period, btn) {
    if (!revenueChartInstance || !currentChartDataSets || !currentChartDataSets.revenue[period]) return;
    
    if (btn) {
        const parent = btn.parentElement;
        if (parent) {
            parent.querySelectorAll('.chart-period-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        }
    }

    const ds = currentChartDataSets.revenue[period];
    revenueChartInstance.data.labels = ds.labels;
    revenueChartInstance.data.datasets[0].data = ds.data;
    revenueChartInstance.update();
};

window.updateOrdersChart = function(period, btn) {
    if (!ordersChartInstance || !currentChartDataSets || !currentChartDataSets.orders[period]) return;

    if (btn) {
        const parent = btn.parentElement;
        if (parent) {
            parent.querySelectorAll('.chart-period-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        }
    }

    const ds = currentChartDataSets.orders[period];
    ordersChartInstance.data.labels = ds.labels;
    ordersChartInstance.data.datasets[0].data = ds.data;
    ordersChartInstance.update();
};

// ─── B. PRODUCT MANAGEMENT VIEW ────────────────────────────────────
let activeSpecs = {};
let currentProductImages = [];
let localFilesToUpload = [];
let selectedProductIds = new Set();

// ─── SELECCIÓN Y EDICIÓN MASIVA DE PRODUCTOS ─────────────────────
window.toggleSelectAllProducts = function(checked) {
    const checkboxes = document.querySelectorAll('.product-select-checkbox');
    checkboxes.forEach(cb => {
        cb.checked = checked;
        if (checked) {
            selectedProductIds.add(cb.value);
        } else {
            selectedProductIds.delete(cb.value);
        }
    });
    updateBulkSelectionUI();
};

window.onProductCheckboxChange = function(checkbox) {
    if (checkbox.checked) {
        selectedProductIds.add(checkbox.value);
    } else {
        selectedProductIds.delete(checkbox.value);
    }
    const selectAllCb = document.getElementById('select-all-products');
    if (selectAllCb) {
        const total = document.querySelectorAll('.product-select-checkbox').length;
        selectAllCb.checked = total > 0 && selectedProductIds.size === total;
    }
    updateBulkSelectionUI();
};

window.clearBulkSelection = function() {
    selectedProductIds.clear();
    const selectAllCb = document.getElementById('select-all-products');
    if (selectAllCb) selectAllCb.checked = false;
    const checkboxes = document.querySelectorAll('.product-select-checkbox');
    checkboxes.forEach(cb => cb.checked = false);
    updateBulkSelectionUI();
};

function updateBulkSelectionUI() {
    const toolbar = document.getElementById('bulk-actions-toolbar');
    const countEl = document.getElementById('bulk-selected-count');
    const count = selectedProductIds.size;

    if (toolbar) {
        toolbar.style.display = count > 0 ? 'flex' : 'none';
    }
    if (countEl) {
        countEl.innerText = `${count} ${count === 1 ? 'seleccionado' : 'seleccionados'}`;
    }
}

// ─── ACCIONES MASIVAS POR SELECCIÓN ───────────────────────────────
window.openBulkStockPrompt = async function() {
    const ids = Array.from(selectedProductIds);
    if (ids.length === 0) return;

    const input = prompt(`Cambio Masivo de Stock para ${ids.length} productos:\n\n• Ingresa un número para establecer el stock directo (ej: 10).\n• O usa + o - para sumar/restar al stock actual (ej: +5 o -2):`);
    if (input === null || input.trim() === '') return;

    const str = input.trim();
    const isDelta = str.startsWith('+') || str.startsWith('-');
    const deltaVal = parseInt(str, 10) || 0;

    let updatedCount = 0;
    for (const id of ids) {
        const p = productsList.find(item => item.id === id);
        if (p) {
            if (isDelta) {
                p.stock = Math.max(0, (p.stock || 0) + deltaVal);
            } else {
                p.stock = Math.max(0, parseInt(str, 10) || 0);
            }
            await saveSingleProductRecord(p);
            updatedCount++;
        }
    }

    alert(`Stock actualizado con éxito en ${updatedCount} productos.`);
    clearBulkSelection();
    await initProductsView();
};

window.openBulkWebPricePrompt = async function() {
    const ids = Array.from(selectedProductIds);
    if (ids.length === 0) return;

    const input = prompt(`Ajuste Masivo de Precio Web para ${ids.length} productos:\n\n• Ingresa un % de variación (ej: 15 para +15% o -10 para -10%).\n• O escribe un precio fijo antecedido por $ (ej: $5000):`);
    if (input === null || input.trim() === '') return;

    const str = input.trim();
    const isFixed = str.startsWith('$');
    const fixedVal = parseFloat(str.replace('$', '')) || 0;
    const pctVal = parseFloat(str) || 0;

    let updatedCount = 0;
    for (const id of ids) {
        const p = productsList.find(item => item.id === id);
        if (p) {
            if (isFixed) {
                p.price = Math.round(fixedVal);
            } else {
                p.price = Math.round(p.price * (1 + pctVal / 100));
            }
            if (p.priceMeLiPercent !== undefined && p.priceMeLiPercent !== null) {
                p.priceMeLi = Math.round(p.price * (1 + p.priceMeLiPercent / 100));
            }
            await saveSingleProductRecord(p);
            updatedCount++;
        }
    }

    alert(`Precio Web actualizado con éxito en ${updatedCount} productos.`);
    clearBulkSelection();
    await initProductsView();
};

window.openBulkMeLiPricePrompt = async function() {
    const ids = Array.from(selectedProductIds);
    if (ids.length === 0) return;

    const input = prompt(`Ajuste Masivo de Precio Mercado Libre para ${ids.length} productos:\n\n• Ingresa el % de recargo que irá sobre el precio web (ej: 15 para +15% de recargo en MeLi, o 0 para mismo precio).\n• O antecede con $ para fijar un precio exacto en MeLi (ej: $65000):`);
    if (input === null || input.trim() === '') return;

    const str = input.trim();
    const isFixed = str.startsWith('$');
    const fixedVal = parseFloat(str.replace('$', '')) || 0;
    const pctVal = parseFloat(str) || 0;

    let updatedCount = 0;
    for (const id of ids) {
        const p = productsList.find(item => item.id === id);
        if (p) {
            if (isFixed) {
                p.priceMeLi = Math.round(fixedVal);
                p.priceMeLiPercent = p.price > 0 ? Math.round(((p.priceMeLi - p.price) / p.price) * 100) : 0;
            } else {
                p.priceMeLiPercent = pctVal;
                p.priceMeLi = Math.round(p.price * (1 + pctVal / 100));
            }
            await saveSingleProductRecord(p);
            updatedCount++;
        }
    }

    alert(`Precio Mercado Libre actualizado en ${updatedCount} productos.`);
    clearBulkSelection();
    await initProductsView();
};

window.openBulkStatusPrompt = async function() {
    const ids = Array.from(selectedProductIds);
    if (ids.length === 0) return;

    const choice = confirm(`¿Deseas marcar como ACTIVOS los ${ids.length} productos seleccionados?\n\n[Aceptar] = Activar (Stock disponible)\n[Cancelar] = Marcar Sin Stock (Stock = 0)`);

    let updatedCount = 0;
    for (const id of ids) {
        const p = productsList.find(item => item.id === id);
        if (p) {
            if (choice) {
                if (p.stock <= 0) p.stock = 1;
            } else {
                p.stock = 0;
            }
            await saveSingleProductRecord(p);
            updatedCount++;
        }
    }

    alert(`Estado actualizado en ${updatedCount} productos.`);
    clearBulkSelection();
    await initProductsView();
};

// ─── SINCRONIZACIÓN DIRECTA CON MERCADO LIBRE DESDE LA WEB ───────
window.syncWithMercadoLibreWeb = async function() {
    const btn = document.getElementById('btn-sync-meli-web');
    const originalHtml = btn ? btn.innerHTML : "Sincronizar Mercado Libre";
    
    if (productsList.length === 0) {
        alert("No hay productos cargados en el catálogo para sincronizar.");
        return;
    }

    if (!confirm(`¿Deseas iniciar la sincronización en tiempo real de ${productsList.length} productos con Mercado Libre?`)) {
        return;
    }

    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sincronizando con Mercado Libre...';
    }

    const token = 'APP_USR-1747970079974544-072115-89ac0d6eee5dddd49885c412382f1318-648344334';
    let createdCount = 0;
    let updatedCount = 0;
    let errorCount = 0;

    let dollarRate = 1250;
    try {
        const rateRes = await fetch('https://dolarapi.com/v1/dolares/oficial');
        if (rateRes.ok) {
            const rateData = await rateRes.json();
            if (rateData && rateData.venta) dollarRate = parseFloat(rateData.venta);
        }
    } catch (e) {}

    for (const p of productsList) {
        const usdPrice = parseFloat(p.priceMeLi || p.price || 0);
        if (usdPrice <= 0) continue;

        // Convertir precio registrado en USD a Pesos ARS según la cotización actual
        const finalPriceARS = Math.max(1000, Math.round(usdPrice * dollarRate));

        let mlItemId = "";
        if (p.mercadolibreLink && p.mercadolibreLink.includes('MLA')) {
            const match = p.mercadolibreLink.match(/MLA-?(\d+)/i);
            if (match) mlItemId = `MLA${match[1]}`;
        }

        try {
            const pictures = (p.images && p.images.length > 0)
                ? p.images.filter(img => img.startsWith('http')).map(img => ({ source: img }))
                : [{ source: "https://casadruetto.com.ar/assets/img/casadruettologo1.png" }];

            if (mlItemId) {
                // ACTUALIZAR PUBLICACIÓN EXISTENTE (Precio, Stock e Imágenes)
                const res = await fetch(`https://api.mercadolibre.com/items/${mlItemId}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        price: finalPriceARS,
                        available_quantity: Math.max(1, parseInt(p.stock) || 1),
                        pictures: pictures
                    })
                });
                if (res.ok) {
                    updatedCount++;
                } else {
                    errorCount++;
                }
            } else {
                // CREAR NUEVA PUBLICACIÓN CON PREDICCIÓN DINÁMICA DE CATEGORÍA
                let categoryId = "MLA388941";
                try {
                    const catRes = await fetch(`https://api.mercadolibre.com/sites/MLA/domain_discovery/search?q=${encodeURIComponent((p.name || '').substring(0, 50))}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (catRes.ok) {
                        const catData = await catRes.json();
                        if (catData && catData.length > 0 && catData[0].category_id) {
                            categoryId = catData[0].category_id;
                        }
                    }
                } catch (catErr) {}

                const pictures = (p.images && p.images.length > 0)
                    ? p.images.filter(img => img.startsWith('http')).map(img => ({ source: img }))
                    : [{ source: "https://casadruetto.com.ar/assets/img/casadruettologo1.png" }];

                const buyingMode = (categoryId === "MLA80600" || (p.name || '').toLowerCase().includes('tractor') || (p.category || '').toLowerCase().includes('maquinaria')) ? "classified" : "buy_it_now";

                let title = p.name || 'Producto';
                if (title.length < 20) {
                    title = `${p.name || ''} Repuesto Agrícola ${p.brand || 'John Deere'} Cód ${p.code || ''}`;
                }
                title = title.substring(0, 60).trim();

                const itemData = {
                    title: title,
                    category_id: categoryId,
                    price: finalPriceARS,
                    currency_id: 'ARS',
                    available_quantity: Math.max(1, parseInt(p.stock) || 1),
                    buying_mode: buyingMode,
                    listing_type_id: buyingMode === 'buy_it_now' ? 'bronze' : 'free',
                    condition: p.condition === 'Nuevo' ? 'new' : 'used',
                    pictures: pictures.length > 0 ? pictures : [{ source: "https://casadruetto.com.ar/assets/img/casadruettologo1.png" }],
                    attributes: [
                        { id: 'BRAND', value_name: p.brand || 'John Deere' },
                        { id: 'MODEL', value_name: p.model || 'Estándar' },
                        { id: 'PART_NUMBER', value_name: p.code || p.id || '1001' },
                        { id: 'MANUFACTURER', value_name: p.brand || 'John Deere' },
                        { id: 'CROP_TYPE', value_name: 'Multicultivo' },
                        { id: 'REQUIRES_ASSEMBLY', value_name: 'No' }
                    ]
                };

                const res = await fetch('https://api.mercadolibre.com/items', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(itemData)
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data.permalink) {
                        p.mercadolibreLink = data.permalink;
                        await saveSingleProductRecord(p);
                        createdCount++;
                    }
                } else {
                    errorCount++;
                }
            }
        } catch (err) {
            console.error(`Error sincronizando ${p.name} con MeLi:`, err);
            errorCount++;
        }
    }

    if (btn) {
        btn.disabled = false;
        btn.innerHTML = originalHtml;
    }

    alert(`✅ Sincronización Web con Mercado Libre finalizada:\n\n• Publicaciones Nuevas Creadas: ${createdCount}\n• Publicaciones Actualizadas: ${updatedCount}\n• Omisiones / Errores: ${errorCount}`);
    await initProductsView();
};

async function saveSingleProductRecord(p) {
    if (useFirebase) {
        await setDoc(doc(db, "druetto_products", p.id), p);
    } else {
        await localDb.setDoc("products", p.id, p);
    }
}

// ─── CÁLCULOS DINÁMICOS DE PRECIO MELI EN FORMULARIO ──────────────
window.calculateMeLiPriceFromPercent = function() {
    const webPrice = parseFloat(document.getElementById('product-price').value) || 0;
    const percentEl = document.getElementById('product-price-meli-percent');
    const meliPriceEl = document.getElementById('product-price-meli');
    
    if (!percentEl || !meliPriceEl) return;
    const percent = parseFloat(percentEl.value);
    
    if (!isNaN(percent)) {
        meliPriceEl.value = Math.round(webPrice * (1 + percent / 100));
    }
};

window.calculatePercentFromMeLiPrice = function() {
    const webPrice = parseFloat(document.getElementById('product-price').value) || 0;
    const meliPrice = parseFloat(document.getElementById('product-price-meli').value) || 0;
    const percentEl = document.getElementById('product-price-meli-percent');

    if (!percentEl) return;
    if (webPrice > 0 && meliPrice > 0) {
        const pct = ((meliPrice - webPrice) / webPrice) * 100;
        percentEl.value = pct.toFixed(1);
    }
};

// Configurar el escuchador de selección de archivos locales
function setupFileInputListener() {
    const fileInput = document.getElementById('product-file-input');
    if (fileInput) {
        // Remover listeners previos para evitar duplicados
        const newFileInput = fileInput.cloneNode(true);
        fileInput.parentNode.replaceChild(newFileInput, fileInput);
        
        newFileInput.addEventListener('change', (e) => {
            const files = e.target.files;
            if (!files) return;
            for (let i = 0; i < files.length; i++) {
                localFilesToUpload.push(files[i]);
            }
            renderModalImages();
            newFileInput.value = ''; // Limpiar selector nativo
        });
    }
}

// Renderizar las miniaturas de imágenes del producto en el modal de edición
function renderModalImages() {
    const container = document.getElementById('product-images-container');
    const notice = document.getElementById('pending-upload-notice');
    if (!container) return;

    container.innerHTML = '';

    // Mostrar u ocultar el aviso según si hay imágenes locales listas
    if (notice) {
        notice.style.display = localFilesToUpload.length > 0 ? 'block' : 'none';
    }

    if (currentProductImages.length === 0 && localFilesToUpload.length === 0) {
        container.innerHTML = '<span style="color:var(--admin-text-muted); font-size:0.85rem; padding:0.5rem 0;">No hay imágenes seleccionadas. Elige archivos locales abajo.</span>';
        return;
    }

    // 1. Renderizar imágenes ya guardadas en la base de datos
    currentProductImages.forEach((img, idx) => {
        const div = document.createElement('div');
        div.style.cssText = 'position:relative; width:80px; height:80px; background:#0f172a; border:1px solid var(--admin-border); border-radius:6px; display:flex; align-items:center; justify-content:center; overflow:hidden; padding:4px;';

        const image = document.createElement('img');
        const displayUrl = img.startsWith('http') || img.startsWith('data:') || img.startsWith('../') ? img : '../' + img;
        image.src = displayUrl;
        image.style.cssText = 'width:100%; height:100%; object-fit:contain; border-radius:4px;';

        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.innerHTML = '✕';
        deleteBtn.title = 'Eliminar esta imagen';
        deleteBtn.style.cssText = 'position:absolute; top:3px; right:3px; width:18px; height:18px; border-radius:50%; background:rgba(239, 68, 68, 0.9); border:none; color:white; font-size:0.65rem; cursor:pointer; display:flex; align-items:center; justify-content:center; font-weight:bold; transition: background 0.2s;';

        deleteBtn.addEventListener('mouseover', () => { deleteBtn.style.background = '#dc2626'; });
        deleteBtn.addEventListener('mouseout', () => { deleteBtn.style.background = 'rgba(239, 68, 68, 0.9)'; });

        deleteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            currentProductImages.splice(idx, 1);
            renderModalImages();
        });

        div.appendChild(image);
        div.appendChild(deleteBtn);
        container.appendChild(div);
    });

    // 2. Renderizar imágenes locales en cola (pendientes de subida)
    localFilesToUpload.forEach((file, idx) => {
        const div = document.createElement('div');
        div.style.cssText = 'position:relative; width:80px; height:80px; background:#0f172a; border:2px dashed #f59e0b; border-radius:6px; display:flex; align-items:center; justify-content:center; overflow:hidden; padding:4px;';

        const image = document.createElement('img');
        image.src = URL.createObjectURL(file);
        image.style.cssText = 'width:100%; height:100%; object-fit:contain; border-radius:4px; opacity:0.8;';

        // Etiqueta flotante "Por subir"
        const badge = document.createElement('span');
        badge.innerText = 'Por subir';
        badge.style.cssText = 'position:absolute; bottom:2px; left:2px; right:2px; background:rgba(245, 158, 11, 0.9); color:black; font-size:0.55rem; text-align:center; font-weight:bold; border-radius:2px; padding:1px 0; pointer-events:none;';

        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.innerHTML = '✕';
        deleteBtn.title = 'Quitar de la cola';
        deleteBtn.style.cssText = 'position:absolute; top:3px; right:3px; width:18px; height:18px; border-radius:50%; background:rgba(239, 68, 68, 0.9); border:none; color:white; font-size:0.65rem; cursor:pointer; display:flex; align-items:center; justify-content:center; font-weight:bold; transition: background 0.2s;';

        deleteBtn.addEventListener('mouseover', () => { deleteBtn.style.background = '#dc2626'; });
        deleteBtn.addEventListener('mouseout', () => { deleteBtn.style.background = 'rgba(239, 68, 68, 0.9)'; });

        deleteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localFilesToUpload.splice(idx, 1);
            renderModalImages();
        });

        div.appendChild(image);
        div.appendChild(badge);
        div.appendChild(deleteBtn);
        container.appendChild(div);
    });
}


async function initProductsView() {
    await loadAllData();
    renderProductsTable();
    populateCategoryDropdowns();
}

function populateCategoryDropdowns() {
    const selects = [
        document.getElementById('product-category'),
        document.getElementById('adjust-category-filter')
    ];
    selects.forEach(select => {
        if (!select) return;
        // Limpiar opciones previas excepto la primera
        while (select.options.length > 1) {
            select.remove(1);
        }
        categoriesList.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.name;
            opt.innerText = c.name;
            select.appendChild(opt);
        });
    });
}

window.filterAdminProductsTable = function(searchTerm) {
    if (!searchTerm) {
        renderProductsTable();
        return;
    }
    const term = searchTerm.toLowerCase().trim();
    const filtered = productsList.filter(p => {
        const name = (p.name || '').toLowerCase();
        const code = (p.code || '').toLowerCase();
        const category = (p.category || '').toLowerCase();
        const brand = (p.brand || '').toLowerCase();
        return name.includes(term) || code.includes(term) || category.includes(term) || brand.includes(term);
    });
    renderProductsTable(filtered);
};

function renderProductsTable(itemsToRender = productsList) {
    const tbody = document.getElementById('admin-products-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (itemsToRender.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;color:#888;padding:2rem;">No se encontraron productos coincidentes.</td></tr>';
        return;
    }

    itemsToRender.forEach(p => {
        const tr = document.createElement('tr');
        const isChecked = selectedProductIds.has(p.id);
        const imgUrl = p.images?.[0] ? (p.images[0].startsWith('http') || p.images[0].startsWith('data:') || p.images[0].startsWith('../') ? p.images[0] : '../' + p.images[0]) : '../assets/img/casadruettologo1.png';

        const meLiPrice = p.priceMeLi !== undefined && p.priceMeLi !== null && p.priceMeLi > 0 ? p.priceMeLi : p.price;
        const meLiDiffPct = p.price > 0 ? Math.round(((meLiPrice - p.price) / p.price) * 100) : 0;
        const meLiBadge = meLiDiffPct > 0 
            ? `<br><small style="color:#eab308; font-weight:700;">+${meLiDiffPct}% MeLi</small>`
            : meLiDiffPct < 0 
            ? `<br><small style="color:#ef4444; font-weight:700;">${meLiDiffPct}% MeLi</small>`
            : `<br><small style="color:#64748b;">(Mismo precio)</small>`;

        tr.innerHTML = `
            <td style="text-align:center;">
                <input type="checkbox" class="product-select-checkbox" value="${p.id}" ${isChecked ? 'checked' : ''} onchange="window.onProductCheckboxChange(this)" style="width:16px; height:16px; cursor:pointer;">
            </td>
            <td><img src="${imgUrl}" style="width:45px; height:45px; object-fit:contain; background:#000; border-radius:4px;"></td>
            <td><strong>${p.name}</strong><br><small style="color:var(--admin-text-muted);">Cód: ${p.code}</small></td>
            <td><strong>$${p.price.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</strong></td>
            <td><strong style="color:#eab308;">$${meLiPrice.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</strong>${meLiBadge}</td>
            <td>${p.category}</td>
            <td>${p.stock}</td>
            <td><span class="status-badge ${p.stock > 0 ? 'success' : 'danger'}">${p.stock > 0 ? 'Activo' : 'Sin Stock'}</span></td>
            <td>
                <div class="admin-actions-cell">
                    <button class="admin-btn-action" onclick="openProductEditModal('${p.id}')" title="Editar"><i class="fas fa-edit"></i></button>
                    <button class="admin-btn-action delete-btn" onclick="deleteProductAction('${p.id}')" title="Eliminar"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });

    updateBulkSelectionUI();
}

// Abrir Modal Crear
window.openProductCreateModal = function () {
    document.getElementById('modal-title').innerText = "Nuevo Producto";
    document.getElementById('product-form').reset();
    document.getElementById('product-id').value = "";
    document.getElementById('product-price-meli').value = "";
    document.getElementById('product-price-meli-percent').value = "";
    currentProductImages = [];
    localFilesToUpload = [];
    renderModalImages();
    setupFileInputListener();
    activeSpecs = {};
    renderSpecsBuilder();
    toggleProductModal(true);
};

// Abrir Modal Editar
window.openProductEditModal = function (id) {
    const p = productsList.find(x => x.id === id);
    if (!p) return;

    document.getElementById('modal-title').innerText = "Editar Producto";
    document.getElementById('product-id').value = p.id;
    document.getElementById('product-name').value = p.name;
    document.getElementById('product-code').value = p.code;
    document.getElementById('product-desc').value = p.desc;
    document.getElementById('product-price').value = p.price;
    document.getElementById('product-category').value = p.category;
    document.getElementById('product-brand').value = p.brand || '';
    document.getElementById('product-condition').value = p.condition;
    document.getElementById('product-stock').value = p.stock;

    const meLiPrice = p.priceMeLi !== undefined && p.priceMeLi !== null ? p.priceMeLi : p.price;
    const meLiPercent = p.priceMeLiPercent !== undefined && p.priceMeLiPercent !== null ? p.priceMeLiPercent : (p.price > 0 ? Math.round(((meLiPrice - p.price) / p.price) * 100) : 0);
    
    document.getElementById('product-price-meli').value = meLiPrice || "";
    document.getElementById('product-price-meli-percent').value = meLiPercent !== 0 ? meLiPercent : "0";
    
    currentProductImages = p.images ? [...p.images] : [];
    localFilesToUpload = [];
    renderModalImages();
    setupFileInputListener();
    
    document.getElementById('product-images').value = p.images?.join(', ') || '';
    document.getElementById('product-ml-link').value = p.mercadolibreLink || '';

    activeSpecs = p.specs ? { ...p.specs } : {};
    renderSpecsBuilder();
    toggleProductModal(true);
};

// Toggle Modal
window.toggleProductModal = function (open) {
    const modal = document.getElementById('product-modal');
    if (modal) {
        if (open) modal.classList.add('open');
        else modal.classList.remove('open');
    }
};

// Guardar Producto (Crear/Editar)
window.saveProductForm = async function () {
    const saveBtn = document.getElementById('btn-save-product');
    const cancelBtn = document.getElementById('btn-cancel-product');
    const originalSaveHtml = saveBtn ? saveBtn.innerHTML : "Guardar Cambios";

    // Bloquear UI
    if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subiendo...';
    }
    if (cancelBtn) cancelBtn.disabled = true;

    const id = document.getElementById('product-id').value;
    const name = document.getElementById('product-name').value;
    const code = document.getElementById('product-code').value;
    const desc = document.getElementById('product-desc').value;
    const price = parseFloat(document.getElementById('product-price').value) || 0;
    const priceMeLi = parseFloat(document.getElementById('product-price-meli').value) || price;
    const priceMeLiPercent = parseFloat(document.getElementById('product-price-meli-percent').value) || 0;
    const category = document.getElementById('product-category').value;
    const brand = document.getElementById('product-brand').value;
    const condition = document.getElementById('product-condition').value;
    const stock = parseInt(document.getElementById('product-stock').value) || 0;
    const imagesStr = document.getElementById('product-images').value;
    const mercadolibreLink = document.getElementById('product-ml-link').value;

    const uploadedImages = [];

    // Subir imágenes locales acumuladas en la cola a Cloudinary
    if (localFilesToUpload.length > 0) {
        const progressContainer = document.getElementById('upload-progress-container');
        const statusText = document.getElementById('upload-status-text');

        if (progressContainer) progressContainer.style.display = 'block';

        try {
            for (let i = 0; i < localFilesToUpload.length; i++) {
                const file = localFilesToUpload[i];
                if (statusText) statusText.innerText = `Subiendo imagen ${i + 1} de ${localFilesToUpload.length}...`;

                const fd = new FormData();
                fd.append('file', file);
                fd.append('upload_preset', CLOUDINARY_PRESET);

                const res = await fetch(CLOUDINARY_URL, {
                    method: 'POST',
                    body: fd
                });

                if (!res.ok) throw new Error(`Error en subida de imagen a Cloudinary (Status: ${res.status})`);

                const data = await res.json();
                if (data.secure_url) {
                    uploadedImages.push(data.secure_url);
                }
            }
            localFilesToUpload = []; // Limpiar cola tras subida exitosa
        } catch (uploadErr) {
            console.error("Error al subir imágenes a Cloudinary:", uploadErr);
            alert("Ocurrió un error al subir alguna de las imágenes locales. Se continuará guardando el producto con las imágenes ya subidas.");
        } finally {
            if (progressContainer) progressContainer.style.display = 'none';
        }
    }

    const images = [...currentProductImages, ...uploadedImages];

    // Capturar specs de las filas
    const specRows = document.querySelectorAll('.specs-builder-row');
    const specs = {};
    specRows.forEach(row => {
        const key = row.querySelector('.spec-key-input').value.trim();
        const val = row.querySelector('.spec-val-input').value.trim();
        if (key && val) specs[key] = val;
    });

    const productData = {
        name,
        code,
        desc,
        price,
        priceMeLi,
        priceMeLiPercent,
        category,
        brand,
        condition,
        stock,
        images,
        specs,
        mercadolibreLink
    };

    // Cambiar estado a Guardando
    if (saveBtn) {
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';
    }

    try {
        if (useFirebase) {
            const docId = id || doc(collection(db, "druetto_products")).id;
            await setDoc(doc(db, "druetto_products", docId), productData);
            await deleteDoc(doc(db, "druetto_deleted_products", docId)).catch(() => {});
        } else {
            const docId = id || "prod_" + Date.now();
            await localDb.setDoc("products", docId, productData);
            await localDb.deleteDoc("deleted_products", docId);
        }
        alert("Producto guardado con éxito.");
        toggleProductModal(false);
        await initProductsView();
    } catch (e) {
        console.error("Error al guardar producto:", e);
        alert("Error al guardar en base de datos: " + e.message + "\n\n(Si estás usando extensiones bloqueadoras de publicidad o escudos de privacidad, desactívalas temporalmente para esta página, ya que pueden bloquear la conexión con la base de datos de Firebase).");
    } finally {
        // Habilitar UI
        if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.innerHTML = originalSaveHtml;
        }
        if (cancelBtn) cancelBtn.disabled = false;
    }
};

// Eliminar Producto
window.deleteProductAction = async function (id) {
    if (!confirm("¿Está seguro de que desea eliminar este producto?")) return;
    try {
        const prodToDelete = productsList.find(p => p.id === id);
        const codeToDelete = prodToDelete ? prodToDelete.code : '';
        const deletedRecord = {
            id: id,
            code: codeToDelete,
            deletedAt: new Date().toISOString()
        };

        if (useFirebase) {
            await deleteDoc(doc(db, "druetto_products", id));
            await setDoc(doc(db, "druetto_deleted_products", id), deletedRecord);
        } else {
            await localDb.deleteDoc("products", id);
            await localDb.setDoc("deleted_products", id, deletedRecord);
        }

        // Remover de la lista local en memoria
        productsList = productsList.filter(p => p.id !== id);

        alert("Producto eliminado.");
        await initProductsView();
    } catch (e) {
        alert("Error al eliminar producto: " + e.message);
    }
};

// Constructor de Ficha Técnica (Specs) en Modal
function renderSpecsBuilder() {
    const container = document.getElementById('specs-builder-container');
    if (!container) return;

    container.innerHTML = '';

    const entries = Object.entries(activeSpecs);
    if (entries.length === 0) {
        // Fila vacía inicial
        addSpecRow('', '');
    } else {
        entries.forEach(([k, v]) => {
            addSpecRow(k, v);
        });
    }
}

window.addSpecRow = function (key = '', val = '') {
    const container = document.getElementById('specs-builder-container');
    if (!container) return;

    const div = document.createElement('div');
    div.className = 'specs-builder-row';
    div.innerHTML = `
        <input type="text" placeholder="Especificación (ej: Motor)" class="spec-key-input" value="${key}">
        <input type="text" placeholder="Detalle (ej: John Deere 4 cil)" class="spec-val-input" value="${val}">
        <button class="admin-btn-action delete-btn" onclick="this.closest('.specs-builder-row').remove();" style="height:40px;"><i class="fas fa-trash"></i></button>
    `;
    container.appendChild(div);
};

// ─── C. IMPORTAR / EXPORTAR CATÁLOGO MASIVO (CSV) ────────────────
window.exportCatalogCSV = function () {
    if (productsList.length === 0) {
        alert("No hay productos en el catálogo para exportar.");
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    // Encabezado
    csvContent += "Codigo,Nombre,Categoria,Marca,Condicion,Precio,Stock,ImagenesUrls,Descripcion\n";

    productsList.forEach(p => {
        const descEscaped = p.desc ? p.desc.replace(/"/g, '""') : '';
        const nameEscaped = p.name ? p.name.replace(/"/g, '""') : '';
        const imgUrls = p.images?.join(';') || '';

        csvContent += `"${p.code}","${nameEscaped}","${p.category}","${p.brand || ''}","${p.condition}",${p.price},${p.stock},"${imgUrls}","${descEscaped}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `catalogo_casa_druetto_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// Procesar importación CSV
window.handleCSVImport = function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function (e) {
        const text = e.target.result;
        await parseAndImportProducts(text);
    };
    reader.readAsText(file);
};

async function parseAndImportProducts(csvText) {
    const lines = csvText.split('\n');
    if (lines.length <= 1) {
        alert("El archivo CSV está vacío.");
        return;
    }

    let importedCount = 0;
    let updatedCount = 0;

    // Saltar encabezado
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Parsing básico de CSV respetando comillas
        const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
        const cleanFields = matches.map(f => f.replace(/^"|"$/g, '').trim());

        if (cleanFields.length < 5) continue;

        const code = cleanFields[0];
        const name = cleanFields[1];
        const category = cleanFields[2];
        const brand = cleanFields[3] || '';
        const condition = cleanFields[4] || 'Nuevo';
        const price = parseFloat(cleanFields[5]) || 0;
        const stock = parseInt(cleanFields[6]) || 0;
        const images = cleanFields[7] ? cleanFields[7].split(';') : [];
        const desc = cleanFields[8] || '';

        const productData = {
            name,
            code,
            category,
            brand,
            condition,
            price,
            stock,
            images,
            desc,
            specs: {},
            mercadolibreLink: ""
        };

        // Buscar si ya existe por código
        const existing = productsList.find(p => p.code === code);

        try {
            if (useFirebase) {
                const docId = existing ? existing.id : doc(collection(db, "druetto_products")).id;
                await setDoc(doc(db, "druetto_products", docId), productData);
            } else {
                const docId = existing ? existing.id : "prod_" + Date.now() + "_" + i;
                await localDb.setDoc("products", docId, productData);
            }

            if (existing) updatedCount++;
            else importedCount++;
        } catch (err) {
            console.error("Error al importar línea:", line, err);
        }
    }

    alert(`Planilla procesada con éxito:\n\n• Productos Nuevos Creados: ${importedCount}\n• Productos Actualizados: ${updatedCount}`);
    await initProductsView();
};

// ─── D. ACTUALIZACIÓN MASIVA DE PRECIOS ──────────────────────────
window.applyBulkPriceAdjustment = async function () {
    const category = document.getElementById('adjust-category-filter').value;
    const pct = parseFloat(document.getElementById('adjust-percentage').value) || 0;

    if (pct === 0) {
        alert("Por favor ingrese un porcentaje distinto de cero.");
        return;
    }

    let targets = [...productsList];
    if (category !== 'all') {
        targets = targets.filter(p => p.category === category);
    }

    if (targets.length === 0) {
        alert("No se encontraron productos elegibles para ajustar.");
        return;
    }

    const confirmMsg = `¿Está seguro de que desea ajustar los precios de ${targets.length} productos en un ${pct}%?`;
    if (!confirm(confirmMsg)) return;

    let successCount = 0;
    const factor = 1 + (pct / 100);

    for (const p of targets) {
        p.price = Math.round(p.price * factor);
        try {
            if (useFirebase) {
                await setDoc(doc(db, "druetto_products", p.id), p);
            } else {
                await localDb.setDoc("products", p.id, p);
            }
            successCount++;
        } catch (e) {
            console.error(`Error al ajustar precio de ${p.code}:`, e);
        }
    }

    alert(`Precios actualizados con éxito en ${successCount} productos.`);
    await initProductsView();
};

// ─── E. CATEGORIES VIEW ────────────────────────────────────────────
async function initCategoriesView() {
    await loadAllData();
    renderCategoriesTable();
}

function renderCategoriesTable() {
    const tbody = document.getElementById('admin-categories-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (categoriesList.length === 0) {
        // Si no hay categorías, precargar unas por defecto
        const defaultCats = [
            { id: "cat_maq", name: "Maquinaria Agrícola", slug: "maquinaria" },
            { id: "cat_agp", name: "Agricultura de Precisión", slug: "precision" },
            { id: "cat_rep", name: "Repuestos y Accesorios", slug: "repuestos" },
            { id: "cat_dro", name: "Drones DJI", slug: "drones" }
        ];
        categoriesList = defaultCats;
        if (!useFirebase) localDb.setCollection("categories", defaultCats);
    }

    categoriesList.forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${c.name}</strong></td>
            <td>/${c.slug}</td>
            <td>
                <div class="admin-actions-cell">
                    <button class="admin-btn-action delete-btn" onclick="deleteCategoryAction('${c.id}')"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

window.addNewCategory = async function () {
    const name = document.getElementById('new-cat-name').value.trim();
    if (!name) return;

    const slug = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
    const newCat = {
        name,
        slug
    };

    try {
        if (useFirebase) {
            await addDoc(collection(db, "druetto_categories"), newCat);
        } else {
            const id = "cat_" + Date.now();
            await localDb.setDoc("categories", id, newCat);
        }
        document.getElementById('new-cat-name').value = '';
        await initCategoriesView();
    } catch (e) {
        alert("Error: " + e.message);
    }
};

window.deleteCategoryAction = async function (id) {
    if (!confirm("¿Desea borrar esta categoría?")) return;
    try {
        if (useFirebase) {
            await deleteDoc(doc(db, "druetto_categories", id));
        } else {
            await localDb.deleteDoc("categories", id);
        }
        await initCategoriesView();
    } catch (e) {
        alert("Error: " + e.message);
    }
};

// ─── F. CONFIGURATION VIEW ─────────────────────────────────────────
function initConfigView() {
    const config = localStorage.getItem('druetto_config');
    const emailField = document.getElementById('conf-email');
    if (emailField) emailField.value = 'casadruettosa@gmail.com';

    if (config) {
        try {
            const data = JSON.parse(config);
            if (emailField && data.email) emailField.value = data.email;
            document.getElementById('conf-wa').value = data.whatsappNumber || '';
            document.getElementById('conf-address').value = data.address || '';
            document.getElementById('conf-bank').value = data.bankDetails || '';
            document.getElementById('conf-mp-token').value = data.mpToken || '';
        } catch (e) { }
    }
}

window.saveConfigForm = function () {
    const email = document.getElementById('conf-email')?.value.trim() || 'casadruettosa@gmail.com';
    const whatsappNumber = document.getElementById('conf-wa').value.trim();
    const address = document.getElementById('conf-address').value.trim();
    const bankDetails = document.getElementById('conf-bank').value.trim();
    const mpToken = document.getElementById('conf-mp-token').value.trim();

    const data = {
        email,
        whatsappNumber,
        address,
        bankDetails,
        mpToken
    };

    localStorage.setItem('druetto_config', JSON.stringify(data));
    alert("Configuración comercial guardada con éxito.");
};

// ─── UTILS: LOAD DATA FROM BACKEND ───────────────────────────────
async function loadAllData() {
    try {
        if (useFirebase) {
            // Cargar de Firestore
            const prodSnap = await getDocs(collection(db, "druetto_products"));
            productsList = prodSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            const catSnap = await getDocs(collection(db, "druetto_categories"));
            categoriesList = catSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Autosemilla de Categorías Oficiales
            if (categoriesList.length === 0) {
                const defaultCats = [
                    { id: "cat_maq", name: "Maquinaria Agrícola", slug: "maquinaria" },
                    { id: "cat_agp", name: "Agricultura de Precisión", slug: "precision" },
                    { id: "cat_rep", name: "Repuestos y Accesorios", slug: "repuestos" },
                    { id: "cat_dro", name: "Drones DJI", slug: "drones" }
                ];
                for (const c of defaultCats) {
                    await setDoc(doc(db, "druetto_categories", c.id), c).catch(() => {});
                }
                categoriesList = defaultCats;
            }

            // Autosemilla de Productos Iniciales Completo
            if (productsList.length === 0) {
                try {
                    const { SEED_PRODUCTS } = await import('./products.js');
                    productsList = [...SEED_PRODUCTS];
                    for (const p of SEED_PRODUCTS) {
                        await setDoc(doc(db, "druetto_products", p.id), p).catch(() => {});
                    }
                } catch (importErr) {}
            }
        } else {
            // Cargar de Local
            productsList = await localDb.getCollection("products");
            categoriesList = await localDb.getCollection("categories");
            ordersList = await localDb.getCollection("orders");

            if (!productsList || productsList.length === 0) {
                const { SEED_PRODUCTS } = await import('./products.js');
                await localDb.setCollection("products", SEED_PRODUCTS);
                productsList = [...SEED_PRODUCTS];
            }
        }

        // ── Sincronizar automáticamente imágenes Semilla (Correas y Productos Nuevos) ──
        try {
            const { SEED_PRODUCTS } = await import('./products.js');
            for (const sp of SEED_PRODUCTS) {
                const existing = productsList.find(p => p.id === sp.id || p.code === sp.code);
                if (existing) {
                    // Si el producto semilla tiene imágenes reales pero en la base de datos tiene la foto del logo o imágenes por defecto
                    const existingImg = (existing.images && existing.images.length > 0) ? existing.images[0] : '';
                    const spImg = (sp.images && sp.images.length > 0) ? sp.images[0] : '';
                    if ((!existingImg || existingImg.includes('casadruettologo1') || existingImg.includes('STD') || existingImg.includes('WhatsApp') || JSON.stringify(existing.images) !== JSON.stringify(sp.images)) && spImg && !spImg.includes('casadruettologo1')) {
                        existing.images = sp.images;
                        saveSingleProductRecord(existing).catch(() => {});
                    }
                } else {
                    productsList.push(sp);
                    saveSingleProductRecord(sp).catch(() => {});
                }
            }
        } catch (syncErr) {
            console.warn("Error en auto-sincronización de imágenes semilla:", syncErr);
        }

    } catch (e) {
        console.error("Global data loading error:", e);
    }
}

// ─── F. SINCRONIZAR PRECIOS Y PRODUCTOS DESDE CÓDIGO (PRODUCTS.JS) ──
window.syncPricesFromCode = async function() {
    const alertFn = window.showWebAlert || ((t, m) => alert(`${t}: ${m}`));
    const confirmFn = window.showWebConfirm || ((t, m, ok) => { if (confirm(`${t}\n\n${m}`)) ok(); });

    if (productsList.length === 0) {
        alertFn("Catálogo Vacío", "El catálogo local está vacío. Espere a que carguen los productos.", "info");
        return;
    }
    
    // Importar SEED_PRODUCTS
    let SEED_PRODUCTS;
    try {
        const prodModule = await import('./products.js');
        SEED_PRODUCTS = prodModule.SEED_PRODUCTS;
    } catch (e) {
        console.error("Error al importar products.js:", e);
        alertFn("Error", "Error al cargar los productos de products.js.", "error");
        return;
    }

    // Cargar productos eliminados para no reinsertarlos ni actualizarlos
    let deletedRecords = [];
    try {
        if (useFirebase) {
            const delSnap = await getDocs(collection(db, "druetto_deleted_products"));
            deletedRecords = delSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } else {
            deletedRecords = await localDb.getCollection("deleted_products");
        }
    } catch (e) {
        console.warn("Error al cargar lista de eliminados:", e);
    }

    const deletedIds = new Set(deletedRecords.map(d => d.id).filter(Boolean));
    const deletedCodes = new Set(deletedRecords.map(d => d.code).filter(Boolean));

    // Filtrar desactualizados y nuevos
    const updates = [];
    const newProducts = [];
    
    for (const localProduct of SEED_PRODUCTS) {
        if (deletedIds.has(localProduct.id) || (localProduct.code && deletedCodes.has(localProduct.code))) {
            continue;
        }

        const dbProduct = productsList.find(p => p.code === localProduct.code || p.id === localProduct.id);
        if (dbProduct) {
            const priceChanged = dbProduct.price !== localProduct.price;
            const localImgs = localProduct.images || [];
            const dbImgs = dbProduct.images || [];
            const imagesChanged = JSON.stringify(localImgs) !== JSON.stringify(dbImgs);
            
            if (priceChanged || imagesChanged) {
                updates.push({ dbProduct, localProduct, priceChanged, imagesChanged });
            }
        } else {
            newProducts.push(localProduct);
        }
    }

    if (updates.length === 0 && newProducts.length === 0) {
        alertFn("Sincronización Completa", "La base de datos ya está completamente sincronizada con el código local.", "info");
        return;
    }

    let confirmMsg = "Se encontraron los siguientes cambios pendientes:\n";
    if (updates.length > 0) {
        confirmMsg += `• ${updates.length} productos con precios o imágenes desactualizados.\n`;
    }
    if (newProducts.length > 0) {
        confirmMsg += `• ${newProducts.length} productos nuevos para agregar.\n`;
    }
    confirmMsg += `\n¿Desea aplicar estos cambios ahora?`;

    confirmFn("Confirmar Sincronización", confirmMsg, async () => {
        let updateCount = 0;
        let insertCount = 0;

        for (const item of updates) {
            const p = item.dbProduct;
            p.price = item.localProduct.price;
            p.images = item.localProduct.images;
            p.desc = item.localProduct.desc;
            p.brand = item.localProduct.brand;
            p.category = item.localProduct.category;

            try {
                if (useFirebase) {
                    await setDoc(doc(db, "druetto_products", p.id), p).catch(() => {});
                }
                await localDb.setDoc("products", p.id, p).catch(() => {});
                updateCount++;
            } catch (e) {
                updateCount++;
            }
        }

        for (const p of newProducts) {
            try {
                if (useFirebase) {
                    await setDoc(doc(db, "druetto_products", p.id), p).catch(() => {});
                }
                await localDb.setDoc("products", p.id, p).catch(() => {});
                if (!productsList.find(x => x.id === p.id)) {
                    productsList.push(p);
                }
                insertCount++;
            } catch (e) {
                if (!productsList.find(x => x.id === p.id)) {
                    productsList.push(p);
                }
                insertCount++;
            }
        }

        alertFn(
            "Sincronización Finalizada",
            `Se han procesado correctamente todos los productos:\n\n• Productos actualizados: ${updateCount}\n• Productos nuevos agregados: ${insertCount}`,
            "success",
            async () => {
                await initProductsView();
            }
        );
    });
};


