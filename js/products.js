// ═══════════════════════════════════════════════════════════════════
// products.js — Gestión del Catálogo y Detalle de Productos
// ═══════════════════════════════════════════════════════════════════

import { db, useFirebase, localDb } from './firebase-config.js';
import { collection, getDocs, doc, getDoc, writeBatch } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";


// Catálogo Oficial Semilla (para inicialización automática)
export const SEED_PRODUCTS = [

    {
        "id": "dji_agras_t40",
        "name": "Drone Agrícola DJI Agras T40",
        "code": "DJI-AGRAS-T40",
        "desc": "El DJI Agras T40 redefine la pulverización agrícola. Equipado con un diseño revolucionario de rotor doble coaxial, permite cargar un peso de pulverización de 40 kg y un peso de esparcido de 50 kg. Sistema de pulverización atomizada doble, radar de matriz en fase activo y visión binocular integrada para máxima seguridad en vuelo.",
        "price": 26500,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T40",
        "stock": 3,
        "images": [
            "assets/img/b3f28557c245459b451d255276ebd1f2.png",
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "https://www.mercadolibre.com.ar",
        "specs": {
            "Capacidad del Tanque": "40 Litros",
            "Ancho de Pulverización": "Hasta 11 metros",
            "Rendimiento Diario": "Hasta 21 hectáreas por hora",
            "Batería": "DB1560 Inteligente",
            "Cargador": "Estación de Carga Inteligente C10000"
        }
    },
    {
        "id": "jd_6125j_tractor",
        "name": "Tractor John Deere 6125J",
        "code": "JD-6125J",
        "desc": "Excelente rendimiento y bajo consumo. Motor John Deere PowerTech de 4 cilindros y 4.5 L, transmisión PowrQuad de 16 marchas hacia adelante y 16 hacia atrás. Cabina confortable con comandos ergonómicos, tracción delantera asistida para trabajos exigentes de labranza y siembra.",
        "price": 85000,
        "category": "Maquinaria Agrícola",
        "condition": "Usado",
        "brand": "John Deere",
        "model": "6125J",
        "stock": 1,
        "images": [
            "assets/img/1c213b02c106d92e2cf10cb8f72b5b44.png",
            "assets/img/48683dec82d4eaf8dd7e5eb4ef7bf4d9.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Potencia del Motor": "125 HP",
            "Transmisión": "PowrQuad 16x16",
            "Horas de Uso": "4,200 Hs",
            "Año": "2019",
            "Cabina": "Original con Aire Acondicionado"
        }
    },
    {
        "id": "trimble_gfx750",
        "name": "Pantalla Trimble GFX-750 con NAV-900",
        "code": "TRIM-GFX750",
        "desc": "Pantalla táctil de alta definición de 10.1 pulgadas (25.6 cm) para agricultura de precisión. Incorpora el controlador de guiado NAV-900 con receptor GNSS multiconstelación de última generación. Compatible con sistemas de autoguiado EZ-Pilot Pro y Autopilot.",
        "price": 9800,
        "category": "Agricultura de Precisión",
        "condition": "Nuevo",
        "brand": "Trimble",
        "model": "GFX-750",
        "stock": 8,
        "images": [
            "assets/img/8edfac4772a77b9e7df9391427de01bd.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "https://www.mercadolibre.com.ar",
        "specs": {
            "Pantalla": "10.1 Pulgadas Táctil",
            "Sistema Operativo": "Android",
            "Receptor": "NAV-900 Integrado",
            "Conectividad": "Wi-Fi y Bluetooth",
            "Señales Soportadas": "GPS, GLONASS, Galileo, BeiDou"
        }
    },
    {
        "id": "restaurado_fiat_700",
        "name": "Tractor Fiat 700 (Restaurado a Nuevo)",
        "code": "REST-FIAT700",
        "desc": "Un clásico del campo argentino revivido en nuestro taller de restauración de Casa Druetto. Motor Fiat original rectificado por completo a nuevo, chapa arenada, pintura poliuretánica oficial Fiat, instalación eléctrica nueva y cubiertas delanteras a estrenar. Una pieza de colección totalmente funcional para el trabajo diario.",
        "price": 14500,
        "category": "Maquinaria Agrícola",
        "condition": "Restaurado",
        "brand": "Fiat",
        "model": "700",
        "stock": 1,
        "images": [
            "assets/img/48683dec82d4eaf8dd7e5eb4ef7bf4d9.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Estado": "Restaurado a Estrenar",
            "Motor": "Fiat 4 Cilindros (Repasado completo)",
            "Pintura": "Poliuretano Fiat Naranja Oficial",
            "Rodado Trasero": "18.4x34 (80% vida)",
            "Instalación Eléctrica": "12V Nueva"
        }
    },
    {
        "id": "jd_n280829",
        "name": "Boquilla",
        "code": "N280829",
        "desc": "Boquilla de pulverización de alta precisión original. Fabricada con materiales de alta calidad, resistente al desgaste y corrosión química, garantizando una distribución de gotas uniforme.",
        "price": 6.19,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 4,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "N280829",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_n282738",
        "name": "Boquilla",
        "code": "N282738",
        "desc": "Boquilla de pulverización de alta precisión original. Fabricada con materiales de alta calidad, resistente al desgaste y corrosión química, garantizando una distribución de gotas uniforme.",
        "price": 6.09,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 6,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "N282738",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_re532952",
        "name": "CARTUCHO DE FILTRO",
        "code": "RE532952",
        "desc": "Filtro/cartucho filtrante original John Deere. Mantiene la pureza de los fluidos del equipo (Código: RE532952), previniendo el desgaste y la pérdida de rendimiento bajo trabajo intenso.",
        "price": 140.2,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 3,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "RE532952",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_sw10967p1",
        "name": "Cartucho de filtro",
        "code": "SW10967P1",
        "desc": "Filtro/cartucho filtrante original John Deere. Mantiene la pureza de los fluidos del equipo (Código: SW10967P1), previniendo el desgaste y la pérdida de rendimiento bajo trabajo intenso.",
        "price": 10.24,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 14,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "SW10967P1",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_aj11402",
        "name": "Filtro de aceite motor",
        "code": "AJ11402",
        "desc": "Filtro de aceite motor original John Deere para maquinaria agrícola (Código: AJ11402). Proporciona un filtrado de alta eficiencia de impurezas, protegiendo las piezas internas del motor del desgaste mecánico.",
        "price": 11.79,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 4,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "AJ11402",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_dq24941",
        "name": "Filtro de aire",
        "code": "DQ24941",
        "desc": "Filtro de aire de motor original John Deere (Código: DQ24941). Diseñado para retener polvo e impurezas externas, asegurando el flujo de aire óptimo y limpio para la combustión en condiciones de polvo severo en el campo.",
        "price": 33.64,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "DQ24941",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_pe78420010",
        "name": "Filtro aceite hidraulico",
        "code": "PE78420010",
        "desc": "Filtro de aceite motor original John Deere para maquinaria agrícola (Código: PE78420010). Proporciona un filtrado de alta eficiencia de impurezas, protegiendo las piezas internas del motor del desgaste mecánico.",
        "price": 89.2,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 6,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "PE78420010",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_ah120547",
        "name": "Filtro A/A",
        "code": "AH120547",
        "desc": "Filtro de aire de cabina original John Deere (Código: AH120547). Purifica el aire ingresado a la cabina, reteniendo partículas de polvo, polen y residuos de agroquímicos para la protección del operador.",
        "price": 82.79,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 8,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "AH120547",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_h146639",
        "name": "Portaaspersor",
        "code": "H146639",
        "desc": "Boquilla de pulverización de alta precisión original. Fabricada con materiales de alta calidad, resistente al desgaste y corrosión química, garantizando una distribución de gotas uniforme.",
        "price": 204.96,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "H146639",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_z51244",
        "name": "Filtro",
        "code": "Z51244",
        "desc": "Filtro/cartucho filtrante original John Deere. Mantiene la pureza de los fluidos del equipo (Código: Z51244), previniendo el desgaste y la pérdida de rendimiento bajo trabajo intenso.",
        "price": 1.81,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 3,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "Z51244",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_al79010",
        "name": "Filtro",
        "code": "AL79010",
        "desc": "Filtro/cartucho filtrante original John Deere. Mantiene la pureza de los fluidos del equipo (Código: AL79010), previniendo el desgaste y la pérdida de rendimiento bajo trabajo intenso.",
        "price": 141.76,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "AL79010",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_l79122",
        "name": "Filtro",
        "code": "L79122",
        "desc": "Filtro/cartucho filtrante original John Deere. Mantiene la pureza de los fluidos del equipo (Código: L79122), previniendo el desgaste y la pérdida de rendimiento bajo trabajo intenso.",
        "price": 74.24,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "L79122",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_r53169",
        "name": "Filtro",
        "code": "R53169",
        "desc": "Filtro/cartucho filtrante original John Deere. Mantiene la pureza de los fluidos del equipo (Código: R53169), previniendo el desgaste y la pérdida de rendimiento bajo trabajo intenso.",
        "price": 54.91,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "R53169",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_r89411",
        "name": "Filtro",
        "code": "R89411",
        "desc": "Filtro/cartucho filtrante original John Deere. Mantiene la pureza de los fluidos del equipo (Código: R89411), previniendo el desgaste y la pérdida de rendimiento bajo trabajo intenso.",
        "price": 79.93,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "R89411",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_ae29052",
        "name": "Filtro de combustible",
        "code": "AE29052",
        "desc": "Filtro de combustible original John Deere (Código: AE29052). Separa el agua y retiene los sedimentos microscópicos del gasoil, resguardando la bomba de inyección y los inyectores Common Rail.",
        "price": 10.15,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "AE29052",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_ae31724",
        "name": "Filtro de aire",
        "code": "AE31724",
        "desc": "Filtro de aire de motor original John Deere (Código: AE31724). Diseñado para retener polvo e impurezas externas, asegurando el flujo de aire óptimo y limpio para la combustión en condiciones de polvo severo en el campo.",
        "price": 57.96,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "AE31724",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_ah115836",
        "name": "Filtro de A/A",
        "code": "AH115836",
        "desc": "Filtro de aire de cabina original John Deere (Código: AH115836). Purifica el aire ingresado a la cabina, reteniendo partículas de polvo, polen y residuos de agroquímicos para la protección del operador.",
        "price": 52.46,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "AH115836",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_ah128449",
        "name": "Filtro de hidráulico",
        "code": "AH128449",
        "desc": "Filtro de fluido hidráulico y transmisión John Deere (Código: AH128449). Diseñado para soportar altas presiones de trabajo en sistemas hidráulicos agrícolas, reteniendo micropartículas abrasivas.",
        "price": 72.6,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 27,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "AH128449",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_ah148880",
        "name": "Filtro de aire",
        "code": "AH148880",
        "desc": "Filtro de aire de motor original John Deere (Código: AH148880). Diseñado para retener polvo e impurezas externas, asegurando el flujo de aire óptimo y limpio para la combustión en condiciones de polvo severo en el campo.",
        "price": 140.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "AH148880",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_ah164063",
        "name": "Filtro de seguridad",
        "code": "AH164063",
        "desc": "Filtro/cartucho filtrante original John Deere. Mantiene la pureza de los fluidos del equipo (Código: AH164063), previniendo el desgaste y la pérdida de rendimiento bajo trabajo intenso.",
        "price": 157.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "AH164063",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_ah165504",
        "name": "Filtro de combustible",
        "code": "AH165504",
        "desc": "Filtro de combustible original John Deere (Código: AH165504). Separa el agua y retiene los sedimentos microscópicos del gasoil, resguardando la bomba de inyección y los inyectores Common Rail.",
        "price": 48.84,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "AH165504",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_ah170798",
        "name": "Filtro Aire Motor",
        "code": "AH170798",
        "desc": "Filtro de aire de motor original John Deere (Código: AH170798). Diseñado para retener polvo e impurezas externas, asegurando el flujo de aire óptimo y limpio para la combustión en condiciones de polvo severo en el campo.",
        "price": 152.65,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "AH170798",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_ah174196",
        "name": "Prefiltro Aire Motor",
        "code": "AH174196",
        "desc": "Filtro de aire de motor original John Deere (Código: AH174196). Diseñado para retener polvo e impurezas externas, asegurando el flujo de aire óptimo y limpio para la combustión en condiciones de polvo severo en el campo.",
        "price": 105.25,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "AH174196",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_ah212294",
        "name": "Filtro Aire",
        "code": "AH212294",
        "desc": "Filtro de aire de motor original John Deere (Código: AH212294). Diseñado para retener polvo e impurezas externas, asegurando el flujo de aire óptimo y limpio para la combustión en condiciones de polvo severo en el campo.",
        "price": 278.71,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "AH212294",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_ah212295",
        "name": "Filtro Aire",
        "code": "AH212295",
        "desc": "Filtro de aire de motor original John Deere (Código: AH212295). Diseñado para retener polvo e impurezas externas, asegurando el flujo de aire óptimo y limpio para la combustión en condiciones de polvo severo en el campo.",
        "price": 210.39,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "AH212295",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_ah222225",
        "name": "Filtro",
        "code": "AH222225",
        "desc": "Filtro/cartucho filtrante original John Deere. Mantiene la pureza de los fluidos del equipo (Código: AH222225), previniendo el desgaste y la pérdida de rendimiento bajo trabajo intenso.",
        "price": 484.29,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "AH222225",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_aj10106",
        "name": "Filtro de aceite",
        "code": "AJ10106",
        "desc": "Filtro de aceite motor original John Deere para maquinaria agrícola (Código: AJ10106). Proporciona un filtrado de alta eficiencia de impurezas, protegiendo las piezas internas del motor del desgaste mecánico.",
        "price": 12.85,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 8,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "AJ10106",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_aj11399",
        "name": "Filtro de combustible auxiliar",
        "code": "AJ11399",
        "desc": "Filtro de combustible original John Deere (Código: AJ11399). Separa el agua y retiene los sedimentos microscópicos del gasoil, resguardando la bomba de inyección y los inyectores Common Rail.",
        "price": 7.21,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 3,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "AJ11399",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_aj55127",
        "name": "Filtro Aire Primario",
        "code": "AJ55127",
        "desc": "Filtro de aire de motor original John Deere (Código: AJ55127). Diseñado para retener polvo e impurezas externas, asegurando el flujo de aire óptimo y limpio para la combustión en condiciones de polvo severo en el campo.",
        "price": 85.01,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 7,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "AJ55127",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_aj55128",
        "name": "Filtro Aire Seguridad",
        "code": "AJ55128",
        "desc": "Filtro de aire de motor original John Deere (Código: AJ55128). Diseñado para retener polvo e impurezas externas, asegurando el flujo de aire óptimo y limpio para la combustión en condiciones de polvo severo en el campo.",
        "price": 67.05,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "AJ55128",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_al119095",
        "name": "Filtro",
        "code": "AL119095",
        "desc": "Filtro/cartucho filtrante original John Deere. Mantiene la pureza de los fluidos del equipo (Código: AL119095), previniendo el desgaste y la pérdida de rendimiento bajo trabajo intenso.",
        "price": 82.51,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "AL119095",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_al150288",
        "name": "Filtro Seguridad",
        "code": "AL150288",
        "desc": "Filtro/cartucho filtrante original John Deere. Mantiene la pureza de los fluidos del equipo (Código: AL150288), previniendo el desgaste y la pérdida de rendimiento bajo trabajo intenso.",
        "price": 61.24,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "AL150288",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_al156625",
        "name": "FILTRO TRANSM (AL221066)",
        "code": "AL156625",
        "desc": "Filtro de fluido hidráulico y transmisión John Deere (Código: AL156625). Diseñado para soportar altas presiones de trabajo en sistemas hidráulicos agrícolas, reteniendo micropartículas abrasivas.",
        "price": 88.35,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "AL156625",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_an260207",
        "name": "Filtro",
        "code": "AN260207",
        "desc": "Filtro/cartucho filtrante original John Deere. Mantiene la pureza de los fluidos del equipo (Código: AN260207), previniendo el desgaste y la pérdida de rendimiento bajo trabajo intenso.",
        "price": 150.71,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 4,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "AN260207",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_ap29320",
        "name": "Cartucho de filtro",
        "code": "AP29320",
        "desc": "Filtro/cartucho filtrante original John Deere. Mantiene la pureza de los fluidos del equipo (Código: AP29320), previniendo el desgaste y la pérdida de rendimiento bajo trabajo intenso.",
        "price": 30.98,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 3,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "AP29320",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_ar103220",
        "name": "Filtro Combustible",
        "code": "AR103220",
        "desc": "Filtro de combustible original John Deere (Código: AR103220). Separa el agua y retiene los sedimentos microscópicos del gasoil, resguardando la bomba de inyección y los inyectores Common Rail.",
        "price": 49.01,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "AR103220",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_ar45785",
        "name": "Filtro",
        "code": "AR45785",
        "desc": "Filtro/cartucho filtrante original John Deere. Mantiene la pureza de los fluidos del equipo (Código: AR45785), previniendo el desgaste y la pérdida de rendimiento bajo trabajo intenso.",
        "price": 86.14,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "AR45785",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_ar50041",
        "name": "Filtro Combustible",
        "code": "AR50041",
        "desc": "Filtro de combustible original John Deere (Código: AR50041). Separa el agua y retiene los sedimentos microscópicos del gasoil, resguardando la bomba de inyección y los inyectores Common Rail.",
        "price": 25.04,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 11,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "AR50041",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_ar75603",
        "name": "Filtro de aceite transmisión",
        "code": "AR75603",
        "desc": "Filtro de aceite motor original John Deere para maquinaria agrícola (Código: AR75603). Proporciona un filtrado de alta eficiencia de impurezas, protegiendo las piezas internas del motor del desgaste mecánico.",
        "price": 21.11,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 3,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "AR75603",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_ar79941",
        "name": "Filtro de Aire Primario",
        "code": "AR79941",
        "desc": "Filtro de aire de motor original John Deere (Código: AR79941). Diseñado para retener polvo e impurezas externas, asegurando el flujo de aire óptimo y limpio para la combustión en condiciones de polvo severo en el campo.",
        "price": 85.29,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "AR79941",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_ar84228",
        "name": "Filtro aire",
        "code": "AR84228",
        "desc": "Filtro de aire de motor original John Deere (Código: AR84228). Diseñado para retener polvo e impurezas externas, asegurando el flujo de aire óptimo y limpio para la combustión en condiciones de polvo severo en el campo.",
        "price": 102.86,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "AR84228",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_ar86755",
        "name": "Filtro auxiliar de combustible",
        "code": "AR86755",
        "desc": "Filtro de combustible original John Deere (Código: AR86755). Separa el agua y retiene los sedimentos microscópicos del gasoil, resguardando la bomba de inyección y los inyectores Common Rail.",
        "price": 48.65,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "AR86755",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_at171853",
        "name": "Filtro de Aire",
        "code": "AT171853",
        "desc": "Filtro de aire de motor original John Deere (Código: AT171853). Diseñado para retener polvo e impurezas externas, asegurando el flujo de aire óptimo y limpio para la combustión en condiciones de polvo severo en el campo.",
        "price": 65.85,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 14,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "AT171853",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_at171854",
        "name": "Filtro de Seguridad",
        "code": "AT171854",
        "desc": "Filtro/cartucho filtrante original John Deere. Mantiene la pureza de los fluidos del equipo (Código: AT171854), previniendo el desgaste y la pérdida de rendimiento bajo trabajo intenso.",
        "price": 33.44,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 17,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "AT171854",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_at17387",
        "name": "Filtro de combustible",
        "code": "AT17387",
        "desc": "Filtro de combustible original John Deere (Código: AT17387). Separa el agua y retiene los sedimentos microscópicos del gasoil, resguardando la bomba de inyección y los inyectores Common Rail.",
        "price": 9.54,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 22,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "AT17387",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_at178517",
        "name": "Cartucho de filtro",
        "code": "AT178517",
        "desc": "Filtro/cartucho filtrante original John Deere. Mantiene la pureza de los fluidos del equipo (Código: AT178517), previniendo el desgaste y la pérdida de rendimiento bajo trabajo intenso.",
        "price": 73.09,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "AT178517",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_at195915",
        "name": "Filtro hidráulico",
        "code": "AT195915",
        "desc": "Filtro de fluido hidráulico y transmisión John Deere (Código: AT195915). Diseñado para soportar altas presiones de trabajo en sistemas hidráulicos agrícolas, reteniendo micropartículas abrasivas.",
        "price": 92.76,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "AT195915",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_at228474",
        "name": "Filtro de aceite",
        "code": "AT228474",
        "desc": "Filtro de aceite motor original John Deere para maquinaria agrícola (Código: AT228474). Proporciona un filtrado de alta eficiencia de impurezas, protegiendo las piezas internas del motor del desgaste mecánico.",
        "price": 136.5,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "AT228474",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_at308274",
        "name": "Filtro de Aceite",
        "code": "AT308274",
        "desc": "Filtro de aceite motor original John Deere para maquinaria agrícola (Código: AT308274). Proporciona un filtrado de alta eficiencia de impurezas, protegiendo las piezas internas del motor del desgaste mecánico.",
        "price": 122.8,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "AT308274",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_at33364",
        "name": "Filtro de Aire",
        "code": "AT33364",
        "desc": "Filtro de aire de motor original John Deere (Código: AT33364). Diseñado para retener polvo e impurezas externas, asegurando el flujo de aire óptimo y limpio para la combustión en condiciones de polvo severo en el campo.",
        "price": 35.41,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "AT33364",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_at44378",
        "name": "Cartucho de filtro",
        "code": "AT44378",
        "desc": "Filtro/cartucho filtrante original John Deere. Mantiene la pureza de los fluidos del equipo (Código: AT44378), previniendo el desgaste y la pérdida de rendimiento bajo trabajo intenso.",
        "price": 69.4,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "AT44378",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_at67957",
        "name": "Filtro",
        "code": "AT67957",
        "desc": "Filtro/cartucho filtrante original John Deere. Mantiene la pureza de los fluidos del equipo (Código: AT67957), previniendo el desgaste y la pérdida de rendimiento bajo trabajo intenso.",
        "price": 60.86,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "AT67957",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_az22878",
        "name": "Filtro",
        "code": "AZ22878",
        "desc": "Filtro/cartucho filtrante original John Deere. Mantiene la pureza de los fluidos del equipo (Código: AZ22878), previniendo el desgaste y la pérdida de rendimiento bajo trabajo intenso.",
        "price": 24.49,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "AZ22878",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_az26007",
        "name": "Cartucho de filtro",
        "code": "AZ26007",
        "desc": "Filtro/cartucho filtrante original John Deere. Mantiene la pureza de los fluidos del equipo (Código: AZ26007), previniendo el desgaste y la pérdida de rendimiento bajo trabajo intenso.",
        "price": 33.29,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "AZ26007",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_az26091",
        "name": "Cartucho de filtro",
        "code": "AZ26091",
        "desc": "Filtro/cartucho filtrante original John Deere. Mantiene la pureza de los fluidos del equipo (Código: AZ26091), previniendo el desgaste y la pérdida de rendimiento bajo trabajo intenso.",
        "price": 67.16,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "AZ26091",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_az43412",
        "name": "Filtro Aire Cabina",
        "code": "AZ43412",
        "desc": "Filtro de aire de motor original John Deere (Código: AZ43412). Diseñado para retener polvo e impurezas externas, asegurando el flujo de aire óptimo y limpio para la combustión en condiciones de polvo severo en el campo.",
        "price": 199.55,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "AZ43412",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_az48195",
        "name": "Filtro de aire",
        "code": "AZ48195",
        "desc": "Filtro de aire de motor original John Deere (Código: AZ48195). Diseñado para retener polvo e impurezas externas, asegurando el flujo de aire óptimo y limpio para la combustión en condiciones de polvo severo en el campo.",
        "price": 127.44,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "AZ48195",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_az48196",
        "name": "Filtro de seguridad",
        "code": "AZ48196",
        "desc": "Filtro/cartucho filtrante original John Deere. Mantiene la pureza de los fluidos del equipo (Código: AZ48196), previniendo el desgaste y la pérdida de rendimiento bajo trabajo intenso.",
        "price": 79.44,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "AZ48196",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_ce16309",
        "name": "Filtro",
        "code": "CE16309",
        "desc": "Filtro/cartucho filtrante original John Deere. Mantiene la pureza de los fluidos del equipo (Código: CE16309), previniendo el desgaste y la pérdida de rendimiento bajo trabajo intenso.",
        "price": 80.19,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "CE16309",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_cq29104",
        "name": "Filtro",
        "code": "CQ29104",
        "desc": "Filtro/cartucho filtrante original John Deere. Mantiene la pureza de los fluidos del equipo (Código: CQ29104), previniendo el desgaste y la pérdida de rendimiento bajo trabajo intenso.",
        "price": 8.94,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "CQ29104",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_de17263",
        "name": "Filtro",
        "code": "DE17263",
        "desc": "Filtro/cartucho filtrante original John Deere. Mantiene la pureza de los fluidos del equipo (Código: DE17263), previniendo el desgaste y la pérdida de rendimiento bajo trabajo intenso.",
        "price": 126.45,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 6,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "DE17263",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_dq05097",
        "name": "Filtro hidráulico",
        "code": "DQ05097",
        "desc": "Filtro de fluido hidráulico y transmisión John Deere (Código: DQ05097). Diseñado para soportar altas presiones de trabajo en sistemas hidráulicos agrícolas, reteniendo micropartículas abrasivas.",
        "price": 24.26,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "DQ05097",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_dq12161",
        "name": "Filtro de hidráulico",
        "code": "DQ12161",
        "desc": "Filtro de fluido hidráulico y transmisión John Deere (Código: DQ12161). Diseñado para soportar altas presiones de trabajo en sistemas hidráulicos agrícolas, reteniendo micropartículas abrasivas.",
        "price": 46.59,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "DQ12161",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_dq21803",
        "name": "FILTRO",
        "code": "DQ21803",
        "desc": "Filtro/cartucho filtrante original John Deere. Mantiene la pureza de los fluidos del equipo (Código: DQ21803), previniendo el desgaste y la pérdida de rendimiento bajo trabajo intenso.",
        "price": 52.31,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 23,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "DQ21803",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_dq24942",
        "name": "Filtro de seguridad",
        "code": "DQ24942",
        "desc": "Filtro/cartucho filtrante original John Deere. Mantiene la pureza de los fluidos del equipo (Código: DQ24942), previniendo el desgaste y la pérdida de rendimiento bajo trabajo intenso.",
        "price": 25.25,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "DQ24942",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_dq43482",
        "name": "Filtro Aire",
        "code": "DQ43482",
        "desc": "Filtro de aire de motor original John Deere (Código: DQ43482). Diseñado para retener polvo e impurezas externas, asegurando el flujo de aire óptimo y limpio para la combustión en condiciones de polvo severo en el campo.",
        "price": 197.89,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "DQ43482",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_dq43483",
        "name": "Filtro de seguridad",
        "code": "DQ43483",
        "desc": "Filtro/cartucho filtrante original John Deere. Mantiene la pureza de los fluidos del equipo (Código: DQ43483), previniendo el desgaste y la pérdida de rendimiento bajo trabajo intenso.",
        "price": 43.29,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "DQ43483",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_dq46907",
        "name": "Filtro Aire",
        "code": "DQ46907",
        "desc": "Filtro de aire de motor original John Deere (Código: DQ46907). Diseñado para retener polvo e impurezas externas, asegurando el flujo de aire óptimo y limpio para la combustión en condiciones de polvo severo en el campo.",
        "price": 49.11,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "DQ46907",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_dq46908",
        "name": "Filtro Seguridad",
        "code": "DQ46908",
        "desc": "Filtro/cartucho filtrante original John Deere. Mantiene la pureza de los fluidos del equipo (Código: DQ46908), previniendo el desgaste y la pérdida de rendimiento bajo trabajo intenso.",
        "price": 42.9,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 3,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "DQ46908",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_dq59138",
        "name": "Filtro de Aire Primario (SJ17532)",
        "code": "DQ59138",
        "desc": "Filtro de aire de motor original John Deere (Código: DQ59138). Diseñado para retener polvo e impurezas externas, asegurando el flujo de aire óptimo y limpio para la combustión en condiciones de polvo severo en el campo.",
        "price": 35.62,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 3,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "DQ59138",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_h220870",
        "name": "Filtro de aire",
        "code": "H220870",
        "desc": "Filtro de aire de motor original John Deere (Código: H220870). Diseñado para retener polvo e impurezas externas, asegurando el flujo de aire óptimo y limpio para la combustión en condiciones de polvo severo en el campo.",
        "price": 100.85,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "H220870",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_l29251",
        "name": "Tapa filtro",
        "code": "L29251",
        "desc": "Filtro/cartucho filtrante original John Deere. Mantiene la pureza de los fluidos del equipo (Código: L29251), previniendo el desgaste y la pérdida de rendimiento bajo trabajo intenso.",
        "price": 63.63,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "L29251",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_pe70114566",
        "name": "Filtro de hidráulico",
        "code": "PE70114566",
        "desc": "Filtro de fluido hidráulico y transmisión John Deere (Código: PE70114566). Diseñado para soportar altas presiones de trabajo en sistemas hidráulicos agrícolas, reteniendo micropartículas abrasivas.",
        "price": 35.41,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 8,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "PE70114566",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_pe931260",
        "name": "Filtro de combustible",
        "code": "PE931260",
        "desc": "Filtro de combustible original John Deere (Código: PE931260). Separa el agua y retiene los sedimentos microscópicos del gasoil, resguardando la bomba de inyección y los inyectores Common Rail.",
        "price": 21.56,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "PE931260",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_re205726",
        "name": "Filtro aceite hidráulico TRANSMISION",
        "code": "RE205726",
        "desc": "Filtro de aceite motor original John Deere para maquinaria agrícola (Código: RE205726). Proporciona un filtrado de alta eficiencia de impurezas, protegiendo las piezas internas del motor del desgaste mecánico.",
        "price": 139.39,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "RE205726",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_re24619",
        "name": "Filtro aire cabina",
        "code": "RE24619",
        "desc": "Filtro de aire de motor original John Deere (Código: RE24619). Diseñado para retener polvo e impurezas externas, asegurando el flujo de aire óptimo y limpio para la combustión en condiciones de polvo severo en el campo.",
        "price": 71.01,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "RE24619",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_re34958",
        "name": "Filtro de hidráulico",
        "code": "RE34958",
        "desc": "Filtro de fluido hidráulico y transmisión John Deere (Código: RE34958). Diseñado para soportar altas presiones de trabajo en sistemas hidráulicos agrícolas, reteniendo micropartículas abrasivas.",
        "price": 81.45,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 4,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "RE34958",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_re34963",
        "name": "Cartucho de filtro",
        "code": "RE34963",
        "desc": "Filtro/cartucho filtrante original John Deere. Mantiene la pureza de los fluidos del equipo (Código: RE34963), previniendo el desgaste y la pérdida de rendimiento bajo trabajo intenso.",
        "price": 61.4,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "RE34963",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_re34967",
        "name": "Filtro de aire secundario",
        "code": "RE34967",
        "desc": "Filtro de aire de motor original John Deere (Código: RE34967). Diseñado para retener polvo e impurezas externas, asegurando el flujo de aire óptimo y limpio para la combustión en condiciones de polvo severo en el campo.",
        "price": 102.6,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "RE34967",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_re45828",
        "name": "Filtro aire seguridad",
        "code": "RE45828",
        "desc": "Filtro de aire de motor original John Deere (Código: RE45828). Diseñado para retener polvo e impurezas externas, asegurando el flujo de aire óptimo y limpio para la combustión en condiciones de polvo severo en el campo.",
        "price": 57.11,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "RE45828",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_re45864",
        "name": "Filtro de hidraulico",
        "code": "RE45864",
        "desc": "Filtro de fluido hidráulico y transmisión John Deere (Código: RE45864). Diseñado para soportar altas presiones de trabajo en sistemas hidráulicos agrícolas, reteniendo micropartículas abrasivas.",
        "price": 101.84,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "RE45864",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_re46310",
        "name": "Filtro Aire primario",
        "code": "RE46310",
        "desc": "Filtro de aire de motor original John Deere (Código: RE46310). Diseñado para retener polvo e impurezas externas, asegurando el flujo de aire óptimo y limpio para la combustión en condiciones de polvo severo en el campo.",
        "price": 165.4,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "RE46310",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_re46311",
        "name": "Filtro Aire seguridad",
        "code": "RE46311",
        "desc": "Filtro de aire de motor original John Deere (Código: RE46311). Diseñado para retener polvo e impurezas externas, asegurando el flujo de aire óptimo y limpio para la combustión en condiciones de polvo severo en el campo.",
        "price": 51.04,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 3,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "RE46311",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_re47313",
        "name": "Kit filtro de transmisión",
        "code": "RE47313",
        "desc": "Filtro de fluido hidráulico y transmisión John Deere (Código: RE47313). Diseñado para soportar altas presiones de trabajo en sistemas hidráulicos agrícolas, reteniendo micropartículas abrasivas.",
        "price": 134.73,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 3,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "RE47313",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_re48882",
        "name": "Filtro aire cabina",
        "code": "RE48882",
        "desc": "Filtro de aire de motor original John Deere (Código: RE48882). Diseñado para retener polvo e impurezas externas, asegurando el flujo de aire óptimo y limpio para la combustión en condiciones de polvo severo en el campo.",
        "price": 38.09,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "RE48882",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_re504836",
        "name": "Filtro aceite (VPD5181)",
        "code": "RE504836",
        "desc": "Filtro de aceite motor original John Deere para maquinaria agrícola (Código: RE504836). Proporciona un filtrado de alta eficiencia de impurezas, protegiendo las piezas internas del motor del desgaste mecánico.",
        "price": 36.45,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "RE504836",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_re507284",
        "name": "Filtro Combustible Primario",
        "code": "RE507284",
        "desc": "Filtro de combustible original John Deere (Código: RE507284). Separa el agua y retiene los sedimentos microscópicos del gasoil, resguardando la bomba de inyección y los inyectores Common Rail.",
        "price": 111.55,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "RE507284",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_re508633",
        "name": "Filtro auxiliar combustible",
        "code": "RE508633",
        "desc": "Filtro de combustible original John Deere (Código: RE508633). Separa el agua y retiene los sedimentos microscópicos del gasoil, resguardando la bomba de inyección y los inyectores Common Rail.",
        "price": 55.11,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 4,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "RE508633",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_re509036",
        "name": "Filtro de Combustible",
        "code": "RE509036",
        "desc": "Filtro de combustible original John Deere (Código: RE509036). Separa el agua y retiene los sedimentos microscópicos del gasoil, resguardando la bomba de inyección y los inyectores Common Rail.",
        "price": 44.94,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 3,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "RE509036",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_re509672",
        "name": "Filtro de aceite",
        "code": "RE509672",
        "desc": "Filtro de aceite motor original John Deere para maquinaria agrícola (Código: RE509672). Proporciona un filtrado de alta eficiencia de impurezas, protegiendo las piezas internas del motor del desgaste mecánico.",
        "price": 55.46,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 3,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "RE509672",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_re51650",
        "name": "VASO DECANTADOR FILTRO",
        "code": "RE51650",
        "desc": "Filtro/cartucho filtrante original John Deere. Mantiene la pureza de los fluidos del equipo (Código: RE51650), previniendo el desgaste y la pérdida de rendimiento bajo trabajo intenso.",
        "price": 139.43,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "RE51650",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_re519608",
        "name": "Filtro de Combustible",
        "code": "RE519608",
        "desc": "Filtro de combustible original John Deere (Código: RE519608). Separa el agua y retiene los sedimentos microscópicos del gasoil, resguardando la bomba de inyección y los inyectores Common Rail.",
        "price": 107.5,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "RE519608",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_re519626",
        "name": "Filtro de aceite",
        "code": "RE519626",
        "desc": "Filtro de aceite motor original John Deere para maquinaria agrícola (Código: RE519626). Proporciona un filtrado de alta eficiencia de impurezas, protegiendo las piezas internas del motor del desgaste mecánico.",
        "price": 20.91,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 20,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "RE519626",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_re522372",
        "name": "Filtro combustible",
        "code": "RE522372",
        "desc": "Filtro de combustible original John Deere (Código: RE522372). Separa el agua y retiene los sedimentos microscópicos del gasoil, resguardando la bomba de inyección y los inyectores Common Rail.",
        "price": 138.7,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 9,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "RE522372",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_re522688",
        "name": "Filtro combustible",
        "code": "RE522688",
        "desc": "Filtro de combustible original John Deere (Código: RE522688). Separa el agua y retiene los sedimentos microscópicos del gasoil, resguardando la bomba de inyección y los inyectores Common Rail.",
        "price": 61.96,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 16,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "RE522688",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_re530107",
        "name": "Filtro de aceite",
        "code": "RE530107",
        "desc": "Filtro de aceite motor original John Deere para maquinaria agrícola (Código: RE530107). Proporciona un filtrado de alta eficiencia de impurezas, protegiendo las piezas internas del motor del desgaste mecánico.",
        "price": 97.31,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 9,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "RE530107",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_re531703",
        "name": "Filtro de combustible",
        "code": "RE531703",
        "desc": "Filtro de combustible original John Deere (Código: RE531703). Separa el agua y retiene los sedimentos microscópicos del gasoil, resguardando la bomba de inyección y los inyectores Common Rail.",
        "price": 120.24,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "RE531703",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_re541420",
        "name": "Filtro de aceite",
        "code": "RE541420",
        "desc": "Filtro de aceite motor original John Deere para maquinaria agrícola (Código: RE541420). Proporciona un filtrado de alta eficiencia de impurezas, protegiendo las piezas internas del motor del desgaste mecánico.",
        "price": 25.29,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 9,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "RE541420",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_re57394",
        "name": "Filtro aceite motor = DZ118156",
        "code": "RE57394",
        "desc": "Filtro de aceite motor original John Deere para maquinaria agrícola (Código: RE57394). Proporciona un filtrado de alta eficiencia de impurezas, protegiendo las piezas internas del motor del desgaste mecánico.",
        "price": 30.46,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 6,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "RE57394",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_re58935",
        "name": "Filtro Aceite",
        "code": "RE58935",
        "desc": "Filtro de aceite motor original John Deere para maquinaria agrícola (Código: RE58935). Proporciona un filtrado de alta eficiencia de impurezas, protegiendo las piezas internas del motor del desgaste mecánico.",
        "price": 127.11,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "RE58935",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_re59754",
        "name": "FILTRO DE ACEITE REEMPL. DZ118286",
        "code": "RE59754",
        "desc": "Filtro de aceite motor original John Deere para maquinaria agrícola (Código: RE59754). Proporciona un filtrado de alta eficiencia de impurezas, protegiendo las piezas internas del motor del desgaste mecánico.",
        "price": 17.89,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "RE59754",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_re60021",
        "name": "Filtro de Combustible",
        "code": "RE60021",
        "desc": "Filtro de combustible original John Deere (Código: RE60021). Separa el agua y retiene los sedimentos microscópicos del gasoil, resguardando la bomba de inyección y los inyectores Common Rail.",
        "price": 40.4,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 10,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "RE60021",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_re62418",
        "name": "Filtro de combustible",
        "code": "RE62418",
        "desc": "Filtro de combustible original John Deere (Código: RE62418). Separa el agua y retiene los sedimentos microscópicos del gasoil, resguardando la bomba de inyección y los inyectores Common Rail.",
        "price": 39.19,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 4,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "RE62418",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_re62419",
        "name": "Filtro de combustible",
        "code": "RE62419",
        "desc": "Filtro de combustible original John Deere (Código: RE62419). Separa el agua y retiene los sedimentos microscópicos del gasoil, resguardando la bomba de inyección y los inyectores Common Rail.",
        "price": 38.29,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "RE62419",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_re62424",
        "name": "Filtro auxiliar combustible",
        "code": "RE62424",
        "desc": "Filtro de combustible original John Deere (Código: RE62424). Separa el agua y retiene los sedimentos microscópicos del gasoil, resguardando la bomba de inyección y los inyectores Common Rail.",
        "price": 44.94,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 7,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "RE62424",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_re67124",
        "name": "Cartucho de filtro",
        "code": "RE67124",
        "desc": "Filtro/cartucho filtrante original John Deere. Mantiene la pureza de los fluidos del equipo (Código: RE67124), previniendo el desgaste y la pérdida de rendimiento bajo trabajo intenso.",
        "price": 87.15,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "RE67124",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_t19044",
        "name": "Filtro aceite motor",
        "code": "T19044",
        "desc": "Filtro de aceite motor original John Deere para maquinaria agrícola (Código: T19044). Proporciona un filtrado de alta eficiencia de impurezas, protegiendo las piezas internas del motor del desgaste mecánico.",
        "price": 12.79,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 7,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "T19044",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_z62223",
        "name": "Filtro",
        "code": "Z62223",
        "desc": "Filtro/cartucho filtrante original John Deere. Mantiene la pureza de los fluidos del equipo (Código: Z62223), previniendo el desgaste y la pérdida de rendimiento bajo trabajo intenso.",
        "price": 27.33,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 3,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "Z62223",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_am101207",
        "name": "Filtro de aceite",
        "code": "AM101207",
        "desc": "Filtro de aceite motor original John Deere para maquinaria agrícola (Código: AM101207). Proporciona un filtrado de alta eficiencia de impurezas, protegiendo las piezas internas del motor del desgaste mecánico.",
        "price": 18.16,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "AM101207",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_am107314",
        "name": "Filtro de Combustible",
        "code": "AM107314",
        "desc": "Filtro de combustible original John Deere (Código: AM107314). Separa el agua y retiene los sedimentos microscópicos del gasoil, resguardando la bomba de inyección y los inyectores Common Rail.",
        "price": 7.2,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 6,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "AM107314",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_am107423",
        "name": "Filtro aceite motor",
        "code": "AM107423",
        "desc": "Filtro de aceite motor original John Deere para maquinaria agrícola (Código: AM107423). Proporciona un filtrado de alta eficiencia de impurezas, protegiendo las piezas internas del motor del desgaste mecánico.",
        "price": 12.05,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 3,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "AM107423",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_am108243",
        "name": "Filtro de aire",
        "code": "AM108243",
        "desc": "Filtro de aire de motor original John Deere (Código: AM108243). Diseñado para retener polvo e impurezas externas, asegurando el flujo de aire óptimo y limpio para la combustión en condiciones de polvo severo en el campo.",
        "price": 49.99,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "AM108243",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_am116156",
        "name": "Filtro de aceite hidráulico",
        "code": "AM116156",
        "desc": "Filtro de aceite motor original John Deere para maquinaria agrícola (Código: AM116156). Proporciona un filtrado de alta eficiencia de impurezas, protegiendo las piezas internas del motor del desgaste mecánico.",
        "price": 17.19,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 7,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "AM116156",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_am116304",
        "name": "Filtro combustible",
        "code": "AM116304",
        "desc": "Filtro de combustible original John Deere (Código: AM116304). Separa el agua y retiene los sedimentos microscópicos del gasoil, resguardando la bomba de inyección y los inyectores Common Rail.",
        "price": 8.58,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "AM116304",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_am120916",
        "name": "Filtro",
        "code": "AM120916",
        "desc": "Filtro/cartucho filtrante original John Deere. Mantiene la pureza de los fluidos del equipo (Código: AM120916), previniendo el desgaste y la pérdida de rendimiento bajo trabajo intenso.",
        "price": 67.76,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "AM120916",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_am125424",
        "name": "Filtro aceite motor",
        "code": "AM125424",
        "desc": "Filtro de aceite motor original John Deere para maquinaria agrícola (Código: AM125424). Proporciona un filtrado de alta eficiencia de impurezas, protegiendo las piezas internas del motor del desgaste mecánico.",
        "price": 18.28,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 14,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "AM125424",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_am130295",
        "name": "Filtro aire y seguridad",
        "code": "AM130295",
        "desc": "Filtro de aire de motor original John Deere (Código: AM130295). Diseñado para retener polvo e impurezas externas, asegurando el flujo de aire óptimo y limpio para la combustión en condiciones de polvo severo en el campo.",
        "price": 156.31,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "AM130295",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_ch15553",
        "name": "Filtro de combustible",
        "code": "CH15553",
        "desc": "Filtro de combustible original John Deere (Código: CH15553). Separa el agua y retiene los sedimentos microscópicos del gasoil, resguardando la bomba de inyección y los inyectores Common Rail.",
        "price": 10.44,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "CH15553",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_gy20574",
        "name": "Conjunto Filtro de aire",
        "code": "GY20574",
        "desc": "Filtro de aire de motor original John Deere (Código: GY20574). Diseñado para retener polvo e impurezas externas, asegurando el flujo de aire óptimo y limpio para la combustión en condiciones de polvo severo en el campo.",
        "price": 20.76,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "GY20574",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_gy20575",
        "name": "Cartucho de Filtro",
        "code": "GY20575",
        "desc": "Filtro/cartucho filtrante original John Deere. Mantiene la pureza de los fluidos del equipo (Código: GY20575), previniendo el desgaste y la pérdida de rendimiento bajo trabajo intenso.",
        "price": 28.94,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 4,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "GY20575",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_lg273638s",
        "name": "Filtro",
        "code": "LG273638S",
        "desc": "Filtro/cartucho filtrante original John Deere. Mantiene la pureza de los fluidos del equipo (Código: LG273638S), previniendo el desgaste y la pérdida de rendimiento bajo trabajo intenso.",
        "price": 9.29,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "LG273638S",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_m111817",
        "name": "Filtro de combustible",
        "code": "M111817",
        "desc": "Filtro de combustible original John Deere (Código: M111817). Separa el agua y retiene los sedimentos microscópicos del gasoil, resguardando la bomba de inyección y los inyectores Common Rail.",
        "price": 52.39,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "M111817",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_m76076",
        "name": "Filtro",
        "code": "M76076",
        "desc": "Filtro/cartucho filtrante original John Deere. Mantiene la pureza de los fluidos del equipo (Código: M76076), previniendo el desgaste y la pérdida de rendimiento bajo trabajo intenso.",
        "price": 5.85,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "M76076",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_m806418",
        "name": "Filtro aceite motor",
        "code": "M806418",
        "desc": "Filtro de aceite motor original John Deere para maquinaria agrícola (Código: M806418). Proporciona un filtrado de alta eficiencia de impurezas, protegiendo las piezas internas del motor del desgaste mecánico.",
        "price": 19.25,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 7,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "M806418",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_m807152",
        "name": "Filtro combustible",
        "code": "M807152",
        "desc": "Filtro de combustible original John Deere (Código: M807152). Separa el agua y retiene los sedimentos microscópicos del gasoil, resguardando la bomba de inyección y los inyectores Common Rail.",
        "price": 26.84,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "M807152",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_m92360",
        "name": "Cartucho de filtro",
        "code": "M92360",
        "desc": "Filtro/cartucho filtrante original John Deere. Mantiene la pureza de los fluidos del equipo (Código: M92360), previniendo el desgaste y la pérdida de rendimiento bajo trabajo intenso.",
        "price": 20.44,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "M92360",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_m94734",
        "name": "Filtro de aire",
        "code": "M94734",
        "desc": "Filtro de aire de motor original John Deere (Código: M94734). Diseñado para retener polvo e impurezas externas, asegurando el flujo de aire óptimo y limpio para la combustión en condiciones de polvo severo en el campo.",
        "price": 45.85,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "M94734",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_m97211",
        "name": "Filtro de aire",
        "code": "M97211",
        "desc": "Filtro de aire de motor original John Deere (Código: M97211). Diseñado para retener polvo e impurezas externas, asegurando el flujo de aire óptimo y limpio para la combustión en condiciones de polvo severo en el campo.",
        "price": 24.7,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "M97211",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_miu11286",
        "name": "Filtro",
        "code": "MIU11286",
        "desc": "Filtro/cartucho filtrante original John Deere. Mantiene la pureza de los fluidos del equipo (Código: MIU11286), previniendo el desgaste y la pérdida de rendimiento bajo trabajo intenso.",
        "price": 23.35,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "MIU11286",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_miu11377",
        "name": "Cartucho de filtro",
        "code": "MIU11377",
        "desc": "Filtro/cartucho filtrante original John Deere. Mantiene la pureza de los fluidos del equipo (Código: MIU11377), previniendo el desgaste y la pérdida de rendimiento bajo trabajo intenso.",
        "price": 41.59,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "MIU11377",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_miu11513",
        "name": "Filtro de Aire",
        "code": "MIU11513",
        "desc": "Filtro de aire de motor original John Deere (Código: MIU11513). Diseñado para retener polvo e impurezas externas, asegurando el flujo de aire óptimo y limpio para la combustión en condiciones de polvo severo en el campo.",
        "price": 4.93,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "MIU11513",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_miu11515",
        "name": "Filtro de aire",
        "code": "MIU11515",
        "desc": "Filtro de aire de motor original John Deere (Código: MIU11515). Diseñado para retener polvo e impurezas externas, asegurando el flujo de aire óptimo y limpio para la combustión en condiciones de polvo severo en el campo.",
        "price": 39.06,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 3,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "MIU11515",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_miu13963",
        "name": "Filtro de aire",
        "code": "MIU13963",
        "desc": "Filtro de aire de motor original John Deere (Código: MIU13963). Diseñado para retener polvo e impurezas externas, asegurando el flujo de aire óptimo y limpio para la combustión en condiciones de polvo severo en el campo.",
        "price": 20.99,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "MIU13963",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_re68048",
        "name": "Filtro de aire",
        "code": "RE68048",
        "desc": "Filtro de aire de motor original John Deere (Código: RE68048). Diseñado para retener polvo e impurezas externas, asegurando el flujo de aire óptimo y limpio para la combustión en condiciones de polvo severo en el campo.",
        "price": 28.31,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 3,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "RE68048",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_re68049",
        "name": "Filtro de aire de seguridad",
        "code": "RE68049",
        "desc": "Filtro de aire de motor original John Deere (Código: RE68049). Diseñado para retener polvo e impurezas externas, asegurando el flujo de aire óptimo y limpio para la combustión en condiciones de polvo severo en el campo.",
        "price": 30.91,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 3,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "RE68049",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_jx0810d2",
        "name": "FILTRO ACEITE TAURUS",
        "code": "JX0810D2",
        "desc": "Filtro de aceite motor original John Deere para maquinaria agrícola (Código: JX0810D2). Proporciona un filtrado de alta eficiencia de impurezas, protegiendo las piezas internas del motor del desgaste mecánico.",
        "price": 42.45,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "JX0810D2",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_j11051_cd",
        "name": "BASE DE FILTRO",
        "code": "J11051-CD",
        "desc": "Filtro/cartucho filtrante original John Deere. Mantiene la pureza de los fluidos del equipo (Código: J11051-CD), previniendo el desgaste y la pérdida de rendimiento bajo trabajo intenso.",
        "price": 31.71,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "J11051-CD",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_j52906_cd",
        "name": "FILTRO",
        "code": "J52906-CD",
        "desc": "Filtro/cartucho filtrante original John Deere. Mantiene la pureza de los fluidos del equipo (Código: J52906-CD), previniendo el desgaste y la pérdida de rendimiento bajo trabajo intenso.",
        "price": 1.98,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "J52906-CD",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_al118036",
        "name": "Filtro hidráulico",
        "code": "AL118036",
        "desc": "Filtro de fluido hidráulico y transmisión John Deere (Código: AL118036). Diseñado para soportar altas presiones de trabajo en sistemas hidráulicos agrícolas, reteniendo micropartículas abrasivas.",
        "price": 45.48,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "AL118036",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_al177184",
        "name": "Filtro de aire",
        "code": "AL177184",
        "desc": "Filtro de aire de motor original John Deere (Código: AL177184). Diseñado para retener polvo e impurezas externas, asegurando el flujo de aire óptimo y limpio para la combustión en condiciones de polvo severo en el campo.",
        "price": 50.01,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "AL177184",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_al177185",
        "name": "Filtro de aire",
        "code": "AL177185",
        "desc": "Filtro de aire de motor original John Deere (Código: AL177185). Diseñado para retener polvo e impurezas externas, asegurando el flujo de aire óptimo y limpio para la combustión en condiciones de polvo severo en el campo.",
        "price": 67.77,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "AL177185",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_ar43634",
        "name": "Filtro de aceite",
        "code": "AR43634",
        "desc": "Filtro de aceite motor original John Deere para maquinaria agrícola (Código: AR43634). Proporciona un filtrado de alta eficiencia de impurezas, protegiendo las piezas internas del motor del desgaste mecánico.",
        "price": 12.01,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "AR43634",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_pe931140",
        "name": "Cartucho de filtro",
        "code": "PE931140",
        "desc": "Filtro/cartucho filtrante original John Deere. Mantiene la pureza de los fluidos del equipo (Código: PE931140), previniendo el desgaste y la pérdida de rendimiento bajo trabajo intenso.",
        "price": 18.44,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "PE931140",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_re533910",
        "name": "Filtro de combustibl",
        "code": "RE533910",
        "desc": "Filtro/cartucho filtrante original John Deere. Mantiene la pureza de los fluidos del equipo (Código: RE533910), previniendo el desgaste y la pérdida de rendimiento bajo trabajo intenso.",
        "price": 161.78,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "RE533910",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_at21469.rc",
        "name": "BASE FILTROS",
        "code": "AT21469.RC",
        "desc": "Filtro/cartucho filtrante original John Deere. Mantiene la pureza de los fluidos del equipo (Código: AT21469.RC), previniendo el desgaste y la pérdida de rendimiento bajo trabajo intenso.",
        "price": 40.86,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "AT21469.RC",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_j52956_rv",
        "name": "FILTRO",
        "code": "J52956-RV",
        "desc": "Filtro/cartucho filtrante original John Deere. Mantiene la pureza de los fluidos del equipo (Código: J52956-RV), previniendo el desgaste y la pérdida de rendimiento bajo trabajo intenso.",
        "price": 5.25,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "J52956-RV",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_j54432_rc",
        "name": "VALVULA FILTRO AIRE",
        "code": "J54432-RC",
        "desc": "Filtro de aire de motor original John Deere (Código: J54432-RC). Diseñado para retener polvo e impurezas externas, asegurando el flujo de aire óptimo y limpio para la combustión en condiciones de polvo severo en el campo.",
        "price": 6.2,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "J54432-RC",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_r34985_rc",
        "name": "BOQUILLA BOMBA AGUA",
        "code": "R34985-RC",
        "desc": "Boquilla de pulverización de alta precisión original. Fabricada con materiales de alta calidad, resistente al desgaste y corrosión química, garantizando una distribución de gotas uniforme.",
        "price": 5.51,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "R34985-RC",
            "Marca": "John Deere",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "udor_2507608",
        "name": "JUEGO CHAPAS PLEGADAS P/ECOTANK 200/500 P/DRONES",
        "code": "2507608",
        "desc": "Repuesto original John Deere (Código: 2507608) para maquinaria agrícola. Diseñado bajo especificaciones de fábrica para máxima fiabilidad, durabilidad y compatibilidad exacta con su tractor o cosechadora.",
        "price": 1634.75,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "UDOR",
        "model": "EcoTank",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "2507608",
            "Marca": "UDOR",
            "Compatibilidad": "Drones de pulverización (Agras T30/T40/T50)",
            "Origen": "Italia"
        }
    },
    {
        "id": "udor_2507719",
        "name": "MEZCLADOR ECOTANK - KIT MANGUERA/PISTOLA DRON",
        "code": "2507719",
        "desc": "Mezclador químico MEZCLADOR ECOTANK - KIT MANGUERA/PISTOLA DRON marca UDOR. Diseñado especialmente para optimizar la premezcla de productos fitosanitarios y acelerar los tiempos de reabastecimiento en tierra para drones agrícolas DJI Agras. Fabricado con materiales de alta resistencia a la corrosión química.",
        "price": 135.25,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "UDOR",
        "model": "EcoTank",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "2507719",
            "Marca": "UDOR",
            "Compatibilidad": "Drones de pulverización (Agras T30/T40/T50)",
            "Origen": "Italia"
        }
    },
    {
        "id": "udor_2507739",
        "name": "MEZCLADOR ECOTANK P/DRONES - KIT BOMBA AGUA LIMPIA",
        "code": "2507739",
        "desc": "Mezclador químico MEZCLADOR ECOTANK P/DRONES - KIT BOMBA AGUA LIMPIA marca UDOR. Diseñado especialmente para optimizar la premezcla de productos fitosanitarios y acelerar los tiempos de reabastecimiento en tierra para drones agrícolas DJI Agras. Fabricado con materiales de alta resistencia a la corrosión química.",
        "price": 1735.53,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "UDOR",
        "model": "EcoTank",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "2507739",
            "Marca": "UDOR",
            "Compatibilidad": "Drones de pulverización (Agras T30/T40/T50)",
            "Origen": "Italia"
        }
    },
    {
        "id": "udor_2507854",
        "name": "MEZCLADOR ECOTANK P/DRONES - CONJUNTO BASE",
        "code": "2507854",
        "desc": "Mezclador químico MEZCLADOR ECOTANK P/DRONES - CONJUNTO BASE marca UDOR. Diseñado especialmente para optimizar la premezcla de productos fitosanitarios y acelerar los tiempos de reabastecimiento en tierra para drones agrícolas DJI Agras. Fabricado con materiales de alta resistencia a la corrosión química.",
        "price": 8252.39,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "UDOR",
        "model": "EcoTank",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "2507854",
            "Marca": "UDOR",
            "Compatibilidad": "Drones de pulverización (Agras T30/T40/T50)",
            "Origen": "Italia"
        }
    },
    {
        "id": "udor_2507855",
        "name": "MEZCLADOR ECOTANK P/DRONES - TANQUE 200",
        "code": "2507855",
        "desc": "Mezclador químico MEZCLADOR ECOTANK P/DRONES - TANQUE 200 marca UDOR. Diseñado especialmente para optimizar la premezcla de productos fitosanitarios y acelerar los tiempos de reabastecimiento en tierra para drones agrícolas DJI Agras. Fabricado con materiales de alta resistencia a la corrosión química.",
        "price": 1244.83,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "UDOR",
        "model": "EcoTank",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "2507855",
            "Marca": "UDOR",
            "Compatibilidad": "Drones de pulverización (Agras T30/T40/T50)",
            "Origen": "Italia"
        }
    },
    {
        "id": "udor_2507856",
        "name": "MEZCLADOR ECOTANK P/DRONES - TANQUE 500",
        "code": "2507856",
        "desc": "Mezclador químico MEZCLADOR ECOTANK P/DRONES - TANQUE 500 marca UDOR. Diseñado especialmente para optimizar la premezcla de productos fitosanitarios y acelerar los tiempos de reabastecimiento en tierra para drones agrícolas DJI Agras. Fabricado con materiales de alta resistencia a la corrosión química.",
        "price": 3007.6,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "UDOR",
        "model": "EcoTank",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "2507856",
            "Marca": "UDOR",
            "Compatibilidad": "Drones de pulverización (Agras T30/T40/T50)",
            "Origen": "Italia"
        }
    },
    {
        "id": "udor_2507857",
        "name": "MEZCLADOR ECOTANK P/DRONES - TANQUE 700",
        "code": "2507857",
        "desc": "Mezclador químico MEZCLADOR ECOTANK P/DRONES - TANQUE 700 marca UDOR. Diseñado especialmente para optimizar la premezcla de productos fitosanitarios y acelerar los tiempos de reabastecimiento en tierra para drones agrícolas DJI Agras. Fabricado con materiales de alta resistencia a la corrosión química.",
        "price": 3817.87,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "UDOR",
        "model": "EcoTank",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "2507857",
            "Marca": "UDOR",
            "Compatibilidad": "Drones de pulverización (Agras T30/T40/T50)",
            "Origen": "Italia"
        }
    },
    {
        "id": "udor_2507889",
        "name": "PISTOLA DESPACHO DRON",
        "code": "2507889",
        "desc": "Pistola de despacho y carga rápida de alto caudal para la recarga limpia de drones de pulverización. Evita pérdidas de mezcla y agiliza el reabastecimiento en la zona de despegue.",
        "price": 72.75,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "UDOR",
        "model": "EcoTank",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "2507889",
            "Marca": "UDOR",
            "Compatibilidad": "Drones de pulverización (Agras T30/T40/T50)",
            "Origen": "Italia"
        }
    },
    {
        "id": "udor_2507893",
        "name": "CHASIS ECOTANK 200 DRON/FULL",
        "code": "2507893",
        "desc": "Chasis metálico reforzado diseñado específicamente para soportar el tanque de mezcla EcoTank de drones. Estructura robusta para el traslado seguro del mezclador químico al campo.",
        "price": 244.0,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "UDOR",
        "model": "EcoTank",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "2507893",
            "Marca": "UDOR",
            "Compatibilidad": "Drones de pulverización (Agras T30/T40/T50)",
            "Origen": "Italia"
        }
    },
    {
        "id": "udor_6501099",
        "name": "MEZCLADOR ECOTANK P/DRONES 200/500",
        "code": "6501099",
        "desc": "Mezclador químico MEZCLADOR ECOTANK P/DRONES 200/500 marca UDOR. Diseñado especialmente para optimizar la premezcla de productos fitosanitarios y acelerar los tiempos de reabastecimiento en tierra para drones agrícolas DJI Agras. Fabricado con materiales de alta resistencia a la corrosión química.",
        "price": 12644.89,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "UDOR",
        "model": "EcoTank",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "6501099",
            "Marca": "UDOR",
            "Compatibilidad": "Drones de pulverización (Agras T30/T40/T50)",
            "Origen": "Italia"
        }
    },
    {
        "id": "udor_6501100",
        "name": "MEZCLADOR ECOTANK P/DRONES 700/1000",
        "code": "6501100",
        "desc": "Mezclador químico MEZCLADOR ECOTANK P/DRONES 700/1000 marca UDOR. Diseñado especialmente para optimizar la premezcla de productos fitosanitarios y acelerar los tiempos de reabastecimiento en tierra para drones agrícolas DJI Agras. Fabricado con materiales de alta resistencia a la corrosión química.",
        "price": 15039.16,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "UDOR",
        "model": "EcoTank",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "6501100",
            "Marca": "UDOR",
            "Compatibilidad": "Drones de pulverización (Agras T30/T40/T50)",
            "Origen": "Italia"
        }
    },
    {
        "id": "udor_6501106",
        "name": "MEZCLADOR ECOTANK 200 DRON",
        "code": "6501106",
        "desc": "Mezclador químico MEZCLADOR ECOTANK 200 DRON marca UDOR. Diseñado especialmente para optimizar la premezcla de productos fitosanitarios y acelerar los tiempos de reabastecimiento en tierra para drones agrícolas DJI Agras. Fabricado con materiales de alta resistencia a la corrosión química.",
        "price": 3641.89,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "UDOR",
        "model": "EcoTank",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "6501106",
            "Marca": "UDOR",
            "Compatibilidad": "Drones de pulverización (Agras T30/T40/T50)",
            "Origen": "Italia"
        }
    },
    {
        "id": "udor_6501107",
        "name": "MEZCLADOR ECOTANK 500 DRON",
        "code": "6501107",
        "desc": "Mezclador químico MEZCLADOR ECOTANK 500 DRON marca UDOR. Diseñado especialmente para optimizar la premezcla de productos fitosanitarios y acelerar los tiempos de reabastecimiento en tierra para drones agrícolas DJI Agras. Fabricado con materiales de alta resistencia a la corrosión química.",
        "price": 4530.83,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "UDOR",
        "model": "EcoTank",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "6501107",
            "Marca": "UDOR",
            "Compatibilidad": "Drones de pulverización (Agras T30/T40/T50)",
            "Origen": "Italia"
        }
    },
    {
        "id": "udor_6501110",
        "name": "MEZCLADOR ECOTANK 500 NEVADA / DRON",
        "code": "6501110",
        "desc": "Mezclador químico MEZCLADOR ECOTANK 500 NEVADA / DRON marca UDOR. Diseñado especialmente para optimizar la premezcla de productos fitosanitarios y acelerar los tiempos de reabastecimiento en tierra para drones agrícolas DJI Agras. Fabricado con materiales de alta resistencia a la corrosión química.",
        "price": 5113.91,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "UDOR",
        "model": "EcoTank",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "6501110",
            "Marca": "UDOR",
            "Compatibilidad": "Drones de pulverización (Agras T30/T40/T50)",
            "Origen": "Italia"
        }
    }
];

let products = [];

// Inicialización de la base de datos de productos
export async function loadProductsData() {
    try {
        if (useFirebase) {
            const querySnapshot = await getDocs(collection(db, "druetto_products"));
            const fbList = [];
            querySnapshot.forEach((doc) => {
                fbList.push({ id: doc.id, ...doc.data() });
            });
            
            if (fbList.length >= 15) {
                products = fbList;
            } else {
                // Catálogo incompleto o vacío, inicializar/actualizar con defaults de forma atómica en un lote
                const batch = writeBatch(db);
                for (const p of SEED_PRODUCTS) {
                    const docRef = doc(db, "druetto_products", p.id);
                    batch.set(docRef, p);
                }
                await batch.commit();
                products = [...SEED_PRODUCTS];
                console.log("[Firebase Seeding Store] Catálogo completo (" + SEED_PRODUCTS.length + " productos) sembrado con éxito en Firestore.");
            }

        } else {
            // Local fallback
            const localList = await localDb.getCollection("products");
            if (localList.length > 0 && localList.length >= SEED_PRODUCTS.length) {
                products = localList;
            } else {
                await localDb.setCollection("products", SEED_PRODUCTS);
                products = [...SEED_PRODUCTS];
            }
        }
    } catch (e) {
        console.error("Error cargando catálogo de productos:", e);
        products = [...SEED_PRODUCTS];
    }
    return products;
}

// ─── Lógica de Renderizado del Catálogo (tienda.html) ─────────────────
window.renderStoreCatalog = function(containerId, filters = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let filtered = [...products];

    // Búsqueda
    if (filters.search) {
        const query = filters.search.toLowerCase();
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(query) || 
            p.brand?.toLowerCase().includes(query) || 
            p.code.toLowerCase().includes(query)
        );
    }

    // Categoría
    if (filters.category && filters.category !== 'all') {
        filtered = filtered.filter(p => p.category === filters.category);
    }

    // Marca
    if (filters.brand && filters.brand !== 'all') {
        filtered = filtered.filter(p => p.brand === filters.brand);
    }

    // Estado (Nuevo / Usado / Restaurado)
    if (filters.condition && filters.condition !== 'all') {
        filtered = filtered.filter(p => p.condition === filters.condition);
    }

    // Precio Mínimo y Máximo
    if (filters.priceMin) {
        filtered = filtered.filter(p => p.price >= parseFloat(filters.priceMin));
    }
    if (filters.priceMax) {
        filtered = filtered.filter(p => p.price <= parseFloat(filters.priceMax));
    }

    // Ordenar
    if (filters.order) {
        if (filters.order === 'price_asc') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (filters.order === 'price_desc') {
            filtered.sort((a, b) => b.price - a.price);
        } else {
            // Recientes por defecto (si hay fecha o ID)
            filtered.reverse();
        }
    }

    container.innerHTML = '';

    if (filtered.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align:center; padding: 4rem 1rem; color: #888;">
                <i class="fas fa-search" style="font-size:3rem; margin-bottom:1rem; color:#444;"></i>
                <p>No se encontraron productos con estos filtros.</p>
            </div>
        `;
        return;
    }

    // Paginación state variables (inicializados si no existen)
    if (typeof window.currentPage === 'undefined') window.currentPage = 1;
    if (typeof window.productsPerPage === 'undefined') window.productsPerPage = 30;

    const totalProducts = filtered.length;
    const totalPages = Math.ceil(totalProducts / window.productsPerPage);

    // Ajustar página actual si excede el número de páginas
    if (window.currentPage > totalPages && totalPages > 0) {
        window.currentPage = 1;
    }

    const startIdx = (window.currentPage - 1) * window.productsPerPage;
    const endIdx = startIdx + window.productsPerPage;
    const pageProducts = filtered.slice(startIdx, endIdx);

    pageProducts.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-store-card';
        const coverImg = p.images && p.images.length > 0 ? p.images[0] : 'assets/img/default.png';
        
        card.innerHTML = `
            <div class="store-card-img-wrap" onclick="viewProductDetail('${p.id}')">
                <img src="${coverImg}" alt="${p.name}" class="store-card-img">
                <span class="store-card-badge ${p.condition.toLowerCase()}">${p.condition}</span>
            </div>
            <div class="store-card-info">
                <span class="store-card-cat">${p.category}</span>
                <h3 class="store-card-title" onclick="viewProductDetail('${p.id}')">${p.name}</h3>
                <p class="store-card-code">Código: ${p.code}</p>
                <div class="store-card-price-row">
                    <span class="store-card-price">$${p.price.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                    <span class="store-card-stock ${p.stock > 0 ? 'in-stock' : 'out-of-stock'}">
                        ${p.stock > 0 ? `Stock: ${p.stock}` : 'Sin Stock'}
                    </span>
                </div>
                <div class="store-card-actions">
                    <button class="store-card-btn-cart" onclick="addToCart('${p.id}', '${p.name.replace(/'/g, "\\'")}', '${p.code}', ${p.price}, '${coverImg}')" ${p.stock <= 0 ? 'disabled' : ''}>
                        <i class="fas fa-shopping-cart"></i> Agregar
                    </button>
                    <button class="store-card-btn-view" onclick="viewProductDetail('${p.id}')">
                        <i class="fas fa-eye"></i> Detalles
                    </button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });

    // Renderizar botones de paginación
    const paginationContainer = document.getElementById('catalog-pagination');
    if (paginationContainer) {
        paginationContainer.innerHTML = '';
        if (totalPages > 1) {
            let pagHtml = '';
            
            // Botón Anterior
            pagHtml += `<button class="pag-btn" ${window.currentPage === 1 ? 'disabled' : ''} onclick="changePage(${window.currentPage - 1})"><i class="fas fa-chevron-left"></i></button>`;
            
            // Páginas numéricas
            for (let i = 1; i <= totalPages; i++) {
                pagHtml += `<button class="pag-btn ${window.currentPage === i ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
            }
            
            // Botón Siguiente
            pagHtml += `<button class="pag-btn" ${window.currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${window.currentPage + 1})"><i class="fas fa-chevron-right"></i></button>`;
            
            paginationContainer.innerHTML = pagHtml;
        }
    }
};

// Redirecciona o abre la vista de detalle
window.viewProductDetail = function(productId) {
    window.location.href = `producto-detalle.html?id=${productId}`;
};

// ─── Lógica de Renderizado del Detalle del Producto (producto-detalle.html) ───
window.renderProductDetailPage = async function() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) {
        document.getElementById('detail-page-content').innerHTML = `
            <div style="text-align:center; padding: 5rem 1rem;">
                <h2>Producto no especificado</h2>
                <a href="tienda.html" class="btn">Volver a la Tienda</a>
            </div>
        `;
        return;
    }

    await loadProductsData();
    const p = products.find(x => x.id === id);
    if (!p) {
        document.getElementById('detail-page-content').innerHTML = `
            <div style="text-align:center; padding: 5rem 1rem;">
                <h2>El producto no existe o fue eliminado</h2>
                <a href="tienda.html" class="btn">Volver a la Tienda</a>
            </div>
        `;
        return;
    }

    // Inyectar título
    document.title = `${p.name} | Casa Druetto`;

    // Renderizar Fotos
    const mainImgContainer = document.getElementById('product-detail-main-img');
    const thumbContainer = document.getElementById('product-detail-thumbs');
    
    if (mainImgContainer) {
        const cover = p.images && p.images.length > 0 ? p.images[0] : 'assets/img/default.png';
        mainImgContainer.innerHTML = `<img src="${cover}" alt="${p.name}" id="main-detailed-img" class="detail-main-img">`;
    }

    if (thumbContainer && p.images && p.images.length > 1) {
        thumbContainer.innerHTML = '';
        p.images.forEach((img, idx) => {
            const thumb = document.createElement('img');
            thumb.src = img;
            thumb.alt = `${p.name} vista ${idx+1}`;
            thumb.className = `thumb-img ${idx === 0 ? 'active' : ''}`;
            thumb.onclick = function() {
                document.querySelectorAll('.thumb-img').forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
                document.getElementById('main-detailed-img').src = img;
            };
            thumbContainer.appendChild(thumb);
        });
    }

    // Información del producto
    document.getElementById('detail-title').innerText = p.name;
    document.getElementById('detail-category').innerText = p.category;
    document.getElementById('detail-code').innerText = p.code;
    document.getElementById('detail-condition').innerText = p.condition;
    document.getElementById('detail-condition').className = `detail-badge ${p.condition.toLowerCase()}`;
    document.getElementById('detail-brand').innerText = p.brand || 'No especificada';
    document.getElementById('detail-price').innerText = `$${p.price.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;
    
    const stockEl = document.getElementById('detail-stock');
    if (stockEl) {
        stockEl.innerText = p.stock > 0 ? `Stock Disponible: ${p.stock} unidades` : 'Sin Stock Disponible';
        stockEl.className = p.stock > 0 ? 'stock-status in-stock' : 'stock-status out-of-stock';
    }

    document.getElementById('detail-desc').innerText = p.desc;

    // Ficha Técnica (Specs)
    const specsContainer = document.getElementById('detail-specs-table');
    if (specsContainer) {
        specsContainer.innerHTML = '';
        if (p.specs && Object.keys(p.specs).length > 0) {
            Object.entries(p.specs).forEach(([k, v]) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td class="spec-name">${k}</td>
                    <td class="spec-val">${v}</td>
                `;
                specsContainer.appendChild(tr);
            });
        } else {
            specsContainer.innerHTML = '<tr><td colspan="2">No hay especificaciones técnicas detalladas para este equipo.</td></tr>';
        }
    }

    // Botones de Compra y Redirecciones
    const buyLocalBtn = document.getElementById('detail-buy-local-btn');
    if (buyLocalBtn) {
        buyLocalBtn.disabled = p.stock <= 0;
        buyLocalBtn.onclick = function() {
            const cover = p.images && p.images.length > 0 ? p.images[0] : 'assets/img/default.png';
            window.addToCart(p.id, p.name, p.code, p.price, cover, 1);
            // Abrir automáticamente el carrito para feedback visual
            window.toggleCart(true);
        };
    }

    const addCartBtn = document.getElementById('detail-add-cart-btn');
    if (addCartBtn) {
        addCartBtn.disabled = p.stock <= 0;
    }

    const buyMlBtn = document.getElementById('detail-buy-ml-btn');
    if (buyMlBtn) {
        if (p.mercadolibreLink && p.mercadolibreLink.trim() !== '') {
            buyMlBtn.style.display = 'inline-flex';
            buyMlBtn.href = p.mercadolibreLink;
        } else {
            buyMlBtn.style.display = 'none';
        }
    }
};

// Cargar catálogo al iniciar la tienda
document.addEventListener('DOMContentLoaded', async () => {
    // Si la página contiene el catálogo, inicializar los datos y renderizar
    if (document.getElementById('store-catalog-grid')) {
        await loadProductsData();
        window.renderStoreCatalog('store-catalog-grid', { order: 'recent' });
    }
    
    // Si es la página de detalle del producto, cargar e inyectar datos
    if (document.getElementById('detail-page-content')) {
        window.renderProductDetailPage();
    }
});
