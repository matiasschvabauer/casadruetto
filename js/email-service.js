// ═══════════════════════════════════════════════════════════════════
// email-service.js — Servicio de Envio de Correos para Casa Druetto
// Destino Principal: casadruettosa@gmail.com
// ═══════════════════════════════════════════════════════════════════

const ADMIN_EMAIL = 'casadruettosa@gmail.com';
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyzfyi5Cb-6I9ojzAaRiXuVDzlIlVddEOop-txsQsBWNLlNS0W32_YsNdTo8jC4wQQUqQ/exec';

/**
 * Notificar pedido de venta a casadruettosa@gmail.com y cliente vía Google Apps Script
 */
window.sendOrderToAdmin = async function(orderData) {
    console.log('[EmailService] Notificando venta vía Google Apps Script a:', ADMIN_EMAIL, orderData);

    let itemsText = orderData.items.map(item => `• ${item.name} (x${item.qty}) - $${item.price} ${item.currency || 'USD'}`).join('\n');
    
    // Guardar en localStorage para el panel de administración
    saveOrderToLocalHistory(orderData);

    try {
        // 1. Notificación al Administrador (casadruettosa@gmail.com)
        await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'admin_order',
                orderId: orderData.id || ('ORD-' + Math.floor(100000 + Math.random() * 900000)),
                customerName: orderData.customerName || 'No especificado',
                customerEmail: orderData.customerEmail || 'No especificado',
                customerPhone: orderData.customerPhone || 'No especificado',
                paymentMethod: orderData.paymentMethod || 'A coordinar / WhatsApp',
                orderDetails: itemsText,
                totalUSD: orderData.totalUSD
            })
        });
        console.log('[EmailService] Notificación de venta enviada a casadruettosa@gmail.com');
        return true;
    } catch (e) {
        console.warn('[EmailService] Error enviando correo vía Apps Script:', e);
        return false;
    }
};

/**
 * Notificar comprobante al comprador
 */
window.sendOrderConfirmationToCustomer = async function(orderData) {
    if (!orderData.customerEmail) return false;
    console.log('[EmailService] Enviando comprobante a comprador:', orderData.customerEmail);

    let itemsText = orderData.items.map(item => `• ${item.name} (x${item.qty}) - $${item.price} ${item.currency || 'USD'}`).join('\n');

    try {
        await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'customer_receipt',
                customerName: orderData.customerName || 'Cliente',
                customerEmail: orderData.customerEmail,
                orderDetails: itemsText,
                totalUSD: orderData.totalUSD
            })
        });
        console.log('[EmailService] Comprobante enviado con éxito al cliente:', orderData.customerEmail);
        return true;
    } catch (e) {
        console.warn('[EmailService] Error enviando comprobante al cliente:', e);
        return false;
    }
};

/**
 * Enviar recordatorio de Carrito Abandonado
 */
window.sendAbandonedCartReminder = async function(cartItems, userEmail) {
    if (!userEmail || !cartItems || cartItems.length === 0) return false;
    console.log('[EmailService] 🛒 Registrando carrito abandonado para:', userEmail);

    const abandonedLog = {
        email: userEmail,
        itemsCount: cartItems.length,
        items: cartItems.map(i => ({ name: i.name, qty: i.qty, price: i.price })),
        timestamp: new Date().toISOString(),
        status: 'Pendiente de recuperación'
    };

    // Guardar en historial local de carritos abandonados para el panel de administración
    let abandonments = JSON.parse(localStorage.getItem('druetto_abandoned_carts') || '[]');
    abandonments.unshift(abandonedLog);
    localStorage.setItem('druetto_abandoned_carts', JSON.stringify(abandonments.slice(0, 50)));

    // Si EmailJS está activo, enviar correo de recuperación al cliente
    if (window.emailjs && EMAILJS_CONFIG.publicKey !== 'user_casadruettokey') {
        try {
            await emailjs.send(EMAILJS_CONFIG.serviceID, EMAILJS_CONFIG.abandonedTemplateID, {
                to_email: userEmail,
                cart_summary: cartItems.map(i => `${i.name} (x${i.qty})`).join(', ')
            });
            console.log('[EmailService] Email de carrito abandonado enviado a:', userEmail);
        } catch (e) {
            console.warn('[EmailService] No se pudo enviar email de carrito abandonado.', e);
        }
    }
    return true;
};

/**
 * Guardar pedido en historial local del administrador
 */
function saveOrderToLocalHistory(orderData) {
    try {
        let orders = JSON.parse(localStorage.getItem('druetto_orders_history') || '[]');
        orders.unshift({
            ...orderData,
            date: new Date().toISOString()
        });
        localStorage.setItem('druetto_orders_history', JSON.stringify(orders.slice(0, 100)));
    } catch (e) {
        console.error('[EmailService] Error guardando pedido en historial:', e);
    }
}
