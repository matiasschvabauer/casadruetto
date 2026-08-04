// ═══════════════════════════════════════════════════════════════════
// cart.js — Gestión del Carrito de Compras y Checkout
// ═══════════════════════════════════════════════════════════════════

const CART_KEY = 'druetto_cart';
const CART_TIME_KEY = 'druetto_cart_time';

// Configuración por defecto (Autoadministrable desde admin/configuracion)
let shopConfig = {
    whatsappNumber: '5493404521246',
    address: 'Gálvez, Santa Fe, Argentina',
    bankDetails: 'Banco Nación - Alias: CASA.DRUETTO.AGRO - CBU: 0110123456789012345678',
    mpToken: 'APP_USR-1747970079974544-072115-89ac0d6eee5dddd49885c412382f1318-648344334'
};

// Cargar configuración guardada
function loadConfig() {
    const stored = localStorage.getItem('druetto_config');
    if (stored) {
        try {
            shopConfig = { ...shopConfig, ...JSON.parse(stored) };
        } catch (e) {
            console.error("Error loading config:", e);
        }
    }
}

let cart = [];

window.getCart = () => cart;

// Cargar carrito con caducidad automática tras 24 horas
function loadCart() {
    const storedTime = localStorage.getItem(CART_TIME_KEY);
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;

    // Si pasaron más de 24 horas desde la última adición, vaciar el carrito
    if (storedTime && (now - parseInt(storedTime, 10)) > twentyFourHours) {
        cart = [];
        localStorage.removeItem(CART_KEY);
        localStorage.removeItem(CART_TIME_KEY);
        console.log("[Carrito] Pasaron más de 24 horas desde el último producto guardado. Carrito limpiado automáticamente.");
    } else {
        const stored = localStorage.getItem(CART_KEY);
        if (stored) {
            try {
                cart = JSON.parse(stored);
            } catch (e) {
                cart = [];
            }
        }
    }
    updateCartIcon();
}

function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    if (cart.length > 0) {
        localStorage.setItem(CART_TIME_KEY, Date.now().toString());
    } else {
        localStorage.removeItem(CART_TIME_KEY);
    }
    updateCartIcon();
    renderCartItems();
}

// Obtener cotización de Dólar para conversión a ARS en Mercado Pago
async function fetchCurrentDollarRate() {
    try {
        const res = await fetch('https://dolarapi.com/v1/dolares/oficial');
        if (res.ok) {
            const data = await res.json();
            if (data && data.venta) return parseFloat(data.venta);
        }
    } catch (e) {
        console.warn("No se pudo obtener cotización del dólar en tiempo real. Usando fallback de $1250 ARS.", e);
    }
    return 1250.00;
}

// Método global para agregar al carrito
window.addToCart = function(id, name, code, price, img, qty = 1) {
    const existing = cart.find(item => item.id === id);
    const parsedPrice = parseFloat(price) || 0;
    
    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({
            id,
            name,
            code: code || 'S/C',
            price: parsedPrice,
            currency: 'USD',
            img: img || 'assets/img/casadruettologo1.png',
            qty
        });
    }
    saveCart();
    showToast(`"${name}" agregado al carrito.`);
};

window.removeFromCart = function(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
};

window.updateQty = function(id, delta) {
    const item = cart.find(x => x.id === id);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) {
            removeFromCart(id);
        } else {
            saveCart();
        }
    }
};

function updateCartIcon() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
        const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
        badge.innerText = totalItems;
        badge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Renderiza los items en el modal/drawer del carrito
function renderCartItems() {
    const container = document.getElementById('cart-items-container');
    if (!container) return;

    container.innerHTML = '';
    if (cart.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding:3rem 1rem; color:#888;">
                <i class="fas fa-shopping-cart" style="font-size:3rem; margin-bottom:1rem; color:#444;"></i>
                <p>El carrito está vacío.</p>
            </div>
        `;
        const totalEl = document.getElementById('cart-total-amount');
        if (totalEl) totalEl.innerText = '$0.00 USD';
        return;
    }

    let grandTotalUSD = 0;

    cart.forEach(item => {
        const itemSubtotal = item.price * item.qty;
        grandTotalUSD += itemSubtotal;
        
        const div = document.createElement('div');
        div.className = 'cart-item-row';
        div.innerHTML = `
            <img src="${item.img}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-details">
                <h4 class="cart-item-name">${item.name}</h4>
                <p class="cart-item-code">Código: ${item.code}</p>
                <div class="cart-item-price-qty">
                    <span class="cart-item-price">$${item.price.toLocaleString('es-AR', { minimumFractionDigits: 2 })} USD</span>
                    <div class="cart-qty-selector">
                        <button onclick="updateQty('${item.id}', -1)">-</button>
                        <span>${item.qty}</span>
                        <button onclick="updateQty('${item.id}', 1)">+</button>
                    </div>
                </div>
            </div>
            <button class="cart-item-delete" onclick="removeFromCart('${item.id}')">
                <i class="fas fa-trash"></i>
            </button>
        `;
        container.appendChild(div);
    });

    const totalEl = document.getElementById('cart-total-amount');
    if (totalEl) {
        totalEl.innerText = `$${grandTotalUSD.toLocaleString('es-AR', { minimumFractionDigits: 2 })} USD`;
    }
}

// Abre/Cierra el Drawer del Carrito
window.toggleCart = function(forceOpen = null) {
    const drawer = document.getElementById('cart-drawer');
    if (!drawer) return;
    
    if (forceOpen === true) {
        drawer.classList.add('open');
        renderCartItems();
    } else if (forceOpen === false) {
        drawer.classList.remove('open');
    } else {
        drawer.classList.toggle('open');
        if (drawer.classList.contains('open')) {
            renderCartItems();
        }
    }
};

// Checkout Online con Mercado Pago (Conversión automática U$S -> ARS)
window.checkoutMercadoPago = async function() {
    if (cart.length === 0) {
        alert("El carrito está vacío.");
        return;
    }

    const clientName = document.getElementById('checkout-name')?.value || '';
    const clientPhone = document.getElementById('checkout-phone')?.value || '';
    
    if (!clientName || !clientPhone) {
        alert("Por favor completa tu Nombre y Teléfono antes de continuar con el pago de Mercado Pago.");
        return;
    }

    const mpBtn = document.getElementById('mp-checkout-btn');
    if (mpBtn) {
        mpBtn.disabled = true;
        mpBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Obteniendo cotización U$S...';
    }

    const token = shopConfig.mpToken || 'APP_USR-1747970079974544-072115-89ac0d6eee5dddd49885c412382f1318-648344334';

    try {
        // Obtener la cotización oficial del dólar en tiempo real
        const dollarRate = await fetchCurrentDollarRate();

        // Convertir items en USD a Pesos Argentinos (ARS) para Mercado Pago
        const mpItems = cart.map(item => {
            const unitPriceARS = Math.max(100, Math.round(Number(item.price) * dollarRate));

            return {
                title: item.name,
                description: `Cód: ${item.code} (Cotización U$S 1 = $${dollarRate} ARS)`,
                quantity: Number(item.qty),
                unit_price: unitPriceARS,
                currency_id: 'ARS'
            };
        });

        const totalARS = mpItems.reduce((acc, i) => acc + (i.unit_price * i.quantity), 0);

        if (mpBtn) {
            mpBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Conectando con Mercado Pago...';
        }

        const preferenceData = {
            items: mpItems,
            payer: {
                name: clientName,
                phone: { number: clientPhone }
            },
            back_urls: {
                success: window.location.origin + window.location.pathname + '?status=approved',
                failure: window.location.origin + window.location.pathname + '?status=failure',
                pending: window.location.origin + window.location.pathname + '?status=pending'
            },
            auto_return: "approved"
        };

        const res = await fetch("https://api.mercadopago.com/checkout/preferences", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(preferenceData)
        });

        const data = await res.json();
        console.log("[Mercado Pago] Preferencia de cobro en ARS creada:", data);

        if (data.init_point) {
            try {
                const existingOrders = JSON.parse(localStorage.getItem('druetto_orders') || '[]');
                const newOrder = {
                    id: 'MP-' + Math.floor(100000 + Math.random() * 900000),
                    client: clientName,
                    phone: clientPhone,
                    total: totalARS,
                    currency: 'ARS',
                    status: 'pending',
                    paymentMethod: 'Mercado Pago',
                    date: new Date().toLocaleDateString('es-AR'),
                    createdAt: new Date().toISOString(),
                    items: cart.map(i => ({ id: i.id, name: i.name, qty: i.qty, price: i.price }))
                };
                existingOrders.push(newOrder);
                localStorage.setItem('druetto_orders', JSON.stringify(existingOrders));
            } catch (e) {}

            cart = [];
            saveCart();
            window.location.href = data.init_point;
        } else {
            throw new Error(data.message || "No se pudo generar la pasarela de pago.");
        }

    } catch (err) {
        console.error("Error al procesar cobro con Mercado Pago:", err);
        alert("No se pudo iniciar el cobro online con Mercado Pago: " + err.message + "\n\nTe redireccionaremos para enviar el pedido por WhatsApp.");
        window.checkoutOrder('mp');
    } finally {
        if (mpBtn) {
            mpBtn.disabled = false;
            mpBtn.innerHTML = '<i class="fas fa-credit-card"></i> Pagar con Mercado Pago';
        }
    }
};

// Checkout: Generar texto estructurado para WhatsApp / Transferencia
window.checkoutOrder = function(paymentMethod = 'whatsapp') {
    if (cart.length === 0) {
        alert("El carrito está vacío.");
        return;
    }

    const clientName = document.getElementById('checkout-name')?.value || '';
    const clientPhone = document.getElementById('checkout-phone')?.value || '';
    const clientNotes = document.getElementById('checkout-notes')?.value || '';
    
    if (!clientName || !clientPhone) {
        alert("Por favor completa tu Nombre y Teléfono de contacto para realizar el pedido.");
        return;
    }

    let text = `🌾 *CASA DRUETTO - Nuevo Pedido de Tienda Web* 🌾\n\n`;
    text += `*Cliente:* ${clientName}\n`;
    text += `*WhatsApp:* ${clientPhone}\n`;
    if (clientNotes) text += `*Notas:* ${clientNotes}\n`;
    text += `----------------------------------------------\n\n`;

    let total = 0;
    cart.forEach(item => {
        const subtotal = item.price * item.qty;
        total += subtotal;
        text += `• ${item.qty}x ${item.name}\n  _Código:_ ${item.code}\n  _Precio:_ $${item.price.toLocaleString('es-AR', { minimumFractionDigits: 2 })} | _Subtotal:_ $${subtotal.toLocaleString('es-AR', { minimumFractionDigits: 2 })}\n\n`;
    });

    text += `----------------------------------------------\n`;
    text += `*TOTAL DEL PEDIDO: $${total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}*\n\n`;

    if (paymentMethod === 'bank') {
        text += `*Método de Pago Seleccionado:* Transferencia Bancaria\n`;
        text += `_Por favor envíe el comprobante de transferencia al CBU indicado._\n\n`;
        alert(`Datos de Transferencia Bancaria:\n\n${shopConfig.bankDetails}\n\nPresione Aceptar para enviar el pedido por WhatsApp.`);
    } else if (paymentMethod === 'mp') {
        text += `*Método de Pago Seleccionado:* Mercado Pago / Online\n`;
        text += `_Deseo recibir el link de pago online para abonar._\n\n`;
    } else {
        text += `*Método de Pago Seleccionado:* Acuerdo con el Vendedor / WhatsApp\n\n`;
    }

    text += `_Pedido enviado desde la Tienda Virtual._`;

    // Registrar la orden localmente para el panel de admin
    try {
        const existingOrders = JSON.parse(localStorage.getItem('druetto_orders') || '[]');
        const newOrder = {
            id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
            client: clientName,
            phone: clientPhone,
            notes: clientNotes,
            total: total,
            status: 'pending',
            date: new Date().toLocaleDateString('es-AR'),
            createdAt: new Date().toISOString(),
            items: cart.map(i => ({ id: i.id, name: i.name, qty: i.qty, price: i.price }))
        };
        existingOrders.push(newOrder);
        localStorage.setItem('druetto_orders', JSON.stringify(existingOrders));
    } catch (e) {
        console.error("Error al registrar orden local:", e);
    }

    const encodedText = encodeURIComponent(text);
    const waUrl = `https://wa.me/${shopConfig.whatsappNumber}?text=${encodedText}`;
    
    cart = [];
    saveCart();
    window.toggleCart(false);

    window.open(waUrl, '_blank');
};

// Notificaciones flotantes rápidas
function showToast(message) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerText = message;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Inyección de estilos de notificación y drawer dinámicamente si es necesario
document.addEventListener('DOMContentLoaded', () => {
    loadConfig();
    loadCart();

    // Crear la UI del Drawer si no existe en la página
    const drawerHtml = `
        <div id="cart-drawer" class="cart-drawer">
            <div class="cart-header">
                <h3><i class="fas fa-shopping-cart"></i> Mi Carrito</h3>
                <button onclick="toggleCart(false)" class="cart-close-btn">&times;</button>
            </div>
            <div id="cart-items-container" class="cart-items-container">
                <!-- Se llena dinámicamente -->
            </div>
            <div class="cart-checkout-form">
                <div class="cart-total-row">
                    <span>Total:</span>
                    <span id="cart-total-amount">$0.00</span>
                </div>
                
                <div class="checkout-form-container">
                    <h4>Datos para concretar la compra:</h4>
                    <input type="text" id="checkout-name" placeholder="Nombre completo *" required>
                    <input type="tel" id="checkout-phone" placeholder="WhatsApp / Teléfono *" required>
                    <textarea id="checkout-notes" placeholder="Notas sobre el envío o detalles especiales"></textarea>
                </div>

                <div class="checkout-options-grid" style="display:flex; flex-direction:column; gap:0.5rem;">
                    <button class="checkout-btn mp-checkout-btn" id="mp-checkout-btn" onclick="checkoutMercadoPago()" style="background:#009ee3; color:#fff; font-weight:700; padding:0.75rem; border:none; border-radius:6px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px;">
                        <i class="fas fa-credit-card"></i> Pagar con Mercado Pago
                    </button>
                    <div style="display:flex; gap:0.5rem;">
                        <button class="checkout-btn wa-checkout-btn" onclick="checkoutOrder('whatsapp')" style="flex:1;">
                            <i class="fab fa-whatsapp"></i> Pedir por WhatsApp
                        </button>
                        <button class="checkout-btn bank-checkout-btn" onclick="checkoutOrder('bank')" style="flex:1;">
                            <i class="fas fa-university"></i> Transferencia
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div id="cart-overlay" onclick="toggleCart(false)"></div>
    `;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = drawerHtml;
    while (tempDiv.firstChild) {
        document.body.appendChild(tempDiv.firstChild);
    }

    // Inyectar botón de menú hamburguesa responsivo dinámicamente si no existe
    const headerActions = document.querySelector('.header-actions');
    if (headerActions && !document.getElementById('mobile-menu-toggle')) {
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'mobile-menu-toggle';
        toggleBtn.id = 'mobile-menu-toggle';
        toggleBtn.setAttribute('aria-label', 'Abrir menú');
        toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
        
        // Insertar el botón al final de headerActions
        headerActions.appendChild(toggleBtn);
        
        // Manejar el toggle del menú
        const navContainer = document.querySelector('.header-nav-row') || document.querySelector('.nav-menu');
        if (navContainer) {
            toggleBtn.addEventListener('click', () => {
                navContainer.classList.toggle('active');
                const icon = toggleBtn.querySelector('i');
                if (icon) {
                    if (navContainer.classList.contains('active')) {
                        icon.className = 'fas fa-times';
                    } else {
                        icon.className = 'fas fa-bars';
                    }
                }
            });
        }
    }

    // Detectar si el usuario viene redirigido de un pago de Mercado Pago
    const urlParams = new URLSearchParams(window.location.search);
    const mpStatus = urlParams.get('status');
    if (mpStatus === 'approved') {
        try {
            const existingOrders = JSON.parse(localStorage.getItem('druetto_orders') || '[]');
            if (existingOrders.length > 0) {
                const lastOrder = existingOrders[existingOrders.length - 1];
                if (lastOrder && lastOrder.status === 'pending') {
                    lastOrder.status = 'approved';
                    localStorage.setItem('druetto_orders', JSON.stringify(existingOrders));
                }
            }
        } catch (e) {}

        showToast("🎉 ¡Pago acreditado con éxito por Mercado Pago! Tu orden fue registrada.");
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});
