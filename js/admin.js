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
    addDoc
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
}

// ─── B. PRODUCT MANAGEMENT VIEW ────────────────────────────────────
let activeSpecs = {};

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

function renderProductsTable() {
    const tbody = document.getElementById('admin-products-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (productsList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#888;">El catálogo está vacío.</td></tr>';
        return;
    }

    productsList.forEach(p => {
        const tr = document.createElement('tr');
        const imgUrl = p.images?.[0] ? (p.images[0].startsWith('http') || p.images[0].startsWith('data:') || p.images[0].startsWith('../') ? p.images[0] : '../' + p.images[0]) : '../assets/img/default.png';
        tr.innerHTML = `
            <td><img src="${imgUrl}" style="width:45px; height:45px; object-fit:contain; background:#000; border-radius:4px;"></td>
            <td><strong>${p.name}</strong><br><small style="color:var(--admin-text-muted);">Cód: ${p.code}</small></td>
            <td>$${p.price.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</td>
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
}

// Abrir Modal Crear
window.openProductCreateModal = function () {
    document.getElementById('modal-title').innerText = "Nuevo Producto";
    document.getElementById('product-form').reset();
    document.getElementById('product-id').value = "";
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
    const id = document.getElementById('product-id').value;
    const name = document.getElementById('product-name').value;
    const code = document.getElementById('product-code').value;
    const desc = document.getElementById('product-desc').value;
    const price = parseFloat(document.getElementById('product-price').value) || 0;
    const category = document.getElementById('product-category').value;
    const brand = document.getElementById('product-brand').value;
    const condition = document.getElementById('product-condition').value;
    const stock = parseInt(document.getElementById('product-stock').value) || 0;
    const imagesStr = document.getElementById('product-images').value;
    const mercadolibreLink = document.getElementById('product-ml-link').value;

    const existingImages = imagesStr ? imagesStr.split(',').map(img => img.trim()).filter(Boolean) : [];
    const uploadedImages = [];

    // Subir imágenes locales seleccionadas a Cloudinary
    const fileInput = document.getElementById('product-file-input');
    if (fileInput && fileInput.files.length > 0) {
        const progressContainer = document.getElementById('upload-progress-container');
        const statusText = document.getElementById('upload-status-text');

        if (progressContainer) progressContainer.style.display = 'block';

        try {
            for (let i = 0; i < fileInput.files.length; i++) {
                const file = fileInput.files[i];
                if (statusText) statusText.innerText = `Subiendo imagen ${i + 1} de ${fileInput.files.length}...`;

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
        } catch (uploadErr) {
            console.error("Error al subir imágenes a Cloudinary:", uploadErr);
            alert("Ocurrió un error al subir alguna de las imágenes locales. Se continuará guardando el producto con las imágenes ya subidas.");
        } finally {
            if (progressContainer) progressContainer.style.display = 'none';
            fileInput.value = ''; // Limpiar selector
        }
    }

    const images = [...existingImages, ...uploadedImages];

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
        category,
        brand,
        condition,
        stock,
        images,
        specs,
        mercadolibreLink
    };

    try {
        if (useFirebase) {
            const docId = id || doc(collection(db, "druetto_products")).id;
            await setDoc(doc(db, "druetto_products", docId), productData);
        } else {
            const docId = id || "prod_" + Date.now();
            await localDb.setDoc("products", docId, productData);
        }
        alert("Producto guardado con éxito.");
        toggleProductModal(false);
        await initProductsView();
    } catch (e) {
        console.error("Error al guardar producto:", e);
        alert("Error al guardar: " + e.message);
    }
};

// Eliminar Producto
window.deleteProductAction = async function (id) {
    if (!confirm("¿Está seguro de que desea eliminar este producto?")) return;
    try {
        if (useFirebase) {
            await deleteDoc(doc(db, "druetto_products", id));
        } else {
            await localDb.deleteDoc("products", id);
        }
        alert("Producto eliminado.");
        await initProductsView();
    } catch (e) {
        alert("Error: " + e.message);
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
    if (config) {
        try {
            const data = JSON.parse(config);
            document.getElementById('conf-wa').value = data.whatsappNumber || '';
            document.getElementById('conf-address').value = data.address || '';
            document.getElementById('conf-bank').value = data.bankDetails || '';
            document.getElementById('conf-mp-token').value = data.mpToken || '';
        } catch (e) { }
    }
}

window.saveConfigForm = function () {
    const whatsappNumber = document.getElementById('conf-wa').value.trim();
    const address = document.getElementById('conf-address').value.trim();
    const bankDetails = document.getElementById('conf-bank').value.trim();
    const mpToken = document.getElementById('conf-mp-token').value.trim();

    const data = {
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
                    await setDoc(doc(db, "druetto_categories", c.id), c);
                }
                categoriesList = defaultCats;
            }

            // Autosemilla de Productos Iniciales Completo
            if (productsList.length === 0) {
                try {
                    const { SEED_PRODUCTS } = await import('./products.js');
                    for (const p of SEED_PRODUCTS) {
                        await setDoc(doc(db, "druetto_products", p.id), p);
                    }
                    productsList = [...SEED_PRODUCTS];
                    console.log("[Firebase Seeding] Catálogo completo sembrado con éxito en Firestore.");
                } catch (importErr) {
                    console.error("Error importando/sembrando productos semilla en admin:", importErr);
                }
            }


            // Intento de órdenes
            try {
                const orderSnap = await getDocs(collection(db, "druetto_orders"));
                ordersList = orderSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            } catch (err) { ordersList = []; }
        } else {
            // Cargar de Local
            productsList = await localDb.getCollection("products");
            categoriesList = await localDb.getCollection("categories");
            ordersList = await localDb.getCollection("orders");
        }
    } catch (e) {
        console.error("Global data loading error:", e);
    }
}

