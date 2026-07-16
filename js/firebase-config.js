// ═══════════════════════════════════════════════════════════════════
// firebase-config.js — Configuración de Firebase y Fallback Local
// ═══════════════════════════════════════════════════════════════════

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

// Reemplazar con las credenciales del nuevo proyecto de Firebase cuando esté listo
const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

let app, db, storage, auth;
let useFirebase = false;

// Intentar inicializar Firebase (si las credenciales son válidas)
if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY_HERE") {
    try {
        app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        storage = getStorage(app);
        auth = getAuth(app);
        useFirebase = true;
        console.log("[Firebase] Inicializado con éxito.");
    } catch (e) {
        console.warn("[Firebase] Error al conectar. Usando base de datos local de respaldo.", e);
    }
} else {
    console.log("[Firebase] Sin credenciales configuradas. Usando base de datos local (Fallback).");
}

// ─── Base de Datos Local de Respaldo (Fallback local en localStorage) ───
const localDb = {
    // Simula operaciones básicas de Firestore
    async getCollection(colName) {
        const stored = localStorage.getItem(`druetto_local_${colName}`);
        return stored ? JSON.parse(stored) : [];
    },
    async setCollection(colName, data) {
        localStorage.setItem(`druetto_local_${colName}`, JSON.stringify(data));
    },
    async getDoc(colName, docId) {
        const items = await this.getCollection(colName);
        return items.find(i => i.id === docId) || null;
    },
    async setDoc(colName, docId, data) {
        const items = await this.getCollection(colName);
        const idx = items.findIndex(i => i.id === docId);
        const updatedDoc = { id: docId, ...data };
        if (idx !== -1) {
            items[idx] = updatedDoc;
        } else {
            items.push(updatedDoc);
        }
        await this.setCollection(colName, items);
        return updatedDoc;
    },
    async deleteDoc(colName, docId) {
        let items = await this.getCollection(colName);
        items = items.filter(i => i.id !== docId);
        await this.setCollection(colName, items);
    }
};

export { app, db, storage, auth, useFirebase, localDb };
