// ═══════════════════════════════════════════════════════════════════
// auth.js — Control de Sesión y Autenticación Administrativa
// ═══════════════════════════════════════════════════════════════════

import { auth, useFirebase } from './firebase-config.js';
import { 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

// Credenciales Administrativas Oficiales (Fallback Local)
const ADMIN_EMAIL = "contacto@casadruetto.com.ar";
const LOCAL_ADMIN_PASS = "druetto123";

// Helpers globales para consultar estado
window.isAdminUser = function() {
    if (useFirebase) {
        const user = auth.currentUser;
        return user ? user.email === ADMIN_EMAIL : false;
    } else {
        return localStorage.getItem("druetto_admin_logged") === "true";
    }
};

window.getCurrentUserEmail = function() {
    if (useFirebase) {
        return auth.currentUser ? auth.currentUser.email : null;
    } else {
        return window.isAdminUser() ? ADMIN_EMAIL : null;
    }
};

// ─── Login handler ────────────────────────────────────────────────
window.loginAdmin = async function(email, password) {
    const errorEl = document.getElementById('login-error');
    const submitBtn = document.getElementById('login-btn');
    
    if (errorEl) errorEl.style.display = 'none';
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Verificando...'; }

    try {
        if (useFirebase) {
            // Iniciar sesión con Firebase
            await signInWithEmailAndPassword(auth, email, password);
            if (auth.currentUser.email !== ADMIN_EMAIL) {
                throw new Error("El correo no está autorizado como administrador.");
            }
        } else {
            // Validación local (Fallback)
            if (email === ADMIN_EMAIL && password === LOCAL_ADMIN_PASS) {
                localStorage.setItem("druetto_admin_logged", "true");
                console.log("[Auth Fallback] Inicio de sesión exitoso localmente.");
                // Simular delay de red
                await new Promise(resolve => setTimeout(resolve, 800));
            } else {
                throw new Error("Correo o contraseña incorrectos.");
            }
        }
        
        // Redirigir al dashboard
        window.location.href = "dashboard.html";
        
    } catch (err) {
        console.error("Login failed:", err);
        if (errorEl) {
            errorEl.textContent = err.message || "Error al iniciar sesión.";
            errorEl.style.display = 'block';
        }
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Iniciar Sesión'; }
    }
};

// ─── Logout handler ───────────────────────────────────────────────
window.logoutAdmin = async function() {
    if (useFirebase) {
        await signOut(auth);
    } else {
        localStorage.removeItem("druetto_admin_logged");
    }
    window.location.href = "login.html";
};

// ─── Observer: Inicialización y cambios de estado ──────────────────
if (useFirebase) {
    onAuthStateChanged(auth, (user) => {
        const isAdmin = user ? user.email === ADMIN_EMAIL : false;
        handleAuthRedirect(isAdmin);
    });
} else {
    // Para fallback local, verificamos en el momento de carga
    document.addEventListener('DOMContentLoaded', () => {
        handleAuthRedirect(window.isAdminUser());
    });
}

// Control de redirecciones automáticas en páginas protegidas
function handleAuthRedirect(isLoggedIn) {
    const path = window.location.pathname;
    
    // Si estamos en login y ya está logueado -> ir a dashboard
    if (path.includes('login.html') && isLoggedIn) {
        window.location.href = "dashboard.html";
    }
    
    // Si estamos en cualquier otra página de administración (ej. dashboard, productos, etc.) y no está logueado -> ir a login
    if (!path.includes('login.html') && path.includes('/admin/') && !isLoggedIn) {
        window.location.href = "login.html";
    }
}
