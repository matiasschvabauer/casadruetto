// --- AGROGUARDATI - CONFIGURACIÓN DE FIREBASE Y CLOUDINARY ---

window.AGRO_CONFIG = {
  // Configuración de Cloudinary para subida directa de imágenes
  cloudinary: {
    cloudName: "pfskomq5",
    uploadPreset: "nwrslkmw"
  },

  // Configuración de Firebase (Auth Google + Firestore Database)
  firebase: {
    apiKey: "AIzaSyA92iepzPYW09tQoHDbRhsPGlyp9GQh46w",
    authDomain: "agroguardati.firebaseapp.com",
    projectId: "agroguardati",
    storageBucket: "agroguardati.firebasestorage.app",
    messagingSenderId: "515227534943",
    appId: "1:515227534943:web:178c960ad6cdd065f2bdea"
  },

  // Email de Administrador Autorizado
  adminEmail: "matiasschvabauer@gmail.com",
  adminEmails: ["matiasschvabauer@gmail.com", "guillermoguardati@gmail.com", "Lucioguardati1@gmail.com", "lucioguardati1@gmail.com"]
};
