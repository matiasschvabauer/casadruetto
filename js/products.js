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
        "price": 29282.5,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T40",
        "stock": 3,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785192720/bt2ji0le3yungebz7ptu.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785242905/qihvuccbkimkuj7lhwwe.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785242906/puq49u57z6okowodvgib.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785242907/lbxmjcqkpjtpkzgkkhl9.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785242908/x7o6qb3p7zwnumlnx7we.png"
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
        "price": 102850.0,
        "category": "Maquinaria Agrícola",
        "condition": "Usado",
        "brand": "John Deere",
        "model": "6125J",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785242949/hnptron9rqjmh6zmis79.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785242950/jvfsws6ze8totlozzs21.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785242951/kb4binem0eqemfrgebpr.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785242953/dsnx25kkzyphhjkwzpal.jpg"
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
        "price": 11858.0,
        "category": "Agricultura de Precisión",
        "condition": "Nuevo",
        "brand": "Trimble",
        "model": "GFX-750",
        "stock": 8,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785242945/cftf0qtcedt4hukut0nl.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785242947/zur9g1r502z5amdqq0u7.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785242948/kdtj0ykqbqxs2nfvhjkg.jpg"
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
        "price": 17545.0,
        "category": "Maquinaria Agrícola",
        "condition": "Restaurado",
        "brand": "Fiat",
        "model": "700",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785242943/djthpgjcy35b6ubwn3vk.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785242944/etiacyuy1adit15ixvcx.jpg"
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
        "desc": "Repuesto para maquinaria agrícola. Código: N280829. Boquilla.",
        "price": 7.49,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 4,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281676/oa1ctf8n8mmrbdiocvk5.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281677/k9g5bn6n5cahkcbawfba.webp"
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
        "desc": "Repuesto para maquinaria agrícola. Código: N282738. Boquilla.",
        "price": 7.37,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 6,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281678/uok6wnibj34wi200ndjx.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281679/nnvkkhmnkjpkwusnnywt.jpg"
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE532952. CARTUCHO DE FILTRO.",
        "price": 169.64,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 3,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785242921/uh8hfjvlhqqtzwwguvvg.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785242923/ytgpmzijvq7uxoo9on3v.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785242925/umdgv7w2vw6tfjvefmhg.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724254274-cartucho-de-filtro-repuesto-agricola-john-deere-cod-re532952-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: SW10967P1. Cartucho de filtro.",
        "price": 12.39,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 14,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785242926/tnzssg1lrh22dqknutrv.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785242927/o5crybpgu6mmjk00seqz.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785242929/a96xvb4fatsvag8uxp2l.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724153602-cartucho-de-filtro-repuesto-agricola-john-deere-cod-sw10967p-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AJ11402. Filtro de aceite motor.",
        "price": 14.27,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 4,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785242930/t8fjpw2jj5p0hbark91m.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947668771-filtro-de-aceite-motor-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: DQ24941. Filtro de aire.",
        "price": 40.7,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785242931/xxnrvvi67nr1ihxffu7y.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785242932/ntxphjpx5dcc4ah6yhv2.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785242933/nf9qj3i4jfzusnnuqkoh.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724153614-filtro-de-aire-repuesto-agricola-john-deere-cod-dq24941-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: PE78420010. Filtro aceite hidraulico.",
        "price": 107.93,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 6,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947668781-filtro-aceite-hidraulico-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AH120547. Filtro A/A.",
        "price": 100.18,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 8,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785242936/pi3kssacnsbhmtkdefok.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724254286-filtro-aa-repuesto-agricola-john-deere-cod-ah120547-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: H146639. Portaaspersor.",
        "price": 248.0,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785242938/qnosu59ghcxzweawmq7z.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785242939/oqhl27uat4jbzmwonjp8.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724254288-portaaspersor-repuesto-agricola-john-deere-cod-h146639-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: Z51244. Filtro.",
        "price": 2.19,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 3,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281731/e0qbtvnq6qgluxmxxfgl.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947668795-filtro-repuesto-agricola-john-deere-cod-z51244-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AL79010. Filtro.",
        "price": 171.53,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785242941/bzn2iot0es3uet3cq1qo.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785242942/ounzz746cvf11oto7fha.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724254294-filtro-repuesto-agricola-john-deere-cod-al79010-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: L79122. Filtro.",
        "price": 89.83,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281683/kjvvluuwnddqgobruo3f.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724153632-filtro-repuesto-agricola-john-deere-cod-l79122-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: R53169. Filtro.",
        "price": 66.44,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281684/nmrflsxd7jwrh8dzkvs1.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947668801-filtro-repuesto-agricola-john-deere-cod-r53169-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: R89411. Filtro.",
        "price": 96.72,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281685/lgs4tlo4azgvzyxt7lq0.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724153650-filtro-repuesto-agricola-john-deere-cod-r89411-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AE29052. Filtro de combustible.",
        "price": 12.28,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281687/gj6tvqqkhj17mzal2ftx.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947668823-filtro-de-combustible-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AE31724. Filtro de aire.",
        "price": 70.13,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281730/f7hold0nlehxuyefpbay.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947668835-filtro-de-aire-repuesto-agricola-john-deere-cod-ae31724-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AH115836. Filtro de A/A.",
        "price": 63.48,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281732/qs0wsfopbeuvpbudxocc.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281733/fmzypdv5zr6m1lnfqtgj.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724254332-filtro-de-aa-repuesto-agricola-john-deere-cod-ah115836-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AH128449. Filtro de hidr ulico.",
        "price": 87.85,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 27,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281734/xnmnaw56pzmtytw3rfpv.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281736/wkv5qyjxdwhuhckzfmun.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724254336-filtro-de-hidraulico-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AH148880. Filtro de aire.",
        "price": 169.4,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281738/lh0vpdqvfklqevdxge86.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281739/zlhrkrvguubuzyzj2f9c.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281741/lmdftxahwfm9no8egbdz.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281743/zupfux35vqgz2qubrxoo.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724153680-filtro-de-aire-repuesto-agricola-john-deere-cod-ah148880-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AH164063. Filtro de seguridad.",
        "price": 189.97,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281745/j2wxopjq17u0xqrsped4.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281746/rquekvzqgg3zi4jbpfrm.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724153694-filtro-de-seguridad-repuesto-agricola-john-deere-cod-ah16406-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AH165504. Filtro de combustible.",
        "price": 59.1,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281747/slfu1g9chjzrxbyeygig.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281748/fz4yhwhxoyqgxww0cmw6.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281749/rhxefkns0vqkeueqegs9.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947668867-filtro-de-combustible-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AH170798. Filtro Aire Motor.",
        "price": 184.71,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281751/xjw8tiqcwnbhtygo41ph.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281752/ovgzdnu52ijuhubjpoqi.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281755/cfxhan4o4rxuznsvrshd.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281756/u6pfwci3tlhvuqeajmys.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947668873-filtro-aire-motor-repuesto-agricola-john-deere-cod-ah170798-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AH174196. Prefiltro Aire Motor.",
        "price": 127.35,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281758/y59zxmiqbocq7tuha6kt.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281759/ojikwlg5bw19ctiihrs9.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724153706-prefiltro-aire-motor-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AH212294. Filtro Aire.",
        "price": 337.24,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281761/mzut5wacozztt9bwwoxn.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281762/vczx8hduewbsymmyrio0.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724153710-filtro-aire-repuesto-agricola-john-deere-cod-ah212294-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AH212295. Filtro Aire.",
        "price": 254.57,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281763/ko31icfatd5nqcew2yzk.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281765/ibbi1fobrf2ljkdrsyut.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281767/wo9vi4kug9qpnm5bgsku.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947668887-filtro-aire-repuesto-agricola-john-deere-cod-ah212295-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AH222225. Filtro.",
        "price": 585.99,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281768/jiueyvzrbcjzx0heupfq.png",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281769/taagx4t0a7yplnamyadr.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724153720-filtro-repuesto-agricola-john-deere-cod-ah222225-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AJ10106. Filtro de aceite.",
        "price": 15.55,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 8,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281770/fbhscn8wyozw1ahdamml.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947668895-filtro-de-aceite-repuesto-agricola-john-deere-cod-aj10106-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AJ11399. Filtro de combustible auxiliar.",
        "price": 8.72,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 3,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281771/nqe4prhrabcalaij4nlp.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947668899-filtro-de-combustible-auxiliar-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AJ55127. Filtro Aire Primario.",
        "price": 102.86,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 7,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724254374-filtro-aire-primario-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AJ55128. Filtro Aire Seguridad.",
        "price": 81.13,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724153734-filtro-aire-seguridad-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AL119095. Filtro.",
        "price": 99.84,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281772/wtejxgvzczmkeyzqxl3d.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281775/qrfvtwltmzui6szrtois.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947668917-filtro-repuesto-agricola-john-deere-cod-al119095-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AL150288. Filtro Seguridad.",
        "price": 74.1,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281776/cjwyltkapsyj6pxaj9sj.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281778/bknzsjhdcogqjltn2ijd.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281780/ku8tupe48twyw5yluexl.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724153736-filtro-seguridad-repuesto-agricola-john-deere-cod-al150288-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AL156625. FILTRO TRANSM (AL221066).",
        "price": 106.9,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281781/yj2ghl0lf7p0xtu03zyr.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281783/ntwudjjnhvalz7wfjx8t.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724254382-filtro-transm-al221066-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AN260207. Filtro.",
        "price": 182.36,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 4,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281784/jvsaggtbqcsxtc7bydrh.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724153744-filtro-repuesto-agricola-john-deere-cod-an260207-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AP29320. Cartucho de filtro.",
        "price": 37.49,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 3,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281785/hbjhtnunakuldzptsvbx.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947668933-cartucho-de-filtro-repuesto-agricola-john-deere-cod-ap29320-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AR103220. Filtro Combustible.",
        "price": 59.3,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281787/bb6tm5ro6tfc5aof9lg1.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281788/v9moigeeqs18zif0bgqa.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724254390-filtro-combustible-repuesto-agricola-john-deere-cod-ar103220-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AR45785. Filtro.",
        "price": 104.23,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281789/wjjexvygqmwgfkka6ezw.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724153750-filtro-repuesto-agricola-john-deere-cod-ar45785-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AR50041. Filtro Combustible.",
        "price": 30.3,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 11,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281791/gttjq4ki9jkoujcebu3l.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281792/tsnuscxuyvvoeygdgkjg.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281793/vfkcfqhzmmcq7wqzykch.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947668949-filtro-combustible-repuesto-agricola-john-deere-cod-ar50041-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AR75603. Filtro de aceite transmisi n.",
        "price": 25.54,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 3,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281794/ttr3o6gufrwqeu3ldfaz.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281796/wysgh5zmknt7vklxdb8s.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947668955-filtro-de-aceite-transmision-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AR79941. Filtro de Aire Primario.",
        "price": 103.2,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281797/aeqims7fnbnwhpn7vbfy.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724254410-filtro-de-aire-primario-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AR84228. Filtro aire.",
        "price": 124.46,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281798/qfrj2ryqtskntdxdyfha.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281799/plfexipujghe8fitbmyg.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724153758-filtro-aire-repuesto-agricola-john-deere-cod-ar84228-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AR86755. Filtro auxiliar de combustible.",
        "price": 58.87,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281801/r4uhzqyu78y75gamck4g.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281803/big28ercgkoyyjndsjg4.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724153760-filtro-auxiliar-de-combustible-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AT171853. Filtro de Aire.",
        "price": 79.68,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 14,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281804/sjlab9kizdmxohkac57o.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281807/yuuryiycbilfeh4nw1qk.png",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281809/wrf2ckfqao81j6fzonbs.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947668967-filtro-de-aire-repuesto-agricola-john-deere-cod-at171853-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AT171854. Filtro de Seguridad.",
        "price": 40.46,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 17,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281810/ebfz4vu9hbfbajk485xv.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281812/bvcmduwq34lgyftdj4qn.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281813/gygxf6xv4xstalyetczh.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724153776-filtro-de-seguridad-repuesto-agricola-john-deere-cod-at17185-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AT17387. Filtro de combustible.",
        "price": 11.54,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 22,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281814/t0fmwhncgk8ibybmp7tz.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281815/jdyudvmyyyril0aue2in.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281817/vj0rzeycq3aqmdrk9zio.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724153782-filtro-de-combustible-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AT178517. Cartucho de filtro.",
        "price": 88.44,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281818/icbn0dh3hflm2v9zfxpz.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281819/pxvvpvck6zcz7mqsphlj.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724153794-cartucho-de-filtro-repuesto-agricola-john-deere-cod-at178517-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AT195915. Filtro hidr ulico.",
        "price": 112.24,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281820/tnipksntgpblpyjgbcee.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947668977-filtro-hidraulico-repuesto-agricola-john-deere-cod-at195915-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AT228474. Filtro de aceite.",
        "price": 165.16,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281823/ufonppbnlx3fbood8eii.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724153802-filtro-de-aceite-repuesto-agricola-john-deere-cod-at228474-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AT308274. Filtro de Aceite.",
        "price": 148.59,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281826/m25ipewv5brupxn5vpra.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724254438-filtro-de-aceite-repuesto-agricola-john-deere-cod-at308274-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AT33364. Filtro de Aire.",
        "price": 42.85,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290581/xrs9stxzni1hd3lxynwv.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290582/pf2exmnjvclrksp2tce3.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947668979-filtro-de-aire-repuesto-agricola-john-deere-cod-at33364-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AT44378. Cartucho de filtro.",
        "price": 83.97,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290584/blxqsvpz7zrzrvxbc9dq.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290586/enxbommb0nqlwwujteui.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724153812-cartucho-de-filtro-repuesto-agricola-john-deere-cod-at44378-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AT67957. Filtro.",
        "price": 73.64,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290587/qpwha9eibutois2vztrv.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290588/yymmb9s7dfp9spsqucwp.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724153816-filtro-repuesto-agricola-john-deere-cod-at67957-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AZ22878. Filtro.",
        "price": 29.63,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290590/rv1aw8ewpiqblj2ub0mq.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290593/dm1kqpgbuxympk9lxsy8.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947668989-filtro-repuesto-agricola-john-deere-cod-az22878-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AZ26007. Cartucho de filtro.",
        "price": 40.28,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290595/gn37kmqemdxgctvqwg34.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290596/igcojqlomqbxqzjsimij.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724153824-cartucho-de-filtro-repuesto-agricola-john-deere-cod-az26007-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AZ26091. Cartucho de filtro.",
        "price": 81.26,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290598/vzp0xz4snkm4ou4vga5g.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724153828-cartucho-de-filtro-repuesto-agricola-john-deere-cod-az26091-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AZ43412. Filtro Aire Cabina.",
        "price": 241.46,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290600/gpncbjyo6zxqg6vb8skg.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290601/eivrbywrmrgbtn1q8xrk.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290603/tkn8h3zijtpqwnpsfzew.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724254468-filtro-aire-cabina-repuesto-agricola-john-deere-cod-az43412-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AZ48195. Filtro de aire.",
        "price": 154.2,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290605/zkvnhswecifkiksouuya.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290606/ikc7acaxoliexrtaqysq.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724153844-filtro-de-aire-repuesto-agricola-john-deere-cod-az48195-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AZ48196. Filtro de seguridad.",
        "price": 96.12,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290608/vqhkareymprrtdxkfkkd.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947669009-filtro-de-seguridad-repuesto-agricola-john-deere-cod-az48196-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: CE16309. Filtro.",
        "price": 97.03,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290609/zwawfbwmtmxepfgwy6ir.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290613/n2zpa5ocilhbmfysqjhp.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724254474-filtro-repuesto-agricola-john-deere-cod-ce16309-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: CQ29104. Filtro.",
        "price": 10.82,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290614/xhq8qc5vhtbcrfydihwf.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290615/de9drwcd8wgas6luqzwx.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947669021-filtro-repuesto-agricola-john-deere-cod-cq29104-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: DE17263. Filtro.",
        "price": 153.0,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 6,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290616/dpyrw63owfqi2f3peyoo.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290617/kbqomnt6rjhuqeiykire.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724153858-filtro-repuesto-agricola-john-deere-cod-de17263-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: DQ05097. Filtro hidr ulico.",
        "price": 29.35,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290618/gatttsfty1cvypmsgvks.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290620/jbmckeb3icgtnyjsd2rv.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947669027-filtro-hidraulico-repuesto-agricola-john-deere-cod-dq05097-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: DQ12161. Filtro de hidr ulico.",
        "price": 56.37,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290622/dgzbbgpkhierz2cnbzrf.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290624/mnymfm5wxmqavenkomsz.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947669033-filtro-de-hidraulico-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: DQ21803. FILTRO.",
        "price": 63.3,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 23,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290625/fpj2d9enorb5qbroqeix.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724153882-filtro-repuesto-agricola-john-deere-cod-dq21803-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: DQ24942. Filtro de seguridad.",
        "price": 30.55,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290626/hd28j8y9qd6gpeckw2fx.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290627/idvv1gyqei7xyefzfpd5.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947669051-filtro-de-seguridad-repuesto-agricola-john-deere-cod-dq24942-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: DQ43482. Filtro Aire.",
        "price": 239.45,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290628/mlhyoeb2yik7x6tbupx3.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290629/bjotgbt1isba8c9f1uuc.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724254516-filtro-aire-repuesto-agricola-john-deere-cod-dq43482-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: DQ43483. Filtro de seguridad.",
        "price": 52.38,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290630/wpdh1knqgssmhe9jpwt0.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290632/bnciotommcavzn6xofem.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724153898-filtro-de-seguridad-repuesto-agricola-john-deere-cod-dq43483-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: DQ46907. Filtro Aire.",
        "price": 59.42,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290633/dpns11ai0xbffrozdvg4.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290634/ggw9fhgf0bn4gpbnupvd.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724153906-filtro-aire-repuesto-agricola-john-deere-cod-dq46907-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: DQ46908. Filtro Seguridad.",
        "price": 51.91,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 3,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290635/vhoh7gjb7m18xuqg55sm.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290636/vwarutaelsx1mh8oxsuy.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947669081-filtro-seguridad-repuesto-agricola-john-deere-cod-dq46908-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: DQ59138. Filtro de Aire Primario (SJ17532).",
        "price": 43.1,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 3,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290637/ckvngwftalnewycqejok.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290638/oeijqundammje5v7ere8.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290639/htty0cdsqxh3yt8mpytb.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724153924-filtro-de-aire-primario-sj17532-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: H220870. Filtro de aire.",
        "price": 122.03,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290640/cbqict0r2ek5avxtyi3f.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290641/ivafkanaajoug5ibt48l.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724254548-filtro-de-aire-repuesto-agricola-john-deere-cod-h220870-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: L29251. Tapa filtro.",
        "price": 76.99,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290643/ggw9cefvbasswdmn6yhf.jpg"
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
        "desc": "Repuesto para maquinaria agrícola. Código: PE70114566. Filtro de hidr ulico.",
        "price": 42.85,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 8,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290644/aatcttwxwb652dsafyvh.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290645/j7mqdo6hf0rtlpnrulhd.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724153938-filtro-de-hidraulico-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: PE931260. Filtro de combustible.",
        "price": 26.09,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290647/kapyxor1no8rtmivk9n8.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724153944-filtro-de-combustible-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE205726. Filtro aceite hidr ulico TRANSMISION.",
        "price": 168.66,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290649/doqbve4atqdo6hiuttgt.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290650/pg9yzqogwkszs8n00fln.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290652/lenorkun6pv2de8mluut.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724153946-filtro-aceite-hidraulico-transmision-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE24619. Filtro aire cabina.",
        "price": 85.92,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290653/sv3vqlyqrrbrmifcfr5r.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290655/dpwqzcllpyvdko1pdelp.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947669097-filtro-aire-cabina-repuesto-agricola-john-deere-cod-re24619-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE34958. Filtro de hidr ulico.",
        "price": 98.55,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 4,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290656/dzsenwquh3lqcbvpsuae.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947669103-filtro-de-hidraulico-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE34963. Cartucho de filtro.",
        "price": 74.29,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290658/dnfbf3c1v4xor3515com.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947669105-cartucho-de-filtro-repuesto-agricola-john-deere-cod-re34963-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE34967. Filtro de aire secundario.",
        "price": 124.15,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290659/grshhoijaydoupva0hap.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724153960-filtro-de-aire-secundario-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE45828. Filtro aire seguridad.",
        "price": 69.1,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290660/nxmv12u4crzkfgrerfke.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724254586-filtro-aire-seguridad-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE45864. Filtro de hidraulico.",
        "price": 123.23,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290662/ximbawlrww4oq6wtetbm.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290663/hs9ntvydmeerocv35gqe.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290665/e0ncjovowjs9faum5mcx.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947669119-filtro-de-hidraulico-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE46310. Filtro Aire primario.",
        "price": 200.13,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290666/vulgvy29l36i0vvzyzr9.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724254596-filtro-aire-primario-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE46311. Filtro Aire seguridad.",
        "price": 61.76,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 3,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290667/heqouxvu3iylnv5kepjr.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724153966-filtro-aire-seguridad-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE47313. Kit filtro de transmisi n.",
        "price": 163.02,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 3,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290669/asfxw4wbffssipb41apr.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724153972-kit-filtro-de-transmision-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE48882. Filtro aire cabina.",
        "price": 46.09,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290671/aanriyklkvkkv6owuhw5.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290672/jvxz7l57pg8uq6qz3w8a.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947669135-filtro-aire-cabina-repuesto-agricola-john-deere-cod-re48882-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE504836. Filtro aceite (VPD5181).",
        "price": 44.1,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290673/y4e8nawarl9v8o1mystz.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290675/ircuara0us1dizutufqt.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290676/lbcm98wsgdwj0ayjorvo.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290678/gvslskaec7joakojo6rt.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947669139-filtro-aceite-vpd5181-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE507284. Filtro Combustible Primario.",
        "price": 134.98,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290680/rw6uo62p0izw4tuipmqj.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290682/f8wkol8ci5iu4c3oesuk.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290684/nxyv7x9ir02iqomeuidj.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290685/e5dkta3dbsdktogqalii.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290686/cunng6rhj2gpbnpq826d.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290688/tlnd15aje8g18occvwqc.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724153988-filtro-combustible-primario-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE508633. Filtro auxiliar combs.",
        "price": 66.68,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 4,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290689/ynramamutepp1kcdlo5v.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290690/ennxvtvn5lwxarm4vzoo.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947669147-filtro-auxiliar-combustible-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE509036. Filtro de Combustible.",
        "price": 54.38,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 3,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290691/qdmyf45pl0laomkz6pp6.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290692/uwqwiyjf7klejmlutiti.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947669153-filtro-de-combustible-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE509672. Filtro de aceite.",
        "price": 67.11,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 3,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290695/m7u6lffge2mdyjhzsz0j.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290697/wnu047rjigx2ca6dk70q.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290718/rzwpay3tz3vzuzysv1aw.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290721/ms8cczhmj9ovznq79ial.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947669157-filtro-de-aceite-repuesto-agricola-john-deere-cod-re509672-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE51650. VASO DECANTADOR FILTRO.",
        "price": 168.71,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290723/l9cyloxv6gv23qovkx9l.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290724/wx2p278ufqyoxsrpcc4n.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947669163-vaso-decantador-filtro-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE519608. Filtro de Combustible.",
        "price": 130.07,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290725/mag8mmwxatjyq4esp9xk.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724254620-filtro-de-combustible-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE519626. Filtro de aceite.",
        "price": 25.3,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 20,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290727/ujuvs2apbynhvhmysedm.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290728/sw0rlmkkokuuxzmld2iv.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290729/abij3oypomecbfur3u08.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724254622-filtro-de-aceite-repuesto-agricola-john-deere-cod-re519626-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE522372. Filtro combustible.",
        "price": 167.83,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 9,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290731/tvr9ldubh6k4g7m55ehm.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290733/egp39wxvw3fwmdm2u2je.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290734/aye1e4tgrptisp2esxy5.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290736/rfdsldl2wj0vejxqa2ds.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947669171-filtro-combustible-repuesto-agricola-john-deere-cod-re522372-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE522688. Filtro combustible.",
        "price": 74.97,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 16,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290738/zgzfup6ntdd2edffv8yw.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290740/mqt4tpt4oowkyx6lvuoo.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290742/o6dlu977vajwz9dhdajx.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290743/i8hinxurcucool6jauvm.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947669175-filtro-combustible-repuesto-agricola-john-deere-cod-re522688-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE530107. Filtro de aceite.",
        "price": 117.75,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 9,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290744/oxbgvcbewnncymiyr2cv.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290746/pycisixvegizpcbmqzhr.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724154022-filtro-de-aceite-repuesto-agricola-john-deere-cod-re530107-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE531703. Filtro de combustible.",
        "price": 145.49,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290747/af4xkbw7rx7lpylujwrf.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290749/hrsomiutisdwtp7mzszy.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290750/xpqkhgkpevlzv7pk21ib.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290752/oxnlyzdgnfz7dc7v5axa.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290754/y53o3jnlipdbufvfsese.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947669185-filtro-de-combustible-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE541420. Filtro de aceite.",
        "price": 30.6,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 9,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290757/lxlvg7udwzbkcm6e72rv.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290759/rdtcgingxv1pwafnbcrv.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290761/vpkfvraq1vqmk3g37snq.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947669187-filtro-de-aceite-repuesto-agricola-john-deere-cod-re541420-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE57394. Filtro aceite motor = DZ118156.",
        "price": 36.86,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 6,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290762/sltsbvwvpci2lqn4jlgc.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290763/mksqv9mc5i1xuatsjmgh.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290766/esu8kiuey2vrn2v6ip4i.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724154028-filtro-aceite-motor-dz118156-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE58935. Filtro Aceite.",
        "price": 153.8,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290768/gueoqypxcsfh5uxadzec.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290770/zlwtzgonvqhkaqwcxgvp.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290771/akpyte52yx81woljztye.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724254640-filtro-aceite-repuesto-agricola-john-deere-cod-re58935-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE59754. FILTRO DE ACEITE REEMPL. DZ118286.",
        "price": 21.65,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290773/fgiruuk4apdgjhgf5xta.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290774/fheizhahra8qidm333ui.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290775/j4xkapmq0a4ar61wy4uh.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724154032-filtro-de-aceite-reempl-dz118286-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE60021. Filtro de Combustible.",
        "price": 48.88,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 10,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290776/k8z0i95tbbcbqrkalmla.png",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290778/ohzr5see2ut5k3ocvpka.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724254642-filtro-de-combustible-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE62418. Filtro de combustible.",
        "price": 47.42,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 4,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290780/pn2ahfuq10boxtelzu27.png",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290781/vytvlmiqqimgy4qyoxso.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290783/v58pt5nptz9ixort6riy.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724154048-filtro-de-combustible-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE62419. Filtro de combustible.",
        "price": 46.33,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290784/f4yeknclr501agulrhlb.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290786/oziwzst3cfyzlilmle1u.png",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290787/huk9ethgfscrt6zmhqew.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724254644-filtro-de-combustible-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE62424. Filtro auxiliar combustible.",
        "price": 54.38,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 7,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290788/tbdfwdj77ryd35die8zj.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290789/zd6jkhsknyua93rfvlwb.png",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290791/vfyyeinmt79ppwmrphjd.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724154064-filtro-auxiliar-combustible-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE67124. Cartucho de filtro.",
        "price": 105.45,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290792/hlmgtd6ksy7ptsrtd7e1.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724154068-cartucho-de-filtro-repuesto-agricola-john-deere-cod-re67124-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: T19044. Filtro aceite motor.",
        "price": 15.48,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 7,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290793/yhtmouha65gxd6feyyje.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290795/fxq1vovw1di8jnlzk3qx.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290796/vj3jx7sg3rrruhxfutyu.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724254660-filtro-aceite-motor-repuesto-agricola-john-deere-cod-t19044-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: Z62223. Filtro.",
        "price": 33.07,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 3,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290797/v4o4sybroojxxb2qjdgl.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947669223-filtro-repuesto-agricola-john-deere-cod-z62223-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AM101207. Filtro de aceite.",
        "price": 21.97,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290799/j6adxihxzklhmkmwuykr.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290800/rplwfmcmkoubwgo8mjwd.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290801/wn6sue1kjyd3shbd6xcz.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724154074-filtro-de-aceite-repuesto-agricola-john-deere-cod-am101207-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AM107314. Filtro de Combustible.",
        "price": 8.71,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 6,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290802/ufcfmhhjmimpuf4lculk.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724254664-filtro-de-combustible-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AM107423. Filtro aceite motor.",
        "price": 14.58,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 3,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290804/njxhnr3s0h3bu8xeecdo.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290805/fx1akjgdvzyrtemtbqd3.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290806/eewsdbjjnlscvh98fn4j.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947669237-filtro-aceite-motor-repuesto-agricola-john-deere-cod-am10742-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AM108243. Filtro de aire.",
        "price": 60.49,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290807/wpslvkl9cw6pnirjj8nq.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947669241-filtro-de-aire-repuesto-agricola-john-deere-cod-am108243-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AM116156. Filtro de aceite hidr ulico.",
        "price": 20.8,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 7,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290808/ttpef8aufoecqdk4gw9r.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290810/tdht6iewukh7ffxy0pgf.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290811/dzgx9jbmxnmaw3xf4ou3.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724154080-filtro-de-aceite-hidraulico-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AM116304. Filtro combustible.",
        "price": 10.38,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290812/xy0gseldzidcvbs2suaj.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290814/vq2hop2m30vchkilfrao.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290815/c3dqg2dmovaxsew4ftml.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290816/foat29zqenzrjolr6uo3.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290817/rnqcv6iopa8bgqtva9b2.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724154090-filtro-combustible-repuesto-agricola-john-deere-cod-am116304-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AM120916. Filtro.",
        "price": 81.99,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290818/mnd72gheofir0uktfu7s.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947669257-filtro-repuesto-agricola-john-deere-cod-am120916-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AM125424. Filtro aceite motor.",
        "price": 22.12,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 14,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290819/kho2kq0hfcanbnc1z9zd.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290821/knphmbnlrnpq0uga7omw.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290822/oztbkr4agiq6lyhwxbpb.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947669259-filtro-aceite-motor-repuesto-agricola-john-deere-cod-am12542-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AM130295. Filtro aire y seguridad.",
        "price": 189.14,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290824/u1gq3hjbab0h9zw4ushq.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290824/wlcmfwueu2ykks0iwr1k.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290825/cta6mpifavbeaytqsyzf.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724254688-filtro-aire-y-seguridad-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: CH15553. Filtro de combustible.",
        "price": 12.63,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290827/m8pyjjbfjqqkp0j2kfrx.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290829/bwhtgsmhv8jgxjzqnaio.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724254690-filtro-de-combustible-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: GY20574. Conjunto filtro aire.",
        "price": 25.12,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290830/y35vqkzbiiksh10nhvog.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290831/ljiawbn01pmfqpx7i8je.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947669269-conjunto-filtro-de-aire-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: GY20575. Cartucho de Filtro.",
        "price": 35.02,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 4,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290873/awmy9gny4rjoaki1czys.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947669275-cartucho-de-filtro-repuesto-agricola-john-deere-cod-gy20575-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: LG273638S. Filtro.",
        "price": 11.24,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290874/mdkff14ybqcwlr8od8tm.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290876/gwcfvmep6pil0zo0k78o.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724254694-filtro-repuesto-agricola-john-deere-cod-lg273638s-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: M111817. Filtro de combustible.",
        "price": 63.39,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290877/u4r8fuhcqilt7cmmqgdn.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290878/wvhufu8aine2trabuvxl.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290880/cthzsca0pfi7vph6zi4w.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947669279-filtro-de-combustible-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: M76076. Filtro.",
        "price": 7.08,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290881/hjergm4akaqqlpqwd7eu.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290883/mws86sy75dihbil26ms2.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724154140-filtro-repuesto-agricola-john-deere-cod-m76076-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: M806418. Filtro aceite motor.",
        "price": 23.29,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 7,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290886/bc8geupuwqehbejtamwk.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290888/znsqya3az4ey3m79yvm3.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290890/iwgdjroopxerveam4gz4.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290891/olrkf3qgqeszljgmv8hg.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724254752-filtro-aceite-motor-repuesto-agricola-john-deere-cod-m806418-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: M807152. Filtro combs.",
        "price": 32.48,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290893/eqrdj0lzrjpq1z5x8sib.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724154176-filtro-combustible-repuesto-agricola-john-deere-cod-m807152-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: M92360. Cartucho de filtro.",
        "price": 4.01,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724154182-cartucho-de-filtro-repuesto-agricola-john-deere-cod-m92360-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: M94734. Filtro de aire.",
        "price": 55.48,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290894/nehelqahzay4mcwqh3y6.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290895/qloy48lg5iuih7ybd73t.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724154194-filtro-de-aire-repuesto-agricola-john-deere-cod-m94734-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: M97211. Filtro de aire.",
        "price": 29.89,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290897/gxgoaayaqmzlsd9rjln3.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290898/ww4bsqmonxudtuweiglh.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724154200-filtro-de-aire-repuesto-agricola-john-deere-cod-m97211-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: MIU11286. Filtro.",
        "price": 28.25,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290899/wefoh76bmcq7wkox4kig.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290900/ojri1ly4y7eoq5b6cik5.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724154206-filtro-repuesto-agricola-john-deere-cod-miu11286-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: MIU11377. Cartucho de filtro.",
        "price": 50.32,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290901/vyewqq1gvz9g7hzhxphk.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290902/myf3i32itryglhrggjxv.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724154212-cartucho-de-filtro-repuesto-agricola-john-deere-cod-miu11377-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: MIU11513. Filtro de Aire.",
        "price": 5.97,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290903/e3cqfrr0yybw0wdhmjin.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290904/q1vulht20k53ijscqtbn.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290905/fwdbyqnylxgkfhre4qqt.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947669343-filtro-de-aire-repuesto-agricola-john-deere-cod-miu11513-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: MIU11515. Filtro de aire.",
        "price": 47.26,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 3,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290906/fb5rvznk397ykc27j3fr.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290907/advp32h6opkfiemwjcxd.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290908/jn1hilvkrz7q4ygoy2nr.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947669349-filtro-de-aire-repuesto-agricola-john-deere-cod-miu11515-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: MIU13963. Filtro de aire.",
        "price": 25.4,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290909/mg4ae82gf1ndev9wopgh.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290911/es9rhoqau9kenfqabpdw.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724254792-filtro-de-aire-repuesto-agricola-john-deere-cod-miu13963-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE68048. Filtro de aire.",
        "price": 34.26,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 3,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290914/lvfwghtpv6tegcgsormp.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947669357-filtro-de-aire-repuesto-agricola-john-deere-cod-re68048-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE68049. Filtro de aire de seguridad.",
        "price": 37.4,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 3,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290916/qc1fzy3tzcf1hpboi6qb.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724254800-filtro-de-aire-de-seguridad-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: JX0810D2. FILTRO ACEITE TAURUS.",
        "price": 46.91,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290918/aewgwa0nflfrmub7exfi.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947669365-filtro-aceite-taurus-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: J11051-CD. BASE DE FILTRO.",
        "price": 38.37,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947669369-base-de-filtro-repuesto-agricola-john-deere-cod-j11051-cd-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: J52906-CD. FILTRO.",
        "price": 2.4,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724254804-filtro-repuesto-agricola-john-deere-cod-j52906-cd-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AL118036. Filtro hidr ulico.",
        "price": 55.03,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290919/na4dtulj17l044wdxfs4.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290921/ahzbbxrmlltlfyvuqs3l.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724154256-filtro-hidraulico-repuesto-agricola-john-deere-cod-al118036-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AL177184. Filtro de aire.",
        "price": 60.51,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290922/w7jqubsiemmjylplwien.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290923/uazq4bcsmowgaoyu3hay.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724154264-filtro-de-aire-repuesto-agricola-john-deere-cod-al177184-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AL177185. Filtro de aire.",
        "price": 82.0,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290925/uieh3f02dnz8s1y69xyt.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724154276-filtro-de-aire-repuesto-agricola-john-deere-cod-al177185-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AR43634. Filtro de aceite.",
        "price": 14.53,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290926/nmnbk8wae5ascipupokh.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290927/kw365r0x5tfacg9dwl4k.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724154280-filtro-de-aceite-repuesto-agricola-john-deere-cod-ar43634-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: PE931140. Cartucho de filtro.",
        "price": 22.31,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290928/vubkomdcqb6skw86t3gc.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947669401-cartucho-de-filtro-repuesto-agricola-john-deere-cod-pe931140-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE533910. Filtro de combustibl.",
        "price": 195.75,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290930/sz08dtqk9j3vbqojmnlp.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290932/nni0edaqcn1yh6epu4dx.png",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290933/xnsog5sxfs2jxni5znm5.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290935/etdttr4minvxymlxx4q0.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724254820-filtro-de-combustibl-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AT21469.RC. BASE FILTROS.",
        "price": 49.44,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724146518-base-filtros-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: J52956-RV. FILTRO.",
        "price": 6.35,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724254828-filtro-repuesto-agricola-john-deere-cod-j52956-rv-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: J54432-RC. VALVULA FILTRO AIRE.",
        "price": 7.5,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947669415-valvula-filtro-aire-repuesto-agricola-john-deere-cod-j54432--_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: R34985-RC. BOQUILLA BOMBA AGUA.",
        "price": 6.67,
        "category": "Repuestos",
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
        "id": "coa_2507521",
        "name": "Pulsar Spander (Coadyuvante estabilizante)",
        "code": "2507521",
        "desc": "Coadyuvante/estabilizante Spraytec. Dosis recomendada: 160-250cc C/100 Lts.",
        "price": 25.47,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Spraytec",
        "model": "Original",
        "stock": 10,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785268646/cns9hl95xbghha5wtaay.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724254842-pulsar-spander-coadyuvante-estabilizante-_JM",
        "specs": {
            "Código de repuesto": "2507521",
            "Marca": "Spraytec",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "coa_2508021",
        "name": "Pulsar Drone Up (Coadyuvante antideriva)",
        "code": "2508021",
        "desc": "Coadyuvante antideriva Spraytec para drones. Dosis recomendada: 200 a 400 ml c/100 Lts.",
        "price": 31.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Spraytec",
        "model": "Original",
        "stock": 10,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947669433-pulsar-drone-up-coadyuvante-antideriva-_JM",
        "specs": {
            "Código de repuesto": "2508021",
            "Marca": "Spraytec",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "coa_2507523",
        "name": "Nature Max (Corrector secuestrante)",
        "code": "2507523",
        "desc": "Corrector secuestrante Spraytec. Dosis recomendada: Variable según la calidad de agua y ph.",
        "price": 33.27,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Spraytec",
        "model": "Original",
        "stock": 10,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785268647/o4zrtlprh4gcg57rmnll.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724254850-nature-max-corrector-secuestrante-_JM",
        "specs": {
            "Código de repuesto": "2507523",
            "Marca": "Spraytec",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "coa_2507496",
        "name": "Cover Plus (Antideriva)",
        "code": "2507496",
        "desc": "Coadyuvante antideriva Spraytec. Dosis recomendada: 200 cc C/100 Lts.",
        "price": 32.48,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Spraytec",
        "model": "Original",
        "stock": 10,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785268649/fstwbabmzb4v5voi8eyi.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "2507496",
            "Marca": "Spraytec",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "coa_2507955",
        "name": "Citius (Antievaporante)",
        "code": "2507955",
        "desc": "Coadyuvante antievaporante Spraytec. Dosis recomendada: 100 a 250 cc C/100 Lts.",
        "price": 13.31,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Spraytec",
        "model": "Original",
        "stock": 10,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724254858-citius-antievaporante-_JM",
        "specs": {
            "Código de repuesto": "2507955",
            "Marca": "Spraytec",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "coa_2507881",
        "name": "Ground Amin",
        "code": "2507881",
        "desc": "Fertilizante foliar Spraytec. Dosis recomendada: 400 cc/ha.",
        "price": 32.08,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Spraytec",
        "model": "Original",
        "stock": 10,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785268650/nd5mpph0vlhpgcssf0gd.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947669437-ground-amin-repuesto-agricola-spraytec-cod-2507881-_JM",
        "specs": {
            "Código de repuesto": "2507881",
            "Marca": "Spraytec",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "coa_2507882",
        "name": "Ground Max Boro",
        "code": "2507882",
        "desc": "Fertilizante foliar Spraytec con Boro. Dosis recomendada: 400cc/ha.",
        "price": 32.42,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Spraytec",
        "model": "Original",
        "stock": 10,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785268652/nytpisvu2trptneqpwmm.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724154320-ground-max-boro-repuesto-agricola-spraytec-cod-2507882-_JM",
        "specs": {
            "Código de repuesto": "2507882",
            "Marca": "Spraytec",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "coa_2507883",
        "name": "Ground Max Zinc",
        "code": "2507883",
        "desc": "Fertilizante foliar Spraytec con Zinc. Dosis recomendada: 400 cc/ha.",
        "price": 32.98,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Spraytec",
        "model": "Original",
        "stock": 10,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785268655/fya1aiepan6uin6nl8m4.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947669443-ground-max-zinc-repuesto-agricola-spraytec-cod-2507883-_JM",
        "specs": {
            "Código de repuesto": "2507883",
            "Marca": "Spraytec",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "coa_2507884",
        "name": "Ground Max Fosmax Amin",
        "code": "2507884",
        "desc": "Fertilizante foliar Spraytec Fosmax Amin. Dosis recomendada: 400 cc/ha.",
        "price": 32.98,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Spraytec",
        "model": "Original",
        "stock": 10,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785268656/dbvxp76iunxe38jjs5mh.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724154326-ground-max-fosmax-amin-_JM",
        "specs": {
            "Código de repuesto": "2507884",
            "Marca": "Spraytec",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "coa_2507885",
        "name": "Ground Max Fosmax Complex",
        "code": "2507885",
        "desc": "Fertilizante foliar Spraytec Fosmax Complex. Dosis recomendada: 400 cc/ha.",
        "price": 33.32,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Spraytec",
        "model": "Original",
        "stock": 10,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785268657/oi1odim10dxtwk3wlcwv.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947669447-ground-max-fosmax-complex-_JM",
        "specs": {
            "Código de repuesto": "2507885",
            "Marca": "Spraytec",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "coa_2507519",
        "name": "Clean Full (Limpiador)",
        "code": "2507519",
        "desc": "Limpiador de pulverizadoras Spraytec. Dosis recomendada: 250 cc C/100 Lts.",
        "price": 20.23,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Spraytec",
        "model": "Original",
        "stock": 10,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785268659/teovnzw6sumt5bhjjv0g.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947669457-clean-full-limpiador-_JM",
        "specs": {
            "Código de repuesto": "2507519",
            "Marca": "Spraytec",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "coa_2507809",
        "name": "Deep Truck (Limpiador)",
        "code": "2507809",
        "desc": "Limpiador profundo de maquinaria Spraytec. Dosis recomendada: 250 cc C/100 Lts.",
        "price": 26.62,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Spraytec",
        "model": "Original",
        "stock": 10,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785268660/oqi2pqb17fxwycik6ewg.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947669461-deep-truck-limpiador-_JM",
        "specs": {
            "Código de repuesto": "2507809",
            "Marca": "Spraytec",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "coa_2507733",
        "name": "Degras Remover",
        "code": "2507733",
        "desc": "Limpiador desengrasante Spraytec. Dosis recomendada: 50 cc C/100 Lts.",
        "price": 26.62,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Spraytec",
        "model": "Original",
        "stock": 10,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785268662/bpttapfd5i7bwkh3w05f.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724254886-degras-remover-repuesto-agricola-spraytec-cod-2507733-_JM",
        "specs": {
            "Código de repuesto": "2507733",
            "Marca": "Spraytec",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "coa_2507525",
        "name": "Kortok A (Antiespumante)",
        "code": "2507525",
        "desc": "Antiespumante concentrado Spraytec. Dosis recomendada: 50 cc C/1000 Lts.",
        "price": 19.96,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Spraytec",
        "model": "Original",
        "stock": 10,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785268664/rryutk2fq0nfgcg27t8u.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724154342-kortok-a-antiespumante-_JM",
        "specs": {
            "Código de repuesto": "2507525",
            "Marca": "Spraytec",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "coa_2507971",
        "name": "Bioinsecticida Acote Pack 8u x 2 Lts.",
        "code": "2507971",
        "desc": "Bioinsecticida biológico Acote. Dosis recomendada: 500 cc/ha.",
        "price": 29.27,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Spraytec",
        "model": "Original",
        "stock": 10,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947669483-bioinsecticida-acote-pack-8u-x-2-lts-_JM",
        "specs": {
            "Código de repuesto": "2507971",
            "Marca": "Spraytec",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "coa_2507965",
        "name": "Estimulante Biológico Nitrair 8u x 2 Lts.",
        "code": "2507965",
        "desc": "Estimulante biológico Nitrair. Dosis recomendada: 500 cc/ha.",
        "price": 31.52,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Spraytec",
        "model": "Original",
        "stock": 10,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "2507965",
            "Marca": "Spraytec",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "coa_2507970",
        "name": "Estimulante Biológico Sachaderma 8u x 2 Lts.",
        "code": "2507970",
        "desc": "Estimulante biológico Sachaderma. Dosis recomendada: 1 Lt/ha.",
        "price": 31.44,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Spraytec",
        "model": "Original",
        "stock": 10,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "2507970",
            "Marca": "Spraytec",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "coa_2507990",
        "name": "Inoculante Mix Control Soja Pack",
        "code": "2507990",
        "desc": "Pack de inoculante Mix Control para Soja. Rendimiento: 80 Dosis.",
        "price": 266.38,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Spraytec",
        "model": "Original",
        "stock": 10,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724254910-inoculante-mix-control-soja-pack-_JM",
        "specs": {
            "Código de repuesto": "2507990",
            "Marca": "Spraytec",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "coa_2508005",
        "name": "Inoculante Soja Base Más Insecticida 5u x 2 Lts",
        "code": "2508005",
        "desc": "Pack de inoculante para Soja Base más insecticida. Rendimiento: 80 Dosis.",
        "price": 272.25,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Spraytec",
        "model": "Original",
        "stock": 10,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724254914-inoculante-soja-base-mas-insecticida-5u-x-2-lts-_JM",
        "specs": {
            "Código de repuesto": "2508005",
            "Marca": "Spraytec",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "coa_2508023",
        "name": "Inoculante Soja Base Más Sachaderma 6u x 2 Lts",
        "code": "2508023",
        "desc": "Pack de inoculante para Soja Base más Sachaderma. Rendimiento: 80 Dosis.",
        "price": 266.38,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Spraytec",
        "model": "Original",
        "stock": 10,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724154356-inoculante-soja-base-mas-sachaderma-6u-x-2-lts-_JM",
        "specs": {
            "Código de repuesto": "2508023",
            "Marca": "Spraytec",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "coa_2508009",
        "name": "Inoculante Soja Base Pack 4u x 2 Lts",
        "code": "2508009",
        "desc": "Pack de inoculante para Soja Base. Rendimiento: 80 Dosis.",
        "price": 242.07,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Spraytec",
        "model": "Original",
        "stock": 10,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947669497-inoculante-soja-base-pack-4u-x-2-lts-_JM",
        "specs": {
            "Código de repuesto": "2508009",
            "Marca": "Spraytec",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_minicargadora_tmv690",
        "name": "MINICARGADORA TMV690",
        "code": "VIAL-MINICARGADORA-TMV690",
        "desc": "Equipo de maquinaria vial. Modelo: MINICARGADORA TMV690.",
        "price": 35695.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "TMV",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271450/gmqfrhqbleg75iisyrnw.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271452/wo8hihkfqmdkg4hpkuyw.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271453/ewzdltxhsjanthbyrzdd.webp"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "VIAL-MINICARGADORA-TMV690",
            "Marca": "TMV",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_minicargadora_tmv1100",
        "name": "MINICARGADORA TMV1100",
        "code": "VIAL-MINICARGADORA-TMV1100",
        "desc": "Equipo de maquinaria vial. Modelo: MINICARGADORA TMV1100.",
        "price": 52635.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "TMV",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271446/rowi3bwbmcdxn9pmp77y.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271448/al6xhvn24ssydv0699om.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271449/uhzy8p4yssfhr2mkz9lw.webp"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "VIAL-MINICARGADORA-TMV1100",
            "Marca": "TMV",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_minicargadora_sin_cabina_wt400",
        "name": "MINICARGADORA SIN CABINA WT400",
        "code": "VIAL-MINICARGADORA-SIN-CABINA-WT400",
        "desc": "Equipo de maquinaria vial. Modelo: MINICARGADORA SIN CABINA WT400.",
        "price": 15609.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "WT",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "VIAL-MINICARGADORA-SIN-CABINA-WT400",
            "Marca": "WT",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_miniexcavadora_xn06",
        "name": "MINIEXCAVADORA XN06",
        "code": "VIAL-MINIEXCAVADORA-XN06",
        "desc": "Equipo de maquinaria vial. Modelo: MINIEXCAVADORA XN06.",
        "price": 6534.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "Rhinoceros",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785263206/v4nvcyqrksohphrstbg6.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785263207/fdnlqploag2ncbikxbcw.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3723994786-miniexcavadora-xn06-_JM",
        "specs": {
            "Código de repuesto": "VIAL-MINIEXCAVADORA-XN06",
            "Marca": "Rhinoceros",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_miniexcavadora_xn08",
        "name": "MINIEXCAVADORA XN08",
        "code": "VIAL-MINIEXCAVADORA-XN08",
        "desc": "Equipo de maquinaria vial. Modelo: MINIEXCAVADORA XN08.",
        "price": 7865.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "Rhinoceros",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785263211/flsdgtijza9cysnzpbrx.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785263212/rmcgiwkysnxdefsz7e92.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947433023-miniexcavadora-xn08-_JM",
        "specs": {
            "Código de repuesto": "VIAL-MINIEXCAVADORA-XN08",
            "Marca": "Rhinoceros",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_miniexcavadora_xn10",
        "name": "MINIEXCAVADORA XN10",
        "code": "VIAL-MINIEXCAVADORA-XN10",
        "desc": "Equipo de maquinaria vial. Modelo: MINIEXCAVADORA XN10.",
        "price": 9559.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "Rhinoceros",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785263209/urpbsmrplvltjhbrcvy6.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785263210/jykjm35c0zzetzoniosn.webp"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "VIAL-MINIEXCAVADORA-XN10",
            "Marca": "Rhinoceros",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_miniexcavadora_xn12",
        "name": "MINIEXCAVADORA XN12",
        "code": "VIAL-MINIEXCAVADORA-XN12",
        "desc": "Equipo de maquinaria vial. Modelo: MINIEXCAVADORA XN12.",
        "price": 14641.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "Rhinoceros",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785263213/fcvfxt9ncmkvnzmi7p1s.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785263214/dthcnqt07smn2iycb2ts.webp"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "VIAL-MINIEXCAVADORA-XN12",
            "Marca": "Rhinoceros",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_miniexcavadora_xn16",
        "name": "MINIEXCAVADORA XN16",
        "code": "VIAL-MINIEXCAVADORA-XN16",
        "desc": "Equipo de maquinaria vial. Modelo: MINIEXCAVADORA XN16.",
        "price": 24079.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "Rhinoceros",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785263215/umu8huejik8tjpdjlwty.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785263216/y4el2yz1bvudghzpwqvh.webp"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "VIAL-MINIEXCAVADORA-XN16",
            "Marca": "Rhinoceros",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_miniexcavadora_xn22",
        "name": "MINIEXCAVADORA XN22",
        "code": "VIAL-MINIEXCAVADORA-XN22",
        "desc": "Equipo de maquinaria vial. Modelo: MINIEXCAVADORA XN22.",
        "price": 31339.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "Rhinoceros",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785263218/lvmow5x1v7ijumk5irnh.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785263219/k27lz7omw8wvsjhij52z.webp"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "VIAL-MINIEXCAVADORA-XN22",
            "Marca": "Rhinoceros",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_miniexcavadora_xn28",
        "name": "MINIEXCAVADORA XN28",
        "code": "VIAL-MINIEXCAVADORA-XN28",
        "desc": "Equipo de maquinaria vial. Modelo: MINIEXCAVADORA XN28.",
        "price": 42955.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "Rhinoceros",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785263220/zhi5jejvjrf7jvzs1vpz.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785263221/rwrcqqaacedcvv6fulth.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947433067-miniexcavadora-xn28-_JM",
        "specs": {
            "Código de repuesto": "VIAL-MINIEXCAVADORA-XN28",
            "Marca": "Rhinoceros",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_miniexc_xn28_c_cabina",
        "name": "MINIEXC. XN28 C/CABINA",
        "code": "VIAL-MINIEXC-XN28-C-CABINA",
        "desc": "Equipo de maquinaria vial. Modelo: MINIEXC. XN28 C/CABINA.",
        "price": 44649.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "Rhinoceros",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785263222/rsqfvg3rbnnoljsmhafn.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785263223/xa989nrzg2ybofxmzqoo.webp"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "VIAL-MINIEXC-XN28-C-CABINA",
            "Marca": "Rhinoceros",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_miniexc_xn28_c_cabina_y_a_a",
        "name": "MINIEXC. XN28 C/CABINA Y A/A",
        "code": "VIAL-MINIEXC-XN28-C-CABINA-Y-A-A",
        "desc": "Equipo de maquinaria vial. Modelo: MINIEXC. XN28 C/CABINA Y A/A.",
        "price": 45859.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "Rhinoceros",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785263224/q0csmvln5zpxj4t6vfya.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785263226/ppgoaapzbs0482ivek1c.webp"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "VIAL-MINIEXC-XN28-C-CABINA-Y-A-A",
            "Marca": "Rhinoceros",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_miniexcavadora_xn40",
        "name": "MINIEXCAVADORA XN40",
        "code": "VIAL-MINIEXCAVADORA-XN40",
        "desc": "Equipo de maquinaria vial. Modelo: MINIEXCAVADORA XN40.",
        "price": 58685.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "Rhinoceros",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785263227/erlq1y0lluonbjux0r7q.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785263228/uif4wsloocuintthenk2.webp"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "VIAL-MINIEXCAVADORA-XN40",
            "Marca": "Rhinoceros",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_miniexcavadora_xn60",
        "name": "MINIEXCAVADORA XN60",
        "code": "VIAL-MINIEXCAVADORA-XN60",
        "desc": "Equipo de maquinaria vial. Modelo: MINIEXCAVADORA XN60.",
        "price": 66429.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "Rhinoceros",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785263229/v6uulkogs60xogdnvi5m.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785263230/wlorg1vmtvpwzm1pso9j.webp"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "VIAL-MINIEXCAVADORA-XN60",
            "Marca": "Rhinoceros",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_tractoelevador_ctx_825_a_a",
        "name": "TRACTOELEVADOR CTX-825 A/A",
        "code": "VIAL-TRACTOELEVADOR-CTX-825-A-A",
        "desc": "Equipo de maquinaria vial. Modelo: TRACTOELEVADOR CTX-825 A/A.",
        "price": 42229.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "CTX",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271454/qbscs4jefaxnhrgrlzsh.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271455/jkkpptlngkh1gbt3gkc9.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271456/oohxlevv0596smxfrvn5.webp"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "VIAL-TRACTOELEVADOR-CTX-825-A-A",
            "Marca": "CTX",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_pala_ctx912",
        "name": "PALA CTX912",
        "code": "VIAL-PALA-CTX912",
        "desc": "Equipo de maquinaria vial. Modelo: PALA CTX912.",
        "price": 24079.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "CTX",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271458/wjce7qr9jc7aymclsz7b.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271460/uom0qausvtpwfurl0her.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271461/mpmurvcmoivnngnrx6kz.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947433099-pala-ctx912-_JM",
        "specs": {
            "Código de repuesto": "VIAL-PALA-CTX912",
            "Marca": "CTX",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_pala_ctx918",
        "name": "PALA CTX918",
        "code": "VIAL-PALA-CTX918",
        "desc": "Equipo de maquinaria vial. Modelo: PALA CTX918.",
        "price": 27709.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "CTX",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271462/zsymbjugd0xdrmoropfy.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271463/jsyboxatzhjdn0so79h6.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271464/cwjedcpjgndnv5upiexy.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724146728-pala-ctx918-_JM",
        "specs": {
            "Código de repuesto": "VIAL-PALA-CTX918",
            "Marca": "CTX",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_pala_bronco_cg926a",
        "name": "PALA BRONCO CG926A",
        "code": "VIAL-PALA-BRONCO-CG926A",
        "desc": "Equipo de maquinaria vial. Modelo: PALA BRONCO CG926A.",
        "price": 31339.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "Bronco",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785268665/k72nbi4ag61ehenzf1ep.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785268666/iihkxr31kwmunwld1gnv.webp"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "VIAL-PALA-BRONCO-CG926A",
            "Marca": "Bronco",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_pala_bronco_cg930",
        "name": "PALA BRONCO CG930",
        "code": "VIAL-PALA-BRONCO-CG930",
        "desc": "Equipo de maquinaria vial. Modelo: PALA BRONCO CG930.",
        "price": 37389.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "Bronco",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785268667/bismgvghvmr27ptmkvy9.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785268668/oxm4qljnu0nwbnyjr8xq.webp"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "VIAL-PALA-BRONCO-CG930",
            "Marca": "Bronco",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_pala_ctx926a",
        "name": "PALA CTX926A",
        "code": "VIAL-PALA-CTX926A",
        "desc": "Equipo de maquinaria vial. Modelo: PALA CTX926A.",
        "price": 36179.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "CTX",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271465/rkvcrptl1hqezwsbnuox.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947433127-pala-ctx926a-_JM",
        "specs": {
            "Código de repuesto": "VIAL-PALA-CTX926A",
            "Marca": "CTX",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_pala_ctx926",
        "name": "PALA CTX926",
        "code": "VIAL-PALA-CTX926",
        "desc": "Equipo de maquinaria vial. Modelo: PALA CTX926.",
        "price": 41019.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "CTX",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271467/lj4eqx4wlxi2woof2kvb.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271468/pfut5okx9uwylkxopxv3.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724146760-pala-ctx926-_JM",
        "specs": {
            "Código de repuesto": "VIAL-PALA-CTX926",
            "Marca": "CTX",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_pala_ctx928",
        "name": "PALA CTX928",
        "code": "VIAL-PALA-CTX928",
        "desc": "Equipo de maquinaria vial. Modelo: PALA CTX928.",
        "price": 44649.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "CTX",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271470/ji3s1iqjcwivkbsrkauk.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271471/jq8mggsduqmxnmiuk1lk.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271473/tnx5s46gw3xm7jn33db6.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271474/xb82eamo2qn959k3o8mn.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947433135-pala-ctx928-_JM",
        "specs": {
            "Código de repuesto": "VIAL-PALA-CTX928",
            "Marca": "CTX",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_pala_ctx930_yunnei",
        "name": "PALA CTX930-YUNNEI",
        "code": "VIAL-PALA-CTX930-YUNNEI",
        "desc": "Equipo de maquinaria vial. Modelo: PALA CTX930-YUNNEI.",
        "price": 48279.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "CTX",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271475/yw5e12mxfnfkefeyawmd.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271477/lkgrohal0g3ntiylqj9e.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3723994886-pala-ctx930-yunnei-_JM",
        "specs": {
            "Código de repuesto": "VIAL-PALA-CTX930-YUNNEI",
            "Marca": "CTX",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_pala_ctx930_cummins",
        "name": "PALA CTX930-CUMMINS",
        "code": "VIAL-PALA-CTX930-CUMMINS",
        "desc": "Equipo de maquinaria vial. Modelo: PALA CTX930-CUMMINS.",
        "price": 55539.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "CTX",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271479/db4o59dhe3mwntsy9ct2.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271480/ba0p8a4fug8p5milrxto.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3723994902-pala-ctx930-cummins-_JM",
        "specs": {
            "Código de repuesto": "VIAL-PALA-CTX930-CUMMINS",
            "Marca": "CTX",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_pala_ctx936a",
        "name": "PALA CTX936A",
        "code": "VIAL-PALA-CTX936A",
        "desc": "Equipo de maquinaria vial. Modelo: PALA CTX936A.",
        "price": 59169.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "CTX",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271481/yhgvesgzintnvioadqfl.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271483/b0cotsspddw6b9bfwzta.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271484/calupvakp4ua1s8wzaqf.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271485/md5r0ntahvdmqwmvve9p.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271486/gjeu5aiujzxq28sncide.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3723994908-pala-ctx936a-_JM",
        "specs": {
            "Código de repuesto": "VIAL-PALA-CTX936A",
            "Marca": "CTX",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_pala_ctx936_c_3v",
        "name": "PALA CTX936 C/3V",
        "code": "VIAL-PALA-CTX936-C-3V",
        "desc": "Equipo de maquinaria vial. Modelo: PALA CTX936 C/3V.",
        "price": 88330.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "CTX",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271488/iawqgm5lkdo6gtz3xez3.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271489/eb2yzowliht3az35zb0w.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947433157-pala-ctx936-c3v-_JM",
        "specs": {
            "Código de repuesto": "VIAL-PALA-CTX936-C-3V",
            "Marca": "CTX",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_pala_ctx936_c_3v_acople",
        "name": "PALA CTX936 C/3V-ACOPLE",
        "code": "VIAL-PALA-CTX936-C-3V-ACOPLE",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: PALA CTX936 C/3V-ACOPLE.",
        "price": 91113.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "CTX",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947433165-pala-ctx936-c3v-acople-_JM",
        "specs": {
            "Código de repuesto": "VIAL-PALA-CTX936-C-3V-ACOPLE",
            "Marca": "CTX",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_pala_ctx956_weichai",
        "name": "PALA CTX956 WEICHAI",
        "code": "VIAL-PALA-CTX956-WEICHAI",
        "desc": "Equipo de maquinaria vial. Modelo: PALA CTX956 WEICHAI.",
        "price": 125719.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "CTX",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271490/fluvqk166sibnr3wdszs.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3723994924-pala-ctx956-weichai-_JM",
        "specs": {
            "Código de repuesto": "VIAL-PALA-CTX956-WEICHAI",
            "Marca": "CTX",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "vial_vial_pala_938h_c_3v",
        "name": "PALA 938H C/3V",
        "code": "VIAL-PALA-938H-C-3V",
        "desc": "Equipo de maquinaria vial. Modelo: PALA 938H C/3V.",
        "price": 100309.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "Vial",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724146800-pala-938h-c3v-_JM",
        "specs": {
            "Código de repuesto": "VIAL-PALA-938H-C-3V",
            "Marca": "Vial",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "vial_vial_pala_938h_c_3v_y_acople",
        "name": "PALA 938H C/3V Y ACOPLE",
        "code": "VIAL-PALA-938H-C-3V-Y-ACOPLE",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: PALA 938H C/3V Y ACOPLE.",
        "price": 103939.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Vial",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3723994934-pala-938h-c3v-y-acople-_JM",
        "specs": {
            "Código de repuesto": "VIAL-PALA-938H-C-3V-Y-ACOPLE",
            "Marca": "Vial",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "vial_vial_pala_958h",
        "name": "PALA 958H",
        "code": "VIAL-PALA-958H",
        "desc": "Equipo de maquinaria vial. Modelo: PALA 958H.",
        "price": 131890.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "Vial",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3723994950-pala-958h-_JM",
        "specs": {
            "Código de repuesto": "VIAL-PALA-958H",
            "Marca": "Vial",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "vial_vial_pala_yx657",
        "name": "PALA YX657",
        "code": "VIAL-PALA-YX657",
        "desc": "Equipo de maquinaria vial. Modelo: PALA YX657.",
        "price": 160930.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "Vial",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947433191-pala-yx657-_JM",
        "specs": {
            "Código de repuesto": "VIAL-PALA-YX657",
            "Marca": "Vial",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_retro_ctx30_25_yunnei",
        "name": "RETRO CTX30-25 YUNNEI",
        "code": "VIAL-RETRO-CTX30-25-YUNNEI",
        "desc": "Equipo de maquinaria vial. Modelo: RETRO CTX30-25 YUNNEI.",
        "price": 62799.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "CTX",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271491/kiarchrnjnattye7jjdc.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271492/swedczqfja2fkljhemhg.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271493/bvvci92hreevalhx5bwm.webp"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "VIAL-RETRO-CTX30-25-YUNNEI",
            "Marca": "CTX",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_retro_ctx30_25_cummins",
        "name": "RETRO CTX30-25 CUMMINS",
        "code": "VIAL-RETRO-CTX30-25-CUMMINS",
        "desc": "Equipo de maquinaria vial. Modelo: RETRO CTX30-25 CUMMINS.",
        "price": 71269.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "CTX",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3723994958-retro-ctx30-25-cummins-_JM",
        "specs": {
            "Código de repuesto": "VIAL-RETRO-CTX30-25-CUMMINS",
            "Marca": "CTX",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_retro_ctx388_weichai",
        "name": "RETRO CTX388 WEICHAI",
        "code": "VIAL-RETRO-CTX388-WEICHAI",
        "desc": "Equipo de maquinaria vial. Modelo: RETRO CTX388 WEICHAI.",
        "price": 78529.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "CTX",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271495/oqv9o59uzjd1fuaqikqf.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271496/nb30pdtaz4zvwcj2eviv.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271497/dit3z9hnqcx3kvesismq.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271498/aa4xkldykoruu7cfvkpi.webp"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "VIAL-RETRO-CTX388-WEICHAI",
            "Marca": "CTX",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_retro_ctx388_cummins",
        "name": "RETRO CTX388 CUMMINS",
        "code": "VIAL-RETRO-CTX388-CUMMINS",
        "desc": "Equipo de maquinaria vial. Modelo: RETRO CTX388 CUMMINS.",
        "price": 83369.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "CTX",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947433201-retro-ctx388-cummins-_JM",
        "specs": {
            "Código de repuesto": "VIAL-RETRO-CTX388-CUMMINS",
            "Marca": "CTX",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_excavadora_xn80",
        "name": "EXCAVADORA XN80",
        "code": "VIAL-EXCAVADORA-XN80",
        "desc": "Equipo de maquinaria vial. Modelo: EXCAVADORA XN80.",
        "price": 70059.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "Rhinoceros",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785263232/q54uret9pqcpnzcylzv6.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785263234/ycjoroneu4a4xq0chsmi.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785263235/yfxpuzejiqtuu8ylmsm5.webp"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "VIAL-EXCAVADORA-XN80",
            "Marca": "Rhinoceros",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "vial_vial_motoniveladora_py220",
        "name": "MOTONIVELADORA PY220",
        "code": "VIAL-MOTONIVELADORA-PY220",
        "desc": "Equipo de maquinaria vial. Modelo: MOTONIVELADORA PY220.",
        "price": 174845.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "Vial",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3723994962-motoniveladora-py220-_JM",
        "specs": {
            "Código de repuesto": "VIAL-MOTONIVELADORA-PY220",
            "Marca": "Vial",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "vial_vial_aplanadora_ltc210",
        "name": "APLANADORA LTC210",
        "code": "VIAL-APLANADORA-LTC210",
        "desc": "Equipo de maquinaria vial. Modelo: APLANADORA LTC210.",
        "price": 107690.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "Vial",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3723994966-aplanadora-ltc210-_JM",
        "specs": {
            "Código de repuesto": "VIAL-APLANADORA-LTC210",
            "Marca": "Vial",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "vial_vial_acople_rapido_926_928_930",
        "name": "ACOPLE RAPIDO 926/928/930",
        "code": "VIAL-ACOPLE-RAPIDO-926-928-930",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: ACOPLE RAPIDO 926/928/930.",
        "price": 1694.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Vial",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947433213-acople-rapido-926928930-_JM",
        "specs": {
            "Código de repuesto": "VIAL-ACOPLE-RAPIDO-926-928-930",
            "Marca": "Vial",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "vial_vial_apilador_electrico_tb20_40",
        "name": "APILADOR ELECTRICO TB20-40",
        "code": "VIAL-APILADOR-ELECTRICO-TB20-40",
        "desc": "Equipo de maquinaria vial. Modelo: APILADOR ELECTRICO TB20-40.",
        "price": 17303.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "Vial",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3723994970-apilador-electrico-tb20-40-_JM",
        "specs": {
            "Código de repuesto": "VIAL-APILADOR-ELECTRICO-TB20-40",
            "Marca": "Vial",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "vial_vial_autoelevador_1_8_tn_t_doble_3_mts",
        "name": "AUTOELEVADOR 1,8 TN T/DOBLE 3 MTS",
        "code": "VIAL-AUTOELEVADOR-1-8-TN-T-DOBLE-3-MTS",
        "desc": "Equipo de maquinaria vial. Modelo: AUTOELEVADOR 1,8 TN T/DOBLE 3 MTS.",
        "price": 18876.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "Vial",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "VIAL-AUTOELEVADOR-1-8-TN-T-DOBLE-3-MTS",
            "Marca": "Vial",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "vial_vial_autoelevador_1_8_tn_t_triple_4_5_mts",
        "name": "AUTOELEVADOR 1,8 TN T/TRIPLE 4,5 MTS",
        "code": "VIAL-AUTOELEVADOR-1-8-TN-T-TRIPLE-4-5-MTS",
        "desc": "Equipo de maquinaria vial. Modelo: AUTOELEVADOR 1,8 TN T/TRIPLE 4,5 MTS.",
        "price": 19239.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "Vial",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "VIAL-AUTOELEVADOR-1-8-TN-T-TRIPLE-4-5-MTS",
            "Marca": "Vial",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "vial_vial_autoelevador_2_5_tn_xincai",
        "name": "AUTOELEVADOR 2,5 tn. XINCAI",
        "code": "VIAL-AUTOELEVADOR-2-5-TN-XINCAI",
        "desc": "Equipo de maquinaria vial. Modelo: AUTOELEVADOR 2,5 tn. XINCAI.",
        "price": 19602.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "Vial",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3723994988-autoelevador-25-tn-xincai-_JM",
        "specs": {
            "Código de repuesto": "VIAL-AUTOELEVADOR-2-5-TN-XINCAI",
            "Marca": "Vial",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "vial_vial_autoelevador_3_tn_xinchai",
        "name": "AUTOELEVADOR 3 tn. XINCHAI",
        "code": "VIAL-AUTOELEVADOR-3-TN-XINCHAI",
        "desc": "Equipo de maquinaria vial. Modelo: AUTOELEVADOR 3 tn. XINCHAI.",
        "price": 20086.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "Vial",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724146850-autoelevador-3-tn-xinchai-_JM",
        "specs": {
            "Código de repuesto": "VIAL-AUTOELEVADOR-3-TN-XINCHAI",
            "Marca": "Vial",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "vial_vial_autoelevador_3_5_tn_xinchai",
        "name": "AUTOELEVADOR 3,5 tn. XINCHAI",
        "code": "VIAL-AUTOELEVADOR-3-5-TN-XINCHAI",
        "desc": "Equipo de maquinaria vial. Modelo: AUTOELEVADOR 3,5 tn. XINCHAI.",
        "price": 20691.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "Vial",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724146860-autoelevador-35-tn-xinchai-_JM",
        "specs": {
            "Código de repuesto": "VIAL-AUTOELEVADOR-3-5-TN-XINCHAI",
            "Marca": "Vial",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "vial_vial_autoelevador_3_5_tn_fd35",
        "name": "AUTOELEVADOR 3,5 tn. FD35",
        "code": "VIAL-AUTOELEVADOR-3-5-TN-FD35",
        "desc": "Equipo de maquinaria vial. Modelo: AUTOELEVADOR 3,5 tn. FD35.",
        "price": 21417.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "Vial",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "VIAL-AUTOELEVADOR-3-5-TN-FD35",
            "Marca": "Vial",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "vial_vial_autoelevador_2_5_tn_terr_desp",
        "name": "AUTOELEVADOR 2,5 tn. TERR.DESP.",
        "code": "VIAL-AUTOELEVADOR-2-5-TN-TERR-DESP",
        "desc": "Equipo de maquinaria vial. Modelo: AUTOELEVADOR 2,5 tn. TERR.DESP..",
        "price": 31339.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "Vial",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "VIAL-AUTOELEVADOR-2-5-TN-TERR-DESP",
            "Marca": "Vial",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "vial_vial_autoelevador_3_tn_terr_desp",
        "name": "AUTOELEVADOR 3 tn. TERR.DESP.",
        "code": "VIAL-AUTOELEVADOR-3-TN-TERR-DESP",
        "desc": "Equipo de maquinaria vial. Modelo: AUTOELEVADOR 3 tn. TERR.DESP..",
        "price": 33275.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "Vial",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "VIAL-AUTOELEVADOR-3-TN-TERR-DESP",
            "Marca": "Vial",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "vial_vial_autoelevador_3_5_tn_terr_desp",
        "name": "AUTOELEVADOR 3,5 tn. TERR.DESP.",
        "code": "VIAL-AUTOELEVADOR-3-5-TN-TERR-DESP",
        "desc": "Equipo de maquinaria vial. Modelo: AUTOELEVADOR 3,5 tn. TERR.DESP..",
        "price": 34485.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "Vial",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "VIAL-AUTOELEVADOR-3-5-TN-TERR-DESP",
            "Marca": "Vial",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "vial_vial_adicional_rodado_dual",
        "name": "ADICIONAL RODADO DUAL",
        "code": "VIAL-ADICIONAL-RODADO-DUAL",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: ADICIONAL RODADO DUAL.",
        "price": 665.5,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Vial",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947669661-adicional-rodado-dual-_JM",
        "specs": {
            "Código de repuesto": "VIAL-ADICIONAL-RODADO-DUAL",
            "Marca": "Vial",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "vial_vial_adicional_cabina_p_terr_desp",
        "name": "ADICIONAL CABINA P/TERR.DESP.",
        "code": "VIAL-ADICIONAL-CABINA-P-TERR-DESP",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: ADICIONAL CABINA P/TERR.DESP..",
        "price": 1936.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Vial",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947669669-adicional-cabina-pterrdesp-_JM",
        "specs": {
            "Código de repuesto": "VIAL-ADICIONAL-CABINA-P-TERR-DESP",
            "Marca": "Vial",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "vial_vial_adicional_torre_de_6_mts_comun",
        "name": "ADICIONAL TORRE DE 6 MTS comun",
        "code": "VIAL-ADICIONAL-TORRE-DE-6-MTS-COMUN",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: ADICIONAL TORRE DE 6 MTS comun.",
        "price": 3388.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Vial",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3723995026-adicional-torre-de-6-mts-comun-_JM",
        "specs": {
            "Código de repuesto": "VIAL-ADICIONAL-TORRE-DE-6-MTS-COMUN",
            "Marca": "Vial",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "vial_vial_adicional_torre_de_6_mts_td",
        "name": "ADICIONAL TORRE DE 6 MTS TD",
        "code": "VIAL-ADICIONAL-TORRE-DE-6-MTS-TD",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: ADICIONAL TORRE DE 6 MTS TD.",
        "price": 4235.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Vial",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3723995032-adicional-torre-de-6-mts-td-_JM",
        "specs": {
            "Código de repuesto": "VIAL-ADICIONAL-TORRE-DE-6-MTS-TD",
            "Marca": "Vial",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_garra_forestal_ctx926a_926_928_930",
        "name": "GARRA FORESTAL CTX926A/926/928/930",
        "code": "VIAL-GARRA-FORESTAL-CTX926A-926-928-930",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: GARRA FORESTAL CTX926A/926/928/930.",
        "price": 4719.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "CTX",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281680/f10wrdf9c7vkonk3nyl4.webp"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "VIAL-GARRA-FORESTAL-CTX926A-926-928-930",
            "Marca": "CTX",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_garra_forestal_ctx936",
        "name": "GARRA FORESTAL CTX936",
        "code": "VIAL-GARRA-FORESTAL-CTX936",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: GARRA FORESTAL CTX936.",
        "price": 7865.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "CTX",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281681/tovf3zp6sn4kugpzem73.webp"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "VIAL-GARRA-FORESTAL-CTX936",
            "Marca": "CTX",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_acole_rapido_ctx918",
        "name": "ACOLE RAPIDO CTX918",
        "code": "VIAL-ACOLE-RAPIDO-CTX918",
        "desc": "Equipo de maquinaria vial. Modelo: ACOLE RAPIDO CTX918.",
        "price": 1573.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "CTX",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3723995050-acole-rapido-ctx918-_JM",
        "specs": {
            "Código de repuesto": "VIAL-ACOLE-RAPIDO-CTX918",
            "Marca": "CTX",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_acople_rapido_ctx926a_926_928_930",
        "name": "ACOPLE RAPIDO CTX926A/926/928/930",
        "code": "VIAL-ACOPLE-RAPIDO-CTX926A-926-928-930",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: ACOPLE RAPIDO CTX926A/926/928/930.",
        "price": 1694.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "CTX",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724146902-acople-rapido-ctx926a926928930-_JM",
        "specs": {
            "Código de repuesto": "VIAL-ACOPLE-RAPIDO-CTX926A-926-928-930",
            "Marca": "CTX",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_acople_rapido_ctx936",
        "name": "ACOPLE RAPIDO CTX936",
        "code": "VIAL-ACOPLE-RAPIDO-CTX936",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: ACOPLE RAPIDO CTX936.",
        "price": 2783.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "CTX",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724146908-acople-rapido-ctx936-_JM",
        "specs": {
            "Código de repuesto": "VIAL-ACOPLE-RAPIDO-CTX936",
            "Marca": "CTX",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_u_as_paleteras_ctx912_ctx918",
        "name": "UÑAS PALETERAS CTX912/ CTX918",
        "code": "VIAL-U-AS-PALETERAS-CTX912-CTX918",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: UÑAS PALETERAS CTX912/ CTX918.",
        "price": 1573.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "CTX",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3723995060-unas-paleteras-ctx912-ctx918-_JM",
        "specs": {
            "Código de repuesto": "VIAL-U-AS-PALETERAS-CTX912-CTX918",
            "Marca": "CTX",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_u_as_paleteras_cg926a_bronco",
        "name": "UÑAS PALETERAS CG926A BRONCO",
        "code": "VIAL-U-AS-PALETERAS-CG926A-BRONCO",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: UÑAS PALETERAS CG926A BRONCO.",
        "price": 1452.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bronco",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724146918-unas-paleteras-cg926a-bronco-_JM",
        "specs": {
            "Código de repuesto": "VIAL-U-AS-PALETERAS-CG926A-BRONCO",
            "Marca": "Bronco",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_u_as_paleteras_ctx926a_926_928_930",
        "name": "UÑAS PALETERAS CTX926A/926/928/930",
        "code": "VIAL-U-AS-PALETERAS-CTX926A-926-928-930",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: UÑAS PALETERAS CTX926A/926/928/930.",
        "price": 1694.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "CTX",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724146924-unas-paleteras-ctx926a926928930-_JM",
        "specs": {
            "Código de repuesto": "VIAL-U-AS-PALETERAS-CTX926A-926-928-930",
            "Marca": "CTX",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_u_as_paleteras_ctx936",
        "name": "UÑAS PALETERAS CTX936",
        "code": "VIAL-U-AS-PALETERAS-CTX936",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: UÑAS PALETERAS CTX936.",
        "price": 3509.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "CTX",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724146930-unas-paleteras-ctx936-_JM",
        "specs": {
            "Código de repuesto": "VIAL-U-AS-PALETERAS-CTX936",
            "Marca": "CTX",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_balde_ctx926a_926",
        "name": "BALDE CTX926A/926",
        "code": "VIAL-BALDE-CTX926A-926",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: BALDE CTX926A/926.",
        "price": 2420.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "CTX",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947433329-balde-ctx926a926-_JM",
        "specs": {
            "Código de repuesto": "VIAL-BALDE-CTX926A-926",
            "Marca": "CTX",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_balde_ctx930",
        "name": "BALDE CTX930",
        "code": "VIAL-BALDE-CTX930",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: BALDE CTX930.",
        "price": 2662.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "CTX",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947433333-balde-ctx930-_JM",
        "specs": {
            "Código de repuesto": "VIAL-BALDE-CTX930",
            "Marca": "CTX",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "vial_vial_extencion_balde",
        "name": "EXTENCION BALDE",
        "code": "VIAL-EXTENCION-BALDE",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: EXTENCION BALDE.",
        "price": 605.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Vial",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947669701-extencion-balde-repuesto-agricola-vial-cod-vial-extencion-ba-_JM",
        "specs": {
            "Código de repuesto": "VIAL-EXTENCION-BALDE",
            "Marca": "Vial",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_banco_de_3_valvulas_ctx936",
        "name": "BANCO DE 3 VALVULAS CTX936",
        "code": "VIAL-BANCO-DE-3-VALVULAS-CTX936",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: BANCO DE 3 VALVULAS CTX936.",
        "price": 2541.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "CTX",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947433343-banco-de-3-valvulas-ctx936-_JM",
        "specs": {
            "Código de repuesto": "VIAL-BANCO-DE-3-VALVULAS-CTX936",
            "Marca": "CTX",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_martillo_para_ctx30_25",
        "name": "MARTILLO PARA CTX30-25",
        "code": "VIAL-MARTILLO-PARA-CTX30-25",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: MARTILLO PARA CTX30-25.",
        "price": 7139.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "CTX",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "VIAL-MARTILLO-PARA-CTX30-25",
            "Marca": "CTX",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_martillo_para_ctx388",
        "name": "MARTILLO PARA CTX388",
        "code": "VIAL-MARTILLO-PARA-CTX388",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: MARTILLO PARA CTX388.",
        "price": 7139.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "CTX",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "VIAL-MARTILLO-PARA-CTX388",
            "Marca": "CTX",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_u_a_paletera_wt400",
        "name": "UÑA PALETERA WT400",
        "code": "VIAL-U-A-PALETERA-WT400",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: UÑA PALETERA WT400.",
        "price": 1089.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "WT",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724154552-una-paletera-wt400-repuesto-agricola-wt-cod-vial-u-a-paleter-_JM",
        "specs": {
            "Código de repuesto": "VIAL-U-A-PALETERA-WT400",
            "Marca": "WT",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_u_a_paletera_tmv690",
        "name": "UÑA PALETERA TMV690",
        "code": "VIAL-U-A-PALETERA-TMV690",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: UÑA PALETERA TMV690.",
        "price": 1452.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "TMV",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724146962-una-paletera-tmv690-_JM",
        "specs": {
            "Código de repuesto": "VIAL-U-A-PALETERA-TMV690",
            "Marca": "TMV",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_u_a_paletera_tmv1100",
        "name": "UÑA PALETERA TMV1100",
        "code": "VIAL-U-A-PALETERA-TMV1100",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: UÑA PALETERA TMV1100.",
        "price": 1633.5,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "TMV",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724146972-una-paletera-tmv1100-_JM",
        "specs": {
            "Código de repuesto": "VIAL-U-A-PALETERA-TMV1100",
            "Marca": "TMV",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_martillo_hidraulico_tmv690",
        "name": "MARTILLO HIDRAULICO TMV690",
        "code": "VIAL-MARTILLO-HIDRAULICO-TMV690",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: MARTILLO HIDRAULICO TMV690.",
        "price": 3509.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "TMV",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "VIAL-MARTILLO-HIDRAULICO-TMV690",
            "Marca": "TMV",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_martillo_hidraulico_tmv1100",
        "name": "MARTILLO HIDRAULICO TMV1100",
        "code": "VIAL-MARTILLO-HIDRAULICO-TMV1100",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: MARTILLO HIDRAULICO TMV1100.",
        "price": 3872.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "TMV",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "VIAL-MARTILLO-HIDRAULICO-TMV1100",
            "Marca": "TMV",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_brazo_retroe_pivotante_tmv690",
        "name": "BRAZO RETROE PIVOTANTE TMV690",
        "code": "VIAL-BRAZO-RETROE-PIVOTANTE-TMV690",
        "desc": "Equipo de maquinaria vial. Modelo: BRAZO RETROE PIVOTANTE TMV690.",
        "price": 8349.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "TMV",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "VIAL-BRAZO-RETROE-PIVOTANTE-TMV690",
            "Marca": "TMV",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_brazo_retroe_pivotante_tmv1100",
        "name": "BRAZO RETROE PIVOTANTE TMV1100",
        "code": "VIAL-BRAZO-RETROE-PIVOTANTE-TMV1100",
        "desc": "Equipo de maquinaria vial. Modelo: BRAZO RETROE PIVOTANTE TMV1100.",
        "price": 8712.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "TMV",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "VIAL-BRAZO-RETROE-PIVOTANTE-TMV1100",
            "Marca": "TMV",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_brazo_retro_fijo_tmv690",
        "name": "BRAZO RETRO FIJO TMV690",
        "code": "VIAL-BRAZO-RETRO-FIJO-TMV690",
        "desc": "Equipo de maquinaria vial. Modelo: BRAZO RETRO FIJO TMV690.",
        "price": 3872.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "TMV",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "VIAL-BRAZO-RETRO-FIJO-TMV690",
            "Marca": "TMV",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_brazo_retro_fijo_tmv1100",
        "name": "BRAZO RETRO FIJO TMV1100",
        "code": "VIAL-BRAZO-RETRO-FIJO-TMV1100",
        "desc": "Equipo de maquinaria vial. Modelo: BRAZO RETRO FIJO TMV1100.",
        "price": 4235.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "TMV",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "VIAL-BRAZO-RETRO-FIJO-TMV1100",
            "Marca": "TMV",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_hoyadora_wt400",
        "name": "HOYADORA WT400",
        "code": "VIAL-HOYADORA-WT400",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: HOYADORA WT400.",
        "price": 3872.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "WT",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3723995150-hoyadora-wt400-_JM",
        "specs": {
            "Código de repuesto": "VIAL-HOYADORA-WT400",
            "Marca": "WT",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_hoyadora_tmv690",
        "name": "HOYADORA TMV690",
        "code": "VIAL-HOYADORA-TMV690",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: HOYADORA TMV690.",
        "price": 4477.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "TMV",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947433401-hoyadora-tmv690-_JM",
        "specs": {
            "Código de repuesto": "VIAL-HOYADORA-TMV690",
            "Marca": "TMV",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_hoyadora_tmv1100",
        "name": "HOYADORA TMV1100",
        "code": "VIAL-HOYADORA-TMV1100",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: HOYADORA TMV1100.",
        "price": 4840.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "TMV",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947433411-hoyadora-tmv1100-_JM",
        "specs": {
            "Código de repuesto": "VIAL-HOYADORA-TMV1100",
            "Marca": "TMV",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "vial_vial_alisadora_con_rodillo_vibrador",
        "name": "ALISADORA CON RODILLO VIBRADOR",
        "code": "VIAL-ALISADORA-CON-RODILLO-VIBRADOR",
        "desc": "Equipo de maquinaria vial. Modelo: ALISADORA CON RODILLO VIBRADOR.",
        "price": 11858.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "Vial",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724147012-alisadora-con-rodillo-vibrador-_JM",
        "specs": {
            "Código de repuesto": "VIAL-ALISADORA-CON-RODILLO-VIBRADOR",
            "Marca": "Vial",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_zanjeadora_150mm_wt400",
        "name": "ZANJEADORA 150MM WT400",
        "code": "VIAL-ZANJEADORA-150MM-WT400",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: ZANJEADORA 150MM WT400.",
        "price": 4477.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "WT",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947433415-zanjeadora-150mm-wt400-_JM",
        "specs": {
            "Código de repuesto": "VIAL-ZANJEADORA-150MM-WT400",
            "Marca": "WT",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_zanjeadora_300_mm_tmv690",
        "name": "ZANJEADORA 300 MM TMV690",
        "code": "VIAL-ZANJEADORA-300-MM-TMV690",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: ZANJEADORA 300 MM TMV690.",
        "price": 9196.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "TMV",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724255144-zanjeadora-300-mm-tmv690-_JM",
        "specs": {
            "Código de repuesto": "VIAL-ZANJEADORA-300-MM-TMV690",
            "Marca": "TMV",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_zanjeadora_300mm_tmv1100",
        "name": "ZANJEADORA 300MM TMV1100",
        "code": "VIAL-ZANJEADORA-300MM-TMV1100",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: ZANJEADORA 300MM TMV1100.",
        "price": 9559.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "TMV",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724154588-zanjeadora-300mm-tmv1100-_JM",
        "specs": {
            "Código de repuesto": "VIAL-ZANJEADORA-300MM-TMV1100",
            "Marca": "TMV",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "vial_vial_barredora",
        "name": "BARREDORA",
        "code": "VIAL-BARREDORA",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: BARREDORA.",
        "price": 7502.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Vial",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "VIAL-BARREDORA",
            "Marca": "Vial",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "vial_vial_cepillos_para_barredora_x2",
        "name": "CEPILLOS PARA BARREDORA (X2)",
        "code": "VIAL-CEPILLOS-PARA-BARREDORA-X2",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: CEPILLOS PARA BARREDORA (X2).",
        "price": 2299.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Vial",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947433433-cepillos-para-barredora-x2-_JM",
        "specs": {
            "Código de repuesto": "VIAL-CEPILLOS-PARA-BARREDORA-X2",
            "Marca": "Vial",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_balde_angosto_xn08_xn12",
        "name": "BALDE ANGOSTO XN08/XN12",
        "code": "VIAL-BALDE-ANGOSTO-XN08-XN12",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: BALDE ANGOSTO XN08/XN12.",
        "price": 205.7,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Rhinoceros",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785263241/a4tsd7ovddlly5bmcxbl.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785263242/aqntiwewyub2d1hgotmm.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785263243/glw26oake0pkeiskk8ai.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724147046-balde-angosto-xn08xn12-_JM",
        "specs": {
            "Código de repuesto": "VIAL-BALDE-ANGOSTO-XN08-XN12",
            "Marca": "Rhinoceros",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_balde_angosto_xn16_xn22",
        "name": "BALDE ANGOSTO XN16/XN22",
        "code": "VIAL-BALDE-ANGOSTO-XN16-XN22",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: BALDE ANGOSTO XN16/XN22.",
        "price": 302.5,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Rhinoceros",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785263244/cpwp21esmijspjnr58hk.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785263245/ne4fxfejjlfpqjpa9syc.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785263246/mwq3idqdpx89c1vyznnq.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724147054-balde-angosto-xn16xn22-_JM",
        "specs": {
            "Código de repuesto": "VIAL-BALDE-ANGOSTO-XN16-XN22",
            "Marca": "Rhinoceros",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_balde_angosto_xn28",
        "name": "BALDE ANGOSTO XN28",
        "code": "VIAL-BALDE-ANGOSTO-XN28",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: BALDE ANGOSTO XN28.",
        "price": 459.8,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Rhinoceros",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785263237/dlin9xpvlfu6coikqodi.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785263239/sqkeb0vc4badhhwhqotk.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785263240/c8wqpcd5uetalrcy7eta.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724147060-balde-angosto-xn28-_JM",
        "specs": {
            "Código de repuesto": "VIAL-BALDE-ANGOSTO-XN28",
            "Marca": "Rhinoceros",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_balde_standard_xn08_xn12",
        "name": "BALDE STANDARD XN08/XN12",
        "code": "VIAL-BALDE-STANDARD-XN08-XN12",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: BALDE STANDARD XN08/XN12.",
        "price": 278.3,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Rhinoceros",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785264916/wr6koajf2c2gebyhbdcv.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947433451-balde-standard-xn08xn12-_JM",
        "specs": {
            "Código de repuesto": "VIAL-BALDE-STANDARD-XN08-XN12",
            "Marca": "Rhinoceros",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_balde_standard_xn16_xn22",
        "name": "BALDE STANDARD XN16/XN22",
        "code": "VIAL-BALDE-STANDARD-XN16-XN22",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: BALDE STANDARD XN16/XN22.",
        "price": 435.6,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Rhinoceros",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785264918/rlazrp3jertkchslbdnt.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3723995210-balde-standard-xn16xn22-_JM",
        "specs": {
            "Código de repuesto": "VIAL-BALDE-STANDARD-XN16-XN22",
            "Marca": "Rhinoceros",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_balde_standard_xn28",
        "name": "BALDE STANDARD XN28",
        "code": "VIAL-BALDE-STANDARD-XN28",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: BALDE STANDARD XN28.",
        "price": 592.9,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Rhinoceros",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785264921/so6mmapmri3dwxdicd6i.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724147070-balde-standard-xn28-_JM",
        "specs": {
            "Código de repuesto": "VIAL-BALDE-STANDARD-XN28",
            "Marca": "Rhinoceros",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_balde_nivelador_xn08_10_12",
        "name": "BALDE NIVELADOR XN08/10/12",
        "code": "VIAL-BALDE-NIVELADOR-XN08-10-12",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: BALDE NIVELADOR XN08/10/12.",
        "price": 387.2,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Rhinoceros",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785264923/xl62ueiulivcufyg06el.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "VIAL-BALDE-NIVELADOR-XN08-10-12",
            "Marca": "Rhinoceros",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_balde_nivelador_xn16_xn22",
        "name": "BALDE NIVELADOR XN16/XN22",
        "code": "VIAL-BALDE-NIVELADOR-XN16-XN22",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: BALDE NIVELADOR XN16/XN22.",
        "price": 665.5,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Rhinoceros",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785264926/h8h6mfwxeqetqwjgzfty.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "VIAL-BALDE-NIVELADOR-XN16-XN22",
            "Marca": "Rhinoceros",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_balde_nivelador_xn28",
        "name": "BALDE NIVELADOR XN28",
        "code": "VIAL-BALDE-NIVELADOR-XN28",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: BALDE NIVELADOR XN28.",
        "price": 689.7,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Rhinoceros",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785264928/wwzjqf1sdq5nl83l2lkd.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "VIAL-BALDE-NIVELADOR-XN28",
            "Marca": "Rhinoceros",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_balde_triangular_xn08_xn12",
        "name": "BALDE TRIANGULAR XN08/XN12",
        "code": "VIAL-BALDE-TRIANGULAR-XN08-XN12",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: BALDE TRIANGULAR XN08/XN12.",
        "price": 229.9,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Rhinoceros",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785264929/d6dbzulurz3fbx21rtxa.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785264932/jy7fzcmzxocqoxtvajni.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724147082-balde-triangular-xn08xn12-_JM",
        "specs": {
            "Código de repuesto": "VIAL-BALDE-TRIANGULAR-XN08-XN12",
            "Marca": "Rhinoceros",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_balde_triangular_xn16_xn22",
        "name": "BALDE TRIANGULAR XN16/XN22",
        "code": "VIAL-BALDE-TRIANGULAR-XN16-XN22",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: BALDE TRIANGULAR XN16/XN22.",
        "price": 290.4,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Rhinoceros",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785264934/hcgruqchspasqklcca2m.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785264936/amjd60zfxytamhhe4qvt.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3723995232-balde-triangular-xn16xn22-_JM",
        "specs": {
            "Código de repuesto": "VIAL-BALDE-TRIANGULAR-XN16-XN22",
            "Marca": "Rhinoceros",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_ripera_xn08_xn12",
        "name": "RIPERA XN08/XN12",
        "code": "VIAL-RIPERA-XN08-XN12",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: RIPERA XN08/XN12.",
        "price": 193.6,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Rhinoceros",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785264937/wbtyjpp1k3i3nw3xa5oc.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785264939/xk2bs222kpg5332n5m8v.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947669785-ripera-xn08xn12-repuesto-agricola-rhinoceros-cod-vial-riper-_JM",
        "specs": {
            "Código de repuesto": "VIAL-RIPERA-XN08-XN12",
            "Marca": "Rhinoceros",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_ripera_xn16_xn22",
        "name": "RIPERA XN16/XN22",
        "code": "VIAL-RIPERA-XN16-XN22",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: RIPERA XN16/XN22.",
        "price": 266.2,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Rhinoceros",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785264940/wtqap0h6jkmdhp6gonnb.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785264941/hithl31zkxr7jx1lvmax.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724255176-ripera-xn16xn22-repuesto-agricola-rhinoceros-cod-vial-riper-_JM",
        "specs": {
            "Código de repuesto": "VIAL-RIPERA-XN16-XN22",
            "Marca": "Rhinoceros",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_ripera_xn28",
        "name": "RIPERA XN28",
        "code": "VIAL-RIPERA-XN28",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: RIPERA XN28.",
        "price": 290.4,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Rhinoceros",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785264942/iqtgfbv8u9gwqsqr36ss.jpg",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785264943/ncljy0jtig8txxt32jnw.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724255184-ripera-xn28-repuesto-agricola-rhinoceros-cod-vial-ripera-xn2-_JM",
        "specs": {
            "Código de repuesto": "VIAL-RIPERA-XN28",
            "Marca": "Rhinoceros",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_acople_rapido_xn16",
        "name": "ACOPLE RAPIDO XN16",
        "code": "VIAL-ACOPLE-RAPIDO-XN16",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: ACOPLE RAPIDO XN16.",
        "price": 459.8,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Rhinoceros",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785264945/mcc5nrgrmenbrzxegeoo.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785264946/hlnqgurejvvcilfvftu9.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947669797-acople-rapido-xn16-repuesto-agricola-rhinoceros-cod-vial-aco-_JM",
        "specs": {
            "Código de repuesto": "VIAL-ACOPLE-RAPIDO-XN16",
            "Marca": "Rhinoceros",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_acople_rapido_xn28",
        "name": "ACOPLE RAPIDO XN28",
        "code": "VIAL-ACOPLE-RAPIDO-XN28",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: ACOPLE RAPIDO XN28.",
        "price": 786.5,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Rhinoceros",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785264947/pbljiafolz15fktyvfpn.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785264948/dybucmrapbkssrpoookt.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724255188-acople-rapido-xn28-repuesto-agricola-rhinoceros-cod-vial-aco-_JM",
        "specs": {
            "Código de repuesto": "VIAL-ACOPLE-RAPIDO-XN28",
            "Marca": "Rhinoceros",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_hoyadora_xn08_xn12",
        "name": "HOYADORA XN08/XN12",
        "code": "VIAL-HOYADORA-XN08-XN12",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: HOYADORA XN08/XN12.",
        "price": 992.2,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Rhinoceros",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785264949/hiqmlqqais7mt1xgiyfk.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724154628-hoyadora-xn08xn12-repuesto-agricola-rhinoceros-cod-vial-hoy-_JM",
        "specs": {
            "Código de repuesto": "VIAL-HOYADORA-XN08-XN12",
            "Marca": "Rhinoceros",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_hoyadora_xn16_xn22",
        "name": "HOYADORA XN16/XN22",
        "code": "VIAL-HOYADORA-XN16-XN22",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: HOYADORA XN16/XN22.",
        "price": 4477.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Rhinoceros",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785264951/v2kl4g09qo2gbkglxo8r.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724147106-hoyadora-xn16xn22-_JM",
        "specs": {
            "Código de repuesto": "VIAL-HOYADORA-XN16-XN22",
            "Marca": "Rhinoceros",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_hoyadora_xn28",
        "name": "HOYADORA XN28",
        "code": "VIAL-HOYADORA-XN28",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: HOYADORA XN28.",
        "price": 5445.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Rhinoceros",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785264952/rkj3cptfhbggdiklyi2x.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724147110-hoyadora-xn28-_JM",
        "specs": {
            "Código de repuesto": "VIAL-HOYADORA-XN28",
            "Marca": "Rhinoceros",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_martillo_xn08_xn12",
        "name": "MARTILLO XN08/XN12",
        "code": "VIAL-MARTILLO-XN08-XN12",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: MARTILLO XN08/XN12.",
        "price": 3509.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Rhinoceros",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785264953/m8cqqtmzo1nkhqnlmvd8.webp"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "VIAL-MARTILLO-XN08-XN12",
            "Marca": "Rhinoceros",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_martillo_xn16_xn22",
        "name": "MARTILLO XN16/XN22",
        "code": "VIAL-MARTILLO-XN16-XN22",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: MARTILLO XN16/XN22.",
        "price": 4598.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Rhinoceros",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785264954/bzaz8k6qtframcviuto0.webp"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "VIAL-MARTILLO-XN16-XN22",
            "Marca": "Rhinoceros",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_martillo_xn28",
        "name": "MARTILLO XN28",
        "code": "VIAL-MARTILLO-XN28",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: MARTILLO XN28.",
        "price": 5082.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Rhinoceros",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785264956/pt9obpqekjathy7o2vap.webp"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "VIAL-MARTILLO-XN28",
            "Marca": "Rhinoceros",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_rastrillo_xn16",
        "name": "RASTRILLO XN16",
        "code": "VIAL-RASTRILLO-XN16",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: RASTRILLO XN16.",
        "price": 229.9,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Rhinoceros",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785264958/snrsx5nvdbu8c4nrymkb.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947669841-rastrillo-xn16-repuesto-agricola-rhinoceros-cod-vial-rastril-_JM",
        "specs": {
            "Código de repuesto": "VIAL-RASTRILLO-XN16",
            "Marca": "Rhinoceros",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_agarradera_xn08_xn12",
        "name": "AGARRADERA XN08/XN12",
        "code": "VIAL-AGARRADERA-XN08-XN12",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: AGARRADERA XN08/XN12.",
        "price": 387.2,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Rhinoceros",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785264960/vas7uwwqc9cdhzuxezjq.webp"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "VIAL-AGARRADERA-XN08-XN12",
            "Marca": "Rhinoceros",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_agarradera_xn16_xn22",
        "name": "AGARRADERA XN16/XN22",
        "code": "VIAL-AGARRADERA-XN16-XN22",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: AGARRADERA XN16/XN22.",
        "price": 847.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Rhinoceros",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785264961/oci35ytwg1xzdlkwpyez.webp"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "VIAL-AGARRADERA-XN16-XN22",
            "Marca": "Rhinoceros",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_garra_forestal_xn08_xn12",
        "name": "GARRA FORESTAL XN08/XN12",
        "code": "VIAL-GARRA-FORESTAL-XN08-XN12",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: GARRA FORESTAL XN08/XN12.",
        "price": 326.7,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Rhinoceros",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785264962/omfnk034utvtkzali6ci.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "VIAL-GARRA-FORESTAL-XN08-XN12",
            "Marca": "Rhinoceros",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_garra_forestal_xn16_xn22",
        "name": "GARRA FORESTAL XN16/XN22",
        "code": "VIAL-GARRA-FORESTAL-XN16-XN22",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: GARRA FORESTAL XN16/XN22.",
        "price": 786.5,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Rhinoceros",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785264963/yz87ubzs7ttsesympi4w.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "VIAL-GARRA-FORESTAL-XN16-XN22",
            "Marca": "Rhinoceros",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_garra_forestal_xn28",
        "name": "GARRA FORESTAL XN28",
        "code": "VIAL-GARRA-FORESTAL-XN28",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: GARRA FORESTAL XN28.",
        "price": 810.7,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Rhinoceros",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785264964/kfjijmrx8tebq3gykzto.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Código de repuesto": "VIAL-GARRA-FORESTAL-XN28",
            "Marca": "Rhinoceros",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_chipeadora_bronco_wc50",
        "name": "CHIPEADORA BRONCO WC50",
        "code": "VIAL-CHIPEADORA-BRONCO-WC50",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: CHIPEADORA BRONCO WC50.",
        "price": 1197.9,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bronco",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271433/yxzx1okwy9troff3uzva.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271434/gcgmolhkb3ll8z1i3epc.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271435/psycvv8sj9pa32hztyhg.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724255242-chipeadora-bronco-wc50-_JM",
        "specs": {
            "Código de repuesto": "VIAL-CHIPEADORA-BRONCO-WC50",
            "Marca": "Bronco",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_chipeadora_bronco_wc120",
        "name": "CHIPEADORA BRONCO WC120",
        "code": "VIAL-CHIPEADORA-BRONCO-WC120",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: CHIPEADORA BRONCO WC120.",
        "price": 2299.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bronco",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271438/fm8guu5lluqxg18oxvqd.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271439/jugdaieypkz5fde7qxrk.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271440/pzjmzok5dv9vebd2yrxy.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271441/miinchosvwtpv4me6zvt.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724247528-chipeadora-bronco-wc120-_JM",
        "specs": {
            "Código de repuesto": "VIAL-CHIPEADORA-BRONCO-WC120",
            "Marca": "Bronco",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_cortadora_de_pasto_bronco_tr500_giro_0",
        "name": "CORTADORA DE PASTO BRONCO TR500 (giro 0)",
        "code": "VIAL-CORTADORA-DE-PASTO-BRONCO-TR500-GIRO-0",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: CORTADORA DE PASTO BRONCO TR500 (giro 0).",
        "price": 9559.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bronco",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271442/izxfa7esujlsy3qjuvwv.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271443/rwhw5i66ruq4qn9gd73b.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724147152-cortadora-de-pasto-bronco-tr500-giro-0-_JM",
        "specs": {
            "Código de repuesto": "VIAL-CORTADORA-DE-PASTO-BRONCO-TR500-GIRO-0",
            "Marca": "Bronco",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_cortadora_de_pasto_tractor_marca_bronco",
        "name": "CORTADORA DE PASTO TRACTOR MARCA BRONCO",
        "code": "VIAL-CORTADORA-DE-PASTO-TRACTOR-MARCA-BRONCO",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: CORTADORA DE PASTO TRACTOR MARCA BRONCO.",
        "price": 5566.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bronco",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271445/bngsvhehxpa9abg8urcv.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724147158-cortadora-de-pasto-tractor-marca-bronco-_JM",
        "specs": {
            "Código de repuesto": "VIAL-CORTADORA-DE-PASTO-TRACTOR-MARCA-BRONCO",
            "Marca": "Bronco",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_tractor_bronco_254_ruedas_parqueras",
        "name": "TRACTOR BRONCO 254 ruedas parqueras",
        "code": "VIAL-TRACTOR-BRONCO-254-RUEDAS-PARQUERAS",
        "desc": "Equipo de maquinaria vial. Modelo: TRACTOR BRONCO 254 ruedas parqueras.",
        "price": 13915.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "Bronco",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271400/ymedrpwkohdvofrh4wex.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271401/vfw8ud0qwcgw0dwmrzx5.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3723995332-tractor-bronco-254-ruedas-parqueras-_JM",
        "specs": {
            "Código de repuesto": "VIAL-TRACTOR-BRONCO-254-RUEDAS-PARQUERAS",
            "Marca": "Bronco",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_tractor_bronco_254_ruedas_con_taco",
        "name": "TRACTOR BRONCO 254 ruedas con taco",
        "code": "VIAL-TRACTOR-BRONCO-254-RUEDAS-CON-TACO",
        "desc": "Equipo de maquinaria vial. Modelo: TRACTOR BRONCO 254 ruedas con taco.",
        "price": 13189.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "Bronco",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271402/xowkxmx72rsfcvsdmfaw.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271403/u8l6f9ypc3vdnbxov8kx.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3723995336-tractor-bronco-254-ruedas-con-taco-_JM",
        "specs": {
            "Código de repuesto": "VIAL-TRACTOR-BRONCO-254-RUEDAS-CON-TACO",
            "Marca": "Bronco",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_tractor_bronco_404_ruedas_parqueras",
        "name": "TRACTOR BRONCO 404 ruedas parqueras",
        "code": "VIAL-TRACTOR-BRONCO-404-RUEDAS-PARQUERAS",
        "desc": "Equipo de maquinaria vial. Modelo: TRACTOR BRONCO 404 ruedas parqueras.",
        "price": 15125.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "Bronco",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271404/vu0bbrfuudnttjjv9dwg.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271405/gai3qszmvwc5af8c3mut.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271407/gvdxd9ulxbgankazppcb.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724147170-tractor-bronco-404-ruedas-parqueras-_JM",
        "specs": {
            "Código de repuesto": "VIAL-TRACTOR-BRONCO-404-RUEDAS-PARQUERAS",
            "Marca": "Bronco",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_tractor_bronco_404_ruedas_con_taco",
        "name": "TRACTOR BRONCO 404 ruedas con taco",
        "code": "VIAL-TRACTOR-BRONCO-404-RUEDAS-CON-TACO",
        "desc": "Equipo de maquinaria vial. Modelo: TRACTOR BRONCO 404 ruedas con taco.",
        "price": 14399.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "Bronco",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271408/u0ibwanbiq8rtupf65ra.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271409/zbkl5oa5wg0ct1mbcbdv.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724147178-tractor-bronco-404-ruedas-con-taco-_JM",
        "specs": {
            "Código de repuesto": "VIAL-TRACTOR-BRONCO-404-RUEDAS-CON-TACO",
            "Marca": "Bronco",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_tractor_bronco_604_ruedas_parqueras",
        "name": "TRACTOR BRONCO 604 ruedas parqueras",
        "code": "VIAL-TRACTOR-BRONCO-604-RUEDAS-PARQUERAS",
        "desc": "Equipo de maquinaria vial. Modelo: TRACTOR BRONCO 604 ruedas parqueras.",
        "price": 18029.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "Bronco",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271410/zg5znydbusklfsoy7xqn.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271412/hxivjojeitrbgohhnyeh.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724247556-tractor-bronco-604-ruedas-parqueras-_JM",
        "specs": {
            "Código de repuesto": "VIAL-TRACTOR-BRONCO-604-RUEDAS-PARQUERAS",
            "Marca": "Bronco",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_tractor_bronco_604_ruedas_con_taco",
        "name": "TRACTOR BRONCO 604 ruedas con taco",
        "code": "VIAL-TRACTOR-BRONCO-604-RUEDAS-CON-TACO",
        "desc": "Equipo de maquinaria vial. Modelo: TRACTOR BRONCO 604 ruedas con taco.",
        "price": 17545.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "Bronco",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271413/rifb3hvew7vdq83zpo03.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724247560-tractor-bronco-604-ruedas-con-taco-_JM",
        "specs": {
            "Código de repuesto": "VIAL-TRACTOR-BRONCO-604-RUEDAS-CON-TACO",
            "Marca": "Bronco",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_tractor_bronco_604_ruedas_c_taco_con_cabina",
        "name": "TRACTOR BRONCO 604 ruedas c/taco CON CABINA",
        "code": "VIAL-TRACTOR-BRONCO-604-RUEDAS-C-TACO-CON-CABINA",
        "desc": "Equipo de maquinaria vial. Modelo: TRACTOR BRONCO 604 ruedas c/taco CON CABINA.",
        "price": 21296.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "Bronco",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271415/lokvz7wss11kj2utemqt.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724247566-tractor-bronco-604-ruedas-ctaco-con-cabina-_JM",
        "specs": {
            "Código de repuesto": "VIAL-TRACTOR-BRONCO-604-RUEDAS-C-TACO-CON-CABINA",
            "Marca": "Bronco",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_tractor_bronco_804_ruedas_con_taco",
        "name": "TRACTOR BRONCO 804 ruedas con taco",
        "code": "VIAL-TRACTOR-BRONCO-804-RUEDAS-CON-TACO",
        "desc": "Equipo de maquinaria vial. Modelo: TRACTOR BRONCO 804 ruedas con taco.",
        "price": 30129.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "Bronco",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271416/ke2mhatfxftvhhjkfuyi.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271417/v6pjrnz7j7v8juwvum9c.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271418/jx1hxuihskiul82b1bmm.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3723995352-tractor-bronco-804-ruedas-con-taco-_JM",
        "specs": {
            "Código de repuesto": "VIAL-TRACTOR-BRONCO-804-RUEDAS-CON-TACO",
            "Marca": "Bronco",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_tractor_bronco_804_ruedas_c_taco_con_cabina",
        "name": "TRACTOR BRONCO 804 ruedas c/taco CON CABINA",
        "code": "VIAL-TRACTOR-BRONCO-804-RUEDAS-C-TACO-CON-CABINA",
        "desc": "Equipo de maquinaria vial. Modelo: TRACTOR BRONCO 804 ruedas c/taco CON CABINA.",
        "price": 33759.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "Bronco",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271419/xd8vrycmy5pbymxafzbc.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271421/jxqd04baazgim2ftigod.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271422/nosc1c031vmwxp4o8r1y.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724247582-tractor-bronco-804-ruedas-ctaco-con-cabina-_JM",
        "specs": {
            "Código de repuesto": "VIAL-TRACTOR-BRONCO-804-RUEDAS-C-TACO-CON-CABINA",
            "Marca": "Bronco",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_tractor_bronco_1004_ruedas_con_taco",
        "name": "TRACTOR BRONCO 1004 ruedas con taco",
        "code": "VIAL-TRACTOR-BRONCO-1004-RUEDAS-CON-TACO",
        "desc": "Equipo de maquinaria vial. Modelo: TRACTOR BRONCO 1004 ruedas con taco.",
        "price": 48279.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "Bronco",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271423/gzqotsaxhbqafhszdgzw.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724147202-tractor-bronco-1004-ruedas-con-taco-_JM",
        "specs": {
            "Código de repuesto": "VIAL-TRACTOR-BRONCO-1004-RUEDAS-CON-TACO",
            "Marca": "Bronco",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_tractor_bronco_1104_ruedas_c_taco_con_cabina",
        "name": "TRACTOR BRONCO 1104 ruedas c/taco CON CABINA",
        "code": "VIAL-TRACTOR-BRONCO-1104-RUEDAS-C-TACO-CON-CABINA",
        "desc": "Equipo de maquinaria vial. Modelo: TRACTOR BRONCO 1104 ruedas c/taco CON CABINA.",
        "price": 50699.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "Bronco",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271424/nzgcu4esmtafxmnv9nyw.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271426/qhzwopzdpmhsjlatyvpl.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271427/m8idwuacep2wj3lx51ub.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271428/zs34rtqoyijhw64nq4ia.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724147206-tractor-bronco-1104-ruedas-ctaco-con-cabina-_JM",
        "specs": {
            "Código de repuesto": "VIAL-TRACTOR-BRONCO-1104-RUEDAS-C-TACO-CON-CABINA",
            "Marca": "Bronco",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "jd_vial_tractor_bronco_1254_ruedas_con_taco",
        "name": "TRACTOR BRONCO 1254 ruedas con taco",
        "code": "VIAL-TRACTOR-BRONCO-1254-RUEDAS-CON-TACO",
        "desc": "Equipo de maquinaria vial. Modelo: TRACTOR BRONCO 1254 ruedas con taco.",
        "price": 62799.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "Bronco",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271429/utslg9spfq65tyhrahwm.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271430/sapeh5g7igeyinlrdsj7.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271431/eeg92mczawyuphtufyg7.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3723995360-tractor-bronco-1254-ruedas-con-taco-_JM",
        "specs": {
            "Código de repuesto": "VIAL-TRACTOR-BRONCO-1254-RUEDAS-CON-TACO",
            "Marca": "Bronco",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "vial_vial_desmalezadora_tractor_25_hp_1_40",
        "name": "DESMALEZADORA TRACTOR 25 HP (1,40)",
        "code": "VIAL-DESMALEZADORA-TRACTOR-25-HP-1-40",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: DESMALEZADORA TRACTOR 25 HP (1,40).",
        "price": 2541.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Vial",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3723995366-desmalezadora-tractor-25-hp-140-_JM",
        "specs": {
            "Código de repuesto": "VIAL-DESMALEZADORA-TRACTOR-25-HP-1-40",
            "Marca": "Vial",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "vial_vial_desmalezadora_tractor_40_hp_1_50",
        "name": "DESMALEZADORA TRACTOR 40 HP (1,50)",
        "code": "VIAL-DESMALEZADORA-TRACTOR-40-HP-1-50",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: DESMALEZADORA TRACTOR 40 HP (1,50).",
        "price": 2783.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Vial",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724147222-desmalezadora-tractor-40-hp-150-_JM",
        "specs": {
            "Código de repuesto": "VIAL-DESMALEZADORA-TRACTOR-40-HP-1-50",
            "Marca": "Vial",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "vial_vial_desmalezadora_tractor_60_hp_1_80",
        "name": "DESMALEZADORA TRACTOR 60 HP (1,80)",
        "code": "VIAL-DESMALEZADORA-TRACTOR-60-HP-1-80",
        "desc": "Accesorio/implemento para maquinaria vial. Detalle: DESMALEZADORA TRACTOR 60 HP (1,80).",
        "price": 3025.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Vial",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3723995374-desmalezadora-tractor-60-hp-180-_JM",
        "specs": {
            "Código de repuesto": "VIAL-DESMALEZADORA-TRACTOR-60-HP-1-80",
            "Marca": "Vial",
            "Estado": "Nuevo Original"
        }
    },
    {
        "id": "udor_2507608",
        "name": "JUEGO CHAPAS PLEGADAS P/ECOTANK 200/500 P/DRONES",
        "code": "2507608",
        "desc": "Repuesto para maquinaria agrícola. Código: 2507608. JUEGO CHAPAS PLEGADAS P/ECOTANK 200/500 P/DRONES.",
        "price": 1806.4,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "UDOR",
        "model": "EcoTank",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785250541/fatdesn3go0hv4gytrhr.webp",
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785250547/vpkv24f5k9dqqqpmcloh.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724247652-juego-chapas-plegadas-pecotank-200500-pdrones-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: 2507719. MEZCLADOR ECOTANK - KIT MANGUERA/PISTOLA DRON.",
        "price": 143.94,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "UDOR",
        "model": "EcoTank",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947669949-mezclador-ecotank-kit-manguerapistola-dron-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: 2507739. MEZCLADOR ECOTANK P/DRONES - KIT BOMBA AGUA LIMPIA.",
        "price": 1880.15,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "UDOR",
        "model": "EcoTank",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3723995430-mezclador-ecotank-pdrones-kit-bomba-agua-limpia-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: 2507854. MEZCLADOR ECOTANK P/DRONES - CONJUNTO BASE.",
        "price": 11472.3,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "UDOR",
        "model": "EcoTank",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724147274-mezclador-ecotank-pdrones-conjunto-base-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: 2507855. MEZCLADOR ECOTANK P/DRONES - TANQUE 200.",
        "price": 1398.93,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "UDOR",
        "model": "EcoTank",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785250548/qm0cqouacw1ishqnsq3o.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3723995436-mezclador-ecotank-pdrones-tanque-200-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: 2507856. MEZCLADOR ECOTANK P/DRONES - TANQUE 500.",
        "price": 3293.04,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "UDOR",
        "model": "EcoTank",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785250550/jcgihsl38rxyk1irt4pt.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3723995440-mezclador-ecotank-pdrones-tanque-500-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: 2507857. MEZCLADOR ECOTANK P/DRONES - TANQUE 700.",
        "price": 3767.51,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "UDOR",
        "model": "EcoTank",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785250551/i1czg0egqkxk8mr5zlzo.webp"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724147288-mezclador-ecotank-pdrones-tanque-700-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: 2507889. PISTOLA DESPACHO DRON.",
        "price": 79.98,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "UDOR",
        "model": "EcoTank",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724255320-pistola-despacho-dron-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: 2507893. CHASIS ECOTANK 200 DRON/FULL.",
        "price": 337.51,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "UDOR",
        "model": "EcoTank",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724154782-chasis-ecotank-200-dronfull-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: 6501099. MEZCLADOR ECOTANK P/DRONES 200/500.",
        "price": 13638.56,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "UDOR",
        "model": "EcoTank",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3723995458-mezclador-ecotank-pdrones-200500-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: 6501100. MEZCLADOR ECOTANK P/DRONES 700/1000.",
        "price": 16365.95,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "UDOR",
        "model": "EcoTank",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3723995466-mezclador-ecotank-pdrones-7001000-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: 6501106. MEZCLADOR ECOTANK 200 DRON.",
        "price": 4032.43,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "UDOR",
        "model": "EcoTank",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724147304-mezclador-ecotank-200-dron-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: 6501107. MEZCLADOR ECOTANK 500 DRON.",
        "price": 5006.57,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "UDOR",
        "model": "EcoTank",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724147312-mezclador-ecotank-500-dron-_JM",
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
        "desc": "Repuesto para maquinaria agrícola. Código: 6501110. MEZCLADOR ECOTANK 500 NEVADA / DRON.",
        "price": 5421.91,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "UDOR",
        "model": "EcoTank",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724147318-mezclador-ecotank-500-nevada-dron-_JM",
        "specs": {
            "Código de repuesto": "6501110",
            "Marca": "UDOR",
            "Compatibilidad": "Drones de pulverización (Agras T30/T40/T50)",
            "Origen": "Italia"
        }
    },
    {
        "id": "dji_kt100dual6bat",
        "name": "Drone Agras T100D + 6 Baterias + 2 Generador + Enfriador + Dispersor de Sólidos + Bateria Extra RC",
        "code": "KT100DUAL6BAT",
        "desc": "Drone Agras T100D + 6 Baterias + 2 Generador + Enfriador + Dispersor de Sólidos + Bateria Extra RC..",
        "price": 66738.68,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T100D",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785192720/bt2ji0le3yungebz7ptu.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "KT100DUAL6BAT",
            "Categoría": "T100DUAL",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_kt100dual_full",
        "name": "Drone Agras T100D + 4 Baterias + 2 Generador + Enfriador + Dispersor de Sólidos + Bateria Extra RC + Mavic 3M + Pix4D Lic. Anual",
        "code": "KT100DUAL Full",
        "desc": "Drone Agras T100D + 4 Baterias + 2 Generador + Enfriador + Dispersor de Sólidos + Bateria Extra RC + Mavic 3M + Pix4D Lic. Anual..",
        "price": 64088.89,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T100D",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785192720/bt2ji0le3yungebz7ptu.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "KT100DUAL Full",
            "Categoría": "T100DUAL",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_kt100gener22kva_full_plus",
        "name": "Drone DJI T100 + 3 Baterias + Cargador + Generador 22KVA Brumby + Dispersor de Sólidos + Bateria Extra RC + Mavic 3M + Beneficios Bidcom Agro + Pix4D Lic. Anual",
        "code": "KT100GENER22KVA FULL Plus",
        "desc": "Drone DJI T100 + 3 Baterias + Cargador + Generador 22KVA Brumby + Dispersor de Sólidos + Bateria Extra RC + Mavic 3M + Beneficios Bidcom Agro + Pix4D Lic. Anual..",
        "price": 59883.26,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T100",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785192720/bt2ji0le3yungebz7ptu.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "KT100GENER22KVA FULL Plus",
            "Categoría": "T100PF",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_kt100full_plus_500",
        "name": "Drone DJI T100 + 3 Baterias + Generador + Dispersor de Sólidos + Bateria Extra RC + Mavic 3M + Curso + Mixer 500L + Pix4D Lic. Anual",
        "code": "KT100FULL Plus 500",
        "desc": "Drone DJI T100 + 3 Baterias + Generador + Dispersor de Sólidos + Bateria Extra RC + Mavic 3M + Curso + Mixer 500L + Pix4D Lic. Anual..",
        "price": 57553.92,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T100",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785192720/bt2ji0le3yungebz7ptu.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "KT100FULL Plus 500",
            "Categoría": "T100",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_kt100dual4bat",
        "name": "Drone Agras T100D + 4 Baterias + 2 Generador + Enfriador + Dispersor de Sólidos + Bateria Extra RC",
        "code": "KT100DUAL4BAT",
        "desc": "Drone Agras T100D + 4 Baterias + 2 Generador + Enfriador + Dispersor de Sólidos + Bateria Extra RC..",
        "price": 57458.89,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T100D",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785192720/bt2ji0le3yungebz7ptu.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "KT100DUAL4BAT",
            "Categoría": "T100DUAL",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_kt100dual4bat_plus_500",
        "name": "Drone Agras T100D + 4 Baterias + 2 Generador + Enfriador + Dispersor de Sólidos + Bateria Extra RC + Beneficio BidcomAgro",
        "code": "KT100DUAL4BAT Plus 500",
        "desc": "Drone Agras T100D + 4 Baterias + 2 Generador + Enfriador + Dispersor de Sólidos + Bateria Extra RC + Beneficio BidcomAgro..",
        "price": 57458.89,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T100D",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785192720/bt2ji0le3yungebz7ptu.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "KT100DUAL4BAT Plus 500",
            "Categoría": "T100PDUAL",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_kt100full",
        "name": "Drone DJI T100 + 3 Baterias + Generador + Dispersor de Sólidos + Bateria Extra RC + Mavic 3M + Pix4D Lic. Anual",
        "code": "KT100FULL",
        "desc": "Drone DJI T100 + 3 Baterias + Generador + Dispersor de Sólidos + Bateria Extra RC + Mavic 3M + Pix4D Lic. Anual..",
        "price": 53040.0,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T100",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785192720/bt2ji0le3yungebz7ptu.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "KT100FULL",
            "Categoría": "T100",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_kt70gener22kva_full_plus",
        "name": "Drone DJI T70P + 3 Baterias + Cargador + Generador 22KVA Brumby + Dispersor de Sólidos + Bateria Extra RC + Mavic 3M + Beneficios Bidcom Agro + Pix4D Lic. Anual",
        "code": "KT70GENER22KVA FULL Plus",
        "desc": "Drone DJI T70P + 3 Baterias + Cargador + Generador 22KVA Brumby + Dispersor de Sólidos + Bateria Extra RC + Mavic 3M + Beneficios Bidcom Agro + Pix4D Lic. Anual..",
        "price": 52149.37,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T70P",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785192720/bt2ji0le3yungebz7ptu.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "KT70GENER22KVA FULL Plus",
            "Categoría": "T70PF",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_kt100gener22kva_c_ds",
        "name": "Drone DJI T100 + 3 Baterias + Cargador + Generador 22KVA Brumby + Dispersor de Sólidos + Bateria Extra RC",
        "code": "KT100GENER22KVA c/DS",
        "desc": "Drone DJI T100 + 3 Baterias + Cargador + Generador 22KVA Brumby + Dispersor de Sólidos + Bateria Extra RC..",
        "price": 50828.89,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T100",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785192720/bt2ji0le3yungebz7ptu.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "KT100GENER22KVA c/DS",
            "Categoría": "T100P",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_kt100gener22kva_plus_500",
        "name": "Drone DJI T100 + 3 Baterias + Cargador + Generador 22KVA Brumby + Dispersor de Sólidos + Bateria Extra RC + Beneficios Bidcom Agro",
        "code": "KT100GENER22KVA Plus 500",
        "desc": "Drone DJI T100 + 3 Baterias + Cargador + Generador 22KVA Brumby + Dispersor de Sólidos + Bateria Extra RC + Beneficios Bidcom Agro..",
        "price": 50828.89,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T100",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785192720/bt2ji0le3yungebz7ptu.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "KT100GENER22KVA Plus 500",
            "Categoría": "T100PF",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_kt100dual_combo_c_ds",
        "name": "Drone Agras T100D + 4 Baterias + Enfriador + 2 Cargadores + Dispersor de Sólidos + Bateria Extra RC",
        "code": "KT100DUAL combo c/DS",
        "desc": "Drone Agras T100D + 4 Baterias + Enfriador + 2 Cargadores + Dispersor de Sólidos + Bateria Extra RC..",
        "price": 50389.1,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T100D",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785192720/bt2ji0le3yungebz7ptu.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "KT100DUAL combo c/DS",
            "Categoría": "T100DUAL",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_kt70full_plus_500",
        "name": "Drone DJI T70P + 3 Baterias + Generador + Dispersor de Sólidos + Bateria Extra RC + Mavic 3M + Curso + Mixer 500L + Pix4D Lic. Anual",
        "code": "KT70FULL Plus 500",
        "desc": "Drone DJI T70P + 3 Baterias + Generador + Dispersor de Sólidos + Bateria Extra RC + Mavic 3M + Curso + Mixer 500L + Pix4D Lic. Anual..",
        "price": 49818.92,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T70P",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785192720/bt2ji0le3yungebz7ptu.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "KT70FULL Plus 500",
            "Categoría": "T70",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_kt100gener_c_ds",
        "name": "Drone Agras T100 + 3 Baterias + Generador + Dispersor de Sólidos + Bateria Extra RC",
        "code": "KT100GENER c/DS",
        "desc": "Drone Agras T100 + 3 Baterias + Generador + Dispersor de Sólidos + Bateria Extra RC..",
        "price": 46408.89,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T100",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785192720/bt2ji0le3yungebz7ptu.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "KT100GENER c/DS",
            "Categoría": "T100",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_kt100gener_plus_500",
        "name": "Drone DJI T100 + 3 Baterias + Generador + Dispersor de Sólidos + Bateria Extra RC + Beneficios Bidcom Agro",
        "code": "KT100GENER Plus 500",
        "desc": "Drone DJI T100 + 3 Baterias + Generador + Dispersor de Sólidos + Bateria Extra RC + Beneficios Bidcom Agro..",
        "price": 46408.89,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T100",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785192720/bt2ji0le3yungebz7ptu.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "KT100GENER Plus 500",
            "Categoría": "T100P",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_kt70full",
        "name": "Drone DJI T70P + 3 Baterias + Generador + Dispersor de Sólidos + Bateria Extra RC + Mavic 3M + Pix4D Lic. Anual",
        "code": "KT70FULL",
        "desc": "Drone DJI T70P + 3 Baterias + Generador + Dispersor de Sólidos + Bateria Extra RC + Mavic 3M + Pix4D Lic. Anual..",
        "price": 45305.0,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T70P",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785192720/bt2ji0le3yungebz7ptu.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "KT70FULL",
            "Categoría": "T70",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_kt70gener22kva_c_ds",
        "name": "Drone DJI T70P + 3 Baterias + Cargador + Generador 22KVA Brumby + Dispersor de Sólidos + Bateria Extra RC",
        "code": "KT70GENER22KVA c/DS",
        "desc": "Drone DJI T70P + 3 Baterias + Cargador + Generador 22KVA Brumby + Dispersor de Sólidos + Bateria Extra RC..",
        "price": 43095.0,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T70P",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785192720/bt2ji0le3yungebz7ptu.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "KT70GENER22KVA c/DS",
            "Categoría": "T70P",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_kt70gener22kva_plus_500",
        "name": "Drone DJI T70P + 3 Baterias + Cargador + Generador 22KVA Brumby + Dispersor de Sólidos + Bateria Extra RC + Beneficios Bidcom Agro",
        "code": "KT70GENER22KVA Plus 500",
        "desc": "Drone DJI T70P + 3 Baterias + Cargador + Generador 22KVA Brumby + Dispersor de Sólidos + Bateria Extra RC + Beneficios Bidcom Agro..",
        "price": 43095.0,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T70P",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785192720/bt2ji0le3yungebz7ptu.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "KT70GENER22KVA Plus 500",
            "Categoría": "T70PF",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_kt100combo_c_ds",
        "name": "Drone Agras T100 + 3 Baterias + Dispersor de Sólidos + Cargador + Bateria Extra RC",
        "code": "KT100COMBO c/DS",
        "desc": "Drone Agras T100 + 3 Baterias + Dispersor de Sólidos + Cargador + Bateria Extra RC..",
        "price": 42874.0,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T100",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785192720/bt2ji0le3yungebz7ptu.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "KT100COMBO c/DS",
            "Categoría": "T100",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_kt100combo_plus_500",
        "name": "Drone Agras T100 + 3 Baterias + Cargador + Bateria Extra RC + Beneficios Bidcom Agro",
        "code": "KT100COMBO Plus 500",
        "desc": "Drone Agras T100 + 3 Baterias + Cargador + Bateria Extra RC + Beneficios Bidcom Agro..",
        "price": 42874.0,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T100",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785192720/bt2ji0le3yungebz7ptu.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "KT100COMBO Plus 500",
            "Categoría": "T100P",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_kt100combo",
        "name": "Drone Agras T100 + 3 Baterias + Cargador + Bateria Extra RC",
        "code": "KT100COMBO",
        "desc": "Drone Agras T100 + 3 Baterias + Cargador + Bateria Extra RC..",
        "price": 40775.6,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T100",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785192720/bt2ji0le3yungebz7ptu.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "KT100COMBO",
            "Categoría": "T100",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_kmatrice400",
        "name": "Drone Matrice 400 + Plataforma de carga + 1 Bateria + Sensor Lidar L3",
        "code": "KMATRICE400",
        "desc": "Drone Matrice 400 + Plataforma de carga + 1 Bateria + Sensor Lidar L3..",
        "price": 39050.7,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Matrice 400",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785192720/bt2ji0le3yungebz7ptu.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "KMATRICE400",
            "Categoría": "M4",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_kt70gener_plus_500",
        "name": "Drone DJI T70P + 3 Baterias + Generador + Dispersor de Sólidos + Bateria Extra RC + Curso + Beneficios Bidcom Agro",
        "code": "KT70GENER Plus 500",
        "desc": "Drone DJI T70P + 3 Baterias + Generador + Dispersor de Sólidos + Bateria Extra RC + Curso + Beneficios Bidcom Agro..",
        "price": 38675.0,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T70P",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785192720/bt2ji0le3yungebz7ptu.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "KT70GENER Plus 500",
            "Categoría": "T70P",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_kt70gener_c_ds",
        "name": "Drone DJI T70P + 3 Baterias + Generador + Dispersor de Sólidos + Bateria Extra RC",
        "code": "KT70GENER c/DS",
        "desc": "Drone DJI T70P + 3 Baterias + Generador + Dispersor de Sólidos + Bateria Extra RC..",
        "price": 38673.89,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T70P",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785192720/bt2ji0le3yungebz7ptu.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "KT70GENER c/DS",
            "Categoría": "T70",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_kt55full",
        "name": "Drone DJI T55 + 3 Baterias DB1580 + Generador + Dispersor de Sólidos + Bateria Extra RC + Mavic 3M + Pix4D Lic. Anual",
        "code": "KT55FULL",
        "desc": "Drone DJI T55 + 3 Baterias DB1580 + Generador + Dispersor de Sólidos + Bateria Extra RC + Mavic 3M + Pix4D Lic. Anual..",
        "price": 37568.89,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T55",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785192720/bt2ji0le3yungebz7ptu.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "KT55FULL",
            "Categoría": "T55P",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_kt50full_plus",
        "name": "Drone DJI T50 + 3 Baterias + Generador + Dispersor de Sólidos + Mavic + Bateria Extra RC + Mixer 240 L + Curso",
        "code": "KT50FULL Plus",
        "desc": "Drone DJI T50 + 3 Baterias + Generador + Dispersor de Sólidos + Mavic + Bateria Extra RC + Mixer 240 L + Curso..",
        "price": 37128.0,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T50",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785192720/bt2ji0le3yungebz7ptu.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "KT50FULL Plus",
            "Categoría": "T50",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_kt70combo_c_ds",
        "name": "Drone DJI T70P + 3 Baterias + Cargador + Dispersor de Sólidos + Bateria Extra RC + Curso",
        "code": "KT70COMBO c/DS",
        "desc": "Drone DJI T70P + 3 Baterias + Cargador + Dispersor de Sólidos + Bateria Extra RC + Curso..",
        "price": 35358.89,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T70P",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785192720/bt2ji0le3yungebz7ptu.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "KT70COMBO c/DS",
            "Categoría": "T70",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_kt50full",
        "name": "Drone DJI T50 + 3 Baterias + Generador + Dispersor de Sólidos + Mavic 3M + Bateria Extra RC",
        "code": "KT50FULL",
        "desc": "Drone DJI T50 + 3 Baterias + Generador + Dispersor de Sólidos + Mavic 3M + Bateria Extra RC..",
        "price": 34255.0,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T50",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785192720/bt2ji0le3yungebz7ptu.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "KT50FULL",
            "Categoría": "T50",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_kmatrice400t",
        "name": "Drone Matrice 400 + Plataforma de carga + 1 Bateria + H30T",
        "code": "KMATRICE400T",
        "desc": "Drone Matrice 400 + Plataforma de carga + 1 Bateria + H30T..",
        "price": 33194.2,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Matrice 400",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785192720/bt2ji0le3yungebz7ptu.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "KMATRICE400T",
            "Categoría": "M4",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_kt55gener_c_ds",
        "name": "Drone DJI T55 + 3 Baterias DB1580 + Generador + Dispersor de Sólidos + Bateria Extra RC",
        "code": "KT55GENER c/DS",
        "desc": "Drone DJI T55 + 3 Baterias DB1580 + Generador + Dispersor de Sólidos + Bateria Extra RC..",
        "price": 30938.9,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T55",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785192720/bt2ji0le3yungebz7ptu.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "KT55GENER c/DS",
            "Categoría": "T55",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_kt55gener_plus_240",
        "name": "Drone DJI T55 + 3 Baterias DB1580 + Generador + Dispersor de Sólidos + Bateria Extra RC + Beneficio BidcomAgro",
        "code": "KT55GENER Plus 240",
        "desc": "Drone DJI T55 + 3 Baterias DB1580 + Generador + Dispersor de Sólidos + Bateria Extra RC + Beneficio BidcomAgro..",
        "price": 30938.9,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T55",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785192720/bt2ji0le3yungebz7ptu.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "KT55GENER Plus 240",
            "Categoría": "T55P",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_kdual3bat_user",
        "name": "Dual Spray 90L + 3 Baterias + 1 Generador + Enfriador",
        "code": "KDUAL3BAT User",
        "desc": "Dual Spray 90L + 3 Baterias + 1 Generador + Enfriador..",
        "price": 29167.58,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Dual Spray 90L",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785192720/bt2ji0le3yungebz7ptu.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724147414-dual-spray-90l-3-baterias-1-generador-enfriador-_JM",
        "specs": {
            "SKU": "KDUAL3BAT User",
            "Categoría": "T100DUAL",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_kt50gener_c_ds",
        "name": "Drone DJI T50 + 3 Baterias + Generador + Dispersor de Sólidos + Bateria Extra RC",
        "code": "KT50GENER c/DS",
        "desc": "Drone DJI T50 + 3 Baterias + Generador + Dispersor de Sólidos + Bateria Extra RC..",
        "price": 27625.0,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T50",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785192720/bt2ji0le3yungebz7ptu.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "KT50GENER c/DS",
            "Categoría": "T50",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_kt55combo_c_ds",
        "name": "Drone DJI T55 + 3 Baterias DB1580 + Dispersor de Sólidos + Cargador C12000 + Bateria Extra RC",
        "code": "KT55COMBO c/DS",
        "desc": "Drone DJI T55 + 3 Baterias DB1580 + Dispersor de Sólidos + Cargador C12000 + Bateria Extra RC..",
        "price": 27623.9,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T55",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785192720/bt2ji0le3yungebz7ptu.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "KT55COMBO c/DS",
            "Categoría": "T55",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_kdock3",
        "name": "Dock 3 + Matrice 4TD",
        "code": "KDOCK3",
        "desc": "Dock 3 + Matrice 4TD..",
        "price": 27017.25,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Dock 3",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785192720/bt2ji0le3yungebz7ptu.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724247860-dock-3-matrice-4td-_JM",
        "specs": {
            "SKU": "KDOCK3",
            "Categoría": "M4",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_t50combo",
        "name": "Drone DJI T50 + 3 Baterias + Cargador + Bateria extra RC",
        "code": "T50COMBO",
        "desc": "Drone DJI T50 + 3 Baterias + Cargador + Bateria extra RC..",
        "price": 24310.0,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T50",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785192720/bt2ji0le3yungebz7ptu.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "T50COMBO",
            "Categoría": "T50",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_t100dron",
        "name": "T100 Agras Dron",
        "code": "T100DRON",
        "desc": "T100 Agras Dron..",
        "price": 23203.9,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T100",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785192720/bt2ji0le3yungebz7ptu.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "T100DRON",
            "Categoría": "ACC1",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_kt40gener_c_ds",
        "name": "Drone DJI T40 + 3 Baterias + Generador + Dispersor de Sólidos + Bateria Extra RC",
        "code": "KT40GENER c/DS",
        "desc": "Drone DJI T40 + 3 Baterias + Generador + Dispersor de Sólidos + Bateria Extra RC..",
        "price": 20387.25,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T40",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785192720/bt2ji0le3yungebz7ptu.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "KT40GENER c/DS",
            "Categoría": "T40",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_t70pdron",
        "name": "T70P Dron",
        "code": "T70PDRON",
        "desc": "T70P Dron..",
        "price": 19888.9,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T70P",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785192720/bt2ji0le3yungebz7ptu.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "T70PDRON",
            "Categoría": "ACC1",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_t40combo",
        "name": "Drone DJI T40 + 3 Baterias + Cargador + Dispersor de Sólidos + Bateria Extra RC",
        "code": "T40COMBO",
        "desc": "Drone DJI T40 + 3 Baterias + Cargador + Dispersor de Sólidos + Bateria Extra RC..",
        "price": 18895.5,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T40",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785192720/bt2ji0le3yungebz7ptu.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "T40COMBO",
            "Categoría": "T40",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_t50drone",
        "name": "T50 Dron",
        "code": "T50DRONE",
        "desc": "T50 Dron..",
        "price": 18785.0,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T50",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785192720/bt2ji0le3yungebz7ptu.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "T50DRONE",
            "Categoría": "ACC1",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_kdual1bat_user",
        "name": "Dual Spray 90L + 1 Baterias + 1 Generador + Enfriador",
        "code": "KDUAL1BAT User",
        "desc": "Dual Spray 90L + 1 Baterias + 1 Generador + Enfriador..",
        "price": 17677.79,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Dual Spray 90L",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785192720/bt2ji0le3yungebz7ptu.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3723995586-dual-spray-90l-1-baterias-1-generador-enfriador-_JM",
        "specs": {
            "SKU": "KDUAL1BAT User",
            "Categoría": "T100DUAL",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_t55drone",
        "name": "T55 Drone",
        "code": "T55DRONE",
        "desc": "T55 Drone..",
        "price": 14363.9,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T55",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785192720/bt2ji0le3yungebz7ptu.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "T55DRONE",
            "Categoría": "ACC1",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_kt25gener_c_ds",
        "name": "Drone DJI T25P + 3 Baterias + Dispersor de Sólidos + Generador + Bateria Extra RC",
        "code": "KT25GENER c/DS",
        "desc": "Drone DJI T25P + 3 Baterias + Dispersor de Sólidos + Generador + Bateria Extra RC..",
        "price": 14329.64,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T25P",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785192720/bt2ji0le3yungebz7ptu.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "KT25GENER c/DS",
            "Categoría": "T25",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_kt25gener",
        "name": "Drone DJI T25P + 3 Baterias + Generador + Bateria Extra RC",
        "code": "KT25GENER",
        "desc": "Drone DJI T25P + 3 Baterias + Generador + Bateria Extra RC..",
        "price": 13258.9,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T25P",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785192720/bt2ji0le3yungebz7ptu.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "KT25GENER",
            "Categoría": "T25",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_kt20pgener",
        "name": "Drones Agras T20 + 3 Baterias + Cargador + Generador",
        "code": "KT20PGENER",
        "desc": "Drones Agras T20 + 3 Baterias + Cargador + Generador..",
        "price": 10497.5,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T20",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785192720/bt2ji0le3yungebz7ptu.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "KT20PGENER",
            "Categoría": "T30 / T20",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_kt30gener",
        "name": "Drone Agras T30 + 3 Baterias + Cargador + Generador",
        "code": "KT30GENER",
        "desc": "Drone Agras T30 + 3 Baterias + Cargador + Generador..",
        "price": 10497.5,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T30",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785192720/bt2ji0le3yungebz7ptu.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "KT30GENER",
            "Categoría": "T30 / T20",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_mavicmfmc_pix4d_anual",
        "name": "DJI Mavic 3 Multispectral + Fly More Combo + Pix4D Licencia Anual",
        "code": "MavicMFMC Pix4D Anual",
        "desc": "DJI Mavic 3 Multispectral + Fly More Combo + Pix4D Licencia Anual..",
        "price": 10265.45,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Mavic 3 Multispectral",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785192720/bt2ji0le3yungebz7ptu.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "MavicMFMC Pix4D Anual",
            "Categoría": "Mevic",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_kmatrice4t",
        "name": "Drone Matrice 4T + 1 Bateria",
        "code": "KMATRICE4T",
        "desc": "Drone Matrice 4T + 1 Bateria..",
        "price": 9768.2,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Matrice 4T",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785192720/bt2ji0le3yungebz7ptu.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "KMATRICE4T",
            "Categoría": "M4",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_t20combo",
        "name": "Drones Agras T20 + 3 Baterias + Cargador",
        "code": "T20COMBO",
        "desc": "Drones Agras T20 + 3 Baterias + Cargador..",
        "price": 8840.0,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T20",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785192720/bt2ji0le3yungebz7ptu.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "T20COMBO",
            "Categoría": "T30 / T20",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_t30combo",
        "name": "Drone Agras T30 + 3 Baterias + Cargador",
        "code": "T30COMBO",
        "desc": "Drone Agras T30 + 3 Baterias + Cargador..",
        "price": 8840.0,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T30",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785192720/bt2ji0le3yungebz7ptu.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "T30COMBO",
            "Categoría": "T30 / T20",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_mavidmfmc",
        "name": "DJI Mavic 3 Multispectral + Fly More Combo + Pix4D 2 meses",
        "code": "MavidMFMC",
        "desc": "DJI Mavic 3 Multispectral + Fly More Combo + Pix4D 2 meses..",
        "price": 8287.5,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Mavic 3 Multispectral",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785192720/bt2ji0le3yungebz7ptu.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "MavidMFMC",
            "Categoría": "Mavic",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_t40drone",
        "name": "Drone Agras T40",
        "code": "T40DRONE",
        "desc": "Drone Agras T40..",
        "price": 7735.0,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T40",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785192720/bt2ji0le3yungebz7ptu.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "T40DRONE",
            "Categoría": "ACC2",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_t25pdrone",
        "name": "T25P Drone",
        "code": "T25PDRONE",
        "desc": "T25P Drone..",
        "price": 7733.89,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T25P",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785192720/bt2ji0le3yungebz7ptu.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "T25PDRONE",
            "Categoría": "ACC1",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_kmatrice4e",
        "name": "Drone Matrice 4E + 1 Bateria",
        "code": "KMATRICE4E",
        "desc": "Drone Matrice 4E + 1 Bateria..",
        "price": 7233.33,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Matrice 4E",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785192720/bt2ji0le3yungebz7ptu.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "KMATRICE4E",
            "Categoría": "M4",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_m3mchina",
        "name": "Mavic 3 Multispectral Edition",
        "code": "M3MCHINA",
        "desc": "Mavic 3 Multispectral Edition..",
        "price": 7182.5,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Mavic 3",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785192720/bt2ji0le3yungebz7ptu.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "M3MCHINA",
            "Categoría": "ACC1",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_brfenk22",
        "name": "Generador Brumby Fenk 22KVA",
        "code": "BRFENK22",
        "desc": "Generador Brumby Fenk 22KVA..",
        "price": 7822.65,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Brumby",
        "model": "22KVA",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "BRFENK22",
            "Categoría": "ACC2",
            "Marca": "Brumby",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_t100gener",
        "name": "Generador T100 D14000iE",
        "code": "T100GENER",
        "desc": "Generador T100 D14000iE..",
        "price": 6076.39,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "D14000iE",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "T100GENER",
            "Categoría": "ACC1",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_t100bate",
        "name": "Bateria Dron Agras T100 2160",
        "code": "T100BATE",
        "desc": "Bateria Dron Agras T100 2160. IVA 21,00%.",
        "price": 5744.89,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T100",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "T100BATE",
            "Categoría": "ACC1",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "21.00%"
        }
    },
    {
        "id": "dji_t70bater",
        "name": "T70 Bateria 1580",
        "code": "T70BATER",
        "desc": "T70 Bateria 1580. IVA 21,00%.",
        "price": 5744.89,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T70",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "T70BATER",
            "Categoría": "ACC1",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "21.00%"
        }
    },
    {
        "id": "dji_t20drone",
        "name": "T20 Drone",
        "code": "T20DRONE",
        "desc": "T20 Drone..",
        "price": 5525.0,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T20",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785192720/bt2ji0le3yungebz7ptu.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "T20DRONE",
            "Categoría": "ACC2",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_t40gener",
        "name": "Generadores T40",
        "code": "T40GENER",
        "desc": "Generadores T40..",
        "price": 4972.5,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T40",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "T40GENER",
            "Categoría": "ACC2",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_t50gener",
        "name": "Generadores T50",
        "code": "T50GENER",
        "desc": "Generadores T50..",
        "price": 4972.5,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T50",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "T50GENER",
            "Categoría": "ACC1",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_t100sdual",
        "name": "T100 Dual-Battery Spraying System (without Air-Cooled Heat Sink)",
        "code": "T100SDUAL",
        "desc": "T100 Dual-Battery Spraying System (without Air-Cooled Heat Sink)..",
        "price": 4170.27,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T100",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724247940-t100-dual-battery-spraying-system-without-air-cooled-heat-s-_JM",
        "specs": {
            "SKU": "T100SDUAL",
            "Categoría": "ACC1",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_ktrtk3",
        "name": "Antena RTK 3 + Tripode",
        "code": "KTRTK3",
        "desc": "Antena RTK 3 + Tripode..",
        "price": 3867.5,
        "category": "Agricultura de Precisión",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "RTK 3",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724155058-antena-rtk-3-tripode-_JM",
        "specs": {
            "SKU": "KTRTK3",
            "Categoría": "ACC1",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_mixer_500_l",
        "name": "Mixer Brumby 500 Litros",
        "code": "Mixer 500 L",
        "desc": "Mixer Brumby 500 Litros..",
        "price": 3974.85,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Brumby",
        "model": "500L",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724147542-mixer-brumby-500-litros-_JM",
        "specs": {
            "SKU": "Mixer 500 L",
            "Categoría": "ACC2",
            "Marca": "Brumby",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_t40bater",
        "name": "Bateria Agras T40",
        "code": "T40BATER",
        "desc": "Bateria Agras T40. IVA 21,00%.",
        "price": 3425.5,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T40",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724247952-bateria-agras-t40-_JM",
        "specs": {
            "SKU": "T40BATER",
            "Categoría": "ACC1",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "21.00%"
        }
    },
    {
        "id": "dji_t50bater",
        "name": "T50 Bateria",
        "code": "T50BATER",
        "desc": "T50 Bateria. IVA 21,00%.",
        "price": 3425.5,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T50",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947670225-t50-bateria-repuesto-agricola-dji-cod-t50bater-_JM",
        "specs": {
            "SKU": "T50BATER",
            "Categoría": "ACC1",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "21.00%"
        }
    },
    {
        "id": "dji_mixer_240_l",
        "name": "Mixer Brumby 240 Litros",
        "code": "Mixer 240 L",
        "desc": "Mixer Brumby 240 Litros..",
        "price": 3454.55,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Brumby",
        "model": "240L",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724147552-mixer-brumby-240-litros-_JM",
        "specs": {
            "SKU": "Mixer 240 L",
            "Categoría": "ACC2",
            "Marca": "Brumby",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_antrtk03",
        "name": "Antena RTK - 3",
        "code": "ANTRTK03",
        "desc": "Antena RTK - 3. IVA 21,00%.",
        "price": 3094.0,
        "category": "Agricultura de Precisión",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "RTK 3",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947670231-antena-rtk-3-repuesto-agricola-dji-cod-antrtk03-_JM",
        "specs": {
            "SKU": "ANTRTK03",
            "Categoría": "ACC1",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "21.00%"
        }
    },
    {
        "id": "dji_t40carga",
        "name": "Cargador Agras T40",
        "code": "T40CARGA",
        "desc": "Cargador Agras T40. IVA 21,00%.",
        "price": 2762.5,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T40",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724247978-cargador-agras-t40-_JM",
        "specs": {
            "SKU": "T40CARGA",
            "Categoría": "ACC2",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "21.00%"
        }
    },
    {
        "id": "dji_t50carga",
        "name": "T50 Cargador",
        "code": "T50CARGA",
        "desc": "T50 Cargador. IVA 21,00%.",
        "price": 2762.5,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T50",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3723995732-t50-cargador-_JM",
        "specs": {
            "SKU": "T50CARGA",
            "Categoría": "ACC1",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "21.00%"
        }
    },
    {
        "id": "dji_t100carga",
        "name": "Cargador T100/T70",
        "code": "T100CARGA",
        "desc": "Cargador T100/T70. IVA 21,00%.",
        "price": 2541.5,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T100/T70",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724147602-cargador-t100t70-_JM",
        "specs": {
            "SKU": "T100CARGA",
            "Categoría": "ACC1",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "21.00%"
        }
    },
    {
        "id": "dji_t25gener",
        "name": "Generador T25",
        "code": "T25GENER",
        "desc": "Generador T25..",
        "price": 2540.39,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T25",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "T25GENER",
            "Categoría": "ACC1",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_t20bater",
        "name": "Bateria Agras T20",
        "code": "T20BATER",
        "desc": "Bateria Agras T20. IVA 21,00%.",
        "price": 2320.5,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T20",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724247994-bateria-agras-t20-_JM",
        "specs": {
            "SKU": "T20BATER",
            "Categoría": "ACC1",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "21.00%"
        }
    },
    {
        "id": "dji_t20carga",
        "name": "Cargador Agras T20",
        "code": "T20CARGA",
        "desc": "Cargador Agras T20. IVA 21,00%.",
        "price": 2320.5,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T20",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724247998-cargador-agras-t20-_JM",
        "specs": {
            "SKU": "T20CARGA",
            "Categoría": "ACC2",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "21.00%"
        }
    },
    {
        "id": "dji_t100sgrua",
        "name": "T100 Sistema de Grua",
        "code": "T100sGrua",
        "desc": "T100 Sistema de Grua. IVA 21,00%.",
        "price": 2210.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T100",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "T100sGrua",
            "Categoría": "ACC1",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "21.00%"
        }
    },
    {
        "id": "dji_t65agrua",
        "name": "DL100 Lifting System",
        "code": "T65AGRUA",
        "desc": "DL100 Lifting System. IVA 21,00%.",
        "price": 2210.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "DL100",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724147626-dl100-lifting-system-_JM",
        "specs": {
            "SKU": "T65AGRUA",
            "Categoría": "ACC1",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "21.00%"
        }
    },
    {
        "id": "dji_djipow01agr",
        "name": "DJI POW01 AGR",
        "code": "DJIPOW01AGR",
        "desc": "DJI POW01 AGR. IVA 21,00%.",
        "price": 2198.95,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "DJIPOW01AGR",
            "Categoría": "ACC1",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "21.00%"
        }
    },
    {
        "id": "dji_t100sprea",
        "name": "Spreading System T100",
        "code": "T100SPREA",
        "desc": "Spreading System T100..",
        "price": 2087.34,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T100",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947670255-spreading-system-t100-_JM",
        "specs": {
            "SKU": "T100SPREA",
            "Categoría": "ACC1",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_t40seml",
        "name": "Dispersor Semillas T40",
        "code": "T40SEML",
        "desc": "Dispersor Semillas T40. IVA 21,00%.",
        "price": 2080.72,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T40",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1947670265-dispersor-semillas-t40-_JM",
        "specs": {
            "SKU": "T40SEML",
            "Categoría": "ACC2",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "21.00%"
        }
    },
    {
        "id": "dji_t50sprea",
        "name": "Spreading System T50",
        "code": "T50SPREA",
        "desc": "Spreading System T50..",
        "price": 2080.72,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T50",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3724155122-spreading-system-t50-_JM",
        "specs": {
            "SKU": "T50SPREA",
            "Categoría": "ACC1",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "10.50%"
        }
    },
    {
        "id": "dji_t25bater",
        "name": "Baterias DJI Agras T25",
        "code": "T25BATER",
        "desc": "Baterias DJI Agras T25. IVA 21,00%.",
        "price": 1987.89,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "DJI",
        "model": "Agras T25",
        "stock": 2,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "SKU": "T25BATER",
            "Categoría": "ACC1",
            "Marca": "DJI",
            "Estado": "Nuevo Original",
            "IVA": "21.00%"
        }
    },
    {
        "id": "CORREA-L111801",
        "name": "Correa L111801 - Correa",
        "code": "L111801",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 185.18,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "L111801",
        "description": "Correa de transmisión John Deere código L111801. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_01.jpeg",
            "assets/img/correas/correa_02.jpeg",
            "assets/img/correas/correa_03.jpeg",
            "assets/img/correas/correa_04.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "L111801",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726483288-correa-l111801-correa-_JM"
    },
    {
        "id": "CORREA-R73785",
        "name": "Correa R73785 - Correa",
        "code": "R73785",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 41.97,
        "currency": "USD",
        "stock": 7,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "R73785",
        "description": "Correa de transmisión John Deere código R73785. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_04.jpeg",
            "assets/img/correas/correa_05.jpeg",
            "assets/img/correas/correa_06.jpeg",
            "assets/img/correas/correa_07.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "R73785",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726579078-correa-r73785-correa-_JM"
    },
    {
        "id": "CORREA-J10052",
        "name": "Correa J10052 - Correa",
        "code": "J10052",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 12.32,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "Genérico",
        "model": "J10052",
        "description": "Correa de transmisión Genérico código J10052. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_07.jpeg",
            "assets/img/correas/correa_08.jpeg",
            "assets/img/correas/correa_09.jpeg",
            "assets/img/correas/correa_10.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "J10052",
            "Marca": "Genérico"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726579124-correa-j10052-correa-_JM"
    },
    {
        "id": "CORREA-J51805",
        "name": "Correa J51805 - Correa",
        "code": "J51805",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 15.25,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "Genérico",
        "model": "J51805",
        "description": "Correa de transmisión Genérico código J51805. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_10.jpeg",
            "assets/img/correas/correa_11.jpeg",
            "assets/img/correas/correa_12.jpeg",
            "assets/img/correas/correa_13.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "J51805",
            "Marca": "Genérico"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726483326-correa-j51805-correa-_JM"
    },
    {
        "id": "CORREA-CQ35531",
        "name": "Correa CQ35531 - Correa",
        "code": "CQ35531",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 161.64,
        "currency": "USD",
        "stock": 2,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "CQ35531",
        "description": "Correa de transmisión John Deere código CQ35531. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_13.jpeg",
            "assets/img/correas/correa_14.jpeg",
            "assets/img/correas/correa_15.jpeg",
            "assets/img/correas/correa_16.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "CQ35531",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726579130-correa-cq35531-correa-_JM"
    },
    {
        "id": "CORREA-H125381",
        "name": "Correa H125381 - Correa",
        "code": "H125381",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 104.11,
        "currency": "USD",
        "stock": 6,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "H125381",
        "description": "Correa de transmisión John Deere código H125381. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_16.jpeg",
            "assets/img/correas/correa_17.jpeg",
            "assets/img/correas/correa_18.jpeg",
            "assets/img/correas/correa_19.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "H125381",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948561785-correa-h125381-correa-_JM"
    },
    {
        "id": "CORREA-H138761EW",
        "name": "Correa H138761EW - Correa",
        "code": "H138761EW",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 36.3,
        "currency": "USD",
        "stock": 2,
        "condition": "Nuevo",
        "brand": "Genérico",
        "model": "H138761EW",
        "description": "Correa de transmisión Genérico código H138761EW. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_19.jpeg",
            "assets/img/correas/correa_20.jpeg",
            "assets/img/correas/correa_21.jpeg",
            "assets/img/correas/correa_22.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "H138761EW",
            "Marca": "Genérico"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726579140-correa-h138761ew-correa-_JM"
    },
    {
        "id": "CORREA-H140404",
        "name": "Correa H140404 - Correa",
        "code": "H140404",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 206.76,
        "currency": "USD",
        "stock": 2,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "H140404",
        "description": "Correa de transmisión John Deere código H140404. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_22.jpeg",
            "assets/img/correas/correa_23.jpeg",
            "assets/img/correas/correa_24.jpeg",
            "assets/img/correas/correa_25.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "H140404",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726579152-correa-h140404-correa-_JM"
    },
    {
        "id": "CORREA-A67976",
        "name": "Correa A67976 - Correa Plana",
        "code": "A67976",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 38.65,
        "currency": "USD",
        "stock": 10,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "A67976",
        "description": "Correa de transmisión John Deere código A67976. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_25.jpeg",
            "assets/img/correas/correa_26.jpeg",
            "assets/img/correas/correa_27.jpeg",
            "assets/img/correas/correa_28.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "A67976",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726483344-correa-a67976-correa-plana-_JM"
    },
    {
        "id": "CORREA-AE43286",
        "name": "Correa AE43286 - Correa Plana",
        "code": "AE43286",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 219.12,
        "currency": "USD",
        "stock": 2,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "AE43286",
        "description": "Correa de transmisión John Deere código AE43286. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_28.jpeg",
            "assets/img/correas/correa_29.jpeg",
            "assets/img/correas/correa_30.jpeg",
            "assets/img/correas/correa_31.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "AE43286",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726579156-correa-ae43286-correa-plana-_JM"
    },
    {
        "id": "CORREA-AE52287",
        "name": "Correa AE52287 - Correa Plana",
        "code": "AE52287",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 474.38,
        "currency": "USD",
        "stock": 3,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "AE52287",
        "description": "Correa de transmisión John Deere código AE52287. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_31.jpeg",
            "assets/img/correas/correa_32.jpeg",
            "assets/img/correas/correa_33.jpeg",
            "assets/img/correas/correa_34.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "AE52287",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948561813-correa-ae52287-correa-plana-_JM"
    },
    {
        "id": "CORREA-AE52288",
        "name": "Correa AE52288 - Correa Plana",
        "code": "AE52288",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 712.16,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "AE52288",
        "description": "Correa de transmisión John Deere código AE52288. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_34.jpeg",
            "assets/img/correas/correa_35.jpeg",
            "assets/img/correas/correa_36.jpeg",
            "assets/img/correas/correa_37.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "AE52288",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948561821-correa-ae52288-correa-plana-_JM"
    },
    {
        "id": "CORREA-AE74178",
        "name": "Correa AE74178 - Correa Plana",
        "code": "AE74178",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 1008.73,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "AE74178",
        "description": "Correa de transmisión John Deere código AE74178. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_37.jpeg",
            "assets/img/correas/correa_38.jpeg",
            "assets/img/correas/correa_39.jpeg",
            "assets/img/correas/correa_40.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "AE74178",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726483356-correa-ae74178-correa-plana-_JM"
    },
    {
        "id": "CORREA-AFH202038",
        "name": "Correa AFH202038 - Correa Plana",
        "code": "AFH202038",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 3230.81,
        "currency": "USD",
        "stock": 2,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "AFH202038",
        "description": "Correa de transmisión John Deere código AFH202038. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_40.jpeg",
            "assets/img/correas/correa_01.jpeg",
            "assets/img/correas/correa_02.jpeg",
            "assets/img/correas/correa_03.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "AFH202038",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726483362-correa-afh202038-correa-plana-_JM"
    },
    {
        "id": "CORREA-AH139436",
        "name": "Correa AH139436 - Juego De Correas",
        "code": "AH139436",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 176.51,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "AH139436",
        "description": "Correa de transmisión John Deere código AH139436. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_03.jpeg",
            "assets/img/correas/correa_04.jpeg",
            "assets/img/correas/correa_05.jpeg",
            "assets/img/correas/correa_06.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "AH139436",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726579184-correa-ah139436-juego-de-correas-_JM"
    },
    {
        "id": "CORREA-AH158880",
        "name": "Correa AH158880 - Juego De Correas",
        "code": "AH158880",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 164.23,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "AH158880",
        "description": "Correa de transmisión John Deere código AH158880. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_06.jpeg",
            "assets/img/correas/correa_07.jpeg",
            "assets/img/correas/correa_08.jpeg",
            "assets/img/correas/correa_09.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "AH158880",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948561841-correa-ah158880-juego-de-correas-_JM"
    },
    {
        "id": "CORREA-AH160080",
        "name": "Correa AH160080 - Juego De Correas",
        "code": "AH160080",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 232.74,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "AH160080",
        "description": "Correa de transmisión John Deere código AH160080. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_09.jpeg",
            "assets/img/correas/correa_10.jpeg",
            "assets/img/correas/correa_11.jpeg",
            "assets/img/correas/correa_12.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "AH160080",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726483384-correa-ah160080-juego-de-correas-_JM"
    },
    {
        "id": "CORREA-AJ58940",
        "name": "Correa AJ58940 - Juego De Correas",
        "code": "AJ58940",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 82.72,
        "currency": "USD",
        "stock": 2,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "AJ58940",
        "description": "Correa de transmisión John Deere código AJ58940. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_12.jpeg",
            "assets/img/correas/correa_13.jpeg",
            "assets/img/correas/correa_14.jpeg",
            "assets/img/correas/correa_15.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "AJ58940",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726579188-correa-aj58940-juego-de-correas-_JM"
    },
    {
        "id": "CORREA-AJ58970",
        "name": "Correa AJ58970 - Juego De Correas",
        "code": "AJ58970",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 69.13,
        "currency": "USD",
        "stock": 3,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "AJ58970",
        "description": "Correa de transmisión John Deere código AJ58970. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_15.jpeg",
            "assets/img/correas/correa_16.jpeg",
            "assets/img/correas/correa_17.jpeg",
            "assets/img/correas/correa_18.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "AJ58970",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726579192-correa-aj58970-juego-de-correas-_JM"
    },
    {
        "id": "CORREA-AR50188",
        "name": "Correa AR50188 - Juego De Correas",
        "code": "AR50188",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 64.98,
        "currency": "USD",
        "stock": 5,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "AR50188",
        "description": "Correa de transmisión John Deere código AR50188. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_18.jpeg",
            "assets/img/correas/correa_19.jpeg",
            "assets/img/correas/correa_20.jpeg",
            "assets/img/correas/correa_21.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "AR50188",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948561867-correa-ar50188-juego-de-correas-_JM"
    },
    {
        "id": "CORREA-AR56638",
        "name": "Correa AR56638 - Juego De Correas",
        "code": "AR56638",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 60.42,
        "currency": "USD",
        "stock": 3,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "AR56638",
        "description": "Correa de transmisión John Deere código AR56638. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_21.jpeg",
            "assets/img/correas/correa_22.jpeg",
            "assets/img/correas/correa_23.jpeg",
            "assets/img/correas/correa_24.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "AR56638",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726483392-correa-ar56638-juego-de-correas-_JM"
    },
    {
        "id": "CORREA-AR72036",
        "name": "Correa AR72036 - Juego De Correas",
        "code": "AR72036",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 29.03,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "AR72036",
        "description": "Correa de transmisión John Deere código AR72036. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_24.jpeg",
            "assets/img/correas/correa_25.jpeg",
            "assets/img/correas/correa_26.jpeg",
            "assets/img/correas/correa_27.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "AR72036",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726579204-correa-ar72036-juego-de-correas-_JM"
    },
    {
        "id": "CORREA-AT24833",
        "name": "Correa AT24833 - Juego De Correas",
        "code": "AT24833",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 102.5,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "AT24833",
        "description": "Correa de transmisión John Deere código AT24833. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_27.jpeg",
            "assets/img/correas/correa_28.jpeg",
            "assets/img/correas/correa_29.jpeg",
            "assets/img/correas/correa_30.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "AT24833",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948561877-correa-at24833-juego-de-correas-_JM"
    },
    {
        "id": "CORREA-AT262958",
        "name": "Correa AT262958 - Correa Trapezoidal",
        "code": "AT262958",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 173.71,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "AT262958",
        "description": "Correa de transmisión John Deere código AT262958. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_30.jpeg",
            "assets/img/correas/correa_31.jpeg",
            "assets/img/correas/correa_32.jpeg",
            "assets/img/correas/correa_33.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "AT262958",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726483402-correa-at262958-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-AZ39676",
        "name": "Correa AZ39676 - Juego De Correas",
        "code": "AZ39676",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 119.38,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "AZ39676",
        "description": "Correa de transmisión John Deere código AZ39676. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_33.jpeg",
            "assets/img/correas/correa_34.jpeg",
            "assets/img/correas/correa_35.jpeg",
            "assets/img/correas/correa_36.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "AZ39676",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726579212-correa-az39676-juego-de-correas-_JM"
    },
    {
        "id": "CORREA-AZ39677",
        "name": "Correa AZ39677 - Juego De Correas",
        "code": "AZ39677",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 831.25,
        "currency": "USD",
        "stock": 2,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "AZ39677",
        "description": "Correa de transmisión John Deere código AZ39677. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_36.jpeg",
            "assets/img/correas/correa_37.jpeg",
            "assets/img/correas/correa_38.jpeg",
            "assets/img/correas/correa_39.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "AZ39677",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726579220-correa-az39677-juego-de-correas-_JM"
    },
    {
        "id": "CORREA-AZ39678",
        "name": "Correa AZ39678 - Juego De Correas",
        "code": "AZ39678",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 198.49,
        "currency": "USD",
        "stock": 2,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "AZ39678",
        "description": "Correa de transmisión John Deere código AZ39678. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_39.jpeg",
            "assets/img/correas/correa_40.jpeg",
            "assets/img/correas/correa_01.jpeg",
            "assets/img/correas/correa_02.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "AZ39678",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948561897-correa-az39678-juego-de-correas-_JM"
    },
    {
        "id": "CORREA-AZ56225",
        "name": "Correa AZ56225 - Juego De Correas",
        "code": "AZ56225",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 239.76,
        "currency": "USD",
        "stock": 2,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "AZ56225",
        "description": "Correa de transmisión John Deere código AZ56225. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_02.jpeg",
            "assets/img/correas/correa_03.jpeg",
            "assets/img/correas/correa_04.jpeg",
            "assets/img/correas/correa_05.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "AZ56225",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948561907-correa-az56225-juego-de-correas-_JM"
    },
    {
        "id": "CORREA-CA20518",
        "name": "Correa CA20518 - Correa",
        "code": "CA20518",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 280.8,
        "currency": "USD",
        "stock": 2,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "CA20518",
        "description": "Correa de transmisión John Deere código CA20518. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_05.jpeg",
            "assets/img/correas/correa_06.jpeg",
            "assets/img/correas/correa_07.jpeg",
            "assets/img/correas/correa_08.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "CA20518",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726579236-correa-ca20518-correa-_JM"
    },
    {
        "id": "CORREA-CQ05106",
        "name": "Correa CQ05106 - Correa Trapezoidal",
        "code": "CQ05106",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 536.31,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "CQ05106",
        "description": "Correa de transmisión John Deere código CQ05106. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_08.jpeg",
            "assets/img/correas/correa_09.jpeg",
            "assets/img/correas/correa_10.jpeg",
            "assets/img/correas/correa_11.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "CQ05106",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726579242-correa-cq05106-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-CQ08238",
        "name": "Correa CQ08238 - Correa Trapezoidal",
        "code": "CQ08238",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 14.86,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "CQ08238",
        "description": "Correa de transmisión John Deere código CQ08238. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_11.jpeg",
            "assets/img/correas/correa_12.jpeg",
            "assets/img/correas/correa_13.jpeg",
            "assets/img/correas/correa_14.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "CQ08238",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948561933-correa-cq08238-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-CQ08239",
        "name": "Correa CQ08239 - Correa Trapezoidal",
        "code": "CQ08239",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 36.11,
        "currency": "USD",
        "stock": 3,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "CQ08239",
        "description": "Correa de transmisión John Deere código CQ08239. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_14.jpeg",
            "assets/img/correas/correa_15.jpeg",
            "assets/img/correas/correa_16.jpeg",
            "assets/img/correas/correa_17.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "CQ08239",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726483434-correa-cq08239-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-CQ13837",
        "name": "Correa CQ13837 - Correa Noria",
        "code": "CQ13837",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 63.77,
        "currency": "USD",
        "stock": 4,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "CQ13837",
        "description": "Correa de transmisión John Deere código CQ13837. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_17.jpeg",
            "assets/img/correas/correa_18.jpeg",
            "assets/img/correas/correa_19.jpeg",
            "assets/img/correas/correa_20.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "CQ13837",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948561941-correa-cq13837-correa-noria-_JM"
    },
    {
        "id": "CORREA-CQ17755",
        "name": "Correa CQ17755 - Correa Trapezoidal",
        "code": "CQ17755",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 35.13,
        "currency": "USD",
        "stock": 4,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "CQ17755",
        "description": "Correa de transmisión John Deere código CQ17755. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_20.jpeg",
            "assets/img/correas/correa_21.jpeg",
            "assets/img/correas/correa_22.jpeg",
            "assets/img/correas/correa_23.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "CQ17755",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726579274-correa-cq17755-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-CQ33577",
        "name": "Correa CQ33577 - Correa Trapezoidal",
        "code": "CQ33577",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 35.27,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "CQ33577",
        "description": "Correa de transmisión John Deere código CQ33577. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_23.jpeg",
            "assets/img/correas/correa_24.jpeg",
            "assets/img/correas/correa_25.jpeg",
            "assets/img/correas/correa_26.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "CQ33577",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726579278-correa-cq33577-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-CQ34122",
        "name": "Correa CQ34122 - Correa Trapezoidal",
        "code": "CQ34122",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 18.26,
        "currency": "USD",
        "stock": 3,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "CQ34122",
        "description": "Correa de transmisión John Deere código CQ34122. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_26.jpeg",
            "assets/img/correas/correa_27.jpeg",
            "assets/img/correas/correa_28.jpeg",
            "assets/img/correas/correa_29.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "CQ34122",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948561967-correa-cq34122-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-CQ35426",
        "name": "Correa CQ35426 - Correa Trapezoidal",
        "code": "CQ35426",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 352.33,
        "currency": "USD",
        "stock": 2,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "CQ35426",
        "description": "Correa de transmisión John Deere código CQ35426. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_29.jpeg",
            "assets/img/correas/correa_30.jpeg",
            "assets/img/correas/correa_31.jpeg",
            "assets/img/correas/correa_32.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "CQ35426",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948561971-correa-cq35426-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-CQ35559",
        "name": "Correa CQ35559 - Correa Trapezoidal",
        "code": "CQ35559",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 513.86,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "CQ35559",
        "description": "Correa de transmisión John Deere código CQ35559. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_32.jpeg",
            "assets/img/correas/correa_33.jpeg",
            "assets/img/correas/correa_34.jpeg",
            "assets/img/correas/correa_35.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "CQ35559",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948561977-correa-cq35559-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-CQ37755",
        "name": "Correa CQ37755 - Correa Trapezoidal",
        "code": "CQ37755",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 19.09,
        "currency": "USD",
        "stock": 3,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "CQ37755",
        "description": "Correa de transmisión John Deere código CQ37755. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_35.jpeg",
            "assets/img/correas/correa_36.jpeg",
            "assets/img/correas/correa_37.jpeg",
            "assets/img/correas/correa_38.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "CQ37755",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726483486-correa-cq37755-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-CQ48048",
        "name": "Correa CQ48048 - Correa Trapezoidal",
        "code": "CQ48048",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 210.18,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "CQ48048",
        "description": "Correa de transmisión John Deere código CQ48048. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_38.jpeg",
            "assets/img/correas/correa_39.jpeg",
            "assets/img/correas/correa_40.jpeg",
            "assets/img/correas/correa_01.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "CQ48048",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948561985-correa-cq48048-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-CQ50143",
        "name": "Correa CQ50143 - Correa Trapezoidal",
        "code": "CQ50143",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 168.57,
        "currency": "USD",
        "stock": 2,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "CQ50143",
        "description": "Correa de transmisión John Deere código CQ50143. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_01.jpeg",
            "assets/img/correas/correa_02.jpeg",
            "assets/img/correas/correa_03.jpeg",
            "assets/img/correas/correa_04.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "CQ50143",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726579290-correa-cq50143-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-CQ50815",
        "name": "Correa CQ50815 - Correa Trapezoidal",
        "code": "CQ50815",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 78.64,
        "currency": "USD",
        "stock": 4,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "CQ50815",
        "description": "Correa de transmisión John Deere código CQ50815. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_04.jpeg",
            "assets/img/correas/correa_05.jpeg",
            "assets/img/correas/correa_06.jpeg",
            "assets/img/correas/correa_07.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "CQ50815",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726579296-correa-cq50815-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-CQ51920",
        "name": "Correa CQ51920 - Correa Trapezoidal",
        "code": "CQ51920",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 141.12,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "CQ51920",
        "description": "Correa de transmisión John Deere código CQ51920. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_07.jpeg",
            "assets/img/correas/correa_08.jpeg",
            "assets/img/correas/correa_09.jpeg",
            "assets/img/correas/correa_10.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "CQ51920",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948577515-correa-cq51920-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-CQ51921",
        "name": "Correa CQ51921 - Correa Trapezoidal",
        "code": "CQ51921",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 76.46,
        "currency": "USD",
        "stock": 2,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "CQ51921",
        "description": "Correa de transmisión John Deere código CQ51921. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_10.jpeg",
            "assets/img/correas/correa_11.jpeg",
            "assets/img/correas/correa_12.jpeg",
            "assets/img/correas/correa_13.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "CQ51921",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726579310-correa-cq51921-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-CQ58873",
        "name": "Correa CQ58873 - Correa Plana",
        "code": "CQ58873",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 80.59,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "CQ58873",
        "description": "Correa de transmisión John Deere código CQ58873. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_13.jpeg",
            "assets/img/correas/correa_14.jpeg",
            "assets/img/correas/correa_15.jpeg",
            "assets/img/correas/correa_16.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "CQ58873",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948562017-correa-cq58873-correa-plana-_JM"
    },
    {
        "id": "CORREA-DQ16201",
        "name": "Correa DQ16201 - Juego De Correas",
        "code": "DQ16201",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 19.19,
        "currency": "USD",
        "stock": 2,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "DQ16201",
        "description": "Correa de transmisión John Deere código DQ16201. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_16.jpeg",
            "assets/img/correas/correa_17.jpeg",
            "assets/img/correas/correa_18.jpeg",
            "assets/img/correas/correa_19.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "DQ16201",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726579324-correa-dq16201-juego-de-correas-_JM"
    },
    {
        "id": "CORREA-DQ29594",
        "name": "Correa DQ29594 - Juego De Correas",
        "code": "DQ29594",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 354.08,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "DQ29594",
        "description": "Correa de transmisión John Deere código DQ29594. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_19.jpeg",
            "assets/img/correas/correa_20.jpeg",
            "assets/img/correas/correa_21.jpeg",
            "assets/img/correas/correa_22.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "DQ29594",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948577537-correa-dq29594-juego-de-correas-_JM"
    },
    {
        "id": "CORREA-E78287",
        "name": "Correa E78287 - Correa Trapezoidal",
        "code": "E78287",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 34.0,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "E78287",
        "description": "Correa de transmisión John Deere código E78287. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_22.jpeg",
            "assets/img/correas/correa_23.jpeg",
            "assets/img/correas/correa_24.jpeg",
            "assets/img/correas/correa_25.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "E78287",
            "Marca": "John Deere"
        },
        "featured": false
    },
    {
        "id": "CORREA-GX21395",
        "name": "Correa GX21395 - Correa Plana",
        "code": "GX21395",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 98.55,
        "currency": "USD",
        "stock": 3,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "GX21395",
        "description": "Correa de transmisión John Deere código GX21395. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_25.jpeg",
            "assets/img/correas/correa_26.jpeg",
            "assets/img/correas/correa_27.jpeg",
            "assets/img/correas/correa_28.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "GX21395",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726579342-correa-gx21395-correa-plana-_JM"
    },
    {
        "id": "CORREA-H101469",
        "name": "Correa H101469 - Correa Trapezoidal",
        "code": "H101469",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 74.71,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "H101469",
        "description": "Correa de transmisión John Deere código H101469. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_28.jpeg",
            "assets/img/correas/correa_29.jpeg",
            "assets/img/correas/correa_30.jpeg",
            "assets/img/correas/correa_31.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "H101469",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726579348-correa-h101469-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-H126345",
        "name": "Correa H126345 - Correa Trapezoidal",
        "code": "H126345",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 341.33,
        "currency": "USD",
        "stock": 3,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "H126345",
        "description": "Correa de transmisión John Deere código H126345. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_31.jpeg",
            "assets/img/correas/correa_32.jpeg",
            "assets/img/correas/correa_33.jpeg",
            "assets/img/correas/correa_34.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "H126345",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948577557-correa-h126345-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-H132808",
        "name": "Correa H132808 - Correa Trapezoidal",
        "code": "H132808",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 47.63,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "H132808",
        "description": "Correa de transmisión John Deere código H132808. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_34.jpeg",
            "assets/img/correas/correa_35.jpeg",
            "assets/img/correas/correa_36.jpeg",
            "assets/img/correas/correa_37.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "H132808",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948577559-correa-h132808-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-H134437",
        "name": "Correa H134437 - Correa Trapezoidal",
        "code": "H134437",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 40.97,
        "currency": "USD",
        "stock": 5,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "H134437",
        "description": "Correa de transmisión John Deere código H134437. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_37.jpeg",
            "assets/img/correas/correa_38.jpeg",
            "assets/img/correas/correa_39.jpeg",
            "assets/img/correas/correa_40.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "H134437",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948577561-correa-h134437-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-H138761",
        "name": "Correa H138761 - Correa Trapezoidal",
        "code": "H138761",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 101.77,
        "currency": "USD",
        "stock": 7,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "H138761",
        "description": "Correa de transmisión John Deere código H138761. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_40.jpeg",
            "assets/img/correas/correa_01.jpeg",
            "assets/img/correas/correa_02.jpeg",
            "assets/img/correas/correa_03.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "H138761",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726579362-correa-h138761-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-H141166",
        "name": "Correa H141166 - Correa Trapezoidal",
        "code": "H141166",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 354.82,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "H141166",
        "description": "Correa de transmisión John Deere código H141166. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_03.jpeg",
            "assets/img/correas/correa_04.jpeg",
            "assets/img/correas/correa_05.jpeg",
            "assets/img/correas/correa_06.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "H141166",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948562049-correa-h141166-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-H146636",
        "name": "Correa H146636 - Correa Trapezoidal",
        "code": "H146636",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 35.91,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "H146636",
        "description": "Correa de transmisión John Deere código H146636. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_06.jpeg",
            "assets/img/correas/correa_07.jpeg",
            "assets/img/correas/correa_08.jpeg",
            "assets/img/correas/correa_09.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "H146636",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726579368-correa-h146636-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-H146637",
        "name": "Correa H146637 - Correa Trapezoidal",
        "code": "H146637",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 53.34,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "H146637",
        "description": "Correa de transmisión John Deere código H146637. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_09.jpeg",
            "assets/img/correas/correa_10.jpeg",
            "assets/img/correas/correa_11.jpeg",
            "assets/img/correas/correa_12.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "H146637",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726579372-correa-h146637-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-H153297",
        "name": "Correa H153297 - Correa Trapezoidal",
        "code": "H153297",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 56.8,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "H153297",
        "description": "Correa de transmisión John Deere código H153297. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_12.jpeg",
            "assets/img/correas/correa_13.jpeg",
            "assets/img/correas/correa_14.jpeg",
            "assets/img/correas/correa_15.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "H153297",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726579384-correa-h153297-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-H154723",
        "name": "Correa H154723 - Correa Trapezoidal",
        "code": "H154723",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 203.4,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "H154723",
        "description": "Correa de transmisión John Deere código H154723. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_15.jpeg",
            "assets/img/correas/correa_16.jpeg",
            "assets/img/correas/correa_17.jpeg",
            "assets/img/correas/correa_18.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "H154723",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948562071-correa-h154723-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-H154731",
        "name": "Correa H154731 - Correa Trapezoidal",
        "code": "H154731",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 122.02,
        "currency": "USD",
        "stock": 2,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "H154731",
        "description": "Correa de transmisión John Deere código H154731. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_18.jpeg",
            "assets/img/correas/correa_19.jpeg",
            "assets/img/correas/correa_20.jpeg",
            "assets/img/correas/correa_21.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "H154731",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948577581-correa-h154731-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-H156796",
        "name": "Correa H156796 - Correa Trapezoidal",
        "code": "H156796",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 435.45,
        "currency": "USD",
        "stock": 7,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "H156796",
        "description": "Correa de transmisión John Deere código H156796. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_21.jpeg",
            "assets/img/correas/correa_22.jpeg",
            "assets/img/correas/correa_23.jpeg",
            "assets/img/correas/correa_24.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "H156796",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948562073-correa-h156796-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-H157105",
        "name": "Correa H157105 - Correa Trapezoidal",
        "code": "H157105",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 143.25,
        "currency": "USD",
        "stock": 2,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "H157105",
        "description": "Correa de transmisión John Deere código H157105. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_24.jpeg",
            "assets/img/correas/correa_25.jpeg",
            "assets/img/correas/correa_26.jpeg",
            "assets/img/correas/correa_27.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "H157105",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726579388-correa-h157105-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-H157514",
        "name": "Correa H157514 - Correa Trapezoidal",
        "code": "H157514",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 335.55,
        "currency": "USD",
        "stock": 2,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "H157514",
        "description": "Correa de transmisión John Deere código H157514. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_27.jpeg",
            "assets/img/correas/correa_28.jpeg",
            "assets/img/correas/correa_29.jpeg",
            "assets/img/correas/correa_30.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "H157514",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726579390-correa-h157514-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-H158512",
        "name": "Correa H158512 - Correa Trapezoidal",
        "code": "H158512",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 303.31,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "H158512",
        "description": "Correa de transmisión John Deere código H158512. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_30.jpeg",
            "assets/img/correas/correa_31.jpeg",
            "assets/img/correas/correa_32.jpeg",
            "assets/img/correas/correa_33.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "H158512",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948577583-correa-h158512-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-H160171",
        "name": "Correa H160171 - Correa Trapezoidal",
        "code": "H160171",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 433.28,
        "currency": "USD",
        "stock": 2,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "H160171",
        "description": "Correa de transmisión John Deere código H160171. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_33.jpeg",
            "assets/img/correas/correa_34.jpeg",
            "assets/img/correas/correa_35.jpeg",
            "assets/img/correas/correa_36.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "H160171",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948562079-correa-h160171-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-H161648",
        "name": "Correa H161648 - Correa Trapezoidal",
        "code": "H161648",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 534.74,
        "currency": "USD",
        "stock": 2,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "H161648",
        "description": "Correa de transmisión John Deere código H161648. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_36.jpeg",
            "assets/img/correas/correa_37.jpeg",
            "assets/img/correas/correa_38.jpeg",
            "assets/img/correas/correa_39.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "H161648",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948577597-correa-h161648-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-H161795",
        "name": "Correa H161795 - Correa Trapezoidal",
        "code": "H161795",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 86.79,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "H161795",
        "description": "Correa de transmisión John Deere código H161795. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_39.jpeg",
            "assets/img/correas/correa_40.jpeg",
            "assets/img/correas/correa_01.jpeg",
            "assets/img/correas/correa_02.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "H161795",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948577599-correa-h161795-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-H173024",
        "name": "Correa H173024 - Correa Trapezoidal",
        "code": "H173024",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 1102.91,
        "currency": "USD",
        "stock": 2,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "H173024",
        "description": "Correa de transmisión John Deere código H173024. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_02.jpeg",
            "assets/img/correas/correa_03.jpeg",
            "assets/img/correas/correa_04.jpeg",
            "assets/img/correas/correa_05.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "H173024",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948562087-correa-h173024-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-H175587",
        "name": "Correa H175587 - Correa Trapezoidal",
        "code": "H175587",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 264.84,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "H175587",
        "description": "Correa de transmisión John Deere código H175587. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_05.jpeg",
            "assets/img/correas/correa_06.jpeg",
            "assets/img/correas/correa_07.jpeg",
            "assets/img/correas/correa_08.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "H175587",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948562095-correa-h175587-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-H201334",
        "name": "Correa H201334 - Correa Trapezoidal",
        "code": "H201334",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 632.53,
        "currency": "USD",
        "stock": 3,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "H201334",
        "description": "Correa de transmisión John Deere código H201334. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_08.jpeg",
            "assets/img/correas/correa_09.jpeg",
            "assets/img/correas/correa_10.jpeg",
            "assets/img/correas/correa_11.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "H201334",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948562097-correa-h201334-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-H201571",
        "name": "Correa H201571 - Correa Trapezoidal",
        "code": "H201571",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 322.36,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "H201571",
        "description": "Correa de transmisión John Deere código H201571. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_11.jpeg",
            "assets/img/correas/correa_12.jpeg",
            "assets/img/correas/correa_13.jpeg",
            "assets/img/correas/correa_14.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "H201571",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948577623-correa-h201571-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-H201596",
        "name": "Correa H201596 - Correa Trapezoidal",
        "code": "H201596",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 540.16,
        "currency": "USD",
        "stock": 3,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "H201596",
        "description": "Correa de transmisión John Deere código H201596. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_14.jpeg",
            "assets/img/correas/correa_15.jpeg",
            "assets/img/correas/correa_16.jpeg",
            "assets/img/correas/correa_17.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "H201596",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948562111-correa-h201596-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-H203474",
        "name": "Correa H203474 - Correa Trapezoidal",
        "code": "H203474",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 344.64,
        "currency": "USD",
        "stock": 3,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "H203474",
        "description": "Correa de transmisión John Deere código H203474. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_17.jpeg",
            "assets/img/correas/correa_18.jpeg",
            "assets/img/correas/correa_19.jpeg",
            "assets/img/correas/correa_20.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "H203474",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726579416-correa-h203474-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-H204747",
        "name": "Correa H204747 - Correa Trapezoidal",
        "code": "H204747",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 195.79,
        "currency": "USD",
        "stock": 2,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "H204747",
        "description": "Correa de transmisión John Deere código H204747. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_20.jpeg",
            "assets/img/correas/correa_21.jpeg",
            "assets/img/correas/correa_22.jpeg",
            "assets/img/correas/correa_23.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "H204747",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948577629-correa-h204747-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-H205169",
        "name": "Correa H205169 - Correa Trapezoidal",
        "code": "H205169",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 601.16,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "H205169",
        "description": "Correa de transmisión John Deere código H205169. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_23.jpeg",
            "assets/img/correas/correa_24.jpeg",
            "assets/img/correas/correa_25.jpeg",
            "assets/img/correas/correa_26.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "H205169",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726579424-correa-h205169-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-H206048",
        "name": "Correa H206048 - Correa Trapezoidal",
        "code": "H206048",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 172.49,
        "currency": "USD",
        "stock": 2,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "H206048",
        "description": "Correa de transmisión John Deere código H206048. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_26.jpeg",
            "assets/img/correas/correa_27.jpeg",
            "assets/img/correas/correa_28.jpeg",
            "assets/img/correas/correa_29.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "H206048",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726579426-correa-h206048-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-H206807",
        "name": "Correa H206807 - Correa Trapezoidal",
        "code": "H206807",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 31.51,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "H206807",
        "description": "Correa de transmisión John Deere código H206807. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_29.jpeg",
            "assets/img/correas/correa_30.jpeg",
            "assets/img/correas/correa_31.jpeg",
            "assets/img/correas/correa_32.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "H206807",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726579432-correa-h206807-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-H210476",
        "name": "Correa H210476 - Correa Trapezoidal",
        "code": "H210476",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 615.3,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "H210476",
        "description": "Correa de transmisión John Deere código H210476. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_32.jpeg",
            "assets/img/correas/correa_33.jpeg",
            "assets/img/correas/correa_34.jpeg",
            "assets/img/correas/correa_35.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "H210476",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726579436-correa-h210476-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-H211581",
        "name": "Correa H211581 - Correa Trapezoidal",
        "code": "H211581",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 761.76,
        "currency": "USD",
        "stock": 2,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "H211581",
        "description": "Correa de transmisión John Deere código H211581. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_35.jpeg",
            "assets/img/correas/correa_36.jpeg",
            "assets/img/correas/correa_37.jpeg",
            "assets/img/correas/correa_38.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "H211581",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726579440-correa-h211581-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-H213353",
        "name": "Correa H213353 - Correa Trapezoidal",
        "code": "H213353",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 44.69,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "H213353",
        "description": "Correa de transmisión John Deere código H213353. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_38.jpeg",
            "assets/img/correas/correa_39.jpeg",
            "assets/img/correas/correa_40.jpeg",
            "assets/img/correas/correa_01.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "H213353",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948562133-correa-h213353-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-H218645",
        "name": "Correa H218645 - Correa Trapezoidal",
        "code": "H218645",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 411.29,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "H218645",
        "description": "Correa de transmisión John Deere código H218645. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_01.jpeg",
            "assets/img/correas/correa_02.jpeg",
            "assets/img/correas/correa_03.jpeg",
            "assets/img/correas/correa_04.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "H218645",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948562145-correa-h218645-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-H219182",
        "name": "Correa H219182 - Correa Trapezoidal",
        "code": "H219182",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 186.03,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "H219182",
        "description": "Correa de transmisión John Deere código H219182. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_04.jpeg",
            "assets/img/correas/correa_05.jpeg",
            "assets/img/correas/correa_06.jpeg",
            "assets/img/correas/correa_07.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "H219182",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726579452-correa-h219182-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-H220884",
        "name": "Correa H220884 - Correa Trapezoidal",
        "code": "H220884",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 128.82,
        "currency": "USD",
        "stock": 2,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "H220884",
        "description": "Correa de transmisión John Deere código H220884. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_07.jpeg",
            "assets/img/correas/correa_08.jpeg",
            "assets/img/correas/correa_09.jpeg",
            "assets/img/correas/correa_10.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "H220884",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948562155-correa-h220884-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-H220911",
        "name": "Correa H220911 - Correa Trapezoidal",
        "code": "H220911",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 973.05,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "H220911",
        "description": "Correa de transmisión John Deere código H220911. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_10.jpeg",
            "assets/img/correas/correa_11.jpeg",
            "assets/img/correas/correa_12.jpeg",
            "assets/img/correas/correa_13.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "H220911",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948577655-correa-h220911-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-H221273",
        "name": "Correa H221273 - Correa Trapezoidal",
        "code": "H221273",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 114.22,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "H221273",
        "description": "Correa de transmisión John Deere código H221273. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_13.jpeg",
            "assets/img/correas/correa_14.jpeg",
            "assets/img/correas/correa_15.jpeg",
            "assets/img/correas/correa_16.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "H221273",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948562165-correa-h221273-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-H221498",
        "name": "Correa H221498 - Correa Trapezoidal",
        "code": "H221498",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 919.13,
        "currency": "USD",
        "stock": 3,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "H221498",
        "description": "Correa de transmisión John Deere código H221498. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_16.jpeg",
            "assets/img/correas/correa_17.jpeg",
            "assets/img/correas/correa_18.jpeg",
            "assets/img/correas/correa_19.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "H221498",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948577659-correa-h221498-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-H221731",
        "name": "Correa H221731 - Correa Trapezoidal",
        "code": "H221731",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 256.16,
        "currency": "USD",
        "stock": 2,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "H221731",
        "description": "Correa de transmisión John Deere código H221731. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_19.jpeg",
            "assets/img/correas/correa_20.jpeg",
            "assets/img/correas/correa_21.jpeg",
            "assets/img/correas/correa_22.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "H221731",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948577663-correa-h221731-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-H223230",
        "name": "Correa H223230 - Correa Trapezoidal",
        "code": "H223230",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 734.39,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "H223230",
        "description": "Correa de transmisión John Deere código H223230. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_22.jpeg",
            "assets/img/correas/correa_23.jpeg",
            "assets/img/correas/correa_24.jpeg",
            "assets/img/correas/correa_25.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "H223230",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726579484-correa-h223230-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-H229018",
        "name": "Correa H229018 - Correa Trapezoidal",
        "code": "H229018",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 1002.06,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "H229018",
        "description": "Correa de transmisión John Deere código H229018. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_25.jpeg",
            "assets/img/correas/correa_26.jpeg",
            "assets/img/correas/correa_27.jpeg",
            "assets/img/correas/correa_28.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "H229018",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726579492-correa-h229018-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-H229019",
        "name": "Correa H229019 - Correa Trapezoidal",
        "code": "H229019",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 944.59,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "H229019",
        "description": "Correa de transmisión John Deere código H229019. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_28.jpeg",
            "assets/img/correas/correa_29.jpeg",
            "assets/img/correas/correa_30.jpeg",
            "assets/img/correas/correa_31.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "H229019",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948577683-correa-h229019-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-H230909",
        "name": "Correa H230909 - Correa Trapezoidal",
        "code": "H230909",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 190.77,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "H230909",
        "description": "Correa de transmisión John Deere código H230909. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_31.jpeg",
            "assets/img/correas/correa_32.jpeg",
            "assets/img/correas/correa_33.jpeg",
            "assets/img/correas/correa_34.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "H230909",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948577691-correa-h230909-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-H236472",
        "name": "Correa H236472 - Correa Trapezoidal",
        "code": "H236472",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 231.4,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "H236472",
        "description": "Correa de transmisión John Deere código H236472. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_34.jpeg",
            "assets/img/correas/correa_35.jpeg",
            "assets/img/correas/correa_36.jpeg",
            "assets/img/correas/correa_37.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "H236472",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948562181-correa-h236472-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-H23950",
        "name": "Correa H23950 - Correa Trapezoidal",
        "code": "H23950",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 129.3,
        "currency": "USD",
        "stock": 5,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "H23950",
        "description": "Correa de transmisión John Deere código H23950. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_37.jpeg",
            "assets/img/correas/correa_38.jpeg",
            "assets/img/correas/correa_39.jpeg",
            "assets/img/correas/correa_40.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "H23950",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726579516-correa-h23950-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-H31227",
        "name": "Correa H31227 - Correa Trapezoidal",
        "code": "H31227",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 97.6,
        "currency": "USD",
        "stock": 8,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "H31227",
        "description": "Correa de transmisión John Deere código H31227. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_40.jpeg",
            "assets/img/correas/correa_01.jpeg",
            "assets/img/correas/correa_02.jpeg",
            "assets/img/correas/correa_03.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "H31227",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726579520-correa-h31227-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-H81742",
        "name": "Correa H81742 - Correa Trapezoidal",
        "code": "H81742",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 29.32,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "H81742",
        "description": "Correa de transmisión John Deere código H81742. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_03.jpeg",
            "assets/img/correas/correa_04.jpeg",
            "assets/img/correas/correa_05.jpeg",
            "assets/img/correas/correa_06.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "H81742",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726579530-correa-h81742-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-J57025",
        "name": "Correa J57025 - Correa Trapezoidal",
        "code": "J57025",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 33.23,
        "currency": "USD",
        "stock": 4,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "J57025",
        "description": "Correa de transmisión John Deere código J57025. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_06.jpeg",
            "assets/img/correas/correa_07.jpeg",
            "assets/img/correas/correa_08.jpeg",
            "assets/img/correas/correa_09.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "J57025",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726579538-correa-j57025-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-J57065",
        "name": "Correa J57065 - Correa Trapezoidal",
        "code": "J57065",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 35.13,
        "currency": "USD",
        "stock": 3,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "J57065",
        "description": "Correa de transmisión John Deere código J57065. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_09.jpeg",
            "assets/img/correas/correa_10.jpeg",
            "assets/img/correas/correa_11.jpeg",
            "assets/img/correas/correa_12.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "J57065",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948577715-correa-j57065-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-J57086",
        "name": "Correa J57086 - Correa Trapezoidal",
        "code": "J57086",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 14.01,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "J57086",
        "description": "Correa de transmisión John Deere código J57086. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_12.jpeg",
            "assets/img/correas/correa_13.jpeg",
            "assets/img/correas/correa_14.jpeg",
            "assets/img/correas/correa_15.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "J57086",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948577719-correa-j57086-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-M115776",
        "name": "Correa M115776 - Correa Trapezoidal",
        "code": "M115776",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 143.98,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "M115776",
        "description": "Correa de transmisión John Deere código M115776. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_15.jpeg",
            "assets/img/correas/correa_16.jpeg",
            "assets/img/correas/correa_17.jpeg",
            "assets/img/correas/correa_18.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "M115776",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726579576-correa-m115776-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-M119685",
        "name": "Correa M119685 - Correa Trapezoidal",
        "code": "M119685",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 198.36,
        "currency": "USD",
        "stock": 4,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "M119685",
        "description": "Correa de transmisión John Deere código M119685. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_18.jpeg",
            "assets/img/correas/correa_19.jpeg",
            "assets/img/correas/correa_20.jpeg",
            "assets/img/correas/correa_21.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "M119685",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948562251-correa-m119685-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-M119696",
        "name": "Correa M119696 - Correa Trapezoidal",
        "code": "M119696",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 118.37,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "M119696",
        "description": "Correa de transmisión John Deere código M119696. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_21.jpeg",
            "assets/img/correas/correa_22.jpeg",
            "assets/img/correas/correa_23.jpeg",
            "assets/img/correas/correa_24.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "M119696",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948577749-correa-m119696-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-M125218",
        "name": "Correa M125218 - Correa Trapezoidal",
        "code": "M125218",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 96.55,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "M125218",
        "description": "Correa de transmisión John Deere código M125218. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_24.jpeg",
            "assets/img/correas/correa_25.jpeg",
            "assets/img/correas/correa_26.jpeg",
            "assets/img/correas/correa_27.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "M125218",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948577755-correa-m125218-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-M126012",
        "name": "Correa M126012 - Correa Trapezoidal",
        "code": "M126012",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 98.6,
        "currency": "USD",
        "stock": 2,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "M126012",
        "description": "Correa de transmisión John Deere código M126012. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_27.jpeg",
            "assets/img/correas/correa_28.jpeg",
            "assets/img/correas/correa_29.jpeg",
            "assets/img/correas/correa_30.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "M126012",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948577763-correa-m126012-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-M126536",
        "name": "Correa M126536 - Correa Trapezoidal",
        "code": "M126536",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 103.98,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "M126536",
        "description": "Correa de transmisión John Deere código M126536. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_30.jpeg",
            "assets/img/correas/correa_31.jpeg",
            "assets/img/correas/correa_32.jpeg",
            "assets/img/correas/correa_33.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "M126536",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726579598-correa-m126536-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-M127524",
        "name": "Correa M127524 - Correa Trapezoidal",
        "code": "M127524",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 75.06,
        "currency": "USD",
        "stock": 2,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "M127524",
        "description": "Correa de transmisión John Deere código M127524. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_33.jpeg",
            "assets/img/correas/correa_34.jpeg",
            "assets/img/correas/correa_35.jpeg",
            "assets/img/correas/correa_36.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "M127524",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948577765-correa-m127524-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-M127926",
        "name": "Correa M127926 - Correa S Ncrona",
        "code": "M127926",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 233.47,
        "currency": "USD",
        "stock": 5,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "M127926",
        "description": "Correa de transmisión John Deere código M127926. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_36.jpeg",
            "assets/img/correas/correa_37.jpeg",
            "assets/img/correas/correa_38.jpeg",
            "assets/img/correas/correa_39.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "M127926",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726579606-correa-m127926-correa-s-ncrona-_JM"
    },
    {
        "id": "CORREA-M128733",
        "name": "Correa M128733 - Correa Trapezoidal",
        "code": "M128733",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 127.78,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "M128733",
        "description": "Correa de transmisión John Deere código M128733. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_39.jpeg",
            "assets/img/correas/correa_40.jpeg",
            "assets/img/correas/correa_01.jpeg",
            "assets/img/correas/correa_02.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "M128733",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948562279-correa-m128733-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-M143019",
        "name": "Correa M143019 - Correa Trapezoidal",
        "code": "M143019",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 82.62,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "M143019",
        "description": "Correa de transmisión John Deere código M143019. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_02.jpeg",
            "assets/img/correas/correa_03.jpeg",
            "assets/img/correas/correa_04.jpeg",
            "assets/img/correas/correa_05.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "M143019",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726579626-correa-m143019-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-M146667",
        "name": "Correa M146667 - Correa Trapezoidal",
        "code": "M146667",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 57.58,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "M146667",
        "description": "Correa de transmisión John Deere código M146667. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_05.jpeg",
            "assets/img/correas/correa_06.jpeg",
            "assets/img/correas/correa_07.jpeg",
            "assets/img/correas/correa_08.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "M146667",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948577801-correa-m146667-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-M154958",
        "name": "Correa M154958 - Correa Trapezoidal",
        "code": "M154958",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 90.31,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "M154958",
        "description": "Correa de transmisión John Deere código M154958. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_08.jpeg",
            "assets/img/correas/correa_09.jpeg",
            "assets/img/correas/correa_10.jpeg",
            "assets/img/correas/correa_11.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "M154958",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948577817-correa-m154958-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-M45862",
        "name": "Correa M45862 - Correa Trapezoidal",
        "code": "M45862",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 21.39,
        "currency": "USD",
        "stock": 2,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "M45862",
        "description": "Correa de transmisión John Deere código M45862. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_11.jpeg",
            "assets/img/correas/correa_12.jpeg",
            "assets/img/correas/correa_13.jpeg",
            "assets/img/correas/correa_14.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "M45862",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948577827-correa-m45862-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-M74747",
        "name": "Correa M74747 - Correa Trapezoidal",
        "code": "M74747",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 84.83,
        "currency": "USD",
        "stock": 3,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "M74747",
        "description": "Correa de transmisión John Deere código M74747. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_14.jpeg",
            "assets/img/correas/correa_15.jpeg",
            "assets/img/correas/correa_16.jpeg",
            "assets/img/correas/correa_17.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "M74747",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948577833-correa-m74747-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-M77988",
        "name": "Correa M77988 - Correa Trapezoidal",
        "code": "M77988",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 56.2,
        "currency": "USD",
        "stock": 4,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "M77988",
        "description": "Correa de transmisión John Deere código M77988. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_17.jpeg",
            "assets/img/correas/correa_18.jpeg",
            "assets/img/correas/correa_19.jpeg",
            "assets/img/correas/correa_20.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "M77988",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948562321-correa-m77988-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-M800347",
        "name": "Correa M800347 - Correa Trapezoidal",
        "code": "M800347",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 48.92,
        "currency": "USD",
        "stock": 2,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "M800347",
        "description": "Correa de transmisión John Deere código M800347. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_20.jpeg",
            "assets/img/correas/correa_21.jpeg",
            "assets/img/correas/correa_22.jpeg",
            "assets/img/correas/correa_23.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "M800347",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948562329-correa-m800347-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-M82461",
        "name": "Correa M82461 - Correa Trapezoidal",
        "code": "M82461",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 13.9,
        "currency": "USD",
        "stock": 3,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "M82461",
        "description": "Correa de transmisión John Deere código M82461. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_23.jpeg",
            "assets/img/correas/correa_24.jpeg",
            "assets/img/correas/correa_25.jpeg",
            "assets/img/correas/correa_26.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "M82461",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726579680-correa-m82461-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-M82462",
        "name": "Correa M82462 - Correa Trapezoidal",
        "code": "M82462",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 67.75,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "M82462",
        "description": "Correa de transmisión John Deere código M82462. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_26.jpeg",
            "assets/img/correas/correa_27.jpeg",
            "assets/img/correas/correa_28.jpeg",
            "assets/img/correas/correa_29.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "M82462",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948577847-correa-m82462-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-M83837",
        "name": "Correa M83837 - Correa Trapezoidal",
        "code": "M83837",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 87.12,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "M83837",
        "description": "Correa de transmisión John Deere código M83837. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_29.jpeg",
            "assets/img/correas/correa_30.jpeg",
            "assets/img/correas/correa_31.jpeg",
            "assets/img/correas/correa_32.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "M83837",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948577851-correa-m83837-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-M95728",
        "name": "Correa M95728 - Correa",
        "code": "M95728",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 514.08,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "M95728",
        "description": "Correa de transmisión John Deere código M95728. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_32.jpeg",
            "assets/img/correas/correa_33.jpeg",
            "assets/img/correas/correa_34.jpeg",
            "assets/img/correas/correa_35.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "M95728",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948577859-correa-m95728-correa-_JM"
    },
    {
        "id": "CORREA-N110085",
        "name": "Correa N110085 - Correa Trapezoidal",
        "code": "N110085",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 83.49,
        "currency": "USD",
        "stock": 2,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "N110085",
        "description": "Correa de transmisión John Deere código N110085. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_35.jpeg",
            "assets/img/correas/correa_36.jpeg",
            "assets/img/correas/correa_37.jpeg",
            "assets/img/correas/correa_38.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "N110085",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726579692-correa-n110085-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-P40281",
        "name": "Correa P40281 - Correa Trapezoidal",
        "code": "P40281",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 121.7,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "P40281",
        "description": "Correa de transmisión John Deere código P40281. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_38.jpeg",
            "assets/img/correas/correa_39.jpeg",
            "assets/img/correas/correa_40.jpeg",
            "assets/img/correas/correa_01.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "P40281",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726579700-correa-p40281-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-R106120",
        "name": "Correa R106120 - Correa Trapezoidal",
        "code": "R106120",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 79.67,
        "currency": "USD",
        "stock": 3,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "R106120",
        "description": "Correa de transmisión John Deere código R106120. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_01.jpeg",
            "assets/img/correas/correa_02.jpeg",
            "assets/img/correas/correa_03.jpeg",
            "assets/img/correas/correa_04.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "R106120",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948562407-correa-r106120-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-R106122",
        "name": "Correa R106122 - Correa Trapezoidal",
        "code": "R106122",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 93.24,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "R106122",
        "description": "Correa de transmisión John Deere código R106122. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_04.jpeg",
            "assets/img/correas/correa_05.jpeg",
            "assets/img/correas/correa_06.jpeg",
            "assets/img/correas/correa_07.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "R106122",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726579734-correa-r106122-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-R123449",
        "name": "Correa R123449 - Correa Trapezoidal",
        "code": "R123449",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 163.97,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "R123449",
        "description": "Correa de transmisión John Deere código R123449. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_07.jpeg",
            "assets/img/correas/correa_08.jpeg",
            "assets/img/correas/correa_09.jpeg",
            "assets/img/correas/correa_10.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "R123449",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726579744-correa-r123449-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-R123451",
        "name": "Correa R123451 - Correa Trapezoidal",
        "code": "R123451",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 86.06,
        "currency": "USD",
        "stock": 4,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "R123451",
        "description": "Correa de transmisión John Deere código R123451. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_10.jpeg",
            "assets/img/correas/correa_11.jpeg",
            "assets/img/correas/correa_12.jpeg",
            "assets/img/correas/correa_13.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "R123451",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948562423-correa-r123451-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-R135593",
        "name": "Correa R135593 - Correa Trapezoidal",
        "code": "R135593",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 156.22,
        "currency": "USD",
        "stock": 2,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "R135593",
        "description": "Correa de transmisión John Deere código R135593. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_13.jpeg",
            "assets/img/correas/correa_14.jpeg",
            "assets/img/correas/correa_15.jpeg",
            "assets/img/correas/correa_16.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "R135593",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948562429-correa-r135593-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-R135606",
        "name": "Correa R135606 - Correa Trapezoidal",
        "code": "R135606",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 53.58,
        "currency": "USD",
        "stock": 2,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "R135606",
        "description": "Correa de transmisión John Deere código R135606. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_16.jpeg",
            "assets/img/correas/correa_17.jpeg",
            "assets/img/correas/correa_18.jpeg",
            "assets/img/correas/correa_19.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "R135606",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726579768-correa-r135606-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-R135609",
        "name": "Correa R135609 - Correa Trapezoidal",
        "code": "R135609",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 81.36,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "R135609",
        "description": "Correa de transmisión John Deere código R135609. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_19.jpeg",
            "assets/img/correas/correa_20.jpeg",
            "assets/img/correas/correa_21.jpeg",
            "assets/img/correas/correa_22.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "R135609",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948562443-correa-r135609-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-R135822",
        "name": "Correa R135822 - Correa Trapezoidal",
        "code": "R135822",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 44.35,
        "currency": "USD",
        "stock": 3,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "R135822",
        "description": "Correa de transmisión John Deere código R135822. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_22.jpeg",
            "assets/img/correas/correa_23.jpeg",
            "assets/img/correas/correa_24.jpeg",
            "assets/img/correas/correa_25.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "R135822",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726579778-correa-r135822-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-R252371",
        "name": "Correa R252371 - Correa Trapezoidal",
        "code": "R252371",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 119.74,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "R252371",
        "description": "Correa de transmisión John Deere código R252371. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_25.jpeg",
            "assets/img/correas/correa_26.jpeg",
            "assets/img/correas/correa_27.jpeg",
            "assets/img/correas/correa_28.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "R252371",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948577933-correa-r252371-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-R270859",
        "name": "Correa R270859 - Correa Trapezoidal",
        "code": "R270859",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 238.77,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "R270859",
        "description": "Correa de transmisión John Deere código R270859. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_28.jpeg",
            "assets/img/correas/correa_29.jpeg",
            "assets/img/correas/correa_30.jpeg",
            "assets/img/correas/correa_31.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "R270859",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948577941-correa-r270859-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-R503312",
        "name": "Correa R503312 - Correa Trapezoidal",
        "code": "R503312",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 206.62,
        "currency": "USD",
        "stock": 3,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "R503312",
        "description": "Correa de transmisión John Deere código R503312. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_31.jpeg",
            "assets/img/correas/correa_32.jpeg",
            "assets/img/correas/correa_33.jpeg",
            "assets/img/correas/correa_34.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "R503312",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948562475-correa-r503312-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-R503505",
        "name": "Correa R503505 - Correa Trapezoidal",
        "code": "R503505",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 167.83,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "R503505",
        "description": "Correa de transmisión John Deere código R503505. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_34.jpeg",
            "assets/img/correas/correa_35.jpeg",
            "assets/img/correas/correa_36.jpeg",
            "assets/img/correas/correa_37.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "R503505",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948562483-correa-r503505-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-R515127",
        "name": "Correa R515127 - Correa Trapezoidal",
        "code": "R515127",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 213.12,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "R515127",
        "description": "Correa de transmisión John Deere código R515127. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_37.jpeg",
            "assets/img/correas/correa_38.jpeg",
            "assets/img/correas/correa_39.jpeg",
            "assets/img/correas/correa_40.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "R515127",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948562489-correa-r515127-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-R71603",
        "name": "Correa R71603 - Correa Trapezoidal",
        "code": "R71603",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 23.51,
        "currency": "USD",
        "stock": 3,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "R71603",
        "description": "Correa de transmisión John Deere código R71603. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_40.jpeg",
            "assets/img/correas/correa_01.jpeg",
            "assets/img/correas/correa_02.jpeg",
            "assets/img/correas/correa_03.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "R71603",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948577963-correa-r71603-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-R73189",
        "name": "Correa R73189 - Correa Trapezoidal",
        "code": "R73189",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 15.74,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "R73189",
        "description": "Correa de transmisión John Deere código R73189. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_03.jpeg",
            "assets/img/correas/correa_04.jpeg",
            "assets/img/correas/correa_05.jpeg",
            "assets/img/correas/correa_06.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "R73189",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726579822-correa-r73189-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-R73784",
        "name": "Correa R73784 - Correa Trapezoidal",
        "code": "R73784",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 43.09,
        "currency": "USD",
        "stock": 2,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "R73784",
        "description": "Correa de transmisión John Deere código R73784. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_06.jpeg",
            "assets/img/correas/correa_07.jpeg",
            "assets/img/correas/correa_08.jpeg",
            "assets/img/correas/correa_09.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "R73784",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726579824-correa-r73784-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-S17044",
        "name": "Correa S17044 - Correa Trapezoidal",
        "code": "S17044",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 9.01,
        "currency": "USD",
        "stock": 3,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "S17044",
        "description": "Correa de transmisión John Deere código S17044. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_09.jpeg",
            "assets/img/correas/correa_10.jpeg",
            "assets/img/correas/correa_11.jpeg",
            "assets/img/correas/correa_12.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "S17044",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948577977-correa-s17044-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-SA00601",
        "name": "Correa SA00601 - Correa Trapezoidal",
        "code": "SA00601",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 84.31,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "SA00601",
        "description": "Correa de transmisión John Deere código SA00601. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_12.jpeg",
            "assets/img/correas/correa_13.jpeg",
            "assets/img/correas/correa_14.jpeg",
            "assets/img/correas/correa_15.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "SA00601",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948562505-correa-sa00601-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-SA02101",
        "name": "Correa SA02101 - Correa Trapezoidal",
        "code": "SA02101",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 29.33,
        "currency": "USD",
        "stock": 3,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "SA02101",
        "description": "Correa de transmisión John Deere código SA02101. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_15.jpeg",
            "assets/img/correas/correa_16.jpeg",
            "assets/img/correas/correa_17.jpeg",
            "assets/img/correas/correa_18.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "SA02101",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948577987-correa-sa02101-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-TY26395",
        "name": "Correa TY26395 - Conserv P Correas En",
        "code": "TY26395",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 16.65,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "TY26395",
        "description": "Correa de transmisión John Deere código TY26395. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_18.jpeg",
            "assets/img/correas/correa_19.jpeg",
            "assets/img/correas/correa_20.jpeg",
            "assets/img/correas/correa_21.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "TY26395",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948562517-correa-ty26395-conserv-p-correas-en-_JM"
    },
    {
        "id": "CORREA-Z21501",
        "name": "Correa Z21501 - Correa Trapezoidal",
        "code": "Z21501",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 381.02,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Z21501",
        "description": "Correa de transmisión John Deere código Z21501. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_21.jpeg",
            "assets/img/correas/correa_22.jpeg",
            "assets/img/correas/correa_23.jpeg",
            "assets/img/correas/correa_24.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "Z21501",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726579846-correa-z21501-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-Z30130",
        "name": "Correa Z30130 - Correa",
        "code": "Z30130",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 1657.89,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Z30130",
        "description": "Correa de transmisión John Deere código Z30130. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_24.jpeg",
            "assets/img/correas/correa_25.jpeg",
            "assets/img/correas/correa_26.jpeg",
            "assets/img/correas/correa_27.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "Z30130",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726579856-correa-z30130-correa-_JM"
    },
    {
        "id": "CORREA-Z32190",
        "name": "Correa Z32190 - Correa Trapezoidal",
        "code": "Z32190",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 15.22,
        "currency": "USD",
        "stock": 3,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Z32190",
        "description": "Correa de transmisión John Deere código Z32190. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_27.jpeg",
            "assets/img/correas/correa_28.jpeg",
            "assets/img/correas/correa_29.jpeg",
            "assets/img/correas/correa_30.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "Z32190",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948578021-correa-z32190-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-Z33605",
        "name": "Correa Z33605 - Correa",
        "code": "Z33605",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 493.37,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Z33605",
        "description": "Correa de transmisión John Deere código Z33605. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_30.jpeg",
            "assets/img/correas/correa_31.jpeg",
            "assets/img/correas/correa_32.jpeg",
            "assets/img/correas/correa_33.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "Z33605",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948562535-correa-z33605-correa-_JM"
    },
    {
        "id": "CORREA-Z33790",
        "name": "Correa Z33790 - Correa Trapezoidal",
        "code": "Z33790",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 527.66,
        "currency": "USD",
        "stock": 2,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Z33790",
        "description": "Correa de transmisión John Deere código Z33790. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_33.jpeg",
            "assets/img/correas/correa_34.jpeg",
            "assets/img/correas/correa_35.jpeg",
            "assets/img/correas/correa_36.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "Z33790",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948562545-correa-z33790-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-Z34099",
        "name": "Correa Z34099 - Correa Trapezoidal",
        "code": "Z34099",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 814.8,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Z34099",
        "description": "Correa de transmisión John Deere código Z34099. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_36.jpeg",
            "assets/img/correas/correa_37.jpeg",
            "assets/img/correas/correa_38.jpeg",
            "assets/img/correas/correa_39.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "Z34099",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948578033-correa-z34099-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-Z34786",
        "name": "Correa Z34786 - Correa Trapezoidal",
        "code": "Z34786",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 56.62,
        "currency": "USD",
        "stock": 2,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Z34786",
        "description": "Correa de transmisión John Deere código Z34786. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_39.jpeg",
            "assets/img/correas/correa_40.jpeg",
            "assets/img/correas/correa_01.jpeg",
            "assets/img/correas/correa_02.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "Z34786",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948562553-correa-z34786-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-Z34828",
        "name": "Correa Z34828 - Correa Trapezoidal",
        "code": "Z34828",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 41.61,
        "currency": "USD",
        "stock": 3,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Z34828",
        "description": "Correa de transmisión John Deere código Z34828. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_02.jpeg",
            "assets/img/correas/correa_03.jpeg",
            "assets/img/correas/correa_04.jpeg",
            "assets/img/correas/correa_05.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "Z34828",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948578043-correa-z34828-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-Z38186",
        "name": "Correa Z38186 - Correa Trapezoidal",
        "code": "Z38186",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 262.98,
        "currency": "USD",
        "stock": 4,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Z38186",
        "description": "Correa de transmisión John Deere código Z38186. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_05.jpeg",
            "assets/img/correas/correa_06.jpeg",
            "assets/img/correas/correa_07.jpeg",
            "assets/img/correas/correa_08.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "Z38186",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726579884-correa-z38186-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-Z41178",
        "name": "Correa Z41178 - Correa Trapezoidal",
        "code": "Z41178",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 36.95,
        "currency": "USD",
        "stock": 10,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Z41178",
        "description": "Correa de transmisión John Deere código Z41178. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_08.jpeg",
            "assets/img/correas/correa_09.jpeg",
            "assets/img/correas/correa_10.jpeg",
            "assets/img/correas/correa_11.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "Z41178",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726579892-correa-z41178-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-Z46463",
        "name": "Correa Z46463 - Correa Trapezoidal",
        "code": "Z46463",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 687.9,
        "currency": "USD",
        "stock": 2,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Z46463",
        "description": "Correa de transmisión John Deere código Z46463. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_11.jpeg",
            "assets/img/correas/correa_12.jpeg",
            "assets/img/correas/correa_13.jpeg",
            "assets/img/correas/correa_14.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "Z46463",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948562573-correa-z46463-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-Z46709",
        "name": "Correa Z46709 - Correa Trapezoidal",
        "code": "Z46709",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 275.93,
        "currency": "USD",
        "stock": 2,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Z46709",
        "description": "Correa de transmisión John Deere código Z46709. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_14.jpeg",
            "assets/img/correas/correa_15.jpeg",
            "assets/img/correas/correa_16.jpeg",
            "assets/img/correas/correa_17.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "Z46709",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726579904-correa-z46709-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-Z53288",
        "name": "Correa Z53288 - Correa Trapezoidal",
        "code": "Z53288",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 649.75,
        "currency": "USD",
        "stock": 2,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Z53288",
        "description": "Correa de transmisión John Deere código Z53288. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_17.jpeg",
            "assets/img/correas/correa_18.jpeg",
            "assets/img/correas/correa_19.jpeg",
            "assets/img/correas/correa_20.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "Z53288",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948562581-correa-z53288-correa-trapezoidal-_JM"
    },
    {
        "id": "CORREA-Z43890",
        "name": "Correa Z43890 - Correa",
        "code": "Z43890",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 246.11,
        "currency": "USD",
        "stock": 2,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Z43890",
        "description": "Correa de transmisión John Deere código Z43890. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_20.jpeg",
            "assets/img/correas/correa_21.jpeg",
            "assets/img/correas/correa_22.jpeg",
            "assets/img/correas/correa_23.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "Z43890",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948562615-correa-z43890-correa-_JM"
    },
    {
        "id": "CORREA-AT11535",
        "name": "Correa AT11535 - Correa",
        "code": "AT11535",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 3.63,
        "currency": "USD",
        "stock": 3,
        "condition": "Nuevo",
        "brand": "Genérico",
        "model": "AT11535",
        "description": "Correa de transmisión Genérico código AT11535. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_23.jpeg",
            "assets/img/correas/correa_24.jpeg",
            "assets/img/correas/correa_25.jpeg",
            "assets/img/correas/correa_26.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "AT11535",
            "Marca": "Genérico"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-3726579932-correa-at11535-correa-_JM"
    },
    {
        "id": "CORREA-CQ34345",
        "name": "Correa CQ34345 - Correa",
        "code": "CQ34345",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 128.08,
        "currency": "USD",
        "stock": 3,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "CQ34345",
        "description": "Correa de transmisión John Deere código CQ34345. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_26.jpeg",
            "assets/img/correas/correa_27.jpeg",
            "assets/img/correas/correa_28.jpeg",
            "assets/img/correas/correa_29.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "CQ34345",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948578127-correa-cq34345-correa-_JM"
    },
    {
        "id": "CORREA-DQ23754",
        "name": "Correa DQ23754 - Correa",
        "code": "DQ23754",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 19.58,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "DQ23754",
        "description": "Correa de transmisión John Deere código DQ23754. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_29.jpeg",
            "assets/img/correas/correa_30.jpeg",
            "assets/img/correas/correa_31.jpeg",
            "assets/img/correas/correa_32.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "DQ23754",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948562661-correa-dq23754-correa-_JM"
    },
    {
        "id": "CORREA-H125380",
        "name": "Correa H125380 - Correa",
        "code": "H125380",
        "category": "Repuestos",
        "subcategory": "Correas",
        "price": 192.0,
        "currency": "USD",
        "stock": 1,
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "H125380",
        "description": "Correa de transmisión John Deere código H125380. Repuesto original de alta durabilidad para maquinaria agrícola.",
        "images": [
            "assets/img/correas/correa_32.jpeg",
            "assets/img/correas/correa_33.jpeg",
            "assets/img/correas/correa_34.jpeg",
            "assets/img/correas/correa_35.jpeg"
        ],
        "specs": {
            "Tipo": "Correa de transmisión",
            "Código Original": "H125380",
            "Marca": "John Deere"
        },
        "featured": false,
        "mercadolibreLink": "http://articulo.mercadolibre.com.ar/MLA-1948578141-correa-h125380-correa-_JM"
    },
    {
        "id": "bertini_100001",
        "name": "Repuesto Bertini Maza De Marcador",
        "code": "100001",
        "desc": "Repuesto original Bertini código 100001: Maza De Marcador. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 35.18,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "100001",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "100001",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_100002",
        "name": "Repuesto Bertini Porta Reten Del Marcador",
        "code": "100002",
        "desc": "Repuesto original Bertini código 100002: Porta Reten Del Marcador. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 14.5,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "100002",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "100002",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_100005",
        "name": "Repuesto Bertini Maza Mando Alfalfero",
        "code": "100005",
        "desc": "Repuesto original Bertini código 100005: Maza Mando Alfalfero. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 14.01,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "100005",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "100005",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_100014",
        "name": "Repuesto Bertini Registro De Profundidad",
        "code": "100014",
        "desc": "Repuesto original Bertini código 100014: Registro De Profundidad. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 9.16,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "100014",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "100014",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_100017",
        "name": "Repuesto Bertini Media Maza De Cuchilla",
        "code": "100017",
        "desc": "Repuesto original Bertini código 100017: Media Maza De Cuchilla. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 16.3,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "100017",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "100017",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_100020",
        "name": "Repuesto Bertini Tapa Cilindro Marcador",
        "code": "100020",
        "desc": "Repuesto original Bertini código 100020: Tapa Cilindro Marcador. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 18.78,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "100020",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "100020",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_100021",
        "name": "Repuesto Bertini Buje Soporte",
        "code": "100021",
        "desc": "Repuesto original Bertini código 100021: Buje Soporte. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 11.55,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "100021",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "100021",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_100022",
        "name": "Repuesto Bertini Base De Motor",
        "code": "100022",
        "desc": "Repuesto original Bertini código 100022: Base De Motor. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 102.12,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "100022",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "100022",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_100025",
        "name": "Repuesto Bertini Carcaza Dosificador Alfalfa Fundicion",
        "code": "100025",
        "desc": "Repuesto original Bertini código 100025: Carcaza Dosificador Alfalfa Fundicion. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 18.11,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "100025",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "100025",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_100027",
        "name": "Repuesto Bertini Maza Del Ventilador",
        "code": "100027",
        "desc": "Repuesto original Bertini código 100027: Maza Del Ventilador. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 57.61,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "100027",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "100027",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_100029",
        "name": "Repuesto Bertini Tope Mediano",
        "code": "100029",
        "desc": "Repuesto original Bertini código 100029: Tope Mediano. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 16.02,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "100029",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "100029",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_100030",
        "name": "Repuesto Bertini Tope Grueso",
        "code": "100030",
        "desc": "Repuesto original Bertini código 100030: Tope Grueso. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 18.13,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "100030",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "100030",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_100034",
        "name": "Repuesto Bertini Maza De Mando",
        "code": "100034",
        "desc": "Repuesto original Bertini código 100034: Maza De Mando. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 14.01,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "100034",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "100034",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_100035",
        "name": "Repuesto Bertini Maza Eje Removedor",
        "code": "100035",
        "desc": "Repuesto original Bertini código 100035: Maza Eje Removedor. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 14.01,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "100035",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "100035",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_100036",
        "name": "Repuesto Bertini Buje Entrada Y Salida (51006)",
        "code": "100036",
        "desc": "Repuesto original Bertini código 100036: Buje Entrada Y Salida (51006). Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 21.26,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "100036",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "100036",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_101010",
        "name": "Repuesto Bertini Embrague Del Acople Con Alemite",
        "code": "101010",
        "desc": "Repuesto original Bertini código 101010: Embrague Del Acople Con Alemite. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 10.52,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "101010",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "101010",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_101011",
        "name": "Repuesto Bertini Trinquete Derecho",
        "code": "101011",
        "desc": "Repuesto original Bertini código 101011: Trinquete Derecho. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 14.15,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "101011",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "101011",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_101014",
        "name": "Repuesto Bertini Tensor De Lanza",
        "code": "101014",
        "desc": "Repuesto original Bertini código 101014: Tensor De Lanza. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 10.32,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "101014",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "101014",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_101016",
        "name": "Repuesto Bertini Trinquete Izquierdo Caja Lado Izquierdo",
        "code": "101016",
        "desc": "Repuesto original Bertini código 101016: Trinquete Izquierdo Caja Lado Izquierdo. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 16.75,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "101016",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "101016",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_101017",
        "name": "Repuesto Bertini Trinquete Derecho Caja Lado Derecho",
        "code": "101017",
        "desc": "Repuesto original Bertini código 101017: Trinquete Derecho Caja Lado Derecho. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 16.75,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "101017",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "101017",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_101023",
        "name": "Repuesto Bertini Soporte De Vastago (N. Mod.)",
        "code": "101023",
        "desc": "Repuesto original Bertini código 101023: Soporte De Vastago (N. Mod.). Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 30.96,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "101023",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "101023",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_10000",
        "name": "Repuesto Bertini Enganche Al Tractor",
        "code": "10000",
        "desc": "Repuesto original Bertini código 10000: Enganche Al Tractor. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 90.35,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "10000",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "10000",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_101027",
        "name": "Repuesto Bertini Terminal De Resorte Fertilizacion Entre Lineas",
        "code": "101027",
        "desc": "Repuesto original Bertini código 101027: Terminal De Resorte Fertilizacion Entre Lineas. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 11.15,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "101027",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "101027",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_101031",
        "name": "Repuesto Bertini Soporte Vastago",
        "code": "101031",
        "desc": "Repuesto original Bertini código 101031: Soporte Vastago. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 34.06,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "101031",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "101031",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_101032",
        "name": "Repuesto Bertini Soporte Vastago Siembra Directa",
        "code": "101032",
        "desc": "Repuesto original Bertini código 101032: Soporte Vastago Siembra Directa. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 34.06,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "101032",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "101032",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_102031",
        "name": "Repuesto Bertini Soporte Eje Brazo Discos",
        "code": "102031",
        "desc": "Repuesto original Bertini código 102031: Soporte Eje Brazo Discos. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 9.57,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "102031",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "102031",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_102075",
        "name": "Repuesto Bertini Refuerzo Central Marcador",
        "code": "102075",
        "desc": "Repuesto original Bertini código 102075: Refuerzo Central Marcador. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 36.23,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "102075",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "102075",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_102086",
        "name": "Repuesto Bertini Soporte Eje De Caja",
        "code": "102086",
        "desc": "Repuesto original Bertini código 102086: Soporte Eje De Caja. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 16.4,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "102086",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "102086",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_102111",
        "name": "Repuesto Bertini Engranaje Removedor Semillas",
        "code": "102111",
        "desc": "Repuesto original Bertini código 102111: Engranaje Removedor Semillas. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 42.03,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "102111",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "102111",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_102113",
        "name": "Repuesto Bertini Corona De Mando",
        "code": "102113",
        "desc": "Repuesto original Bertini código 102113: Corona De Mando. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 13.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "102113",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "102113",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_102115",
        "name": "Repuesto Bertini Engranaje De Mando",
        "code": "102115",
        "desc": "Repuesto original Bertini código 102115: Engranaje De Mando. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 41.97,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "102115",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "102115",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_102122",
        "name": "Repuesto Bertini Engranaje Z 22",
        "code": "102122",
        "desc": "Repuesto original Bertini código 102122: Engranaje Z 22. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 9.83,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "102122",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "102122",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_102160",
        "name": "Repuesto Bertini Placa De Plataforma",
        "code": "102160",
        "desc": "Repuesto original Bertini código 102160: Placa De Plataforma. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 59.32,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "102160",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "102160",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_102177",
        "name": "Repuesto Bertini Tubo Delantero",
        "code": "102177",
        "desc": "Repuesto original Bertini código 102177: Tubo Delantero. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 510.76,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "102177",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "102177",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_102183",
        "name": "Repuesto Bertini Tubo De Bisagra",
        "code": "102183",
        "desc": "Repuesto original Bertini código 102183: Tubo De Bisagra. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 16.48,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "102183",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "102183",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_102208",
        "name": "Repuesto Bertini Tope De Resortes",
        "code": "102208",
        "desc": "Repuesto original Bertini código 102208: Tope De Resortes. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 205.47,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "102208",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "102208",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_102217",
        "name": "Repuesto Bertini Espesor",
        "code": "102217",
        "desc": "Repuesto original Bertini código 102217: Espesor. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 9.83,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "102217",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "102217",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_102249",
        "name": "Repuesto Bertini Soporte De Bomba",
        "code": "102249",
        "desc": "Repuesto original Bertini código 102249: Soporte De Bomba. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 29.66,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "102249",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "102249",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_102264",
        "name": "Repuesto Bertini \"Engranaje Z 22 P/ Cadena 1/2\"\"",
        "code": "102264",
        "desc": "Repuesto original Bertini código 102264: \"Engranaje Z 22 P/ Cadena 1/2\"\". Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 16.75,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "102264",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "102264",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_10000",
        "name": "Repuesto Bertini Bisagra Lateral",
        "code": "10000",
        "desc": "Repuesto original Bertini código 10000: Bisagra Lateral. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 91.47,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "10000",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "10000",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_102281",
        "name": "Repuesto Bertini Soporte Central Tolva  Fertilizante Entr",
        "code": "102281",
        "desc": "Repuesto original Bertini código 102281: Soporte Central Tolva  Fertilizante Entr. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 10.05,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "102281",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "102281",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_102282",
        "name": "Repuesto Bertini Soporte Central Tolva Fertilizante Entre",
        "code": "102282",
        "desc": "Repuesto original Bertini código 102282: Soporte Central Tolva Fertilizante Entre. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 10.05,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "102282",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "102282",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_102366",
        "name": "Repuesto Bertini Rueda Lateral Interior (Media Ancha)",
        "code": "102366",
        "desc": "Repuesto original Bertini código 102366: Rueda Lateral Interior (Media Ancha). Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 25.25,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "102366",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "102366",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_102367",
        "name": "Repuesto Bertini Rueda Lateral Exterior (Media Fina)",
        "code": "102367",
        "desc": "Repuesto original Bertini código 102367: Rueda Lateral Exterior (Media Fina). Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 20.15,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "102367",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "102367",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_102368",
        "name": "Repuesto Bertini Llanta De Conformadora",
        "code": "102368",
        "desc": "Repuesto original Bertini código 102368: Llanta De Conformadora. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 29.15,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "102368",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "102368",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_102369",
        "name": "Repuesto Bertini Llanta Rueda Conformadora",
        "code": "102369",
        "desc": "Repuesto original Bertini código 102369: Llanta Rueda Conformadora. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 26.5,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "102369",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "102369",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_102372",
        "name": "Repuesto Bertini Maza De Ruedas Laterales",
        "code": "102372",
        "desc": "Repuesto original Bertini código 102372: Maza De Ruedas Laterales. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 34.36,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "102372",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "102372",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_102415",
        "name": "Repuesto Bertini Escuadra Sop. Eje Caja Y Tensor Derecho/",
        "code": "102415",
        "desc": "Repuesto original Bertini código 102415: Escuadra Sop. Eje Caja Y Tensor Derecho/. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 16.96,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "102415",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "102415",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_102427",
        "name": "Repuesto Bertini Llanta De Rueda Recta Izq.",
        "code": "102427",
        "desc": "Repuesto original Bertini código 102427: Llanta De Rueda Recta Izq.. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 40.59,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "102427",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "102427",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_102428",
        "name": "Repuesto Bertini Llanta De Rueda Recta Derecha",
        "code": "102428",
        "desc": "Repuesto original Bertini código 102428: Llanta De Rueda Recta Derecha. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 40.59,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "102428",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "102428",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_102430",
        "name": "Repuesto Bertini Maza Doble Disco",
        "code": "102430",
        "desc": "Repuesto original Bertini código 102430: Maza Doble Disco. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 40.66,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "102430",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "102430",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_102435",
        "name": "Repuesto Bertini Soporte Tensor Cadena Alfalfero Izquierd",
        "code": "102435",
        "desc": "Repuesto original Bertini código 102435: Soporte Tensor Cadena Alfalfero Izquierd. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 11.55,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "102435",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "102435",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_102444",
        "name": "Repuesto Bertini Rueda Lateral Ciega Para Cubierta Ancha",
        "code": "102444",
        "desc": "Repuesto original Bertini código 102444: Rueda Lateral Ciega Para Cubierta Ancha. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 22.96,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "102444",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "102444",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_102521",
        "name": "Repuesto Bertini Engranaje De Mando_Kit Grano Grueso",
        "code": "102521",
        "desc": "Repuesto original Bertini código 102521: Engranaje De Mando_Kit Grano Grueso. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 19.48,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "102521",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "102521",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_102522",
        "name": "Repuesto Bertini Soporte Engranaje Doble_Kit Grano Grueso",
        "code": "102522",
        "desc": "Repuesto original Bertini código 102522: Soporte Engranaje Doble_Kit Grano Grueso. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 59.66,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "102522",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "102522",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_102529",
        "name": "Repuesto Bertini Media Llanta Interior Trasera",
        "code": "102529",
        "desc": "Repuesto original Bertini código 102529: Media Llanta Interior Trasera. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 26.5,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "102529",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "102529",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_102530",
        "name": "Repuesto Bertini Media Llanta Plana Trasera",
        "code": "102530",
        "desc": "Repuesto original Bertini código 102530: Media Llanta Plana Trasera. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 26.5,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "102530",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "102530",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_102569",
        "name": "Repuesto Bertini Componente De Telescopico",
        "code": "102569",
        "desc": "Repuesto original Bertini código 102569: Componente De Telescopico. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 25.84,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "102569",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "102569",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_102637",
        "name": "Repuesto Bertini Refuerzo De Costilla Derecha",
        "code": "102637",
        "desc": "Repuesto original Bertini código 102637: Refuerzo De Costilla Derecha. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 66.18,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "102637",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "102637",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_102638",
        "name": "Repuesto Bertini Refuerzo De Costilla Izquierda",
        "code": "102638",
        "desc": "Repuesto original Bertini código 102638: Refuerzo De Costilla Izquierda. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 66.18,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "102638",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "102638",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_102648",
        "name": "Repuesto Bertini Maza Rueda Apisonadora",
        "code": "102648",
        "desc": "Repuesto original Bertini código 102648: Maza Rueda Apisonadora. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 12.22,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "102648",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "102648",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_102648",
        "name": "Repuesto Bertini Guardapolvo Para Maza",
        "code": "102648",
        "desc": "Repuesto original Bertini código 102648: Guardapolvo Para Maza. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 91.81,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "102648",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "102648",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_102771",
        "name": "Repuesto Bertini Llanta Trasera En V Embutida",
        "code": "102771",
        "desc": "Repuesto original Bertini código 102771: Llanta Trasera En V Embutida. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 29.15,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "102771",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "102771",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_102772",
        "name": "Repuesto Bertini Llanta Trasera En V",
        "code": "102772",
        "desc": "Repuesto original Bertini código 102772: Llanta Trasera En V. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 26.5,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "102772",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "102772",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_102795",
        "name": "Repuesto Bertini Soporte Derecho De Resorte Amortiguador",
        "code": "102795",
        "desc": "Repuesto original Bertini código 102795: Soporte Derecho De Resorte Amortiguador. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 9.62,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "102795",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "102795",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_102797",
        "name": "Repuesto Bertini Soporte Izquierdo De Resorte Amortiguado",
        "code": "102797",
        "desc": "Repuesto original Bertini código 102797: Soporte Izquierdo De Resorte Amortiguado. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 9.62,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "102797",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "102797",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_103007",
        "name": "Repuesto Bertini Eje De Entrada Caja De 81 Cambios",
        "code": "103007",
        "desc": "Repuesto original Bertini código 103007: Eje De Entrada Caja De 81 Cambios. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 46.13,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "103007",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "103007",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_103009",
        "name": "Repuesto Bertini Perno Superior Del Cilindro",
        "code": "103009",
        "desc": "Repuesto original Bertini código 103009: Perno Superior Del Cilindro. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 10.05,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "103009",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "103009",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_103010",
        "name": "Repuesto Bertini Barra Dosificadora De Abono 10.000",
        "code": "103010",
        "desc": "Repuesto original Bertini código 103010: Barra Dosificadora De Abono 10.000. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 62.81,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "103010",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "103010",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_103011",
        "name": "Repuesto Bertini Eje De Transmision Alfalfero",
        "code": "103011",
        "desc": "Repuesto original Bertini código 103011: Eje De Transmision Alfalfero. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 28.43,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "103011",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "103011",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_103019",
        "name": "Repuesto Bertini Manguito Acople Caja Alfalfero",
        "code": "103019",
        "desc": "Repuesto original Bertini código 103019: Manguito Acople Caja Alfalfero. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 9.9,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "103019",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "103019",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_103021",
        "name": "Repuesto Bertini Eje Pivote De Brazos",
        "code": "103021",
        "desc": "Repuesto original Bertini código 103021: Eje Pivote De Brazos. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 39.71,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "103021",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "103021",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_103034",
        "name": "Repuesto Bertini Eje Largo Brazo De Discos",
        "code": "103034",
        "desc": "Repuesto original Bertini código 103034: Eje Largo Brazo De Discos. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 32.61,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "103034",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "103034",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_103035",
        "name": "Repuesto Bertini Eje Corto Brazo De Discos",
        "code": "103035",
        "desc": "Repuesto original Bertini código 103035: Eje Corto Brazo De Discos. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 31.16,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "103035",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "103035",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_103036",
        "name": "Repuesto Bertini Eje Doble Disco",
        "code": "103036",
        "desc": "Repuesto original Bertini código 103036: Eje Doble Disco. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 19.61,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "103036",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "103036",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_103040",
        "name": "Repuesto Bertini Eje De Cuchilla",
        "code": "103040",
        "desc": "Repuesto original Bertini código 103040: Eje De Cuchilla. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 18.76,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "103040",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "103040",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_103055",
        "name": "Repuesto Bertini Buje Marcador",
        "code": "103055",
        "desc": "Repuesto original Bertini código 103055: Buje Marcador. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 18.19,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "103055",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "103055",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_103061",
        "name": "Repuesto Bertini Buje Pivote Largo",
        "code": "103061",
        "desc": "Repuesto original Bertini código 103061: Buje Pivote Largo. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 12.1,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "103061",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "103061",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_103063",
        "name": "Repuesto Bertini Buje Soporte Cilindro",
        "code": "103063",
        "desc": "Repuesto original Bertini código 103063: Buje Soporte Cilindro. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 10.18,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "103063",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "103063",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_103064",
        "name": "Repuesto Bertini Buje Soporte Cilindro",
        "code": "103064",
        "desc": "Repuesto original Bertini código 103064: Buje Soporte Cilindro. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 11.62,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "103064",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "103064",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_103068",
        "name": "Repuesto Bertini Porta Corona",
        "code": "103068",
        "desc": "Repuesto original Bertini código 103068: Porta Corona. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 10.06,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "103068",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "103068",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_103069",
        "name": "Repuesto Bertini Perno Estriado Interior Z4",
        "code": "103069",
        "desc": "Repuesto original Bertini código 103069: Perno Estriado Interior Z4. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 11.67,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "103069",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "103069",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_103073",
        "name": "Repuesto Bertini Punta De Eje",
        "code": "103073",
        "desc": "Repuesto original Bertini código 103073: Punta De Eje. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 248.26,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "103073",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "103073",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_103076",
        "name": "Repuesto Bertini Buje Pivote",
        "code": "103076",
        "desc": "Repuesto original Bertini código 103076: Buje Pivote. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 66.71,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "103076",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "103076",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_103086",
        "name": "Repuesto Bertini Camisa Cilindro",
        "code": "103086",
        "desc": "Repuesto original Bertini código 103086: Camisa Cilindro. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 69.44,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "103086",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "103086",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_103093",
        "name": "Repuesto Bertini Brazo Del Arco Doble Disco Plantador",
        "code": "103093",
        "desc": "Repuesto original Bertini código 103093: Brazo Del Arco Doble Disco Plantador. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 26.18,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "103093",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "103093",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_103112",
        "name": "Repuesto Bertini Eje Mando Removedor Fertilizante",
        "code": "103112",
        "desc": "Repuesto original Bertini código 103112: Eje Mando Removedor Fertilizante. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 14.15,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "103112",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "103112",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_103115",
        "name": "Repuesto Bertini V Stago Cilindro Marcador",
        "code": "103115",
        "desc": "Repuesto original Bertini código 103115: V Stago Cilindro Marcador. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 39.51,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "103115",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "103115",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_103116",
        "name": "Repuesto Bertini Excentrico De Lanza",
        "code": "103116",
        "desc": "Repuesto original Bertini código 103116: Excentrico De Lanza. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 24.75,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "103116",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "103116",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_103118",
        "name": "Repuesto Bertini Biela Derecha",
        "code": "103118",
        "desc": "Repuesto original Bertini código 103118: Biela Derecha. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 18.93,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "103118",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "103118",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_103119",
        "name": "Repuesto Bertini Biela Izquierda",
        "code": "103119",
        "desc": "Repuesto original Bertini código 103119: Biela Izquierda. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 18.93,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "103119",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "103119",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_103126",
        "name": "Repuesto Bertini Rienda Larga",
        "code": "103126",
        "desc": "Repuesto original Bertini código 103126: Rienda Larga. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 29.66,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "103126",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "103126",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_103127",
        "name": "Repuesto Bertini Rienda Corta",
        "code": "103127",
        "desc": "Repuesto original Bertini código 103127: Rienda Corta. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 21.13,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "103127",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "103127",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_103133",
        "name": "Repuesto Bertini Eje Del Ventilador",
        "code": "103133",
        "desc": "Repuesto original Bertini código 103133: Eje Del Ventilador. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 16.68,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "103133",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "103133",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_103141",
        "name": "Repuesto Bertini Eje Largo De Mando Siembra",
        "code": "103141",
        "desc": "Repuesto original Bertini código 103141: Eje Largo De Mando Siembra. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 19.41,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "103141",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "103141",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_103143",
        "name": "Repuesto Bertini Eje Corto De Mando Siembra",
        "code": "103143",
        "desc": "Repuesto original Bertini código 103143: Eje Corto De Mando Siembra. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 18.11,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "103143",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "103143",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_103186",
        "name": "Repuesto Bertini Eje Izquierdo Dosificador",
        "code": "103186",
        "desc": "Repuesto original Bertini código 103186: Eje Izquierdo Dosificador. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 14.35,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "103186",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "103186",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_103187",
        "name": "Repuesto Bertini Eje Derecho Dosificador",
        "code": "103187",
        "desc": "Repuesto original Bertini código 103187: Eje Derecho Dosificador. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 12.85,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "103187",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "103187",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_103241",
        "name": "Repuesto Bertini Eje Derecho Rueda Tras. En V",
        "code": "103241",
        "desc": "Repuesto original Bertini código 103241: Eje Derecho Rueda Tras. En V. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 14.01,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "103241",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "103241",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_103246",
        "name": "Repuesto Bertini Eje Izquierdo Rueda Tras. En V",
        "code": "103246",
        "desc": "Repuesto original Bertini código 103246: Eje Izquierdo Rueda Tras. En V. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 14.01,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "103246",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "103246",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_103256",
        "name": "Repuesto Bertini Eje Removedor Fertilizante",
        "code": "103256",
        "desc": "Repuesto original Bertini código 103256: Eje Removedor Fertilizante. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 62.81,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "103256",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "103256",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_103257",
        "name": "Repuesto Bertini Eje Alimentador De Siembra",
        "code": "103257",
        "desc": "Repuesto original Bertini código 103257: Eje Alimentador De Siembra. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 62.81,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "103257",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "103257",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_103268",
        "name": "Repuesto Bertini Eje Salida Caja 81 Cambios Sin Safe",
        "code": "103268",
        "desc": "Repuesto original Bertini código 103268: Eje Salida Caja 81 Cambios Sin Safe. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 54.62,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "103268",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "103268",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_103277",
        "name": "Repuesto Bertini Barra De Mando Kit De Grano Grueso 10.00",
        "code": "103277",
        "desc": "Repuesto original Bertini código 103277: Barra De Mando Kit De Grano Grueso 10.00. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 62.81,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "103277",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "103277",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_103286",
        "name": "Repuesto Bertini Barra Mando Corto Cajon Alfalfero",
        "code": "103286",
        "desc": "Repuesto original Bertini código 103286: Barra Mando Corto Cajon Alfalfero. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 14.35,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "103286",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "103286",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_103287",
        "name": "Repuesto Bertini Barra Mando Largo Cajon Alfalfero",
        "code": "103287",
        "desc": "Repuesto original Bertini código 103287: Barra Mando Largo Cajon Alfalfero. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 15.58,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "103287",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "103287",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_103291",
        "name": "Repuesto Bertini Vastago Recto S/Soldar Templado Y Reven.",
        "code": "103291",
        "desc": "Repuesto original Bertini código 103291: Vastago Recto S/Soldar Templado Y Reven.. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 28.01,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "103291",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "103291",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_103293",
        "name": "Repuesto Bertini Eje Derecho Maza Reg. Profundidad",
        "code": "103293",
        "desc": "Repuesto original Bertini código 103293: Eje Derecho Maza Reg. Profundidad. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 14.01,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "103293",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "103293",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_103294",
        "name": "Repuesto Bertini Eje Izquierda Maza Reg. Profundidad.",
        "code": "103294",
        "desc": "Repuesto original Bertini código 103294: Eje Izquierda Maza Reg. Profundidad.. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 14.01,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "103294",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "103294",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_103302",
        "name": "Repuesto Bertini Punta De Eje De Marcador",
        "code": "103302",
        "desc": "Repuesto original Bertini código 103302: Punta De Eje De Marcador. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 21.73,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "103302",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "103302",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_103359",
        "name": "Repuesto Bertini Pist¢N Cilindro Buzo",
        "code": "103359",
        "desc": "Repuesto original Bertini código 103359: Pist¢N Cilindro Buzo. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 199.05,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "103359",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "103359",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_103361",
        "name": "Repuesto Bertini Maza Doble Fertilizaci¢N Y Siembra",
        "code": "103361",
        "desc": "Repuesto original Bertini código 103361: Maza Doble Fertilizaci¢N Y Siembra. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 40.19,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "103361",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "103361",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_103365",
        "name": "Repuesto Bertini Maza Cuchilla Labranza Macho",
        "code": "103365",
        "desc": "Repuesto original Bertini código 103365: Maza Cuchilla Labranza Macho. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 42.87,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "103365",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "103365",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_103366",
        "name": "Repuesto Bertini Maza Cuchilla Labranza Hembra",
        "code": "103366",
        "desc": "Repuesto original Bertini código 103366: Maza Cuchilla Labranza Hembra. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 42.87,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "103366",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "103366",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_103367",
        "name": "Repuesto Bertini Eje Cuchilla De Labranza",
        "code": "103367",
        "desc": "Repuesto original Bertini código 103367: Eje Cuchilla De Labranza. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 20.36,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "103367",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "103367",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_103402",
        "name": "Repuesto Bertini Buje Separador Horquilla Cuchilla Flotan",
        "code": "103402",
        "desc": "Repuesto original Bertini código 103402: Buje Separador Horquilla Cuchilla Flotan. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 23.43,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "103402",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "103402",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_103405",
        "name": "Repuesto Bertini Varilla Resorte Amortiguador Patin 10.000",
        "code": "103405",
        "desc": "Repuesto original Bertini código 103405: Varilla Resorte Amortiguador Patin 10.000. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 11.33,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "103405",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "103405",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_103413",
        "name": "Repuesto Bertini Disco 14 Pulg. Rueda Trasera Dentada Agu",
        "code": "103413",
        "desc": "Repuesto original Bertini código 103413: Disco 14 Pulg. Rueda Trasera Dentada Agu. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 49.52,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "103413",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "103413",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_104001",
        "name": "Repuesto Bertini Disco Dentado 14 Pulg",
        "code": "104001",
        "desc": "Repuesto original Bertini código 104001: Disco Dentado 14 Pulg. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 49.52,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "104001",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "104001",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_104002",
        "name": "Repuesto Bertini Tabla Fertilizante",
        "code": "104002",
        "desc": "Repuesto original Bertini código 104002: Tabla Fertilizante. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 13.33,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "104002",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "104002",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_104003",
        "name": "Repuesto Bertini Tabla De Siembra",
        "code": "104003",
        "desc": "Repuesto original Bertini código 104003: Tabla De Siembra. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 13.33,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "104003",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "104003",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_104008",
        "name": "Repuesto Bertini \"Cadena De Mando Asa P 1/2\"\" L=1400",
        "code": "104008",
        "desc": "Repuesto original Bertini código 104008: \"Cadena De Mando Asa P 1/2\"\" L=1400. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 15.86,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "104008",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "104008",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_104009",
        "name": "Repuesto Bertini \"Cadena De Mando Asa 40 P 1/2\"\" L= 1270",
        "code": "104009",
        "desc": "Repuesto original Bertini código 104009: \"Cadena De Mando Asa 40 P 1/2\"\" L= 1270. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 14.35,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "104009",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "104009",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_104010",
        "name": "Repuesto Bertini \"Cadena De Mando Asa 40 P 1/2\"\" L= 1400",
        "code": "104010",
        "desc": "Repuesto original Bertini código 104010: \"Cadena De Mando Asa 40 P 1/2\"\" L= 1400. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 15.86,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "104010",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "104010",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_104011",
        "name": "Repuesto Bertini \"Cadena De Mando Asa 40 P 1/2\"\" L= 2250",
        "code": "104011",
        "desc": "Repuesto original Bertini código 104011: \"Cadena De Mando Asa 40 P 1/2\"\" L= 2250. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 25.43,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "104011",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "104011",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_104012",
        "name": "Repuesto Bertini \"Cadena De Mando Asa P 1/2\"\" L= 1400",
        "code": "104012",
        "desc": "Repuesto original Bertini código 104012: \"Cadena De Mando Asa P 1/2\"\" L= 1400. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 15.86,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "104012",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "104012",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_104017",
        "name": "Repuesto Bertini Banda De Goma Rueda Lateral",
        "code": "104017",
        "desc": "Repuesto original Bertini código 104017: Banda De Goma Rueda Lateral. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 29.62,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "104017",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "104017",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_104024",
        "name": "Repuesto Bertini Ramal Derecho",
        "code": "104024",
        "desc": "Repuesto original Bertini código 104024: Ramal Derecho. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 49.41,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "104024",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "104024",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_104025",
        "name": "Repuesto Bertini Ramal Izquierdo",
        "code": "104025",
        "desc": "Repuesto original Bertini código 104025: Ramal Izquierdo. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 49.41,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "104025",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "104025",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_104026",
        "name": "Repuesto Bertini Ramal Derecho Delantero",
        "code": "104026",
        "desc": "Repuesto original Bertini código 104026: Ramal Derecho Delantero. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 49.41,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "104026",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "104026",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_104027",
        "name": "Repuesto Bertini Ramal Derecho Trasero",
        "code": "104027",
        "desc": "Repuesto original Bertini código 104027: Ramal Derecho Trasero. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 49.41,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "104027",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "104027",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_104028",
        "name": "Repuesto Bertini Ramal Izquierdo Delantero",
        "code": "104028",
        "desc": "Repuesto original Bertini código 104028: Ramal Izquierdo Delantero. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 49.41,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "104028",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "104028",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_104029",
        "name": "Repuesto Bertini Ramal Izquierdo Trasero",
        "code": "104029",
        "desc": "Repuesto original Bertini código 104029: Ramal Izquierdo Trasero. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 49.41,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "104029",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "104029",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_104030",
        "name": "Repuesto Bertini Valvula Secuencial",
        "code": "104030",
        "desc": "Repuesto original Bertini código 104030: Valvula Secuencial. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 297.77,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "104030",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "104030",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_104031",
        "name": "Repuesto Bertini Banda Semineumatica Positiva",
        "code": "104031",
        "desc": "Repuesto original Bertini código 104031: Banda Semineumatica Positiva. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 50.03,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "104031",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "104031",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_104037",
        "name": "Repuesto Bertini \"Disco Plano 1 Filo 13 1/2\"\"",
        "code": "104037",
        "desc": "Repuesto original Bertini código 104037: \"Disco Plano 1 Filo 13 1/2\"\". Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 41.26,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "104037",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "104037",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_104040",
        "name": "Repuesto Bertini Media Llanta Ancha",
        "code": "104040",
        "desc": "Repuesto original Bertini código 104040: Media Llanta Ancha. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 22.96,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "104040",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "104040",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_104041",
        "name": "Repuesto Bertini Media Llanta Angosta",
        "code": "104041",
        "desc": "Repuesto original Bertini código 104041: Media Llanta Angosta. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 18.31,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "104041",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "104041",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_104043",
        "name": "Repuesto Bertini Anillo Roz Friccion Diam 70",
        "code": "104043",
        "desc": "Repuesto original Bertini código 104043: Anillo Roz Friccion Diam 70. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 14.01,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "104043",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "104043",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_104057",
        "name": "Repuesto Bertini Rotor De Ventilador Chico",
        "code": "104057",
        "desc": "Repuesto original Bertini código 104057: Rotor De Ventilador Chico. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 512.32,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "104057",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "104057",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_104058",
        "name": "Repuesto Bertini Bomba Hidraulica",
        "code": "104058",
        "desc": "Repuesto original Bertini código 104058: Bomba Hidraulica. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 1166.21,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "104058",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "104058",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_104059",
        "name": "Repuesto Bertini Motor Hidraulico",
        "code": "104059",
        "desc": "Repuesto original Bertini código 104059: Motor Hidraulico. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 499.14,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "104059",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "104059",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_104063",
        "name": "Repuesto Bertini Tabla De Fertilizacion",
        "code": "104063",
        "desc": "Repuesto original Bertini código 104063: Tabla De Fertilizacion. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 13.33,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "104063",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "104063",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_104064",
        "name": "Repuesto Bertini Cuchilla Duraflute 16\"",
        "code": "104064",
        "desc": "Repuesto original Bertini código 104064: Cuchilla Duraflute 16\". Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 68.73,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "104064",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "104064",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_104066",
        "name": "Repuesto Bertini Doble Disco Fertilizante Y Semillas Disco Plano 1 Filo 13 1/2\"",
        "code": "104066",
        "desc": "Repuesto original Bertini código 104066: Doble Disco Fertilizante Y Semillas Disco Plano 1 Filo 13 1/2\". Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 40.09,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "104066",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "104066",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_104068",
        "name": "Repuesto Bertini Banda Maciza Conformada",
        "code": "104068",
        "desc": "Repuesto original Bertini código 104068: Banda Maciza Conformada. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 21.88,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "104068",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "104068",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_104072",
        "name": "Repuesto Bertini Filtro De Aceite",
        "code": "104072",
        "desc": "Repuesto original Bertini código 104072: Filtro De Aceite. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 52.71,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "104072",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "104072",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_104073",
        "name": "Repuesto Bertini Prefiltro",
        "code": "104073",
        "desc": "Repuesto original Bertini código 104073: Prefiltro. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 13.2,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "104073",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "104073",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_104074",
        "name": "Repuesto Bertini Cuchilla Reepled 16\"",
        "code": "104074",
        "desc": "Repuesto original Bertini código 104074: Cuchilla Reepled 16\". Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 68.73,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "104074",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "104074",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_104075",
        "name": "Repuesto Bertini Tubo Flexible De Pasaje De Aire",
        "code": "104075",
        "desc": "Repuesto original Bertini código 104075: Tubo Flexible De Pasaje De Aire. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 60.49,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "104075",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "104075",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_104078",
        "name": "Repuesto Bertini Junta Tapa De Caja",
        "code": "104078",
        "desc": "Repuesto original Bertini código 104078: Junta Tapa De Caja. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 21.92,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "104078",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "104078",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_104081",
        "name": "Repuesto Bertini Tabla De Cambios Y Posicion",
        "code": "104081",
        "desc": "Repuesto original Bertini código 104081: Tabla De Cambios Y Posicion. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 13.2,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "104081",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "104081",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_10042",
        "name": "Repuesto Bertini Tubo Goma Fertilizante",
        "code": "10042",
        "desc": "Repuesto original Bertini código 10042: Tubo Goma Fertilizante. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 93.09,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "10042",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "10042",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_104090",
        "name": "Repuesto Bertini \"Manguera 1/4\"\" Ri X 400",
        "code": "104090",
        "desc": "Repuesto original Bertini código 104090: \"Manguera 1/4\"\" Ri X 400. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 14.82,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "104090",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "104090",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_104091",
        "name": "Repuesto Bertini \"Manguera 1/4\"\" Ri X 560",
        "code": "104091",
        "desc": "Repuesto original Bertini código 104091: \"Manguera 1/4\"\" Ri X 560. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 18.78,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "104091",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "104091",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_104092",
        "name": "Repuesto Bertini \"Manguera 3/2\"\" R2 X 4800",
        "code": "104092",
        "desc": "Repuesto original Bertini código 104092: \"Manguera 3/2\"\" R2 X 4800. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 102.12,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "104092",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "104092",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_104093",
        "name": "Repuesto Bertini \"Manguera 3/8\"\" R1 L= 650",
        "code": "104093",
        "desc": "Repuesto original Bertini código 104093: \"Manguera 3/8\"\" R1 L= 650. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 39.71,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "104093",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "104093",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_104094",
        "name": "Repuesto Bertini \"Manguera 1/2\"\" R1 L= 700",
        "code": "104094",
        "desc": "Repuesto original Bertini código 104094: \"Manguera 1/2\"\" R1 L= 700. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 59.32,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "104094",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "104094",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_104095",
        "name": "Repuesto Bertini \"Manguera 3/4\"\" R1 L= 2200",
        "code": "104095",
        "desc": "Repuesto original Bertini código 104095: \"Manguera 3/4\"\" R1 L= 2200. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 110.03,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "104095",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "104095",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_104096",
        "name": "Repuesto Bertini \"Manguera 1/2\"\" R2 L= 2800",
        "code": "104096",
        "desc": "Repuesto original Bertini código 104096: \"Manguera 1/2\"\" R2 L= 2800. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 117.91,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "104096",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "104096",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_104100",
        "name": "Repuesto Bertini Banda Semineumatica Negativa",
        "code": "104100",
        "desc": "Repuesto original Bertini código 104100: Banda Semineumatica Negativa. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 64.35,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "104100",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "104100",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_104102",
        "name": "Repuesto Bertini Collar De Bomba",
        "code": "104102",
        "desc": "Repuesto original Bertini código 104102: Collar De Bomba. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 14.82,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "104102",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "104102",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_104103",
        "name": "Repuesto Bertini \"Grillete W 7/16\"\"",
        "code": "104103",
        "desc": "Repuesto original Bertini código 104103: \"Grillete W 7/16\"\". Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 24.75,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "104103",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "104103",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_104105",
        "name": "Repuesto Bertini Cubierta Limitadora De Profundidad Semin",
        "code": "104105",
        "desc": "Repuesto original Bertini código 104105: Cubierta Limitadora De Profundidad Semin. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 42.63,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "104105",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "104105",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_104115",
        "name": "Repuesto Bertini \"Disco Dentado 14\"\" Agujero Grande",
        "code": "104115",
        "desc": "Repuesto original Bertini código 104115: \"Disco Dentado 14\"\" Agujero Grande. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 49.52,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "104115",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "104115",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_104218",
        "name": "Repuesto Bertini Llanta De 16 Pulg Tiro De Punta 7\"X16X5/16",
        "code": "104218",
        "desc": "Repuesto original Bertini código 104218: Llanta De 16 Pulg Tiro De Punta 7\"X16X5/16. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 188.91,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "104218",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "104218",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_105012",
        "name": "Repuesto Bertini Resorte Amortiguador Grueso",
        "code": "105012",
        "desc": "Repuesto original Bertini código 105012: Resorte Amortiguador Grueso. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 11.96,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "105012",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "105012",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_105013",
        "name": "Repuesto Bertini Resorte Amortiguador",
        "code": "105013",
        "desc": "Repuesto original Bertini código 105013: Resorte Amortiguador. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 13.71,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "105013",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "105013",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_105016",
        "name": "Repuesto Bertini Resorte Brazo Para Fertilizante Entre Lineas",
        "code": "105016",
        "desc": "Repuesto original Bertini código 105016: Resorte Brazo Para Fertilizante Entre Lineas. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 27.87,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "105016",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "105016",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_105021",
        "name": "Repuesto Bertini Resorte De Compresion Conv.",
        "code": "105021",
        "desc": "Repuesto original Bertini código 105021: Resorte De Compresion Conv.. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 21.8,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "105021",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "105021",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_105032",
        "name": "Repuesto Bertini Resorte Doble Disco Fertilizante Modific",
        "code": "105032",
        "desc": "Repuesto original Bertini código 105032: Resorte Doble Disco Fertilizante Modific. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 24.69,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "105032",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "105032",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_106006",
        "name": "Repuesto Bertini Taza De La Maza De Rueda",
        "code": "106006",
        "desc": "Repuesto original Bertini código 106006: Taza De La Maza De Rueda. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 10.07,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "106006",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "106006",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_106011",
        "name": "Repuesto Bertini Caja Dosificadora C/ Bancada",
        "code": "106011",
        "desc": "Repuesto original Bertini código 106011: Caja Dosificadora C/ Bancada. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 13.85,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "106011",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "106011",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_106012",
        "name": "Repuesto Bertini Dosificador Sin Buje",
        "code": "106012",
        "desc": "Repuesto original Bertini código 106012: Dosificador Sin Buje. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 13.85,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "106012",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "106012",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_106015",
        "name": "Repuesto Bertini Caja Distribuidor Neum Tico",
        "code": "106015",
        "desc": "Repuesto original Bertini código 106015: Caja Distribuidor Neum Tico. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 156.66,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "106015",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "106015",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_106019",
        "name": "Repuesto Bertini Tubo De Goma Semilla",
        "code": "106019",
        "desc": "Repuesto original Bertini código 106019: Tubo De Goma Semilla. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 32.93,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "106019",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "106019",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_106020",
        "name": "Repuesto Bertini Codo De Recepcion De Semillas",
        "code": "106020",
        "desc": "Repuesto original Bertini código 106020: Codo De Recepcion De Semillas. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 29.66,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "106020",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "106020",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_106021",
        "name": "Repuesto Bertini Sector De Alfombra",
        "code": "106021",
        "desc": "Repuesto original Bertini código 106021: Sector De Alfombra. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 12.11,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "106021",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "106021",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_106022",
        "name": "Repuesto Bertini Cepillo De 10 Juegos De Cerda",
        "code": "106022",
        "desc": "Repuesto original Bertini código 106022: Cepillo De 10 Juegos De Cerda. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 17.68,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "106022",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "106022",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_106023",
        "name": "Repuesto Bertini Cepillo De 7 Juegos De Cerda (8 Cerdas Amarillo/Verde)",
        "code": "106023",
        "desc": "Repuesto original Bertini código 106023: Cepillo De 7 Juegos De Cerda (8 Cerdas Amarillo/Verde). Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 17.68,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "106023",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "106023",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_106027",
        "name": "Repuesto Bertini Brida De Conexion",
        "code": "106027",
        "desc": "Repuesto original Bertini código 106027: Brida De Conexion. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 31.14,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "106027",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "106027",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_106036",
        "name": "Repuesto Bertini Guia De Vastago",
        "code": "106036",
        "desc": "Repuesto original Bertini código 106036: Guia De Vastago. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 20.85,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "106036",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "106036",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_106044",
        "name": "Repuesto Bertini Buje Del Tapon Caja Cambios",
        "code": "106044",
        "desc": "Repuesto original Bertini código 106044: Buje Del Tapon Caja Cambios. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 12.03,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "106044",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "106044",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_106055",
        "name": "Repuesto Bertini Tabla De Fertilizacion Simple",
        "code": "106055",
        "desc": "Repuesto original Bertini código 106055: Tabla De Fertilizacion Simple. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 17.68,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "106055",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "106055",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_106062",
        "name": "Repuesto Bertini Rotulacion De Sembradora 10,000 Sin Alfa",
        "code": "106062",
        "desc": "Repuesto original Bertini código 106062: Rotulacion De Sembradora 10,000 Sin Alfa. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 289.39,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "106062",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "106062",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_106063",
        "name": "Repuesto Bertini Rotulacion De Sembradora 10,000 Con Alfa",
        "code": "106063",
        "desc": "Repuesto original Bertini código 106063: Rotulacion De Sembradora 10,000 Con Alfa. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 271.17,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "106063",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "106063",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_106066",
        "name": "Repuesto Bertini Calco Rotulacion De Sembradora 10,000 Si",
        "code": "106066",
        "desc": "Repuesto original Bertini código 106066: Calco Rotulacion De Sembradora 10,000 Si. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 289.39,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "106066",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "106066",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_113030",
        "name": "Repuesto Bertini \"Disco Dentado 14\"\"",
        "code": "113030",
        "desc": "Repuesto original Bertini código 113030: \"Disco Dentado 14\"\". Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 49.52,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "113030",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "113030",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_113062",
        "name": "Repuesto Bertini Eje Pivote Del Brazo",
        "code": "113062",
        "desc": "Repuesto original Bertini código 113062: Eje Pivote Del Brazo. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 39.71,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "113062",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "113062",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_113080",
        "name": "Repuesto Bertini Eje De Rueda",
        "code": "113080",
        "desc": "Repuesto original Bertini código 113080: Eje De Rueda. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 12.17,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "113080",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "113080",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_113085",
        "name": "Repuesto Bertini Eje De Doble Disco",
        "code": "113085",
        "desc": "Repuesto original Bertini código 113085: Eje De Doble Disco. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 23.38,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "113085",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "113085",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_113092",
        "name": "Repuesto Bertini Eje Corto De Brazo De Disco",
        "code": "113092",
        "desc": "Repuesto original Bertini código 113092: Eje Corto De Brazo De Disco. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 32.61,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "113092",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "113092",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_113093",
        "name": "Repuesto Bertini Eje Largo De Brazo De Disco",
        "code": "113093",
        "desc": "Repuesto original Bertini código 113093: Eje Largo De Brazo De Disco. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 32.61,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "113093",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "113093",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_114009",
        "name": "Repuesto Bertini Placa Girasol Grado 1",
        "code": "114009",
        "desc": "Repuesto original Bertini código 114009: Placa Girasol Grado 1. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 16.8,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "114009",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "114009",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_114010",
        "name": "Repuesto Bertini Placa Maiz Grande",
        "code": "114010",
        "desc": "Repuesto original Bertini código 114010: Placa Maiz Grande. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 23.78,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "114010",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "114010",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_114011",
        "name": "Repuesto Bertini Placa De Soja",
        "code": "114011",
        "desc": "Repuesto original Bertini código 114011: Placa De Soja. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 23.78,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "114011",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "114011",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_114013",
        "name": "Repuesto Bertini Banda Maciza",
        "code": "114013",
        "desc": "Repuesto original Bertini código 114013: Banda Maciza. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 23.93,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "114013",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "114013",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_114016",
        "name": "Repuesto Bertini Banda Semineumatica Pos.",
        "code": "114016",
        "desc": "Repuesto original Bertini código 114016: Banda Semineumatica Pos.. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 29.11,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "114016",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "114016",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_114017",
        "name": "Repuesto Bertini Banda De Goma Rueda Lateral",
        "code": "114017",
        "desc": "Repuesto original Bertini código 114017: Banda De Goma Rueda Lateral. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 25.7,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "114017",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "114017",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_114018",
        "name": "Repuesto Bertini Placa De Siembra Maiz Mediano",
        "code": "114018",
        "desc": "Repuesto original Bertini código 114018: Placa De Siembra Maiz Mediano. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 23.78,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "114018",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "114018",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_114019",
        "name": "Repuesto Bertini Media Llanta Angosta",
        "code": "114019",
        "desc": "Repuesto original Bertini código 114019: Media Llanta Angosta. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 14.15,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "114019",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "114019",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_114025",
        "name": "Repuesto Bertini Placa Girasol Grado 3",
        "code": "114025",
        "desc": "Repuesto original Bertini código 114025: Placa Girasol Grado 3. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 24.75,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "114025",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "114025",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_114077",
        "name": "Repuesto Bertini Placa De Siembra Sorgo-Trigo",
        "code": "114077",
        "desc": "Repuesto original Bertini código 114077: Placa De Siembra Sorgo-Trigo. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 23.78,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "114077",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "114077",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_115007",
        "name": "Repuesto Bertini Resorte Amortiguador Grueso",
        "code": "115007",
        "desc": "Repuesto original Bertini código 115007: Resorte Amortiguador Grueso. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 11.96,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "115007",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "115007",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_140014",
        "name": "Repuesto Bertini Maza De Rueda 14.000",
        "code": "140014",
        "desc": "Repuesto original Bertini código 140014: Maza De Rueda 14.000. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 110.72,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "140014",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "140014",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_140021",
        "name": "Repuesto Bertini Bancada C/ Buje",
        "code": "140021",
        "desc": "Repuesto original Bertini código 140021: Bancada C/ Buje. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 23.23,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "140021",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "140021",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_140022",
        "name": "Repuesto Bertini Brazo Fundido De Cuchilla 14.000",
        "code": "140022",
        "desc": "Repuesto original Bertini código 140022: Brazo Fundido De Cuchilla 14.000. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 86.4,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "140022",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "140022",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_141007",
        "name": "Repuesto Bertini Soporte De Carro 14.000 (P)",
        "code": "141007",
        "desc": "Repuesto original Bertini código 141007: Soporte De Carro 14.000 (P). Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 24.75,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "141007",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "141007",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_141008",
        "name": "Repuesto Bertini Palanca Regulacion Tension Resorte Rueda",
        "code": "141008",
        "desc": "Repuesto original Bertini código 141008: Palanca Regulacion Tension Resorte Rueda. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 16.13,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "141008",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "141008",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_141013",
        "name": "Repuesto Bertini Brazo De Rueda Lateral Izq. 14.000",
        "code": "141013",
        "desc": "Repuesto original Bertini código 141013: Brazo De Rueda Lateral Izq. 14.000. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 66.55,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "141013",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "141013",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_141014",
        "name": "Repuesto Bertini Brazo De Rueda Lateral Der. 14.000",
        "code": "141014",
        "desc": "Repuesto original Bertini código 141014: Brazo De Rueda Lateral Der. 14.000. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 66.55,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "141014",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "141014",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_141026",
        "name": "Repuesto Bertini Bancada Fija Tren Delantero",
        "code": "141026",
        "desc": "Repuesto original Bertini código 141026: Bancada Fija Tren Delantero. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 37.53,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "141026",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "141026",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_141030",
        "name": "Repuesto Bertini Soporte De Vastago Al Carro",
        "code": "141030",
        "desc": "Repuesto original Bertini código 141030: Soporte De Vastago Al Carro. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 30.96,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "141030",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "141030",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_141031",
        "name": "Repuesto Bertini Terminal Rienda Marcador Izquierda",
        "code": "141031",
        "desc": "Repuesto original Bertini código 141031: Terminal Rienda Marcador Izquierda. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 16.26,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "141031",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "141031",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_141032",
        "name": "Repuesto Bertini Terminal Rienda Marcador Derecha",
        "code": "141032",
        "desc": "Repuesto original Bertini código 141032: Terminal Rienda Marcador Derecha. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 16.26,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "141032",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "141032",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_141035",
        "name": "Repuesto Bertini Bancada Movil Tren Delantero",
        "code": "141035",
        "desc": "Repuesto original Bertini código 141035: Bancada Movil Tren Delantero. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 45.86,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "141035",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "141035",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_141041",
        "name": "Repuesto Bertini Rejitas Fundicion Acero",
        "code": "141041",
        "desc": "Repuesto original Bertini código 141041: Rejitas Fundicion Acero. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 11.55,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "141041",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "141041",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_142026",
        "name": "Repuesto Bertini Protector De Doble Disco",
        "code": "142026",
        "desc": "Repuesto original Bertini código 142026: Protector De Doble Disco. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 14.01,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "142026",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "142026",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_142096",
        "name": "Repuesto Bertini Aleta De Marcador",
        "code": "142096",
        "desc": "Repuesto original Bertini código 142096: Aleta De Marcador. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 13.61,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "142096",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "142096",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_142214",
        "name": "Repuesto Bertini Tapa Tolva Grano Grueso",
        "code": "142214",
        "desc": "Repuesto original Bertini código 142214: Tapa Tolva Grano Grueso. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 24.46,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "142214",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "142214",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_142275",
        "name": "Repuesto Bertini Pliego Medio",
        "code": "142275",
        "desc": "Repuesto original Bertini código 142275: Pliego Medio. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 65.27,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "142275",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "142275",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_143037",
        "name": "Repuesto Bertini Eje De Enganche",
        "code": "143037",
        "desc": "Repuesto original Bertini código 143037: Eje De Enganche. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 19.96,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "143037",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "143037",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_143043",
        "name": "Repuesto Bertini Banana Tercer Tramo",
        "code": "143043",
        "desc": "Repuesto original Bertini código 143043: Banana Tercer Tramo. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 9.62,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "143043",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "143043",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_143044",
        "name": "Repuesto Bertini Buje Pivote",
        "code": "143044",
        "desc": "Repuesto original Bertini código 143044: Buje Pivote. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 50.29,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "143044",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "143044",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_143046",
        "name": "Repuesto Bertini Buje De Biela",
        "code": "143046",
        "desc": "Repuesto original Bertini código 143046: Buje De Biela. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 19.41,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "143046",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "143046",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_143047",
        "name": "Repuesto Bertini Eje De Biela",
        "code": "143047",
        "desc": "Repuesto original Bertini código 143047: Eje De Biela. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 37.33,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "143047",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "143047",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_143048",
        "name": "Repuesto Bertini Separador De Banana",
        "code": "143048",
        "desc": "Repuesto original Bertini código 143048: Separador De Banana. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 20.78,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "143048",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "143048",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_143052",
        "name": "Repuesto Bertini Perno De Banana",
        "code": "143052",
        "desc": "Repuesto original Bertini código 143052: Perno De Banana. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 36.98,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "143052",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "143052",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_143064",
        "name": "Repuesto Bertini Separador De Banana",
        "code": "143064",
        "desc": "Repuesto original Bertini código 143064: Separador De Banana. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 14.66,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "143064",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "143064",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_143076",
        "name": "Repuesto Bertini Rienda De Marcador",
        "code": "143076",
        "desc": "Repuesto original Bertini código 143076: Rienda De Marcador. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 101.88,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "143076",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "143076",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_143092",
        "name": "Repuesto Bertini Eje Doble Disco Siembra",
        "code": "143092",
        "desc": "Repuesto original Bertini código 143092: Eje Doble Disco Siembra. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 19.61,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "143092",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "143092",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_143138",
        "name": "Repuesto Bertini Buje Codo Marcador 14.000",
        "code": "143138",
        "desc": "Repuesto original Bertini código 143138: Buje Codo Marcador 14.000. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 18.13,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "143138",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "143138",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_143139",
        "name": "Repuesto Bertini Buje Pivote Tercer Tramo",
        "code": "143139",
        "desc": "Repuesto original Bertini código 143139: Buje Pivote Tercer Tramo. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 18.5,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "143139",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "143139",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_143145",
        "name": "Repuesto Bertini Guia Bancada",
        "code": "143145",
        "desc": "Repuesto original Bertini código 143145: Guia Bancada. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 9.3,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "143145",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "143145",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_143153",
        "name": "Repuesto Bertini Punta De Ejes Duales",
        "code": "143153",
        "desc": "Repuesto original Bertini código 143153: Punta De Ejes Duales. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 222.33,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "143153",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "143153",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_143213",
        "name": "Repuesto Bertini Eje Derecho Rueda Niveladora",
        "code": "143213",
        "desc": "Repuesto original Bertini código 143213: Eje Derecho Rueda Niveladora. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 16.77,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "143213",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "143213",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_143217",
        "name": "Repuesto Bertini Eje Izquierdo Rueda Niveladora",
        "code": "143217",
        "desc": "Repuesto original Bertini código 143217: Eje Izquierdo Rueda Niveladora. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 16.77,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "143217",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "143217",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_143222",
        "name": "Repuesto Bertini Eje De Rueda Niveladora (Izq./Der)",
        "code": "143222",
        "desc": "Repuesto original Bertini código 143222: Eje De Rueda Niveladora (Izq./Der). Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 14.01,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "143222",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "143222",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_143239",
        "name": "Repuesto Bertini Eje De Rueda En V Izquierdo",
        "code": "143239",
        "desc": "Repuesto original Bertini código 143239: Eje De Rueda En V Izquierdo. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 14.01,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "143239",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "143239",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_143240",
        "name": "Repuesto Bertini Eje De Rueda En V Derecho",
        "code": "143240",
        "desc": "Repuesto original Bertini código 143240: Eje De Rueda En V Derecho. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 14.01,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "143240",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "143240",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_143252",
        "name": "Repuesto Bertini Separador De Barra Hexagonal",
        "code": "143252",
        "desc": "Repuesto original Bertini código 143252: Separador De Barra Hexagonal. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 14.01,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "143252",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "143252",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_143278",
        "name": "Repuesto Bertini Manguito Reondo Exagonal",
        "code": "143278",
        "desc": "Repuesto original Bertini código 143278: Manguito Reondo Exagonal. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 27.09,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "143278",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "143278",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_144004",
        "name": "Repuesto Bertini Media Llanta Rueda Control De Profundida",
        "code": "144004",
        "desc": "Repuesto original Bertini código 144004: Media Llanta Rueda Control De Profundida. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 45.46,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "144004",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "144004",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_144012",
        "name": "Repuesto Bertini Buje 143214 C/Reten Vulcanizado",
        "code": "144012",
        "desc": "Repuesto original Bertini código 144012: Buje 143214 C/Reten Vulcanizado. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 12.35,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "144012",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "144012",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_28000",
        "name": "Repuesto Bertini Disco 15 Pulg. Siembra Carro",
        "code": "28000",
        "desc": "Repuesto original Bertini código 28000: Disco 15 Pulg. Siembra Carro. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 128.8,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "28000",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "28000",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_144017",
        "name": "Repuesto Bertini Tubo De Abono 10040 Nd",
        "code": "144017",
        "desc": "Repuesto original Bertini código 144017: Tubo De Abono 10040 Nd. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 24.88,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "144017",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "144017",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_144032",
        "name": "Repuesto Bertini Cilindro Hidrau. De Marcador Carr 485Mm",
        "code": "144032",
        "desc": "Repuesto original Bertini código 144032: Cilindro Hidrau. De Marcador Carr 485Mm. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 321.23,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "144032",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "144032",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_145001",
        "name": "Repuesto Bertini Resorte De Presion De Ruedas Conformador",
        "code": "145001",
        "desc": "Repuesto original Bertini código 145001: Resorte De Presion De Ruedas Conformador. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 16.69,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "145001",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "145001",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_145002",
        "name": "Repuesto Bertini Resorte De Presion Paralelogramo",
        "code": "145002",
        "desc": "Repuesto original Bertini código 145002: Resorte De Presion Paralelogramo. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 41.64,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "145002",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "145002",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_145003",
        "name": "Repuesto Bertini Muelle",
        "code": "145003",
        "desc": "Repuesto original Bertini código 145003: Muelle. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 16.48,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "145003",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "145003",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_146006",
        "name": "Repuesto Bertini Perilla",
        "code": "146006",
        "desc": "Repuesto original Bertini código 146006: Perilla. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 9.23,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "146006",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "146006",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_146019",
        "name": "Repuesto Bertini Difosor De Insecticida",
        "code": "146019",
        "desc": "Repuesto original Bertini código 146019: Difosor De Insecticida. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 10.26,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "146019",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "146019",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_146021",
        "name": "Repuesto Bertini Distribuidor Primera Edicion",
        "code": "146021",
        "desc": "Repuesto original Bertini código 146021: Distribuidor Primera Edicion. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 569.4,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "146021",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "146021",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_146028",
        "name": "Repuesto Bertini Pisagrano Standard",
        "code": "146028",
        "desc": "Repuesto original Bertini código 146028: Pisagrano Standard. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 10.93,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "146028",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "146028",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_146030",
        "name": "Repuesto Bertini Placa Maiz Chato Chico",
        "code": "146030",
        "desc": "Repuesto original Bertini código 146030: Placa Maiz Chato Chico. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 23.78,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "146030",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "146030",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_146037",
        "name": "Repuesto Bertini Placa Algodon/Poroto Negro",
        "code": "146037",
        "desc": "Repuesto original Bertini código 146037: Placa Algodon/Poroto Negro. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 23.78,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "146037",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "146037",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_146043",
        "name": "Repuesto Bertini Placa Poroto Blanco",
        "code": "146043",
        "desc": "Repuesto original Bertini código 146043: Placa Poroto Blanco. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 23.78,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "146043",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "146043",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_146048",
        "name": "Repuesto Bertini Placa Girasol Grado 1",
        "code": "146048",
        "desc": "Repuesto original Bertini código 146048: Placa Girasol Grado 1. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 23.78,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "146048",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "146048",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_146049",
        "name": "Repuesto Bertini Placa Girasol Grado 2",
        "code": "146049",
        "desc": "Repuesto original Bertini código 146049: Placa Girasol Grado 2. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 23.78,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "146049",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "146049",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_146050",
        "name": "Repuesto Bertini Placa Girasol Grado 3",
        "code": "146050",
        "desc": "Repuesto original Bertini código 146050: Placa Girasol Grado 3. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 23.78,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "146050",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "146050",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_146051",
        "name": "Repuesto Bertini Placa Girasol Grado 4",
        "code": "146051",
        "desc": "Repuesto original Bertini código 146051: Placa Girasol Grado 4. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 23.78,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "146051",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "146051",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_146052",
        "name": "Repuesto Bertini Codo 90 Grados Pvc Dia 75",
        "code": "146052",
        "desc": "Repuesto original Bertini código 146052: Codo 90 Grados Pvc Dia 75. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 17.86,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "146052",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "146052",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_146053",
        "name": "Repuesto Bertini Codo  45",
        "code": "146053",
        "desc": "Repuesto original Bertini código 146053: Codo  45. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 17.86,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "146053",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "146053",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_146054",
        "name": "Repuesto Bertini Placa Maiz Chato Grande",
        "code": "146054",
        "desc": "Repuesto original Bertini código 146054: Placa Maiz Chato Grande. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 23.78,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "146054",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "146054",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_146075",
        "name": "Repuesto Bertini Placa De Siembra Soja 120 Inclinada",
        "code": "146075",
        "desc": "Repuesto original Bertini código 146075: Placa De Siembra Soja 120 Inclinada. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 23.78,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "146075",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "146075",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_146076",
        "name": "Repuesto Bertini Placa De Siembra Soja 180 Inclinada",
        "code": "146076",
        "desc": "Repuesto original Bertini código 146076: Placa De Siembra Soja 180 Inclinada. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 18.48,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "146076",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "146076",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_162170",
        "name": "Repuesto Bertini Engranaje Z=40 Paso 5/8 Aguj. 110 Rueda",
        "code": "162170",
        "desc": "Repuesto original Bertini código 162170: Engranaje Z=40 Paso 5/8 Aguj. 110 Rueda. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 47.23,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "162170",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "162170",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_164004",
        "name": "Repuesto Bertini Llanta Para Cubierta Alliance 550/60-22.",
        "code": "164004",
        "desc": "Repuesto original Bertini código 164004: Llanta Para Cubierta Alliance 550/60-22.. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 1236.87,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "164004",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "164004",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_170001",
        "name": "Repuesto Bertini Triple Bancada Superior",
        "code": "170001",
        "desc": "Repuesto original Bertini código 170001: Triple Bancada Superior. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 9.61,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "170001",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "170001",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_173006",
        "name": "Repuesto Bertini Eje De Selectores",
        "code": "173006",
        "desc": "Repuesto original Bertini código 173006: Eje De Selectores. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 57.52,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "173006",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "173006",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_173015",
        "name": "Repuesto Bertini Eje Intermedio",
        "code": "173015",
        "desc": "Repuesto original Bertini código 173015: Eje Intermedio. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 33.76,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "173015",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "173015",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_173034",
        "name": "Repuesto Bertini Eje De Entrada",
        "code": "173034",
        "desc": "Repuesto original Bertini código 173034: Eje De Entrada. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 47.16,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "173034",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "173034",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_173040",
        "name": "Repuesto Bertini Extremo Eje De Entrada",
        "code": "173040",
        "desc": "Repuesto original Bertini código 173040: Extremo Eje De Entrada. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 17.82,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "173040",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "173040",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_173043",
        "name": "Repuesto Bertini Eje De Salida",
        "code": "173043",
        "desc": "Repuesto original Bertini código 173043: Eje De Salida. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 54.62,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "173043",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "173043",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_205100",
        "name": "Repuesto Bertini Resorte De Tracci¢N 61 Mm Del Cuerpo Arr",
        "code": "205100",
        "desc": "Repuesto original Bertini código 205100: Resorte De Tracci¢N 61 Mm Del Cuerpo Arr. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 75.03,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "205100",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "205100",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_210002",
        "name": "Repuesto Bertini Maza De Rueda Transportin",
        "code": "210002",
        "desc": "Repuesto original Bertini código 210002: Maza De Rueda Transportin. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 47.37,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "210002",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "210002",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_210003",
        "name": "Repuesto Bertini Taza De Rueda Del Carro De Transporte",
        "code": "210003",
        "desc": "Repuesto original Bertini código 210003: Taza De Rueda Del Carro De Transporte. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 24.75,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "210003",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "210003",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_220001",
        "name": "Repuesto Bertini Buje De Mando",
        "code": "220001",
        "desc": "Repuesto original Bertini código 220001: Buje De Mando. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 17.44,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "220001",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "220001",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_220004",
        "name": "Repuesto Bertini Soporte Tensor Cadena",
        "code": "220004",
        "desc": "Repuesto original Bertini código 220004: Soporte Tensor Cadena. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 19.17,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "220004",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "220004",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_220012",
        "name": "Repuesto Bertini Volante Con Chavetero",
        "code": "220012",
        "desc": "Repuesto original Bertini código 220012: Volante Con Chavetero. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 32.68,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "220012",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "220012",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_220017",
        "name": "Repuesto Bertini Disco De Freno",
        "code": "220017",
        "desc": "Repuesto original Bertini código 220017: Disco De Freno. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 258.84,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "220017",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "220017",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_221003",
        "name": "Repuesto Bertini Regulador De Profundidad",
        "code": "221003",
        "desc": "Repuesto original Bertini código 221003: Regulador De Profundidad. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 9.08,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "221003",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "221003",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_221008",
        "name": "Repuesto Bertini Amarre Al Carro",
        "code": "221008",
        "desc": "Repuesto original Bertini código 221008: Amarre Al Carro. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 13.46,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "221008",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "221008",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_221010",
        "name": "Repuesto Bertini Soporte De Cuchillas Entre Lineas Vastag",
        "code": "221010",
        "desc": "Repuesto original Bertini código 221010: Soporte De Cuchillas Entre Lineas Vastag. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 38.61,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "221010",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "221010",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_221011",
        "name": "Repuesto Bertini Soporte De Doble Disco Fertilizacion Ent",
        "code": "221011",
        "desc": "Repuesto original Bertini código 221011: Soporte De Doble Disco Fertilizacion Ent. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 52.97,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "221011",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "221011",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_221016",
        "name": "Repuesto Bertini Brazo De Rueda Control Prof. Derecho",
        "code": "221016",
        "desc": "Repuesto original Bertini código 221016: Brazo De Rueda Control Prof. Derecho. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 54.86,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "221016",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "221016",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_221017",
        "name": "Repuesto Bertini Brazo De Rueda Control Prof. Izquierdo",
        "code": "221017",
        "desc": "Repuesto original Bertini código 221017: Brazo De Rueda Control Prof. Izquierdo. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 54.6,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "221017",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "221017",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_221019",
        "name": "Repuesto Bertini Acople Brazo Cuchilla",
        "code": "221019",
        "desc": "Repuesto original Bertini código 221019: Acople Brazo Cuchilla. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 32.4,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "221019",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "221019",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_221021",
        "name": "Repuesto Bertini Soporte Eje De Rueda Dual Lado Transmisi",
        "code": "221021",
        "desc": "Repuesto original Bertini código 221021: Soporte Eje De Rueda Dual Lado Transmisi. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 109.57,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "221021",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "221021",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_221022",
        "name": "Repuesto Bertini Soporte Eje Rueda Dual",
        "code": "221022",
        "desc": "Repuesto original Bertini código 221022: Soporte Eje Rueda Dual. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 132.45,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "221022",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "221022",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_221023",
        "name": "Repuesto Bertini Soporte Derecho Doble De Cuchilla Y D.D.",
        "code": "221023",
        "desc": "Repuesto original Bertini código 221023: Soporte Derecho Doble De Cuchilla Y D.D.. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 40.33,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "221023",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "221023",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_221024",
        "name": "Repuesto Bertini Soporte Izquierdo Doble Cuchilla",
        "code": "221024",
        "desc": "Repuesto original Bertini código 221024: Soporte Izquierdo Doble Cuchilla. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 40.33,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "221024",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "221024",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_222014",
        "name": "Repuesto Bertini Buje Separador De Paralelogramo",
        "code": "222014",
        "desc": "Repuesto original Bertini código 222014: Buje Separador De Paralelogramo. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 12.78,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "222014",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "222014",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_222033",
        "name": "Repuesto Bertini Soporte Del  Raspador Y  Del Pisagranos",
        "code": "222033",
        "desc": "Repuesto original Bertini código 222033: Soporte Del  Raspador Y  Del Pisagranos. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 13.16,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "222033",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "222033",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_222063",
        "name": "Repuesto Bertini Tapa Boca Semilla",
        "code": "222063",
        "desc": "Repuesto original Bertini código 222063: Tapa Boca Semilla. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 9.56,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "222063",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "222063",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_222116",
        "name": "Repuesto Bertini Brazo De Rueda Dual",
        "code": "222116",
        "desc": "Repuesto original Bertini código 222116: Brazo De Rueda Dual. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 143.73,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "222116",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "222116",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_222178",
        "name": "Repuesto Bertini Pista De Reten Rueda Dual",
        "code": "222178",
        "desc": "Repuesto original Bertini código 222178: Pista De Reten Rueda Dual. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 23.43,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "222178",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "222178",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_222356",
        "name": "Repuesto Bertini Caño Bajada Alfalfero 32.000",
        "code": "222356",
        "desc": "Repuesto original Bertini código 222356: Caño Bajada Alfalfero 32.000. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 13.68,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "222356",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "222356",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_222424",
        "name": "Repuesto Bertini Buje De Brazo",
        "code": "222424",
        "desc": "Repuesto original Bertini código 222424: Buje De Brazo. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 12.3,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "222424",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "222424",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_222770",
        "name": "Repuesto Bertini Cuchilla Cierre Semillas",
        "code": "222770",
        "desc": "Repuesto original Bertini código 222770: Cuchilla Cierre Semillas. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 9.9,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "222770",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "222770",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_222772",
        "name": "Repuesto Bertini Tope Lateral",
        "code": "222772",
        "desc": "Repuesto original Bertini código 222772: Tope Lateral. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 16.06,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "222772",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "222772",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_222904",
        "name": "Repuesto Bertini Brida Porta Rodamiento Oscilante Hex. 32",
        "code": "222904",
        "desc": "Repuesto original Bertini código 222904: Brida Porta Rodamiento Oscilante Hex. 32. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 11.62,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "222904",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "222904",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_222906",
        "name": "Repuesto Bertini Bancada Del Rodamiento Oscilante Hex. 32",
        "code": "222906",
        "desc": "Repuesto original Bertini código 222906: Bancada Del Rodamiento Oscilante Hex. 32. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 19.27,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "222906",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "222906",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_223002",
        "name": "Repuesto Bertini Buje Separador Carenado",
        "code": "223002",
        "desc": "Repuesto original Bertini código 223002: Buje Separador Carenado. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 11.15,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "223002",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "223002",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_223003",
        "name": "Repuesto Bertini Buje De Paralelogramo",
        "code": "223003",
        "desc": "Repuesto original Bertini código 223003: Buje De Paralelogramo. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 22.48,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "223003",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "223003",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_223011",
        "name": "Repuesto Bertini Bajada D.D. Siembra",
        "code": "223011",
        "desc": "Repuesto original Bertini código 223011: Bajada D.D. Siembra. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 32.45,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "223011",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "223011",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_223027",
        "name": "Repuesto Bertini Eje Doble Disco 14 Pulg.",
        "code": "223027",
        "desc": "Repuesto original Bertini código 223027: Eje Doble Disco 14 Pulg.. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 19.61,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "223027",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "223027",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_223098",
        "name": "Repuesto Bertini Amarre D.Disco Fert. Grano Fino",
        "code": "223098",
        "desc": "Repuesto original Bertini código 223098: Amarre D.Disco Fert. Grano Fino. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 24.75,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "223098",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "223098",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_223131",
        "name": "Repuesto Bertini Patin Pisa Rastrojo",
        "code": "223131",
        "desc": "Repuesto original Bertini código 223131: Patin Pisa Rastrojo. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 10.45,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "223131",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "223131",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_223145",
        "name": "Repuesto Bertini Eje Tensor De Cadena Grano Grueso",
        "code": "223145",
        "desc": "Repuesto original Bertini código 223145: Eje Tensor De Cadena Grano Grueso. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 11.96,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "223145",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "223145",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_223147",
        "name": "Repuesto Bertini Pivote Tensor Cadena",
        "code": "223147",
        "desc": "Repuesto original Bertini código 223147: Pivote Tensor Cadena. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 14.01,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "223147",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "223147",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_223153",
        "name": "Repuesto Bertini Eje Rueda Dual Sin Freno",
        "code": "223153",
        "desc": "Repuesto original Bertini código 223153: Eje Rueda Dual Sin Freno. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 560.58,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "223153",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "223153",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_223154",
        "name": "Repuesto Bertini Maza De Rueda Dual",
        "code": "223154",
        "desc": "Repuesto original Bertini código 223154: Maza De Rueda Dual. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 160.74,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "223154",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "223154",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_223158",
        "name": "Repuesto Bertini Eje Del Brazo De Las Ruedas Laterales",
        "code": "223158",
        "desc": "Repuesto original Bertini código 223158: Eje Del Brazo De Las Ruedas Laterales. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 21.65,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "223158",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "223158",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_223170",
        "name": "Repuesto Bertini Cubeta Macho Derecha",
        "code": "223170",
        "desc": "Repuesto original Bertini código 223170: Cubeta Macho Derecha. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 19.41,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "223170",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "223170",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_223171",
        "name": "Repuesto Bertini Cubeta Macho Izquierda",
        "code": "223171",
        "desc": "Repuesto original Bertini código 223171: Cubeta Macho Izquierda. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 19.41,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "223171",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "223171",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_223174",
        "name": "Repuesto Bertini Eje Derecho",
        "code": "223174",
        "desc": "Repuesto original Bertini código 223174: Eje Derecho. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 15.41,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "223174",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "223174",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_223175",
        "name": "Repuesto Bertini Eje Izquierdo",
        "code": "223175",
        "desc": "Repuesto original Bertini código 223175: Eje Izquierdo. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 15.41,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "223175",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "223175",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_223198",
        "name": "Repuesto Bertini Maza Macho Cuchilla Labranza",
        "code": "223198",
        "desc": "Repuesto original Bertini código 223198: Maza Macho Cuchilla Labranza. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 42.87,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "223198",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "223198",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_223199",
        "name": "Repuesto Bertini Maza Hembra Cuchilla Labranza",
        "code": "223199",
        "desc": "Repuesto original Bertini código 223199: Maza Hembra Cuchilla Labranza. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 42.87,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "223199",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "223199",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_223200",
        "name": "Repuesto Bertini Eje De Maza",
        "code": "223200",
        "desc": "Repuesto original Bertini código 223200: Eje De Maza. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 20.36,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "223200",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "223200",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_223206",
        "name": "Repuesto Bertini Rueda Niveladora",
        "code": "223206",
        "desc": "Repuesto original Bertini código 223206: Rueda Niveladora. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 105.04,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "223206",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "223206",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_223234",
        "name": "Repuesto Bertini Rueda Modificada Sin Registro",
        "code": "223234",
        "desc": "Repuesto original Bertini código 223234: Rueda Modificada Sin Registro. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 110.93,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "223234",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "223234",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_223263",
        "name": "Repuesto Bertini Buje De Acople 25-29",
        "code": "223263",
        "desc": "Repuesto original Bertini código 223263: Buje De Acople 25-29. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 20.55,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "223263",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "223263",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_223277",
        "name": "Repuesto Bertini Eje Excentrico Doble Disco Lateral",
        "code": "223277",
        "desc": "Repuesto original Bertini código 223277: Eje Excentrico Doble Disco Lateral. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 17.83,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "223277",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "223277",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_223278",
        "name": "Repuesto Bertini Maza Torica Doble Disco De Siembra Y Abono",
        "code": "223278",
        "desc": "Repuesto original Bertini código 223278: Maza Torica Doble Disco De Siembra Y Abono. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 38.59,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "223278",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "223278",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_223280",
        "name": "Repuesto Bertini Cubeta Macho Derecho De Maza Torica-A",
        "code": "223280",
        "desc": "Repuesto original Bertini código 223280: Cubeta Macho Derecho De Maza Torica-A. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 15.72,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "223280",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "223280",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_223281",
        "name": "Repuesto Bertini Cubeta Macho Izquierdo De Maza Torica",
        "code": "223281",
        "desc": "Repuesto original Bertini código 223281: Cubeta Macho Izquierdo De Maza Torica. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 15.72,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "223281",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "223281",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_223283",
        "name": "Repuesto Bertini Maza Bolas Ajustable Para Rueda Lateral",
        "code": "223283",
        "desc": "Repuesto original Bertini código 223283: Maza Bolas Ajustable Para Rueda Lateral. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 35.14,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "223283",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "223283",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_223284",
        "name": "Repuesto Bertini Cubeta Macho Para Maza Ajustable Derecha",
        "code": "223284",
        "desc": "Repuesto original Bertini código 223284: Cubeta Macho Para Maza Ajustable Derecha. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 21.36,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "223284",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "223284",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_223285",
        "name": "Repuesto Bertini Cubeta Macho Para Maza Ajustable Izquier",
        "code": "223285",
        "desc": "Repuesto original Bertini código 223285: Cubeta Macho Para Maza Ajustable Izquier. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 21.36,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "223285",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "223285",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_223286",
        "name": "Repuesto Bertini Maza A Bolas Ajustable Para Rueda Tapadora",
        "code": "223286",
        "desc": "Repuesto original Bertini código 223286: Maza A Bolas Ajustable Para Rueda Tapadora. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 43.41,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "223286",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "223286",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_223299",
        "name": "Repuesto Bertini Maza De Rueda Dual Con Freno",
        "code": "223299",
        "desc": "Repuesto original Bertini código 223299: Maza De Rueda Dual Con Freno. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 148.24,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "223299",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "223299",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_223323",
        "name": "Repuesto Bertini Eje Dosificador Lateral Chasis 3 Metros",
        "code": "223323",
        "desc": "Repuesto original Bertini código 223323: Eje Dosificador Lateral Chasis 3 Metros. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 10.73,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "223323",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "223323",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_223324",
        "name": "Repuesto Bertini Eje Dosificador Central Para Chasis 3 Me",
        "code": "223324",
        "desc": "Repuesto original Bertini código 223324: Eje Dosificador Central Para Chasis 3 Me. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 28.62,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "223324",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "223324",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_223384",
        "name": "Repuesto Bertini Buje Espaciador Roscado Paralelogramo In",
        "code": "223384",
        "desc": "Repuesto original Bertini código 223384: Buje Espaciador Roscado Paralelogramo In. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 17.63,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "223384",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "223384",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_223393",
        "name": "Repuesto Bertini Perno Amarre Del Resorte Cuchilla C/Pua",
        "code": "223393",
        "desc": "Repuesto original Bertini código 223393: Perno Amarre Del Resorte Cuchilla C/Pua. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 9.54,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "223393",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "223393",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_223404",
        "name": "Repuesto Bertini Eje Entrada Mando Nuematico Para Alfalfe",
        "code": "223404",
        "desc": "Repuesto original Bertini código 223404: Eje Entrada Mando Nuematico Para Alfalfe. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 92.62,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "223404",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "223404",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_223418",
        "name": "Repuesto Bertini Eje De Mando Placa Para Cardan",
        "code": "223418",
        "desc": "Repuesto original Bertini código 223418: Eje De Mando Placa Para Cardan. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 41.55,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "223418",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "223418",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_223420",
        "name": "Repuesto Bertini Piñon Conico Z18 Modulo2",
        "code": "223420",
        "desc": "Repuesto original Bertini código 223420: Piñon Conico Z18 Modulo2. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 20.08,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "223420",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "223420",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_223432",
        "name": "Repuesto Bertini Punta De Eje Con Extremo Roscado",
        "code": "223432",
        "desc": "Repuesto original Bertini código 223432: Punta De Eje Con Extremo Roscado. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 280.29,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "223432",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "223432",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_223468",
        "name": "Repuesto Bertini Eje Rueda Trasera Derecha Para Raspador",
        "code": "223468",
        "desc": "Repuesto original Bertini código 223468: Eje Rueda Trasera Derecha Para Raspador. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 22.28,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "223468",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "223468",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_223469",
        "name": "Repuesto Bertini Eje Rueda Trasera Izquierda Para Raspado",
        "code": "223469",
        "desc": "Repuesto original Bertini código 223469: Eje Rueda Trasera Izquierda Para Raspado. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 22.28,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "223469",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "223469",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_223488",
        "name": "Repuesto Bertini Engranaje Conico Z=12 Modulo 3",
        "code": "223488",
        "desc": "Repuesto original Bertini código 223488: Engranaje Conico Z=12 Modulo 3. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 33.76,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "223488",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "223488",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_223499",
        "name": "Repuesto Bertini Placa De Sacrificio Derecha_Copy1",
        "code": "223499",
        "desc": "Repuesto original Bertini código 223499: Placa De Sacrificio Derecha_Copy1. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 20.36,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "223499",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "223499",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_223500",
        "name": "Repuesto Bertini Placa De Sacrificio Izquierda",
        "code": "223500",
        "desc": "Repuesto original Bertini código 223500: Placa De Sacrificio Izquierda. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 20.36,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "223500",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "223500",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_223522",
        "name": "Repuesto Bertini Placa De Sacrificio Derecha Corta",
        "code": "223522",
        "desc": "Repuesto original Bertini código 223522: Placa De Sacrificio Derecha Corta. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 20.36,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "223522",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "223522",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_223551",
        "name": "Repuesto Bertini Disco Rueda Trasera Dentada",
        "code": "223551",
        "desc": "Repuesto original Bertini código 223551: Disco Rueda Trasera Dentada. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 61.03,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "223551",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "223551",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_224003",
        "name": "Repuesto Bertini Disco Plano 14 Pulg. X 2.5  1 Filo-A",
        "code": "224003",
        "desc": "Repuesto original Bertini código 224003: Disco Plano 14 Pulg. X 2.5  1 Filo-A. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 42.77,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "224003",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "224003",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_224005",
        "name": "Repuesto Bertini Llanta 10 Para Cubierta 31X13.50X15",
        "code": "224005",
        "desc": "Repuesto original Bertini código 224005: Llanta 10 Para Cubierta 31X13.50X15. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 288.05,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "224005",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "224005",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_22000",
        "name": "Repuesto Bertini Banda De Goma Rueda Niveladora",
        "code": "22000",
        "desc": "Repuesto original Bertini código 22000: Banda De Goma Rueda Niveladora. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 200.34,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "22000",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "22000",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_224010",
        "name": "Repuesto Bertini Cuchilla Turbo 15 Pulg",
        "code": "224010",
        "desc": "Repuesto original Bertini código 224010: Cuchilla Turbo 15 Pulg. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 68.73,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "224010",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "224010",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_224012",
        "name": "Repuesto Bertini Manguera 3/4 X 4100 Mc 3/4 X Tg 1 1/16",
        "code": "224012",
        "desc": "Repuesto original Bertini código 224012: Manguera 3/4 X 4100 Mc 3/4 X Tg 1 1/16. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 133.83,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "224012",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "224012",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_224013",
        "name": "Repuesto Bertini Manguera 1/2 R2 X 5000 Mf 1/2 X Tg 7/8",
        "code": "224013",
        "desc": "Repuesto original Bertini código 224013: Manguera 1/2 R2 X 5000 Mf 1/2 X Tg 7/8. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 101.77,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "224013",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "224013",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_224014",
        "name": "Repuesto Bertini Tubo De Bajada Para Semilla Y Abono",
        "code": "224014",
        "desc": "Repuesto original Bertini código 224014: Tubo De Bajada Para Semilla Y Abono. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 24.88,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "224014",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "224014",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_224015",
        "name": "Repuesto Bertini Llanta Para Cubierta 400/60-15.5 14 Tela",
        "code": "224015",
        "desc": "Repuesto original Bertini código 224015: Llanta Para Cubierta 400/60-15.5 14 Tela. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 288.05,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "224015",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "224015",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_224022",
        "name": "Repuesto Bertini Valvula De Cierre",
        "code": "224022",
        "desc": "Repuesto original Bertini código 224022: Valvula De Cierre. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 90.01,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "224022",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "224022",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_224027",
        "name": "Repuesto Bertini Toma De Aire Chica",
        "code": "224027",
        "desc": "Repuesto original Bertini código 224027: Toma De Aire Chica. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 430.16,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "224027",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "224027",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_224037",
        "name": "Repuesto Bertini Llanta Alemana 17\"X16X3/16X3/8",
        "code": "224037",
        "desc": "Repuesto original Bertini código 224037: Llanta Alemana 17\"X16X3/16X3/8. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 665.86,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "224037",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "224037",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_224049",
        "name": "Repuesto Bertini Llanta Para Cubierta Vikafors 400/60-15.",
        "code": "224049",
        "desc": "Repuesto original Bertini código 224049: Llanta Para Cubierta Vikafors 400/60-15.. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 288.05,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "224049",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "224049",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_224051",
        "name": "Repuesto Bertini Cuchilla Turbo 16 Pulg.",
        "code": "224051",
        "desc": "Repuesto original Bertini código 224051: Cuchilla Turbo 16 Pulg.. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 68.73,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "224051",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "224051",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_224052",
        "name": "Repuesto Bertini Cuchilla Dura Flute 16 Pulg 50 Ondas Anc",
        "code": "224052",
        "desc": "Repuesto original Bertini código 224052: Cuchilla Dura Flute 16 Pulg 50 Ondas Anc. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 68.73,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "224052",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "224052",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_224067",
        "name": "Repuesto Bertini Llanta Alemana 16.00 X 17 Et-35",
        "code": "224067",
        "desc": "Repuesto original Bertini código 224067: Llanta Alemana 16.00 X 17 Et-35. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 665.86,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "224067",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "224067",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_224073",
        "name": "Repuesto Bertini Cuchilla Escotada 15 Pulg.",
        "code": "224073",
        "desc": "Repuesto original Bertini código 224073: Cuchilla Escotada 15 Pulg.. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 70.74,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "224073",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "224073",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_224074",
        "name": "Repuesto Bertini Disco Fertilizante Ingersol_17 Pulg_1Fil",
        "code": "224074",
        "desc": "Repuesto original Bertini código 224074: Disco Fertilizante Ingersol_17 Pulg_1Fil. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 87.25,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "224074",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "224074",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_224079",
        "name": "Repuesto Bertini Cuchilla De 17Pulg.",
        "code": "224079",
        "desc": "Repuesto original Bertini código 224079: Cuchilla De 17Pulg.. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 87.25,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "224079",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "224079",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_224084",
        "name": "Repuesto Bertini Cuchilla  Turbo De 18 Pulg.",
        "code": "224084",
        "desc": "Repuesto original Bertini código 224084: Cuchilla  Turbo De 18 Pulg.. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 87.25,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "224084",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "224084",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_225001",
        "name": "Repuesto Bertini Resorte Ruedas Conformadoras",
        "code": "225001",
        "desc": "Repuesto original Bertini código 225001: Resorte Ruedas Conformadoras. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 20.93,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "225001",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "225001",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_225003",
        "name": "Repuesto Bertini Resorte Del Carro",
        "code": "225003",
        "desc": "Repuesto original Bertini código 225003: Resorte Del Carro. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 60.83,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "225003",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "225003",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_225007",
        "name": "Repuesto Bertini Fleje Soporte Patin",
        "code": "225007",
        "desc": "Repuesto original Bertini código 225007: Fleje Soporte Patin. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 9.08,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "225007",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "225007",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_225008",
        "name": "Repuesto Bertini Resorte Del Carro Con Alambre 9 Mm",
        "code": "225008",
        "desc": "Repuesto original Bertini código 225008: Resorte Del Carro Con Alambre 9 Mm. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 84.67,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "225008",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "225008",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_225010",
        "name": "Repuesto Bertini Resorte D.D. Fert. Entre Lineas",
        "code": "225010",
        "desc": "Repuesto original Bertini código 225010: Resorte D.D. Fert. Entre Lineas. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 17.3,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "225010",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "225010",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_225012",
        "name": "Repuesto Bertini Resorte Doble Fertilizacion Grano Grueso",
        "code": "225012",
        "desc": "Repuesto original Bertini código 225012: Resorte Doble Fertilizacion Grano Grueso. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 17.3,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "225012",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "225012",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_225015",
        "name": "Repuesto Bertini Resorte De Cuchilla Al Chasis",
        "code": "225015",
        "desc": "Repuesto original Bertini código 225015: Resorte De Cuchilla Al Chasis. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 32.57,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "225015",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "225015",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_225024",
        "name": "Repuesto Bertini Resorte Doble Disco Fertilizacion Latera",
        "code": "225024",
        "desc": "Repuesto original Bertini código 225024: Resorte Doble Disco Fertilizacion Latera. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 27.55,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "225024",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "225024",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_225039",
        "name": "Repuesto Bertini Resorte Para Cuchilla Flotante Diametro",
        "code": "225039",
        "desc": "Repuesto original Bertini código 225039: Resorte Para Cuchilla Flotante Diametro. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 85.76,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "225039",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "225039",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_226024",
        "name": "Repuesto Bertini Perno Pastilla De Freno",
        "code": "226024",
        "desc": "Repuesto original Bertini código 226024: Perno Pastilla De Freno. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 10.72,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "226024",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "226024",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_226025",
        "name": "Repuesto Bertini Pastilla De Freno De Mordaza",
        "code": "226025",
        "desc": "Repuesto original Bertini código 226025: Pastilla De Freno De Mordaza. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 23.45,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "226025",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "226025",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_226027",
        "name": "Repuesto Bertini Perno Guia Pastilla De Freno",
        "code": "226027",
        "desc": "Repuesto original Bertini código 226027: Perno Guia Pastilla De Freno. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 16.08,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "226027",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "226027",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_226100",
        "name": "Repuesto Bertini Distribuidor Inyectado 2Da Edicion",
        "code": "226100",
        "desc": "Repuesto original Bertini código 226100: Distribuidor Inyectado 2Da Edicion. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 569.4,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "226100",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "226100",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_226101",
        "name": "Repuesto Bertini Codo Inyectado Distribuidor 2Da Edicion",
        "code": "226101",
        "desc": "Repuesto original Bertini código 226101: Codo Inyectado Distribuidor 2Da Edicion. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 32.4,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "226101",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "226101",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_226104",
        "name": "Repuesto Bertini Media Carcaza Inferior",
        "code": "226104",
        "desc": "Repuesto original Bertini código 226104: Media Carcaza Inferior. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 16.48,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "226104",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "226104",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_226105",
        "name": "Repuesto Bertini Media Carcaza Superior",
        "code": "226105",
        "desc": "Repuesto original Bertini código 226105: Media Carcaza Superior. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 16.48,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "226105",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "226105",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_240005",
        "name": "Repuesto Bertini Maza De Rueda 32.000",
        "code": "240005",
        "desc": "Repuesto original Bertini código 240005: Maza De Rueda 32.000. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 244.97,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "240005",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "240005",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_240014",
        "name": "Repuesto Bertini Buje Diam 32 Transmision",
        "code": "240014",
        "desc": "Repuesto original Bertini código 240014: Buje Diam 32 Transmision. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 19.17,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "240014",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "240014",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_241005",
        "name": "Repuesto Bertini Soporte Deslizador De Engranaje",
        "code": "241005",
        "desc": "Repuesto original Bertini código 241005: Soporte Deslizador De Engranaje. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 67.81,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "241005",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "241005",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_241006",
        "name": "Repuesto Bertini Soporte Sup De Botella Izquierda",
        "code": "241006",
        "desc": "Repuesto original Bertini código 241006: Soporte Sup De Botella Izquierda. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 59.06,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "241006",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "241006",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_241007",
        "name": "Repuesto Bertini Soporte Superior Derecho De Botella",
        "code": "241007",
        "desc": "Repuesto original Bertini código 241007: Soporte Superior Derecho De Botella. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 59.12,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "241007",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "241007",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_241008",
        "name": "Repuesto Bertini Soporte Inferior Izquierdo De Botella",
        "code": "241008",
        "desc": "Repuesto original Bertini código 241008: Soporte Inferior Izquierdo De Botella. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 59.12,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "241008",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "241008",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_241009",
        "name": "Repuesto Bertini Soporte Inferior Derecho De Botella",
        "code": "241009",
        "desc": "Repuesto original Bertini código 241009: Soporte Inferior Derecho De Botella. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 59.12,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "241009",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "241009",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_242004",
        "name": "Repuesto Bertini Guia Superior Del Perno Traba Horquilla",
        "code": "242004",
        "desc": "Repuesto original Bertini código 242004: Guia Superior Del Perno Traba Horquilla. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 24.2,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "242004",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "242004",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_242010",
        "name": "Repuesto Bertini Tapa Porta Reten",
        "code": "242010",
        "desc": "Repuesto original Bertini código 242010: Tapa Porta Reten. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 36.15,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "242010",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "242010",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_242042",
        "name": "Repuesto Bertini Base De Buje Horquilla Botella",
        "code": "242042",
        "desc": "Repuesto original Bertini código 242042: Base De Buje Horquilla Botella. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 34.79,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "242042",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "242042",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_242048",
        "name": "Repuesto Bertini Separador Buje Primer Tramo",
        "code": "242048",
        "desc": "Repuesto original Bertini código 242048: Separador Buje Primer Tramo. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 16.26,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "242048",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "242048",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_242061",
        "name": "Repuesto Bertini Entrada De Aire",
        "code": "242061",
        "desc": "Repuesto original Bertini código 242061: Entrada De Aire. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 43.11,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "242061",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "242061",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_242149",
        "name": "Repuesto Bertini Camisa Botella Horquilla",
        "code": "242149",
        "desc": "Repuesto original Bertini código 242149: Camisa Botella Horquilla. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 33.9,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "242149",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "242149",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_242178",
        "name": "Repuesto Bertini Tensor De Resorte De Lanza",
        "code": "242178",
        "desc": "Repuesto original Bertini código 242178: Tensor De Resorte De Lanza. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 12.37,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "242178",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "242178",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_242179",
        "name": "Repuesto Bertini Extremo De Biela De Empuje Horquilla",
        "code": "242179",
        "desc": "Repuesto original Bertini código 242179: Extremo De Biela De Empuje Horquilla. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 16.48,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "242179",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "242179",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_242180",
        "name": "Repuesto Bertini Tubo De Biela",
        "code": "242180",
        "desc": "Repuesto original Bertini código 242180: Tubo De Biela. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 16.48,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "242180",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "242180",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_242205",
        "name": "Repuesto Bertini Placa Sujecion Agujero Diam. 38",
        "code": "242205",
        "desc": "Repuesto original Bertini código 242205: Placa Sujecion Agujero Diam. 38. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 316.25,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "242205",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "242205",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_242206",
        "name": "Repuesto Bertini Placa Sujecion Agujero Diam. 32",
        "code": "242206",
        "desc": "Repuesto original Bertini código 242206: Placa Sujecion Agujero Diam. 32. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 137.16,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "242206",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "242206",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_242370",
        "name": "Repuesto Bertini Soporte Paralelogramo Delantero Derecho",
        "code": "242370",
        "desc": "Repuesto original Bertini código 242370: Soporte Paralelogramo Delantero Derecho. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 322.59,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "242370",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "242370",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_242397",
        "name": "Repuesto Bertini Refuerzo De Lateral Horquilla",
        "code": "242397",
        "desc": "Repuesto original Bertini código 242397: Refuerzo De Lateral Horquilla. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 27.53,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "242397",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "242397",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_242506",
        "name": "Repuesto Bertini Eje Central Removedor De Semillas 32.000",
        "code": "242506",
        "desc": "Repuesto original Bertini código 242506: Eje Central Removedor De Semillas 32.000. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 75.39,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "242506",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "242506",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_242507",
        "name": "Repuesto Bertini Eje Lateral Removedor De Semillas 32.000",
        "code": "242507",
        "desc": "Repuesto original Bertini código 242507: Eje Lateral Removedor De Semillas 32.000. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 37.71,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "242507",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "242507",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_242812",
        "name": "Repuesto Bertini Contrapeso Para Marcador",
        "code": "242812",
        "desc": "Repuesto original Bertini código 242812: Contrapeso Para Marcador. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 68.35,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "242812",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "242812",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_242839",
        "name": "Repuesto Bertini Soporte Derecho Lateral Dcf Reforma 2200",
        "code": "242839",
        "desc": "Repuesto original Bertini código 242839: Soporte Derecho Lateral Dcf Reforma 2200. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 27.41,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "242839",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "242839",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_242840",
        "name": "Repuesto Bertini Soporte Izquierdo Lateral Dcf Reforma 22",
        "code": "242840",
        "desc": "Repuesto original Bertini código 242840: Soporte Izquierdo Lateral Dcf Reforma 22. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 30.14,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "242840",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "242840",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_242846",
        "name": "Repuesto Bertini Tapa De Cierre Cilindro Marcador Sembrad",
        "code": "242846",
        "desc": "Repuesto original Bertini código 242846: Tapa De Cierre Cilindro Marcador Sembrad. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 34.65,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "242846",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "242846",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_242847",
        "name": "Repuesto Bertini Horquilla Cilindro Marcador Sembradora 2",
        "code": "242847",
        "desc": "Repuesto original Bertini código 242847: Horquilla Cilindro Marcador Sembradora 2. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 32.13,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "242847",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "242847",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_242859",
        "name": "Repuesto Bertini Maza 22 Mil Reforma Libre_Copy1...",
        "code": "242859",
        "desc": "Repuesto original Bertini código 242859: Maza 22 Mil Reforma Libre_Copy1.... Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 160.74,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "242859",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "242859",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_242929",
        "name": "Repuesto Bertini Adaptacion Tanque 36 Litros",
        "code": "242929",
        "desc": "Repuesto original Bertini código 242929: Adaptacion Tanque 36 Litros. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 183.09,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "242929",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "242929",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_242938",
        "name": "Repuesto Bertini Engranaje Postizo Z45 A Z31Paso 5/8",
        "code": "242938",
        "desc": "Repuesto original Bertini código 242938: Engranaje Postizo Z45 A Z31Paso 5/8. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 41.49,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "242938",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "242938",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_243011",
        "name": "Repuesto Bertini Eje De Horquilla",
        "code": "243011",
        "desc": "Repuesto original Bertini código 243011: Eje De Horquilla. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 243.01,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "243011",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "243011",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_243014",
        "name": "Repuesto Bertini Perno Traba Horquilla De Mando",
        "code": "243014",
        "desc": "Repuesto original Bertini código 243014: Perno Traba Horquilla De Mando. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 38.65,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "243014",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "243014",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_243017",
        "name": "Repuesto Bertini Engranaje Acople Transmision",
        "code": "243017",
        "desc": "Repuesto original Bertini código 243017: Engranaje Acople Transmision. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 23.98,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "243017",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "243017",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_243033",
        "name": "Repuesto Bertini Barra Eje",
        "code": "243033",
        "desc": "Repuesto original Bertini código 243033: Barra Eje. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 104.98,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "243033",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "243033",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_243044",
        "name": "Repuesto Bertini Perno De Paralelogramo Maquina 32.000",
        "code": "243044",
        "desc": "Repuesto original Bertini código 243044: Perno De Paralelogramo Maquina 32.000. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 84.59,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "243044",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "243044",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_243078",
        "name": "Repuesto Bertini Eje De Embrague",
        "code": "243078",
        "desc": "Repuesto original Bertini código 243078: Eje De Embrague. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 45.74,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "243078",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "243078",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_243081",
        "name": "Repuesto Bertini Boquilla Acople",
        "code": "243081",
        "desc": "Repuesto original Bertini código 243081: Boquilla Acople. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 11.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "243081",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "243081",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_243103",
        "name": "Repuesto Bertini Eje De Rueda",
        "code": "243103",
        "desc": "Repuesto original Bertini código 243103: Eje De Rueda. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 66.43,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "243103",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "243103",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_243137",
        "name": "Repuesto Bertini Eje Mando Granos Gruesos",
        "code": "243137",
        "desc": "Repuesto original Bertini código 243137: Eje Mando Granos Gruesos. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 20.65,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "243137",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "243137",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_243205",
        "name": "Repuesto Bertini Perno Cilindro Hidraulico",
        "code": "243205",
        "desc": "Repuesto original Bertini código 243205: Perno Cilindro Hidraulico. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 17.98,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "243205",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "243205",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_243224",
        "name": "Repuesto Bertini Eje De Paralelogramo",
        "code": "243224",
        "desc": "Repuesto original Bertini código 243224: Eje De Paralelogramo. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 115.62,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "243224",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "243224",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_243277",
        "name": "Repuesto Bertini Eje De Rueda",
        "code": "243277",
        "desc": "Repuesto original Bertini código 243277: Eje De Rueda. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 241.06,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "243277",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "243277",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_243329",
        "name": "Repuesto Bertini Bulon De Rueda",
        "code": "243329",
        "desc": "Repuesto original Bertini código 243329: Bulon De Rueda. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 10.87,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "243329",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "243329",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_243377",
        "name": "Repuesto Bertini Eje De Horquilla De Rueda De Mando Sin E",
        "code": "243377",
        "desc": "Repuesto original Bertini código 243377: Eje De Horquilla De Rueda De Mando Sin E. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 336.96,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "243377",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "243377",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_243389",
        "name": "Repuesto Bertini Eje De Rueda Horquilla De 600",
        "code": "243389",
        "desc": "Repuesto original Bertini código 243389: Eje De Rueda Horquilla De 600. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 337.35,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "243389",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "243389",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_243395",
        "name": "Repuesto Bertini Acople Bomba Multiplicador",
        "code": "243395",
        "desc": "Repuesto original Bertini código 243395: Acople Bomba Multiplicador. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 73.83,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "243395",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "243395",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_244002",
        "name": "Repuesto Bertini Llanta Para Goma 400/60 X 15.5",
        "code": "244002",
        "desc": "Repuesto original Bertini código 244002: Llanta Para Goma 400/60 X 15.5. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 288.05,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "244002",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "244002",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_244010",
        "name": "Repuesto Bertini Gato De Lanza",
        "code": "244010",
        "desc": "Repuesto original Bertini código 244010: Gato De Lanza. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 121.78,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "244010",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "244010",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_244017",
        "name": "Repuesto Bertini Manguera De Marcador",
        "code": "244017",
        "desc": "Repuesto original Bertini código 244017: Manguera De Marcador. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 27.2,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "244017",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "244017",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_244023",
        "name": "Repuesto Bertini Valvula Restrictora",
        "code": "244023",
        "desc": "Repuesto original Bertini código 244023: Valvula Restrictora. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 70.26,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "244023",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "244023",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_244024",
        "name": "Repuesto Bertini Valvula Compensadora Con Codos",
        "code": "244024",
        "desc": "Repuesto original Bertini código 244024: Valvula Compensadora Con Codos. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 480.3,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "244024",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "244024",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_244032",
        "name": "Repuesto Bertini Manguera Tanque",
        "code": "244032",
        "desc": "Repuesto original Bertini código 244032: Manguera Tanque. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 185.1,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "244032",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "244032",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_244044",
        "name": "Repuesto Bertini Manguera Hidraulica Al Tractor",
        "code": "244044",
        "desc": "Repuesto original Bertini código 244044: Manguera Hidraulica Al Tractor. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 140.25,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "244044",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "244044",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_244056",
        "name": "Repuesto Bertini Cilindro Doble Efecto De 5 Pulgadas",
        "code": "244056",
        "desc": "Repuesto original Bertini código 244056: Cilindro Doble Efecto De 5 Pulgadas. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 1045.37,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "244056",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "244056",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_244061",
        "name": "Repuesto Bertini Valvula Limitadora De Presion",
        "code": "244061",
        "desc": "Repuesto original Bertini código 244061: Valvula Limitadora De Presion. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 209.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "244061",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "244061",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_244088",
        "name": "Repuesto Bertini Cubierta Trelleborg 520/50-17",
        "code": "244088",
        "desc": "Repuesto original Bertini código 244088: Cubierta Trelleborg 520/50-17. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 1075.44,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "244088",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "244088",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_245001",
        "name": "Repuesto Bertini Resorte Del Perno Traba Ruedas",
        "code": "245001",
        "desc": "Repuesto original Bertini código 245001: Resorte Del Perno Traba Ruedas. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 10.25,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "245001",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "245001",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_245003",
        "name": "Repuesto Bertini Resorte De Lanza",
        "code": "245003",
        "desc": "Repuesto original Bertini código 245003: Resorte De Lanza. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 48.59,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "245003",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "245003",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_246030",
        "name": "Repuesto Bertini Rotulacion De Sembradora 32,000 De 6,7 M",
        "code": "246030",
        "desc": "Repuesto original Bertini código 246030: Rotulacion De Sembradora 32,000 De 6,7 M. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 368.27,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "246030",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "246030",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_246033",
        "name": "Repuesto Bertini Rotulacion De Sembradora 32,000 De 6,7 M",
        "code": "246033",
        "desc": "Repuesto original Bertini código 246033: Rotulacion De Sembradora 32,000 De 6,7 M. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 368.27,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "246033",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "246033",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_246035",
        "name": "Repuesto Bertini Rotulacion De Sembradora 32,000 De 8,240",
        "code": "246035",
        "desc": "Repuesto original Bertini código 246035: Rotulacion De Sembradora 32,000 De 8,240. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 440.51,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "246035",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "246035",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_301000",
        "name": "Repuesto Bertini Brazo Rueda Niveladora Izquierdo",
        "code": "301000",
        "desc": "Repuesto original Bertini código 301000: Brazo Rueda Niveladora Izquierdo. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 66.55,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "301000",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "301000",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_301001",
        "name": "Repuesto Bertini Brazo Rueda Niveladora Derecho",
        "code": "301001",
        "desc": "Repuesto original Bertini código 301001: Brazo Rueda Niveladora Derecho. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 66.55,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "301001",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "301001",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_302002",
        "name": "Repuesto Bertini Separador Largo Paralelogramo",
        "code": "302002",
        "desc": "Repuesto original Bertini código 302002: Separador Largo Paralelogramo. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 12.5,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "302002",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "302002",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_302043",
        "name": "Repuesto Bertini Rueda Niveladora",
        "code": "302043",
        "desc": "Repuesto original Bertini código 302043: Rueda Niveladora. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 94.79,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "302043",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "302043",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_302054",
        "name": "Repuesto Bertini Biela Fijacion Carcaza Cardan",
        "code": "302054",
        "desc": "Repuesto original Bertini código 302054: Biela Fijacion Carcaza Cardan. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 12.12,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "302054",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "302054",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_303002",
        "name": "Repuesto Bertini Buje Rueda Niveladora",
        "code": "303002",
        "desc": "Repuesto original Bertini código 303002: Buje Rueda Niveladora. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 15.34,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "303002",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "303002",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_303003",
        "name": "Repuesto Bertini Eje Doble Disco Siembra",
        "code": "303003",
        "desc": "Repuesto original Bertini código 303003: Eje Doble Disco Siembra. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 17.83,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "303003",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "303003",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_303005",
        "name": "Repuesto Bertini Buje Del Separador Paralelogramo",
        "code": "303005",
        "desc": "Repuesto original Bertini código 303005: Buje Del Separador Paralelogramo. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 14.35,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "303005",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "303005",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_303006",
        "name": "Repuesto Bertini Eje Del Brazo Rueda Niveladora",
        "code": "303006",
        "desc": "Repuesto original Bertini código 303006: Eje Del Brazo Rueda Niveladora. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 23.31,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "303006",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "303006",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_303008",
        "name": "Repuesto Bertini Maza Rueda Niveladora",
        "code": "303008",
        "desc": "Repuesto original Bertini código 303008: Maza Rueda Niveladora. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 44.16,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "303008",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "303008",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_303020",
        "name": "Repuesto Bertini Eje Rueda Lateral Izquierda",
        "code": "303020",
        "desc": "Repuesto original Bertini código 303020: Eje Rueda Lateral Izquierda. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 29.06,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "303020",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "303020",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_303021",
        "name": "Repuesto Bertini Eje Rueda Lateral Derecha",
        "code": "303021",
        "desc": "Repuesto original Bertini código 303021: Eje Rueda Lateral Derecha. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 29.06,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "303021",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "303021",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_305001",
        "name": "Repuesto Bertini Resorte Traccion Paralelogramo",
        "code": "305001",
        "desc": "Repuesto original Bertini código 305001: Resorte Traccion Paralelogramo. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 19.83,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "305001",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "305001",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_343010",
        "name": "Repuesto Bertini Eje Doble Disco Fertilizacion",
        "code": "343010",
        "desc": "Repuesto original Bertini código 343010: Eje Doble Disco Fertilizacion. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 17.83,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "343010",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "343010",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_366001",
        "name": "Repuesto Bertini Tabla De Siembra Grano Fino",
        "code": "366001",
        "desc": "Repuesto original Bertini código 366001: Tabla De Siembra Grano Fino. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 14.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "366001",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "366001",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_400006",
        "name": "Repuesto Bertini Volante",
        "code": "400006",
        "desc": "Repuesto original Bertini código 400006: Volante. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 21.4,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "400006",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "400006",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_500008",
        "name": "Repuesto Bertini Selector",
        "code": "500008",
        "desc": "Repuesto original Bertini código 500008: Selector. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 18.94,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "500008",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "500008",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_500010",
        "name": "Repuesto Bertini Biela Selector",
        "code": "500010",
        "desc": "Repuesto original Bertini código 500010: Biela Selector. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 14.51,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "500010",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "500010",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_500105",
        "name": "Repuesto Bertini Zafe Fijo",
        "code": "500105",
        "desc": "Repuesto original Bertini código 500105: Zafe Fijo. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 13.8,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "500105",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "500105",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_500201",
        "name": "Repuesto Bertini Engranaje Z=50",
        "code": "500201",
        "desc": "Repuesto original Bertini código 500201: Engranaje Z=50. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 84.34,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "500201",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "500201",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_500202",
        "name": "Repuesto Bertini Engranaje Z=35",
        "code": "500202",
        "desc": "Repuesto original Bertini código 500202: Engranaje Z=35. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 49.41,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "500202",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "500202",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_500217",
        "name": "Repuesto Bertini Chapa Guia De Ejes",
        "code": "500217",
        "desc": "Repuesto original Bertini código 500217: Chapa Guia De Ejes. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 17.44,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "500217",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "500217",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_500302",
        "name": "Repuesto Bertini Eje De Selectores",
        "code": "500302",
        "desc": "Repuesto original Bertini código 500302: Eje De Selectores. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 49.69,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "500302",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "500302",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_500305",
        "name": "Repuesto Bertini Eje Salida Caja 81 Cambios",
        "code": "500305",
        "desc": "Repuesto original Bertini código 500305: Eje Salida Caja 81 Cambios. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 46.89,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "500305",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "500305",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_500306",
        "name": "Repuesto Bertini Engranaje Z=21",
        "code": "500306",
        "desc": "Repuesto original Bertini código 500306: Engranaje Z=21. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 24.75,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "500306",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "500306",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_500307",
        "name": "Repuesto Bertini Engranaje Z=20",
        "code": "500307",
        "desc": "Repuesto original Bertini código 500307: Engranaje Z=20. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 24.75,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "500307",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "500307",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_500308",
        "name": "Repuesto Bertini Engranaje Z=19",
        "code": "500308",
        "desc": "Repuesto original Bertini código 500308: Engranaje Z=19. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 24.75,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "500308",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "500308",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_500309",
        "name": "Repuesto Bertini Engranaje Z=27",
        "code": "500309",
        "desc": "Repuesto original Bertini código 500309: Engranaje Z=27. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 29.66,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "500309",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "500309",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_500310",
        "name": "Repuesto Bertini Engranaje Z=28",
        "code": "500310",
        "desc": "Repuesto original Bertini código 500310: Engranaje Z=28. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 29.8,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "500310",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "500310",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_500311",
        "name": "Repuesto Bertini Engranaje Z=29",
        "code": "500311",
        "desc": "Repuesto original Bertini código 500311: Engranaje Z=29. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 33.76,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "500311",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "500311",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_500312",
        "name": "Repuesto Bertini Engranaje Z=26",
        "code": "500312",
        "desc": "Repuesto original Bertini código 500312: Engranaje Z=26. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 29.66,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "500312",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "500312",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_500313",
        "name": "Repuesto Bertini Engranaje Z=23",
        "code": "500313",
        "desc": "Repuesto original Bertini código 500313: Engranaje Z=23. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 24.75,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "500313",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "500313",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_500314",
        "name": "Repuesto Bertini Engranaje Z=20",
        "code": "500314",
        "desc": "Repuesto original Bertini código 500314: Engranaje Z=20. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 24.75,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "500314",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "500314",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_500315",
        "name": "Repuesto Bertini Engranaje Z=25",
        "code": "500315",
        "desc": "Repuesto original Bertini código 500315: Engranaje Z=25. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 27.34,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "500315",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "500315",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_500316",
        "name": "Repuesto Bertini Engranaje Z=22",
        "code": "500316",
        "desc": "Repuesto original Bertini código 500316: Engranaje Z=22. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 26.79,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "500316",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "500316",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_500317",
        "name": "Repuesto Bertini Engranaje Z=19C",
        "code": "500317",
        "desc": "Repuesto original Bertini código 500317: Engranaje Z=19C. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 24.75,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "500317",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "500317",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_500318",
        "name": "Repuesto Bertini Engranaje Z=25",
        "code": "500318",
        "desc": "Repuesto original Bertini código 500318: Engranaje Z=25. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 27.34,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "500318",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "500318",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_500402",
        "name": "Repuesto Bertini Tabla De Cambios",
        "code": "500402",
        "desc": "Repuesto original Bertini código 500402: Tabla De Cambios. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 14.5,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "500402",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "500402",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_500403",
        "name": "Repuesto Bertini Placa Posicion De Palancas (C. Siembra)",
        "code": "500403",
        "desc": "Repuesto original Bertini código 500403: Placa Posicion De Palancas (C. Siembra). Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 10.32,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "500403",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "500403",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_500404",
        "name": "Repuesto Bertini Placa Posicion De Palancas (C. Fertil.)",
        "code": "500404",
        "desc": "Repuesto original Bertini código 500404: Placa Posicion De Palancas (C. Fertil.). Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 10.32,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "500404",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "500404",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_510004",
        "name": "Repuesto Bertini Buje De Entrada",
        "code": "510004",
        "desc": "Repuesto original Bertini código 510004: Buje De Entrada. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 11.55,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "510004",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "510004",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_510005",
        "name": "Repuesto Bertini Buje De Salida",
        "code": "510005",
        "desc": "Repuesto original Bertini código 510005: Buje De Salida. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 10.52,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "510005",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "510005",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_100036",
        "name": "Repuesto Bertini Buje Eje Intermedio",
        "code": "100036",
        "desc": "Repuesto original Bertini código 100036: Buje Eje Intermedio. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 456.13,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "100036",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "100036",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_510015",
        "name": "Repuesto Bertini Zafe Fijo 8.500",
        "code": "510015",
        "desc": "Repuesto original Bertini código 510015: Zafe Fijo 8.500. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 13.8,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "510015",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "510015",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_101016",
        "name": "Repuesto Bertini Trinquete Lado Izquierdo",
        "code": "101016",
        "desc": "Repuesto original Bertini código 101016: Trinquete Lado Izquierdo. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 456.22,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "101016",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "101016",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_101017",
        "name": "Repuesto Bertini Trinquete Lado Derecho",
        "code": "101017",
        "desc": "Repuesto original Bertini código 101017: Trinquete Lado Derecho. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 456.22,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "101017",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "101017",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_510105",
        "name": "Repuesto Bertini Zafe Fijo",
        "code": "510105",
        "desc": "Repuesto original Bertini código 510105: Zafe Fijo. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 13.8,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "510105",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "510105",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_510315",
        "name": "Repuesto Bertini Eje De Entrada Caja 81 Cambios",
        "code": "510315",
        "desc": "Repuesto original Bertini código 510315: Eje De Entrada Caja 81 Cambios. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 46.13,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "510315",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "510315",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_510603",
        "name": "Repuesto Bertini Junta De Tapa",
        "code": "510603",
        "desc": "Repuesto original Bertini código 510603: Junta De Tapa. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 32.89,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "510603",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "510603",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_750008",
        "name": "Repuesto Bertini O Ring 2335 Sh 90",
        "code": "750008",
        "desc": "Repuesto original Bertini código 750008: O Ring 2335 Sh 90. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 13.25,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "750008",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "750008",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_30205",
        "name": "Repuesto Bertini Rodamiento",
        "code": "30205",
        "desc": "Repuesto original Bertini código 30205: Rodamiento. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 697.61,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "30205",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "30205",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_30204",
        "name": "Repuesto Bertini Rodamiento",
        "code": "30204",
        "desc": "Repuesto original Bertini código 30204: Rodamiento. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 697.61,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "30204",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "30204",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_30208",
        "name": "Repuesto Bertini Rodamiento",
        "code": "30208",
        "desc": "Repuesto original Bertini código 30208: Rodamiento. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 697.61,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "30208",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "30208",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_30210",
        "name": "Repuesto Bertini Rodamiento",
        "code": "30210",
        "desc": "Repuesto original Bertini código 30210: Rodamiento. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 697.61,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "30210",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "30210",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_780007",
        "name": "Repuesto Bertini Rodamiento 6204 1 Rs",
        "code": "780007",
        "desc": "Repuesto original Bertini código 780007: Rodamiento 6204 1 Rs. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 11.62,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "780007",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "780007",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_33015",
        "name": "Repuesto Bertini Rodamiento Conico",
        "code": "33015",
        "desc": "Repuesto original Bertini código 33015: Rodamiento Conico. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 697.61,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "33015",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "33015",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_780010",
        "name": "Repuesto Bertini Rodamiento 30209 J2/Q",
        "code": "780010",
        "desc": "Repuesto original Bertini código 780010: Rodamiento 30209 J2/Q. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 29.88,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "780010",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "780010",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_850004",
        "name": "Repuesto Bertini Buje Central De Barra",
        "code": "850004",
        "desc": "Repuesto original Bertini código 850004: Buje Central De Barra. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 14.82,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "850004",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "850004",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_850027",
        "name": "Repuesto Bertini Buje Mando Abono",
        "code": "850027",
        "desc": "Repuesto original Bertini código 850027: Buje Mando Abono. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 14.01,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "850027",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "850027",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_850035",
        "name": "Repuesto Bertini Maza De Rueda",
        "code": "850035",
        "desc": "Repuesto original Bertini código 850035: Maza De Rueda. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 203.94,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "850035",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "850035",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_850047",
        "name": "Repuesto Bertini Tapa De Tolva Izquierda",
        "code": "850047",
        "desc": "Repuesto original Bertini código 850047: Tapa De Tolva Izquierda. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 749.49,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "850047",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "850047",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_852175",
        "name": "Repuesto Bertini Engranaje Z 70 Cadena 1/2 Mando",
        "code": "852175",
        "desc": "Repuesto original Bertini código 852175: Engranaje Z 70 Cadena 1/2 Mando. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 50.24,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "852175",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "852175",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_852318",
        "name": "Repuesto Bertini Soporte De Eje Brazos Discos",
        "code": "852318",
        "desc": "Repuesto original Bertini código 852318: Soporte De Eje Brazos Discos. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 9.57,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "852318",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "852318",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_852375",
        "name": "Repuesto Bertini Eje Derecho Dosificador",
        "code": "852375",
        "desc": "Repuesto original Bertini código 852375: Eje Derecho Dosificador. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 12.85,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "852375",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "852375",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_852376",
        "name": "Repuesto Bertini Eje Izquierdo Dosificador",
        "code": "852376",
        "desc": "Repuesto original Bertini código 852376: Eje Izquierdo Dosificador. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 14.35,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "852376",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "852376",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_852393",
        "name": "Repuesto Bertini Eje De Entrada",
        "code": "852393",
        "desc": "Repuesto original Bertini código 852393: Eje De Entrada. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 42.03,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "852393",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "852393",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_852459",
        "name": "Repuesto Bertini Media Horquilla Der Rueda Compactadora",
        "code": "852459",
        "desc": "Repuesto original Bertini código 852459: Media Horquilla Der Rueda Compactadora. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 28.01,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "852459",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "852459",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_853006",
        "name": "Repuesto Bertini Grampa De Leva De Barra De Levante",
        "code": "853006",
        "desc": "Repuesto original Bertini código 853006: Grampa De Leva De Barra De Levante. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 10.66,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "853006",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "853006",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_853050",
        "name": "Repuesto Bertini Eje De Transmision",
        "code": "853050",
        "desc": "Repuesto original Bertini código 853050: Eje De Transmision. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 62.81,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "853050",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "853050",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_853057",
        "name": "Repuesto Bertini Eje De Rueda",
        "code": "853057",
        "desc": "Repuesto original Bertini código 853057: Eje De Rueda. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 12.17,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "853057",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "853057",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_853067",
        "name": "Repuesto Bertini Eje Maza Trasera Recta",
        "code": "853067",
        "desc": "Repuesto original Bertini código 853067: Eje Maza Trasera Recta. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 12.17,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "853067",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "853067",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_854003",
        "name": "Repuesto Bertini Tubo Plastico Siembra",
        "code": "854003",
        "desc": "Repuesto original Bertini código 854003: Tubo Plastico Siembra. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 9.24,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "854003",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "854003",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_854011",
        "name": "Repuesto Bertini Tubo De Bajada De Alfalfa Sembradora Modelo 10.000/8000 Diam 18Mm X 500Mm",
        "code": "854011",
        "desc": "Repuesto original Bertini código 854011: Tubo De Bajada De Alfalfa Sembradora Modelo 10.000/8000 Diam 18Mm X 500Mm. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 25.56,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "854011",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "854011",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_854016",
        "name": "Repuesto Bertini Tabla Fertilizante",
        "code": "854016",
        "desc": "Repuesto original Bertini código 854016: Tabla Fertilizante. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 13.33,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "854016",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "854016",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_854017",
        "name": "Repuesto Bertini Llanta 12,4 X 28",
        "code": "854017",
        "desc": "Repuesto original Bertini código 854017: Llanta 12,4 X 28. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 518.82,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "854017",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "854017",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_854020",
        "name": "Repuesto Bertini Tapa Boca Semilla 8.500",
        "code": "854020",
        "desc": "Repuesto original Bertini código 854020: Tapa Boca Semilla 8.500. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 10.26,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "854020",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "854020",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_854023",
        "name": "Repuesto Bertini Tapa Boca",
        "code": "854023",
        "desc": "Repuesto original Bertini código 854023: Tapa Boca. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 11.12,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "854023",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "854023",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_854024",
        "name": "Repuesto Bertini Vibro De Borra Huella",
        "code": "854024",
        "desc": "Repuesto original Bertini código 854024: Vibro De Borra Huella. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 26.38,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "854024",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "854024",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_854029",
        "name": "Repuesto Bertini \"Disco Plano 0 13 1/2\"\"",
        "code": "854029",
        "desc": "Repuesto original Bertini código 854029: \"Disco Plano 0 13 1/2\"\". Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 17.3,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "854029",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "854029",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_10046",
        "name": "Repuesto Bertini Tubo Goma Siembra",
        "code": "10046",
        "desc": "Repuesto original Bertini código 10046: Tubo Goma Siembra. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 763.82,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "10046",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "10046",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_854039",
        "name": "Repuesto Bertini Carcaza Dosificador",
        "code": "854039",
        "desc": "Repuesto original Bertini código 854039: Carcaza Dosificador. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 18.11,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "854039",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "854039",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_854055",
        "name": "Repuesto Bertini Tabla De Siembra",
        "code": "854055",
        "desc": "Repuesto original Bertini código 854055: Tabla De Siembra. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 13.33,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "854055",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "854055",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_855003",
        "name": "Repuesto Bertini Resorte Amortiguador Grueso",
        "code": "855003",
        "desc": "Repuesto original Bertini código 855003: Resorte Amortiguador Grueso. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 11.96,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "855003",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "855003",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_855004",
        "name": "Repuesto Bertini Resorte Amortiguador Fino",
        "code": "855004",
        "desc": "Repuesto original Bertini código 855004: Resorte Amortiguador Fino. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 10.52,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "855004",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "855004",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_86019",
        "name": "Repuesto Bertini Tabla De Fertilizacion Simple",
        "code": "86019",
        "desc": "Repuesto original Bertini código 86019: Tabla De Fertilizacion Simple. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 9.75,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "86019",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "86019",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_86021",
        "name": "Repuesto Bertini Tabla De Siembra Grano Fino",
        "code": "86021",
        "desc": "Repuesto original Bertini código 86021: Tabla De Siembra Grano Fino. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 14.36,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "86021",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "86021",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_86023",
        "name": "Repuesto Bertini Rotulacion De Sembradora 8000 Sin Alfalf",
        "code": "86023",
        "desc": "Repuesto original Bertini código 86023: Rotulacion De Sembradora 8000 Sin Alfalf. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 192.93,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "86023",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "86023",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_86024",
        "name": "Repuesto Bertini Rotulacion De Sembradora 8000 Con Alfalf",
        "code": "86024",
        "desc": "Repuesto original Bertini código 86024: Rotulacion De Sembradora 8000 Con Alfalf. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 192.93,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "86024",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "86024",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_900002",
        "name": "Repuesto Bertini Media Maza De Cuchilla",
        "code": "900002",
        "desc": "Repuesto original Bertini código 900002: Media Maza De Cuchilla. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 14.82,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "900002",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "900002",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_903018",
        "name": "Repuesto Bertini Eje De Cuchilla",
        "code": "903018",
        "desc": "Repuesto original Bertini código 903018: Eje De Cuchilla. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 9.7,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "903018",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "903018",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_950001",
        "name": "Repuesto Bertini Soporte De Bancada",
        "code": "950001",
        "desc": "Repuesto original Bertini código 950001: Soporte De Bancada. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 12.37,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "950001",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "950001",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    },
    {
        "id": "bertini_950002",
        "name": "Repuesto Bertini Bancada",
        "code": "950002",
        "desc": "Repuesto original Bertini código 950002: Bancada. Diseñado para máxima durabilidad en sembradoras de siembra directa Bertini.",
        "price": 12.37,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bertini",
        "model": "950002",
        "stock": 1,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
        "specs": {
            "Marca": "Bertini",
            "Código Original": "950002",
            "Tipo": "Repuesto de Sembradora",
            "Condición": "Nuevo"
        }
    }
];

let products = [];
const EXCHANGE_RATE_ARS = 1520.0;

// Inicialización de la base de datos de productos
export async function loadProductsData() {
    try {
        if (useFirebase) {
            const querySnapshot = await getDocs(collection(db, "druetto_products"));
            const fbList = [];
            querySnapshot.forEach((doc) => {
                fbList.push({ id: doc.id, ...doc.data() });
            });
            
            if (fbList.length > 0) {
                const existingIds = new Set(fbList.map(p => p.id));
                const missingSeeds = SEED_PRODUCTS.filter(p => !existingIds.has(p.id));
                if (missingSeeds.length > 0) {
                    try {
                        const batch = writeBatch(db);
                        for (const p of missingSeeds) {
                            const docRef = doc(db, "druetto_products", p.id);
                            batch.set(docRef, p);
                            fbList.push(p);
                        }
                        await batch.commit();
                    } catch (e) {}
                }
                fbList.forEach(item => {
                    const seed = SEED_PRODUCTS.find(s => s.id === item.id || s.code === item.code);
                    if (seed && item.price !== seed.price) {
                        item.price = seed.price;
                    }
                });
                products = fbList;
            } else {
                let deletedCount = 0;
                try {
                    const delSnap = await getDocs(collection(db, "druetto_deleted_products"));
                    deletedCount = delSnap.docs.length;
                } catch (err) {}

                if (deletedCount === 0) {
                    const batch = writeBatch(db);
                    for (const p of SEED_PRODUCTS) {
                        const docRef = doc(db, "druetto_products", p.id);
                        batch.set(docRef, p);
                    }
                    await batch.commit();
                    products = [...SEED_PRODUCTS];
                } else {
                    products = [];
                }
            }
        } else {
            // Local fallback
            const localList = await localDb.getCollection("products");
            if (localList.length > 0) {
                const existingIds = new Set(localList.map(p => p.id));
                const missingSeeds = SEED_PRODUCTS.filter(p => !existingIds.has(p.id));
                if (missingSeeds.length > 0) {
                    localList.push(...missingSeeds);
                }
                localList.forEach(item => {
                    const seed = SEED_PRODUCTS.find(s => s.id === item.id || s.code === item.code);
                    if (seed && item.price !== seed.price) {
                        item.price = seed.price;
                    }
                });
                await localDb.setCollection("products", localList);
                products = localList;
            } else {
                const deletedList = await localDb.getCollection("deleted_products");
                if (deletedList.length === 0) {
                    await localDb.setCollection("products", SEED_PRODUCTS);
                    products = [...SEED_PRODUCTS];
                } else {
                    products = [];
                }
            }
        }
    } catch (e) {
        console.error("Error cargando catálogo de productos:", e);
        products = [...SEED_PRODUCTS];
    }
    return products;
}

export function getProducts() {
    return products.length > 0 ? products : SEED_PRODUCTS;
}

export function getProductById(id) {
    const list = getProducts();
    return list.find(p => p.id === id || p.code === id) || null;
}

// ─── RENDERIZADO DEL CATÁLOGO DE LA TIENDA ───
window.currentPage = window.currentPage || 1;
window.productsPerPage = window.productsPerPage || 30;

export function renderStoreCatalog(containerId = 'store-catalog-grid', filters = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let items = getProducts();

    if (filters.search && filters.search.trim() !== '') {
        const q = filters.search.toLowerCase().trim();
        items = items.filter(p => {
            const name = (p.name || '').toLowerCase();
            const code = (p.code || '').toLowerCase();
            const brand = (p.brand || '').toLowerCase();
            const category = (p.category || '').toLowerCase();
            const model = (p.model || '').toLowerCase();
            const desc = (p.desc || p.description || '').toLowerCase();
            return name.includes(q) || code.includes(q) || brand.includes(q) || category.includes(q) || model.includes(q) || desc.includes(q);
        });
    }

    if (filters.category && filters.category !== 'all') {
        const catQ = filters.category.toLowerCase().trim();
        items = items.filter(p => (p.category || '').toLowerCase().trim() === catQ);
    }

    if (filters.brand && filters.brand !== 'all') {
        const brandQ = filters.brand.toLowerCase().trim();
        items = items.filter(p => (p.brand || '').toLowerCase().trim() === brandQ);
    }

    if (filters.condition && filters.condition !== 'all') {
        const condQ = filters.condition.toLowerCase().trim();
        items = items.filter(p => (p.condition || '').toLowerCase().trim() === condQ);
    }

    if (filters.priceMin && !isNaN(parseFloat(filters.priceMin))) {
        const minP = parseFloat(filters.priceMin);
        items = items.filter(p => (parseFloat(p.price) || 0) >= minP);
    }
    if (filters.priceMax && !isNaN(parseFloat(filters.priceMax))) {
        const maxP = parseFloat(filters.priceMax);
        items = items.filter(p => (parseFloat(p.price) || 0) <= maxP);
    }

    if (filters.order) {
        if (filters.order === 'price-asc') {
            items.sort((a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0));
        } else if (filters.order === 'price-desc') {
            items.sort((a, b) => (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0));
        } else if (filters.order === 'name-asc') {
            items.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        } else if (filters.order === 'name-desc') {
            items.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
        }
    }

    const totalCountEl = document.getElementById('catalog-total-count');
    if (totalCountEl) {
        totalCountEl.innerText = items.length;
    }

    const perPage = window.productsPerPage || 30;
    const totalPages = Math.ceil(items.length / perPage) || 1;
    if (window.currentPage > totalPages) window.currentPage = totalPages;
    if (window.currentPage < 1) window.currentPage = 1;

    const startIdx = (window.currentPage - 1) * perPage;
    const paginatedItems = items.slice(startIdx, startIdx + perPage);

    if (paginatedItems.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: #6b7280;">
                <i class="fas fa-search" style="font-size: 2.5rem; margin-bottom: 1rem; color: #d1d5db;"></i>
                <h3 style="font-size: 1.25rem; font-weight: 700; color: #111827;">No se encontraron productos</h3>
                <p style="font-size: 0.95rem; margin-top: 0.5rem;">Intenta cambiando los filtros o la búsqueda.</p>
            </div>
        `;
    } else {
        container.innerHTML = paginatedItems.map(p => {
            const img = (p.images && p.images.length > 0) ? p.images[0] : 'assets/img/casadruettologo1.png';
            const priceUSD = parseFloat(p.price) || 0;
            const priceARS = priceUSD * EXCHANGE_RATE_ARS;

            const priceUSDFormatted = priceUSD.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            const priceARSFormatted = priceARS.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

            const cond = p.condition || 'Nuevo';
            const brandName = p.brand || 'Casa Druetto';
            const detailUrl = `producto-detalle.html?id=${encodeURIComponent(p.id)}`;
            const badgeClass = cond.toLowerCase().includes('usad') ? 'usado' : (cond.toLowerCase().includes('restaur') ? 'restaurado' : 'nuevo');

            return `
                <div class="product-store-card">
                    <div class="store-card-img-wrap" onclick="window.location.href='${detailUrl}'">
                        <span class="store-card-badge ${badgeClass}">${cond}</span>
                        <img src="${img}" alt="${p.name}" class="store-card-img" loading="lazy" onerror="this.src='assets/img/casadruettologo1.png'">
                    </div>
                    <div class="store-card-info">
                        <div class="store-card-cat">${brandName} • ${p.category || 'Repuestos'}</div>
                        <h3 class="store-card-title" onclick="window.location.href='${detailUrl}'">${p.name}</h3>
                        <div class="store-card-code">Código: ${p.code || p.model || 'N/A'}</div>
                        <div class="store-card-price-row" style="flex-direction:column; align-items:flex-start; gap:0.1rem; margin-bottom:0.8rem;">
                            <span class="store-card-price" style="font-size:1.15rem;">$${priceUSDFormatted} <small style="font-size:0.65em; color:#6b7280; font-weight:normal;">USD</small></span>
                            <span style="font-size:0.85rem; color:#059669; font-weight:700;">$${priceARSFormatted} <small style="font-size:0.7em; font-weight:600;">ARS</small></span>
                        </div>
                        <div class="store-card-actions">
                            <a href="${detailUrl}" class="store-card-btn-view"><i class="fas fa-eye"></i> Ver Detalle</a>
                            <button onclick="if(typeof addToCart==='function'){addToCart('${p.id}');} if(typeof showWebToast==='function'){showWebToast('🛒 Agregado al carrito');}" class="store-card-btn-cart" title="Agregar al Carrito">
                                <i class="fas fa-shopping-cart"></i> Agregar
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    const paginationContainer = document.getElementById('catalog-pagination');
    if (paginationContainer) {
        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
        } else {
            let pagesHtml = '';
            pagesHtml += `<button onclick="changePage(${window.currentPage - 1})" class="pagination-btn" ${window.currentPage === 1 ? 'disabled' : ''}><i class="fas fa-chevron-left"></i> Anterior</button>`;
            
            for (let i = 1; i <= totalPages; i++) {
                if (i === 1 || i === totalPages || (i >= window.currentPage - 2 && i <= window.currentPage + 2)) {
                    pagesHtml += `<button onclick="changePage(${i})" class="pagination-btn ${i === window.currentPage ? 'active' : ''}">${i}</button>`;
                } else if (i === window.currentPage - 3 || i === window.currentPage + 3) {
                    pagesHtml += `<span class="pagination-ellipsis">...</span>`;
                }
            }

            pagesHtml += `<button onclick="changePage(${window.currentPage + 1})" class="pagination-btn" ${window.currentPage === totalPages ? 'disabled' : ''}>Siguiente <i class="fas fa-chevron-right"></i></button>`;
            paginationContainer.innerHTML = pagesHtml;
        }
    }
}
window.renderStoreCatalog = renderStoreCatalog;

// ─── RENDERIZADO DEL DETALLE DE PRODUCTO ───
export async function renderProductDetailPage() {
    const params = new URLSearchParams(window.location.search);
    const prodId = params.get('id');
    
    const titleEl = document.getElementById('detail-title');
    if (!titleEl) return;

    const allProducts = await loadProductsData();
    if (!prodId) {
        titleEl.innerText = "Producto no especificado";
        return;
    }

    const product = getProductById(prodId) || allProducts.find(p => p.id === prodId || p.code === prodId);
    
    if (!product) {
        titleEl.innerText = "Producto no encontrado";
        const descEl = document.getElementById('detail-desc');
        if (descEl) descEl.innerText = "El producto solicitado no existe o fue removido del catálogo.";
        return;
    }

    document.title = `${product.name} | Casa Druetto`;
    titleEl.innerText = product.name;

    const codeEl = document.getElementById('detail-code');
    if (codeEl) codeEl.innerText = product.code || product.model || '--';

    const condEl = document.getElementById('detail-condition');
    if (condEl) condEl.innerText = product.condition || 'Nuevo';

    const catEl = document.getElementById('detail-category');
    if (catEl) catEl.innerText = product.category || 'General';

    const brandEl = document.getElementById('detail-brand');
    if (brandEl) brandEl.innerText = product.brand || 'Casa Druetto';

    const priceUSD = parseFloat(product.price) || 0;
    const priceARS = priceUSD * EXCHANGE_RATE_ARS;

    const priceEl = document.getElementById('detail-price');
    if (priceEl) priceEl.innerText = `$${priceUSD.toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2})} USD`;

    const priceArsEl = document.getElementById('detail-price-ars');
    if (priceArsEl) priceArsEl.innerText = `$${priceARS.toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2})} ARS`;

    const descEl = document.getElementById('detail-desc');
    if (descEl) descEl.innerText = product.desc || product.description || "Consulte por características técnicas completas y asesoramiento especializado.";

    const stockEl = document.getElementById('detail-stock');
    if (stockEl) {
        const stockQty = product.stock !== undefined ? product.stock : 1;
        stockEl.className = stockQty > 0 ? "stock-status in-stock" : "stock-status out-of-stock";
        stockEl.innerText = stockQty > 0 ? `Stock disponible: ${stockQty} unidad${stockQty > 1 ? 'es' : ''}` : "Consultar disponibilidad";
    }

    const images = (product.images && product.images.length > 0) ? product.images : ['assets/img/casadruettologo1.png'];
    
    const thumbsCol = document.getElementById('product-detail-thumbs');
    const mainImgBox = document.getElementById('product-detail-main-img');

    if (mainImgBox) {
        mainImgBox.innerHTML = `<img src="${images[0]}" alt="${product.name}" id="main-detail-image" style="max-width:100%; max-height:400px; object-fit:contain;" onerror="this.src='assets/img/casadruettologo1.png'">`;
    }

    if (thumbsCol) {
        thumbsCol.innerHTML = images.map((img, idx) => `
            <img src="${img}" alt="Vista ${idx+1}" class="thumb-img ${idx === 0 ? 'active' : ''}" onclick="window.switchDetailMainImage('${img}', this)" onerror="this.src='assets/img/casadruettologo1.png'">
        `).join('');
    }

    const specsTable = document.getElementById('detail-specs-table');
    if (specsTable) {
        let specsRows = `
            <tr><th>Marca</th><td>${product.brand || 'Casa Druetto'}</td></tr>
            <tr><th>Modelo / Código</th><td>${product.code || product.model || 'N/A'}</td></tr>
            <tr><th>Categoría</th><td>${product.category || 'General'}</td></tr>
            <tr><th>Condición</th><td>${product.condition || 'Nuevo'}</td></tr>
        `;

        if (product.specs && typeof product.specs === 'object') {
            for (const [key, val] of Object.entries(product.specs)) {
                specsRows += `<tr><th>${key}</th><td>${val}</td></tr>`;
            }
        }
        specsTable.innerHTML = specsRows;
    }

    const buyBtn = document.getElementById('detail-buy-local-btn');
    if (buyBtn) {
        buyBtn.onclick = function() {
            if (typeof window.addToCart === 'function') {
                window.addToCart(product.id);
            }
            if (typeof window.toggleCart === 'function') {
                window.toggleCart(true);
            }
        };
    }

    const addCartBtn = document.getElementById('detail-add-cart-btn');
    if (addCartBtn) {
        addCartBtn.onclick = function() {
            if (typeof window.addToCart === 'function') {
                window.addToCart(product.id);
            }
            if (typeof window.showWebToast === 'function') {
                window.showWebToast(`🛒 ${product.name} agregado al carrito`);
            }
        };
    }

    // Configuración del calculador de envío
    const calcBtn = document.getElementById('calc-btn');
    const calcZip = document.getElementById('calc-zipcode');
    const calcResults = document.getElementById('calc-results');

    if (calcBtn && calcZip && calcResults) {
        // Remover listener previo si existe (para evitar duplicaciones)
        const newCalcBtn = calcBtn.cloneNode(true);
        calcBtn.parentNode.replaceChild(newCalcBtn, calcBtn);

        newCalcBtn.addEventListener('click', () => {
            const zipVal = calcZip.value.trim();
            if (!zipVal) {
                alert("Por favor, ingrese un código postal.");
                return;
            }
            
            // Simular costos de envío aproximados
            let costCorreo = 4500;
            let costAndreani = 5200;
            
            const cleanZip = zipVal.replace(/\D/g, '');
            if (cleanZip) {
                const num = parseInt(cleanZip, 10);
                if (num >= 2000 && num < 4000) { // Región Santa Fe / Córdoba / Entre Ríos
                    costCorreo = 3800;
                    costAndreani = 4400;
                } else if (num >= 1000 && num < 2000) { // Buenos Aires
                    costCorreo = 4200;
                    costAndreani = 4900;
                } else { // Resto del país
                    costCorreo = 5800;
                    costAndreani = 6500;
                }
            }

            calcResults.innerHTML = `
                <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.8rem; color: var(--text-primary); margin-top: 0.5rem;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; padding: 0.5rem 0; border-bottom: 1px dashed var(--border-color); gap: 10px;">
                        <div>
                           <strong style="display:block; margin-bottom:2px;"><i class="fas fa-box" style="color:var(--accent-color);"></i> Correo Argentino (Domicilio)</strong>
                           <span style="font-size: 0.72rem; color: var(--text-secondary); line-height:1.2; display:block;">(Envío aproximado, a coordinar con el vendedor)</span>
                        </div>
                        <span style="font-weight: 700; color: var(--success-color); white-space: nowrap;">$${costCorreo.toLocaleString('es-AR')} ARS</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; padding: 0.5rem 0; gap: 10px;">
                        <div>
                           <strong style="display:block; margin-bottom:2px;"><i class="fas fa-truck" style="color:var(--accent-color);"></i> Andreani (Sucursal)</strong>
                           <span style="font-size: 0.72rem; color: var(--text-secondary); line-height:1.2; display:block;">(Envío aproximado, a coordinar con el vendedor)</span>
                        </div>
                        <span style="font-weight: 700; color: var(--success-color); white-space: nowrap;">$${costAndreani.toLocaleString('es-AR')} ARS</span>
                    </div>
                </div>
            `;
            calcResults.style.display = 'flex';
        });
    }
}
window.renderProductDetailPage = renderProductDetailPage;
window.getProductById = getProductById;

window.switchDetailMainImage = function(src, thumbEl) {
    const mainImg = document.getElementById('main-detail-image');
    if (mainImg) mainImg.src = src;
    document.querySelectorAll('.ml-thumbs-col .thumb-img').forEach(b => b.classList.remove('active'));
    if (thumbEl) thumbEl.classList.add('active');
};

// Auto-ejecución si estamos en la página de detalle de producto
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('detail-title')) {
        renderProductDetailPage();
    }
});
