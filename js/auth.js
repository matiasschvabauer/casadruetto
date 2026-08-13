// ═══════════════════════════════════════════════════════════════════
// auth.js — Control de Sesión, Google OAuth y Roles (Admin vs Cliente)
// ═══════════════════════════════════════════════════════════════════

import { auth, useFirebase } from './firebase-config.js';
import { 
    signInWithEmailAndPassword, 
    GoogleAuthProvider,
    signInWithPopup,
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

// Lista oficial de correos electrónicos administradores autorizados
const ADMIN_EMAILS = [
    "matiasschvabauer@gmail.com",
    "gabygatti94@gmail.com",
    "gaby.gatti94@gmail.com",
    "casadruettosa@gmail.com"
];

const LOCAL_ADMIN_PASS = "druetto123";

// ─── Helpers globales para consultar estado ───────────────────────
window.isAdminUser = function() {
    if (useFirebase) {
        const user = auth ? auth.currentUser : null;
        if (!user || !user.email) return false;
        return ADMIN_EMAILS.includes(user.email.toLowerCase().trim());
    } else {
        const localEmail = localStorage.getItem("druetto_user_email");
        if (localEmail && ADMIN_EMAILS.includes(localEmail.toLowerCase().trim())) {
            return true;
        }
        return localStorage.getItem("druetto_admin_logged") === "true";
    }
};

window.getCurrentUserEmail = function() {
    if (useFirebase) {
        return auth && auth.currentUser ? auth.currentUser.email : null;
    } else {
        return localStorage.getItem("druetto_user_email") || (window.isAdminUser() ? ADMIN_EMAILS[0] : null);
    }
};

window.getCurrentUser = function() {
    if (useFirebase) {
        return auth ? auth.currentUser : null;
    }
    return null;
};

// ─── Login con Google (Google Sign-In) ───────────────────────────
window.loginWithGoogle = async function() {
    const errorEl = document.getElementById('login-error');
    const googleBtn = document.getElementById('google-login-btn');
    
    if (errorEl) errorEl.style.display = 'none';
    if (googleBtn) { 
        googleBtn.disabled = true; 
        googleBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Conectando...'; 
    }

    try {
        if (!useFirebase) {
            // Simulación en fallback local
            const testEmail = prompt("Firebase no está activo. Ingresa tu correo para simular inicio de sesión:", ADMIN_EMAILS[0]);
            if (testEmail) {
                const normalized = testEmail.toLowerCase().trim();
                localStorage.setItem("druetto_user_email", normalized);
                if (ADMIN_EMAILS.includes(normalized)) {
                    localStorage.setItem("druetto_admin_logged", "true");
                    const isSubdir = window.location.pathname.includes('/admin/');
                    window.location.href = isSubdir ? "dashboard.html" : "admin/dashboard.html";
                } else {
                    localStorage.removeItem("druetto_admin_logged");
                    alert("Sesión iniciada como cliente: " + normalized + " (Sin permisos de administración)");
                    window.location.reload();
                }
            }
            if (googleBtn) { 
                googleBtn.disabled = false; 
                googleBtn.innerHTML = '<i class="fab fa-google" style="color:#ea4335;"></i> Continuar con Google'; 
            }
            return;
        }

        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const userEmail = user.email ? user.email.toLowerCase().trim() : "";

        console.log("[Auth Google] Usuario logueado:", userEmail);

        if (ADMIN_EMAILS.includes(userEmail)) {
            console.log("[Auth Google] Acceso como ADMINISTRADOR concedido.");
            const path = window.location.pathname;
            if (path.includes('login.html')) {
                window.location.href = "dashboard.html";
            } else {
                updateUIForAuthState(user);
            }
        } else {
            console.log("[Auth Google] Acceso como CLIENTE estándar.");
            if (window.location.pathname.includes('/admin/')) {
                alert(`Hola ${user.displayName || userEmail}. Tu cuenta ha iniciado sesión correctamente, pero no posee permisos de administración.`);
                window.location.href = "../index.html";
            } else {
                updateUIForAuthState(user);
            }
        }
    } catch (err) {
        console.error("[Auth Google] Error:", err);
        if (errorEl) {
            errorEl.textContent = err.message || "Error al iniciar sesión con Google.";
            errorEl.style.display = 'block';
        } else {
            alert("Error al iniciar sesión con Google: " + (err.message || err));
        }
    } finally {
        if (googleBtn) {
            googleBtn.disabled = false;
            googleBtn.innerHTML = '<i class="fab fa-google" style="color:#ea4335;"></i> Continuar con Google';
        }
    }
};

// ─── Login Tradicional (Email/Contraseña) ─────────────────────────
window.loginAdmin = async function(email, password) {
    const errorEl = document.getElementById('login-error');
    const submitBtn = document.getElementById('login-btn');
    
    if (errorEl) errorEl.style.display = 'none';
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Verificando...'; }

    try {
        const normalizedEmail = email ? email.toLowerCase().trim() : "";
        if (!ADMIN_EMAILS.includes(normalizedEmail)) {
            throw new Error("El correo ingresado no pertenece a la lista de administradores autorizados.");
        }

        if (useFirebase) {
            await signInWithEmailAndPassword(auth, normalizedEmail, password);
        } else {
            if (password === LOCAL_ADMIN_PASS) {
                localStorage.setItem("druetto_user_email", normalizedEmail);
                localStorage.setItem("druetto_admin_logged", "true");
                await new Promise(resolve => setTimeout(resolve, 600));
            } else {
                throw new Error("Correo o contraseña incorrectos.");
            }
        }
        
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
    }
    localStorage.removeItem("druetto_admin_logged");
    localStorage.removeItem("druetto_user_email");
    const isSubdir = window.location.pathname.includes('/admin/');
    window.location.href = isSubdir ? "login.html" : "index.html";
};

// ─── Actualización Dinámica del Header según Estado Auth ──────────
function updateUIForAuthState(user) {
    const isAdmin = window.isAdminUser();
    const isSubdir = window.location.pathname.includes('/admin/');
    const adminLinks = document.querySelectorAll('.admin-login-link, .btn-header-admin, #header-admin-btn');
    
    adminLinks.forEach(adminLink => {
        if (isAdmin) {
            // Usuario es Administrador -> Mostrar Botón de Panel Admin
            const adminPath = isSubdir ? "dashboard.html" : "admin/dashboard.html";
            adminLink.href = adminPath;
            adminLink.className = "btn-header-admin";
            adminLink.style.display = "inline-flex";
            adminLink.style.alignItems = "center";
            adminLink.style.gap = "6px";
            adminLink.style.backgroundColor = "#0088cc";
            adminLink.style.color = "#ffffff";
            adminLink.style.padding = "6px 14px";
            adminLink.style.borderRadius = "20px";
            adminLink.style.fontWeight = "700";
            adminLink.style.fontSize = "0.82rem";
            adminLink.style.textDecoration = "none";
            adminLink.style.boxShadow = "0 2px 8px rgba(0,136,204,0.35)";
            adminLink.style.transition = "all 0.2s ease";
            adminLink.innerHTML = `<i class="fas fa-user-shield"></i> <span>PANEL ADMIN</span>`;
            adminLink.title = `Administrador: ${user ? user.email : window.getCurrentUserEmail()}`;
            adminLink.onclick = null;
        } else if (user) {
            // Usuario autenticado como cliente estándar
            adminLink.href = "#";
            adminLink.className = "admin-login-link";
            adminLink.style.backgroundColor = "transparent";
            adminLink.style.color = "inherit";
            adminLink.style.padding = "0";
            adminLink.style.boxShadow = "none";
            adminLink.innerHTML = `<i class="fas fa-user-check" style="color:#10b981;" title="Sesión activa: ${user.email}"></i>`;
            adminLink.onclick = (e) => {
                e.preventDefault();
                if (confirm(`Conectado como ${user.email} (Cliente).\n¿Deseas cerrar sesión?`)) {
                    window.logoutAdmin();
                }
            };
        } else {
            // Usuario no autenticado
            const loginPath = isSubdir ? "login.html" : "admin/login.html";
            adminLink.href = loginPath;
            adminLink.className = "admin-login-link";
            adminLink.style.backgroundColor = "transparent";
            adminLink.style.color = "inherit";
            adminLink.style.padding = "0";
            adminLink.style.boxShadow = "none";
            adminLink.innerHTML = `<i class="fas fa-user"></i>`;
            adminLink.title = "Acceso Administrativo / Iniciar Sesión";
            adminLink.onclick = null;
        }
    });
}

// ─── Observer: Inicialización y cambios de estado ──────────────────
if (useFirebase) {
    onAuthStateChanged(auth, (user) => {
        updateUIForAuthState(user);
        const isAdmin = user ? ADMIN_EMAILS.includes(user.email.toLowerCase().trim()) : false;
        handleAuthRedirect(isAdmin);
    });
} else {
    document.addEventListener('DOMContentLoaded', () => {
        updateUIForAuthState(null);
        handleAuthRedirect(window.isAdminUser());
    });
}

// Control de redirecciones automáticas en páginas protegidas
function handleAuthRedirect(isLoggedIn) {
    const path = window.location.pathname;
    
    // Redirigir fuera del panel de administración si no es admin
    if (!path.includes('login.html') && path.includes('/admin/') && !isLoggedIn) {
        window.location.href = "login.html";
        return;
    }

    // Redirigir del login al dashboard si ya está logueado como admin
    if (path.includes('login.html') && isLoggedIn) {
        window.location.href = "dashboard.html";
        return;
    }

    window.dispatchEvent(new CustomEvent('authReady', { detail: { isLoggedIn } }));
}


