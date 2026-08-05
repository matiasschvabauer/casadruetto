// ═══════════════════════════════════════════════════════════════════
// web-alerts.js — Sistema de Alertas, Toasts y Modales Web Elegantes
// ═══════════════════════════════════════════════════════════════════

(function() {
    // Inyectar estilos CSS para el sistema de alertas si no existen
    if (!document.getElementById('web-alerts-styles')) {
        const style = document.createElement('style');
        style.id = 'web-alerts-styles';
        style.innerHTML = `
            .web-alert-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(15, 23, 42, 0.75);
                backdrop-filter: blur(4px);
                z-index: 99999;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 1rem;
                opacity: 0;
                animation: webAlertFadeIn 0.25s forwards cubic-bezier(0.16, 1, 0.3, 1);
            }

            @keyframes webAlertFadeIn {
                to { opacity: 1; }
            }

            .web-alert-modal {
                background: #1e232a;
                border: 1px solid #333944;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
                border-radius: 14px;
                width: 100%;
                max-width: 440px;
                padding: 1.75rem;
                text-align: center;
                transform: scale(0.9);
                animation: webAlertZoomIn 0.25s forwards cubic-bezier(0.16, 1, 0.3, 1);
            }

            @keyframes webAlertZoomIn {
                to { transform: scale(1); }
            }

            .web-alert-icon {
                width: 56px;
                height: 56px;
                border-radius: 50%;
                margin: 0 auto 1.25rem auto;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
            }

            .web-alert-icon.success { background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3); }
            .web-alert-icon.error { background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); }
            .web-alert-icon.info { background: rgba(245, 158, 11, 0.15); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.3); }

            .web-alert-title {
                color: #ffffff;
                font-size: 1.2rem;
                font-weight: 700;
                margin-bottom: 0.5rem;
            }

            .web-alert-text {
                color: #94a3b8;
                font-size: 0.92rem;
                line-height: 1.5;
                margin-bottom: 1.5rem;
            }

            .web-alert-buttons {
                display: flex;
                gap: 0.75rem;
                justify-content: center;
            }

            .web-alert-btn {
                padding: 0.65rem 1.5rem;
                border-radius: 8px;
                font-weight: 600;
                font-size: 0.9rem;
                cursor: pointer;
                border: none;
                transition: all 0.2s;
            }

            .web-alert-btn-primary {
                background: #f59e0b;
                color: #0f172a;
            }
            .web-alert-btn-primary:hover { background: #d97706; }

            .web-alert-btn-secondary {
                background: #333944;
                color: #cbd5e1;
            }
            .web-alert-btn-secondary:hover { background: #475569; }

            /* TOAST FLOATING NOTIFICATION */
            .web-toast-container {
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                z-index: 999999;
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                pointer-events: none;
            }

            .web-toast {
                background: #0f172a;
                color: #ffffff;
                border: 1px solid #f59e0b;
                box-shadow: 0 10px 25px rgba(0,0,0,0.5);
                border-radius: 8px;
                padding: 0.75rem 1.25rem;
                font-size: 0.9rem;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 0.6rem;
                pointer-events: auto;
                opacity: 0;
                transform: translateY(1rem);
                animation: toastIn 0.3s forwards cubic-bezier(0.16, 1, 0.3, 1);
            }

            @keyframes toastIn {
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }

    // Contenedor global de toasts
    let toastContainer = document.getElementById('web-toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'web-toast-container';
        toastContainer.className = 'web-toast-container';
        document.body.appendChild(toastContainer);
    }

    // Función Alerta Web
    window.showWebAlert = function(title, text, type = 'success', onConfirm = null) {
        const overlay = document.createElement('div');
        overlay.className = 'web-alert-overlay';

        const iconMap = {
            success: 'fa-check',
            error: 'fa-times',
            info: 'fa-info'
        };

        overlay.innerHTML = `
            <div class="web-alert-modal">
                <div class="web-alert-icon ${type}">
                    <i class="fas ${iconMap[type] || 'fa-info'}"></i>
                </div>
                <div class="web-alert-title">${title}</div>
                <div class="web-alert-text">${text}</div>
                <div class="web-alert-buttons">
                    <button class="web-alert-btn web-alert-btn-primary" id="web-alert-ok-btn">Aceptar</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        const okBtn = overlay.querySelector('#web-alert-ok-btn');
        okBtn.focus();
        okBtn.addEventListener('click', () => {
            overlay.remove();
            if (onConfirm) onConfirm();
        });
    };

    // Función Confirmación Web
    window.showWebConfirm = function(title, text, onConfirm = null, onCancel = null) {
        const overlay = document.createElement('div');
        overlay.className = 'web-alert-overlay';

        overlay.innerHTML = `
            <div class="web-alert-modal">
                <div class="web-alert-icon info">
                    <i class="fas fa-question"></i>
                </div>
                <div class="web-alert-title">${title}</div>
                <div class="web-alert-text">${text}</div>
                <div class="web-alert-buttons">
                    <button class="web-alert-btn web-alert-btn-secondary" id="web-confirm-cancel-btn">Cancelar</button>
                    <button class="web-alert-btn web-alert-btn-primary" id="web-confirm-ok-btn">Aceptar</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        const okBtn = overlay.querySelector('#web-confirm-ok-btn');
        const cancelBtn = overlay.querySelector('#web-confirm-cancel-btn');

        okBtn.addEventListener('click', () => {
            overlay.remove();
            if (onConfirm) onConfirm();
        });

        cancelBtn.addEventListener('click', () => {
            overlay.remove();
            if (onCancel) onCancel();
        });
    };

    // Función Toast Notificación
    window.showWebToast = function(message, duration = 3000) {
        const container = document.getElementById('web-toast-container') || document.body;
        const toast = document.createElement('div');
        toast.className = 'web-toast';
        toast.innerHTML = `<i class="fas fa-info-circle" style="color:#f59e0b;"></i> <span>${message}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(1rem)';
            toast.style.transition = 'all 0.3s';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    };

    // Función Copiar al Portapapeles
    window.copyContactDetail = window.copyToClipboard = function(text, labelOrElement) {
        let label = typeof labelOrElement === 'string' ? labelOrElement : 'Dato';
        
        function doCopySuccess() {
            window.showWebToast(`📋 Copiado al portapapeles: ${text}`);
            if (labelOrElement && typeof labelOrElement === 'object' && labelOrElement.nodeType) {
                const originalHTML = labelOrElement.innerHTML;
                labelOrElement.style.transition = 'all 0.3s';
                labelOrElement.style.opacity = '0.7';
                setTimeout(() => { labelOrElement.style.opacity = '1'; }, 1500);
            }
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(doCopySuccess).catch(() => {
                fallbackCopyText(text, doCopySuccess);
            });
        } else {
            fallbackCopyText(text, doCopySuccess);
        }
    };

    function fallbackCopyText(text, callback) {
        try {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "fixed";
            textArea.style.left = "-999999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            if (callback) callback();
        } catch (e) {
            window.showWebToast(`📋 Copiado: ${text}`);
        }
    }

    // Handler universal de envío de formulario de contacto por Gmail / Mailto
    window.handleContactFormSubmit = function(e, form) {
        if (e) e.preventDefault();
        if (!form) return;
        
        const inputs = form.querySelectorAll('input, textarea');
        let name = '', email = '', phone = '', subject = 'Consulta Web Casa Druetto', message = '';

        inputs.forEach(input => {
            const type = (input.type || '').toLowerCase();
            const placeholder = (input.placeholder || '').toLowerCase();
            const labelText = (input.previousElementSibling?.innerText || '').toLowerCase();
            const id = (input.id || '').toLowerCase();

            if (id.includes('name') || placeholder.includes('nombre') || labelText.includes('nombre')) {
                name = input.value;
            } else if (type === 'email' || id.includes('email') || placeholder.includes('correo') || labelText.includes('correo') || labelText.includes('email')) {
                email = input.value;
            } else if (type === 'tel' || id.includes('phone') || placeholder.includes('whatsapp') || labelText.includes('whatsapp') || labelText.includes('celular')) {
                phone = input.value;
            } else if (id.includes('subject') || placeholder.includes('asunto') || labelText.includes('asunto')) {
                subject = input.value;
            } else if (input.tagName === 'TEXTAREA' || id.includes('message') || placeholder.includes('consulta') || labelText.includes('mensaje')) {
                message = input.value;
            }
        });

        const mailBody = `Hola Casa Druetto S.A.,\n\nMi nombre es: ${name}\nTeléfono/WhatsApp: ${phone}\nCorreo: ${email}\n\nMensaje / Consulta:\n${message}\n\nEnviado desde el formulario web casadruetto.com.ar`;
        
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=contacto@casadruetto.com.ar&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailBody)}`;
        const mailtoUrl = `mailto:contacto@casadruetto.com.ar?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailBody)}`;

        // Intentar abrir Gmail Web o cliente mailto
        const opened = window.open(gmailUrl, '_blank');
        if (!opened) {
            window.location.href = mailtoUrl;
        }

        if (window.showWebAlert) {
            window.showWebAlert('¡Gracias por tu mensaje!', 'Se ha abierto la redacción de tu consulta dirigida a contacto@casadruetto.com.ar.', 'success');
        }
        form.reset();
    };
})();
