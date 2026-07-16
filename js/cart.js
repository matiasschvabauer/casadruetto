// ═══════════════════════════════════════════════════════════════════
// cart.js — Gestión del Carrito de Compras y Checkout
// ═══════════════════════════════════════════════════════════════════

const CART_KEY = 'druetto_cart';

// Configuración por defecto (Autoadministrable desde admin/configuracion)
let shopConfig = {
    whatsappNumber: '5493404521246',
    address: 'Gálvez, Santa Fe, Argentina',
    bankDetails: 'Banco Nación - Alias: CASA.DRUETTO.AGRO - CBU: 0110123456789012345678',
    mpToken: ''
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

function loadCart() {
    const stored = localStorage.getItem(CART_KEY);
    if (stored) {
        try {
            cart = JSON.parse(stored);
        } catch (e) {
            cart = [];
        }
    }
    updateCartIcon();
}

function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartIcon();
    renderCartItems();
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
            img: img || 'assets/img/default.png',
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
        if (totalEl) totalEl.innerText = '$0.00';
        return;
    }

    let grandTotal = 0;

    cart.forEach(item => {
        const itemSubtotal = item.price * item.qty;
        grandTotal += itemSubtotal;
        
        const div = document.createElement('div');
        div.className = 'cart-item-row';
        div.innerHTML = `
            <img src="${item.img}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-details">
                <h4 class="cart-item-name">${item.name}</h4>
                <p class="cart-item-code">Código: ${item.code}</p>
                <div class="cart-item-price-qty">
                    <span class="cart-item-price">$${item.price.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
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
        totalEl.innerText = `$${grandTotal.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;
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

// Checkout: Generar texto estructurado para WhatsApp
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
        // Mostrar datos de transferencia
        alert(`Datos de Transferencia Bancaria:\n\n${shopConfig.bankDetails}\n\nPresione Aceptar para enviar el pedido por WhatsApp.`);
    } else if (paymentMethod === 'mp') {
        text += `*Método de Pago Seleccionado:* Mercado Pago / Online\n`;
        text += `_Deseo recibir el link de pago online para abonar._\n\n`;
    } else {
        text += `*Método de Pago Seleccionado:* Acuerdo con el Vendedor / WhatsApp\n\n`;
    }

    text += `_Pedido enviado desde la Tienda Virtual._`;

    const encodedText = encodeURIComponent(text);
    const waUrl = `https://wa.me/${shopConfig.whatsappNumber}?text=${encodedText}`;
    
    // Limpiar carrito al finalizar pedido exitosamente
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
                    <input type="text" id="checkout-name" placeholder="Nombre completo" required>
                    <input type="tel" id="checkout-phone" placeholder="WhatsApp / Teléfono" required>
                    <textarea id="checkout-notes" placeholder="Notas sobre el envío o detalles especiales"></textarea>
                </div>

                <div class="checkout-options-grid">
                    <button class="checkout-btn wa-checkout-btn" onclick="checkoutOrder('whatsapp')">
                        <i class="fab fa-whatsapp"></i> Comprar por WhatsApp
                    </button>
                    <button class="checkout-btn bank-checkout-btn" onclick="checkoutOrder('bank')">
                        <i class="fas fa-university"></i> Pagar por Transferencia
                    </button>
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
});
