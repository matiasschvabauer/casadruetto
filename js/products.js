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
        "price": 85000,
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
        "price": 9800,
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
        "price": 14500,
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
        "price": 6.19,
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
        "price": 6.09,
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
        "price": 140.2,
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
        "desc": "Repuesto para maquinaria agrícola. Código: SW10967P1. Cartucho de filtro.",
        "price": 10.24,
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
        "desc": "Repuesto para maquinaria agrícola. Código: AJ11402. Filtro de aceite motor.",
        "price": 11.79,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 4,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785242930/t8fjpw2jj5p0hbark91m.jpg"
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
        "desc": "Repuesto para maquinaria agrícola. Código: DQ24941. Filtro de aire.",
        "price": 33.64,
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
        "desc": "Repuesto para maquinaria agrícola. Código: PE78420010. Filtro aceite hidraulico.",
        "price": 89.2,
        "category": "Repuestos",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AH120547. Filtro A/A.",
        "price": 82.79,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 8,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785242936/pi3kssacnsbhmtkdefok.jpg"
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
        "desc": "Repuesto para maquinaria agrícola. Código: H146639. Portaaspersor.",
        "price": 204.96,
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
        "desc": "Repuesto para maquinaria agrícola. Código: Z51244. Filtro.",
        "price": 1.81,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 3,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281731/e0qbtvnq6qgluxmxxfgl.webp"
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
        "desc": "Repuesto para maquinaria agrícola. Código: AL79010. Filtro.",
        "price": 141.76,
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
        "desc": "Repuesto para maquinaria agrícola. Código: L79122. Filtro.",
        "price": 74.24,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281683/kjvvluuwnddqgobruo3f.jpg"
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
        "desc": "Repuesto para maquinaria agrícola. Código: R53169. Filtro.",
        "price": 54.91,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281684/nmrflsxd7jwrh8dzkvs1.webp"
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
        "desc": "Repuesto para maquinaria agrícola. Código: R89411. Filtro.",
        "price": 79.93,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281685/lgs4tlo4azgvzyxt7lq0.webp"
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
        "desc": "Repuesto para maquinaria agrícola. Código: AE29052. Filtro de combustible.",
        "price": 10.15,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281687/gj6tvqqkhj17mzal2ftx.jpg"
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
        "desc": "Repuesto para maquinaria agrícola. Código: AE31724. Filtro de aire.",
        "price": 57.96,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281730/f7hold0nlehxuyefpbay.webp"
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
        "desc": "Repuesto para maquinaria agrícola. Código: AH115836. Filtro de A/A.",
        "price": 52.46,
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
        "desc": "Repuesto para maquinaria agrícola. Código: AH128449. Filtro de hidr ulico.",
        "price": 72.6,
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
        "desc": "Repuesto para maquinaria agrícola. Código: AH148880. Filtro de aire.",
        "price": 140.0,
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
        "desc": "Repuesto para maquinaria agrícola. Código: AH164063. Filtro de seguridad.",
        "price": 157.0,
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
        "desc": "Repuesto para maquinaria agrícola. Código: AH165504. Filtro de combustible.",
        "price": 48.84,
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
        "desc": "Repuesto para maquinaria agrícola. Código: AH170798. Filtro Aire Motor.",
        "price": 152.65,
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
        "desc": "Repuesto para maquinaria agrícola. Código: AH174196. Prefiltro Aire Motor.",
        "price": 105.25,
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
        "desc": "Repuesto para maquinaria agrícola. Código: AH212294. Filtro Aire.",
        "price": 278.71,
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
        "desc": "Repuesto para maquinaria agrícola. Código: AH212295. Filtro Aire.",
        "price": 210.39,
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
        "desc": "Repuesto para maquinaria agrícola. Código: AH222225. Filtro.",
        "price": 484.29,
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
        "desc": "Repuesto para maquinaria agrícola. Código: AJ10106. Filtro de aceite.",
        "price": 12.85,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 8,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281770/fbhscn8wyozw1ahdamml.webp"
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
        "desc": "Repuesto para maquinaria agrícola. Código: AJ11399. Filtro de combustible auxiliar.",
        "price": 7.21,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 3,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281771/nqe4prhrabcalaij4nlp.webp"
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
        "desc": "Repuesto para maquinaria agrícola. Código: AJ55127. Filtro Aire Primario.",
        "price": 85.01,
        "category": "Repuestos",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AJ55128. Filtro Aire Seguridad.",
        "price": 67.05,
        "category": "Repuestos",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AL119095. Filtro.",
        "price": 82.51,
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
        "desc": "Repuesto para maquinaria agrícola. Código: AL150288. Filtro Seguridad.",
        "price": 61.24,
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
        "desc": "Repuesto para maquinaria agrícola. Código: AL156625. FILTRO TRANSM (AL221066).",
        "price": 88.35,
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
        "desc": "Repuesto para maquinaria agrícola. Código: AN260207. Filtro.",
        "price": 150.71,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 4,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281784/jvsaggtbqcsxtc7bydrh.webp"
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
        "desc": "Repuesto para maquinaria agrícola. Código: AP29320. Cartucho de filtro.",
        "price": 30.98,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 3,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281785/hbjhtnunakuldzptsvbx.webp"
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
        "desc": "Repuesto para maquinaria agrícola. Código: AR103220. Filtro Combustible.",
        "price": 49.01,
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
        "desc": "Repuesto para maquinaria agrícola. Código: AR45785. Filtro.",
        "price": 86.14,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281789/wjjexvygqmwgfkka6ezw.webp"
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
        "desc": "Repuesto para maquinaria agrícola. Código: AR50041. Filtro Combustible.",
        "price": 25.04,
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
        "desc": "Repuesto para maquinaria agrícola. Código: AR75603. Filtro de aceite transmisi n.",
        "price": 21.11,
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
        "desc": "Repuesto para maquinaria agrícola. Código: AR79941. Filtro de Aire Primario.",
        "price": 85.29,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281797/aeqims7fnbnwhpn7vbfy.jpg"
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
        "desc": "Repuesto para maquinaria agrícola. Código: AR84228. Filtro aire.",
        "price": 102.86,
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
        "desc": "Repuesto para maquinaria agrícola. Código: AR86755. Filtro auxiliar de combustible.",
        "price": 48.65,
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
        "desc": "Repuesto para maquinaria agrícola. Código: AT171853. Filtro de Aire.",
        "price": 65.85,
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
        "desc": "Repuesto para maquinaria agrícola. Código: AT171854. Filtro de Seguridad.",
        "price": 33.44,
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
        "desc": "Repuesto para maquinaria agrícola. Código: AT17387. Filtro de combustible.",
        "price": 9.54,
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
        "desc": "Repuesto para maquinaria agrícola. Código: AT178517. Cartucho de filtro.",
        "price": 73.09,
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
        "desc": "Repuesto para maquinaria agrícola. Código: AT195915. Filtro hidr ulico.",
        "price": 92.76,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281820/tnipksntgpblpyjgbcee.webp"
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
        "desc": "Repuesto para maquinaria agrícola. Código: AT228474. Filtro de aceite.",
        "price": 136.5,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281823/ufonppbnlx3fbood8eii.png"
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
        "desc": "Repuesto para maquinaria agrícola. Código: AT308274. Filtro de Aceite.",
        "price": 122.8,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785281826/m25ipewv5brupxn5vpra.jpg"
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
        "desc": "Repuesto para maquinaria agrícola. Código: AT33364. Filtro de Aire.",
        "price": 35.41,
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
        "desc": "Repuesto para maquinaria agrícola. Código: AT44378. Cartucho de filtro.",
        "price": 69.4,
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
        "desc": "Repuesto para maquinaria agrícola. Código: AT67957. Filtro.",
        "price": 60.86,
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
        "desc": "Repuesto para maquinaria agrícola. Código: AZ22878. Filtro.",
        "price": 24.49,
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
        "desc": "Repuesto para maquinaria agrícola. Código: AZ26007. Cartucho de filtro.",
        "price": 33.29,
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
        "desc": "Repuesto para maquinaria agrícola. Código: AZ26091. Cartucho de filtro.",
        "price": 67.16,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290598/vzp0xz4snkm4ou4vga5g.webp"
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
        "desc": "Repuesto para maquinaria agrícola. Código: AZ43412. Filtro Aire Cabina.",
        "price": 199.55,
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
        "desc": "Repuesto para maquinaria agrícola. Código: AZ48195. Filtro de aire.",
        "price": 127.44,
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
        "desc": "Repuesto para maquinaria agrícola. Código: AZ48196. Filtro de seguridad.",
        "price": 79.44,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290608/vqhkareymprrtdxkfkkd.jpg"
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
        "desc": "Repuesto para maquinaria agrícola. Código: CE16309. Filtro.",
        "price": 80.19,
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
        "desc": "Repuesto para maquinaria agrícola. Código: CQ29104. Filtro.",
        "price": 8.94,
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
        "desc": "Repuesto para maquinaria agrícola. Código: DE17263. Filtro.",
        "price": 126.45,
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
        "desc": "Repuesto para maquinaria agrícola. Código: DQ05097. Filtro hidr ulico.",
        "price": 24.26,
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
        "desc": "Repuesto para maquinaria agrícola. Código: DQ12161. Filtro de hidr ulico.",
        "price": 46.59,
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
        "desc": "Repuesto para maquinaria agrícola. Código: DQ21803. FILTRO.",
        "price": 52.31,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 23,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290625/fpj2d9enorb5qbroqeix.webp"
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
        "desc": "Repuesto para maquinaria agrícola. Código: DQ24942. Filtro de seguridad.",
        "price": 25.25,
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
        "desc": "Repuesto para maquinaria agrícola. Código: DQ43482. Filtro Aire.",
        "price": 197.89,
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
        "desc": "Repuesto para maquinaria agrícola. Código: DQ43483. Filtro de seguridad.",
        "price": 43.29,
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
        "desc": "Repuesto para maquinaria agrícola. Código: DQ46907. Filtro Aire.",
        "price": 49.11,
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
        "desc": "Repuesto para maquinaria agrícola. Código: DQ46908. Filtro Seguridad.",
        "price": 42.9,
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
        "desc": "Repuesto para maquinaria agrícola. Código: DQ59138. Filtro de Aire Primario (SJ17532).",
        "price": 35.62,
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
        "desc": "Repuesto para maquinaria agrícola. Código: H220870. Filtro de aire.",
        "price": 100.85,
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
        "desc": "Repuesto para maquinaria agrícola. Código: L29251. Tapa filtro.",
        "price": 63.63,
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
        "price": 35.41,
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
        "desc": "Repuesto para maquinaria agrícola. Código: PE931260. Filtro de combustible.",
        "price": 21.56,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290647/kapyxor1no8rtmivk9n8.webp"
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE205726. Filtro aceite hidr ulico TRANSMISION.",
        "price": 139.39,
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE24619. Filtro aire cabina.",
        "price": 71.01,
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE34958. Filtro de hidr ulico.",
        "price": 81.45,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 4,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290656/dzsenwquh3lqcbvpsuae.jpg"
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE34963. Cartucho de filtro.",
        "price": 61.4,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290658/dnfbf3c1v4xor3515com.jpg"
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE34967. Filtro de aire secundario.",
        "price": 102.6,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290659/grshhoijaydoupva0hap.jpg"
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE45828. Filtro aire seguridad.",
        "price": 57.11,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290660/nxmv12u4crzkfgrerfke.webp"
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE45864. Filtro de hidraulico.",
        "price": 101.84,
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE46310. Filtro Aire primario.",
        "price": 165.4,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290666/vulgvy29l36i0vvzyzr9.jpg"
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE46311. Filtro Aire seguridad.",
        "price": 51.04,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 3,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290667/heqouxvu3iylnv5kepjr.webp"
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE47313. Kit filtro de transmisi n.",
        "price": 134.73,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 3,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290669/asfxw4wbffssipb41apr.jpg"
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE48882. Filtro aire cabina.",
        "price": 38.09,
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE504836. Filtro aceite (VPD5181).",
        "price": 36.45,
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE507284. Filtro Combustible Primario.",
        "price": 111.55,
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE508633. Filtro auxiliar combs.",
        "price": 55.11,
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE509036. Filtro de Combustible.",
        "price": 44.94,
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE509672. Filtro de aceite.",
        "price": 55.46,
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE51650. VASO DECANTADOR FILTRO.",
        "price": 139.43,
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE519608. Filtro de Combustible.",
        "price": 107.5,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290725/mag8mmwxatjyq4esp9xk.jpg"
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE519626. Filtro de aceite.",
        "price": 20.91,
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE522372. Filtro combustible.",
        "price": 138.7,
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE522688. Filtro combustible.",
        "price": 61.96,
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE530107. Filtro de aceite.",
        "price": 97.31,
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE531703. Filtro de combustible.",
        "price": 120.24,
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE541420. Filtro de aceite.",
        "price": 25.29,
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE57394. Filtro aceite motor = DZ118156.",
        "price": 30.46,
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE58935. Filtro Aceite.",
        "price": 127.11,
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE59754. FILTRO DE ACEITE REEMPL. DZ118286.",
        "price": 17.89,
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE60021. Filtro de Combustible.",
        "price": 40.4,
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE62418. Filtro de combustible.",
        "price": 39.19,
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE62419. Filtro de combustible.",
        "price": 38.29,
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE62424. Filtro auxiliar combustible.",
        "price": 44.94,
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE67124. Cartucho de filtro.",
        "price": 87.15,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290792/hlmgtd6ksy7ptsrtd7e1.webp"
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
        "desc": "Repuesto para maquinaria agrícola. Código: T19044. Filtro aceite motor.",
        "price": 12.79,
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
        "desc": "Repuesto para maquinaria agrícola. Código: Z62223. Filtro.",
        "price": 27.33,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 3,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290797/v4o4sybroojxxb2qjdgl.webp"
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
        "desc": "Repuesto para maquinaria agrícola. Código: AM101207. Filtro de aceite.",
        "price": 18.16,
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
        "desc": "Repuesto para maquinaria agrícola. Código: AM107314. Filtro de Combustible.",
        "price": 7.2,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 6,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290802/ufcfmhhjmimpuf4lculk.jpg"
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
        "desc": "Repuesto para maquinaria agrícola. Código: AM107423. Filtro aceite motor.",
        "price": 12.05,
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
        "desc": "Repuesto para maquinaria agrícola. Código: AM108243. Filtro de aire.",
        "price": 49.99,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290807/wpslvkl9cw6pnirjj8nq.jpg"
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
        "desc": "Repuesto para maquinaria agrícola. Código: AM116156. Filtro de aceite hidr ulico.",
        "price": 17.19,
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
        "desc": "Repuesto para maquinaria agrícola. Código: AM116304. Filtro combustible.",
        "price": 8.58,
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
        "desc": "Repuesto para maquinaria agrícola. Código: AM120916. Filtro.",
        "price": 67.76,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290818/mnd72gheofir0uktfu7s.jpg"
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
        "desc": "Repuesto para maquinaria agrícola. Código: AM125424. Filtro aceite motor.",
        "price": 18.28,
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
        "desc": "Repuesto para maquinaria agrícola. Código: AM130295. Filtro aire y seguridad.",
        "price": 156.31,
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
        "desc": "Repuesto para maquinaria agrícola. Código: CH15553. Filtro de combustible.",
        "price": 10.44,
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
        "desc": "Repuesto para maquinaria agrícola. Código: GY20574. Conjunto filtro aire.",
        "price": 20.76,
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
        "desc": "Repuesto para maquinaria agrícola. Código: GY20575. Cartucho de Filtro.",
        "price": 28.94,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 4,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290873/awmy9gny4rjoaki1czys.jpg"
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
        "desc": "Repuesto para maquinaria agrícola. Código: LG273638S. Filtro.",
        "price": 9.29,
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
        "desc": "Repuesto para maquinaria agrícola. Código: M111817. Filtro de combustible.",
        "price": 52.39,
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
        "desc": "Repuesto para maquinaria agrícola. Código: M76076. Filtro.",
        "price": 5.85,
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
        "desc": "Repuesto para maquinaria agrícola. Código: M806418. Filtro aceite motor.",
        "price": 19.25,
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
        "desc": "Repuesto para maquinaria agrícola. Código: M807152. Filtro combs.",
        "price": 26.84,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290893/eqrdj0lzrjpq1z5x8sib.jpg"
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
        "desc": "Repuesto para maquinaria agrícola. Código: M92360. Cartucho de filtro.",
        "price": 3.31,
        "category": "Repuestos",
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
        "desc": "Repuesto para maquinaria agrícola. Código: M94734. Filtro de aire.",
        "price": 45.85,
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
        "desc": "Repuesto para maquinaria agrícola. Código: M97211. Filtro de aire.",
        "price": 24.7,
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
        "desc": "Repuesto para maquinaria agrícola. Código: MIU11286. Filtro.",
        "price": 23.35,
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
        "desc": "Repuesto para maquinaria agrícola. Código: MIU11377. Cartucho de filtro.",
        "price": 41.59,
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
        "desc": "Repuesto para maquinaria agrícola. Código: MIU11513. Filtro de Aire.",
        "price": 4.93,
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
        "desc": "Repuesto para maquinaria agrícola. Código: MIU11515. Filtro de aire.",
        "price": 39.06,
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
        "desc": "Repuesto para maquinaria agrícola. Código: MIU13963. Filtro de aire.",
        "price": 20.99,
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE68048. Filtro de aire.",
        "price": 28.31,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 3,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290914/lvfwghtpv6tegcgsormp.webp"
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE68049. Filtro de aire de seguridad.",
        "price": 30.91,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 3,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290916/qc1fzy3tzcf1hpboi6qb.webp"
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
        "desc": "Repuesto para maquinaria agrícola. Código: JX0810D2. FILTRO ACEITE TAURUS.",
        "price": 42.45,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290918/aewgwa0nflfrmub7exfi.jpg"
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
        "desc": "Repuesto para maquinaria agrícola. Código: J11051-CD. BASE DE FILTRO.",
        "price": 31.71,
        "category": "Repuestos",
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
        "desc": "Repuesto para maquinaria agrícola. Código: J52906-CD. FILTRO.",
        "price": 1.98,
        "category": "Repuestos",
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
        "desc": "Repuesto para maquinaria agrícola. Código: AL118036. Filtro hidr ulico.",
        "price": 45.48,
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
        "desc": "Repuesto para maquinaria agrícola. Código: AL177184. Filtro de aire.",
        "price": 50.01,
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
        "desc": "Repuesto para maquinaria agrícola. Código: AL177185. Filtro de aire.",
        "price": 67.77,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290925/uieh3f02dnz8s1y69xyt.jpg"
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
        "desc": "Repuesto para maquinaria agrícola. Código: AR43634. Filtro de aceite.",
        "price": 12.01,
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
        "desc": "Repuesto para maquinaria agrícola. Código: PE931140. Cartucho de filtro.",
        "price": 18.44,
        "category": "Repuestos",
        "condition": "Nuevo",
        "brand": "John Deere",
        "model": "Original",
        "stock": 1,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785290928/vubkomdcqb6skw86t3gc.webp"
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
        "desc": "Repuesto para maquinaria agrícola. Código: RE533910. Filtro de combustibl.",
        "price": 161.78,
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
        "desc": "Repuesto para maquinaria agrícola. Código: AT21469.RC. BASE FILTROS.",
        "price": 40.86,
        "category": "Repuestos",
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
        "desc": "Repuesto para maquinaria agrícola. Código: J52956-RV. FILTRO.",
        "price": 5.25,
        "category": "Repuestos",
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
        "desc": "Repuesto para maquinaria agrícola. Código: J54432-RC. VALVULA FILTRO AIRE.",
        "price": 6.2,
        "category": "Repuestos",
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
        "desc": "Repuesto para maquinaria agrícola. Código: R34985-RC. BOQUILLA BOMBA AGUA.",
        "price": 5.51,
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
        "price": 21.05,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Spraytec",
        "model": "Original",
        "stock": 10,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785268646/cns9hl95xbghha5wtaay.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
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
        "price": 28.05,
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
        "price": 27.5,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Spraytec",
        "model": "Original",
        "stock": 10,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785268647/o4zrtlprh4gcg57rmnll.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
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
        "price": 26.84,
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
        "price": 11.0,
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
        "price": 26.51,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Spraytec",
        "model": "Original",
        "stock": 10,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785268650/nd5mpph0vlhpgcssf0gd.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
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
        "price": 26.79,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Spraytec",
        "model": "Original",
        "stock": 10,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785268652/nytpisvu2trptneqpwmm.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
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
        "price": 27.26,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Spraytec",
        "model": "Original",
        "stock": 10,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785268655/fya1aiepan6uin6nl8m4.webp"
        ],
        "videos": [],
        "mercadolibreLink": "",
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
        "price": 27.26,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Spraytec",
        "model": "Original",
        "stock": 10,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785268656/dbvxp76iunxe38jjs5mh.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
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
        "price": 27.54,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Spraytec",
        "model": "Original",
        "stock": 10,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785268657/oi1odim10dxtwk3wlcwv.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
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
        "price": 16.72,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Spraytec",
        "model": "Original",
        "stock": 10,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785268659/teovnzw6sumt5bhjjv0g.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
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
        "price": 22.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Spraytec",
        "model": "Original",
        "stock": 10,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785268660/oqi2pqb17fxwycik6ewg.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
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
        "price": 22.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Spraytec",
        "model": "Original",
        "stock": 10,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785268662/bpttapfd5i7bwkh3w05f.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
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
        "price": 16.5,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Spraytec",
        "model": "Original",
        "stock": 10,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785268664/rryutk2fq0nfgcg27t8u.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
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
        "price": 24.19,
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
        "price": 26.05,
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
        "price": 25.98,
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
        "price": 220.15,
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
        "price": 225.0,
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
        "price": 220.15,
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
        "price": 200.06,
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
        "price": 29500.0,
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
        "price": 43500.0,
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
        "price": 12900.0,
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
        "price": 5400.0,
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
        "mercadolibreLink": "",
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
        "price": 6500.0,
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
        "mercadolibreLink": "",
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
        "price": 7900.0,
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
        "price": 12100.0,
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
        "price": 19900.0,
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
        "price": 25900.0,
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
        "price": 35500.0,
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
        "mercadolibreLink": "",
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
        "price": 36900.0,
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
        "price": 37900.0,
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
        "price": 48500.0,
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
        "price": 54900.0,
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
        "price": 34900.0,
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
        "price": 19900.0,
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
        "mercadolibreLink": "",
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
        "price": 22900.0,
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
        "mercadolibreLink": "",
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
        "price": 25900.0,
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
        "price": 30900.0,
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
        "price": 29900.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "CTX",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271465/rkvcrptl1hqezwsbnuox.webp"
        ],
        "videos": [],
        "mercadolibreLink": "",
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
        "price": 33900.0,
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
        "mercadolibreLink": "",
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
        "price": 36900.0,
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
        "mercadolibreLink": "",
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
        "price": 39900.0,
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
        "mercadolibreLink": "",
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
        "price": 45900.0,
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
        "mercadolibreLink": "",
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
        "price": 48900.0,
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
        "mercadolibreLink": "",
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
        "price": 73000.0,
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
        "mercadolibreLink": "",
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
        "price": 75300.0,
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
        "price": 103900.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "CTX",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271490/fluvqk166sibnr3wdszs.webp"
        ],
        "videos": [],
        "mercadolibreLink": "",
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
        "price": 82900.0,
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
        "price": 85900.0,
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
        "price": 109000.0,
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
        "price": 133000.0,
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
        "price": 51900.0,
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
        "price": 58900.0,
        "category": "Maquinaria Agrícola",
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
        "price": 64900.0,
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
        "price": 68900.0,
        "category": "Maquinaria Agrícola",
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
        "price": 57900.0,
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
        "price": 144500.0,
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
        "price": 89000.0,
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
        "price": 1400.0,
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
        "price": 14300.0,
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
        "price": 15600.0,
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
        "price": 15900.0,
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
        "price": 16200.0,
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
        "price": 16600.0,
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
        "price": 17100.0,
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
        "price": 17700.0,
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
        "price": 25900.0,
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
        "price": 27500.0,
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
        "price": 28500.0,
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
        "price": 550.0,
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
        "price": 1600.0,
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
        "price": 2800.0,
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
        "price": 3500.0,
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
        "price": 3900.0,
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
        "price": 6500.0,
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
        "price": 1300.0,
        "category": "Maquinaria Agrícola",
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
        "price": 1400.0,
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
        "price": 2300.0,
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
        "price": 1300.0,
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
        "price": 1200.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bronco",
        "model": "Original",
        "stock": 5,
        "images": [
            "assets/img/casadruettologo1.png"
        ],
        "videos": [],
        "mercadolibreLink": "",
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
        "price": 1400.0,
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
        "price": 2900.0,
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
        "price": 2000.0,
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
        "price": 2200.0,
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
        "price": 500.0,
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
        "price": 2100.0,
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
        "price": 5900.0,
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
        "price": 5900.0,
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
        "price": 900.0,
        "category": "Repuestos y Accesorios",
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
        "price": 1200.0,
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
        "price": 1350.0,
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
        "price": 2900.0,
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
        "price": 3200.0,
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
        "price": 6900.0,
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
        "price": 7200.0,
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
        "price": 3200.0,
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
        "price": 3500.0,
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
        "price": 3200.0,
        "category": "Repuestos y Accesorios",
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
        "price": 3700.0,
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
        "price": 4000.0,
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
        "price": 9800.0,
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
        "price": 3700.0,
        "category": "Repuestos y Accesorios",
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
        "price": 7600.0,
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
        "price": 7900.0,
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
        "price": 6200.0,
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
        "price": 1900.0,
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
        "price": 170.0,
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
        "mercadolibreLink": "",
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
        "price": 250.0,
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
        "mercadolibreLink": "",
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
        "price": 380.0,
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
        "mercadolibreLink": "",
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
        "price": 230.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Rhinoceros",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785264916/wr6koajf2c2gebyhbdcv.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
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
        "price": 360.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Rhinoceros",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785264918/rlazrp3jertkchslbdnt.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
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
        "price": 490.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Rhinoceros",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785264921/so6mmapmri3dwxdicd6i.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
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
        "price": 320.0,
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
        "price": 550.0,
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
        "price": 570.0,
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
        "price": 190.0,
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
        "mercadolibreLink": "",
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
        "price": 240.0,
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
        "mercadolibreLink": "",
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
        "price": 160.0,
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
        "mercadolibreLink": "",
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
        "price": 220.0,
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
        "mercadolibreLink": "",
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
        "price": 240.0,
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
        "mercadolibreLink": "",
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
        "price": 380.0,
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
        "mercadolibreLink": "",
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
        "price": 650.0,
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
        "mercadolibreLink": "",
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
        "price": 820.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Rhinoceros",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785264949/hiqmlqqais7mt1xgiyfk.webp"
        ],
        "videos": [],
        "mercadolibreLink": "",
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
        "price": 3700.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Rhinoceros",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785264951/v2kl4g09qo2gbkglxo8r.webp"
        ],
        "videos": [],
        "mercadolibreLink": "",
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
        "price": 4500.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Rhinoceros",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785264952/rkj3cptfhbggdiklyi2x.webp"
        ],
        "videos": [],
        "mercadolibreLink": "",
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
        "price": 2900.0,
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
        "price": 3800.0,
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
        "price": 4200.0,
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
        "price": 190.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Rhinoceros",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785264958/snrsx5nvdbu8c4nrymkb.jpg"
        ],
        "videos": [],
        "mercadolibreLink": "",
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
        "price": 320.0,
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
        "price": 700.0,
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
        "price": 270.0,
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
        "price": 650.0,
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
        "price": 670.0,
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
        "price": 990.0,
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
        "mercadolibreLink": "",
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
        "price": 1900.0,
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
        "mercadolibreLink": "",
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
        "price": 7900.0,
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
        "mercadolibreLink": "",
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
        "price": 4600.0,
        "category": "Repuestos y Accesorios",
        "condition": "Nuevo",
        "brand": "Bronco",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271445/bngsvhehxpa9abg8urcv.webp"
        ],
        "videos": [],
        "mercadolibreLink": "",
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
        "price": 11500.0,
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
        "mercadolibreLink": "",
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
        "price": 10900.0,
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
        "mercadolibreLink": "",
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
        "price": 12500.0,
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
        "mercadolibreLink": "",
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
        "price": 11900.0,
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
        "mercadolibreLink": "",
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
        "price": 14900.0,
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
        "mercadolibreLink": "",
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
        "price": 14500.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "Bronco",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271413/rifb3hvew7vdq83zpo03.webp"
        ],
        "videos": [],
        "mercadolibreLink": "",
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
        "price": 17600.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "Bronco",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271415/lokvz7wss11kj2utemqt.webp"
        ],
        "videos": [],
        "mercadolibreLink": "",
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
        "price": 24900.0,
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
        "mercadolibreLink": "",
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
        "price": 27900.0,
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
        "mercadolibreLink": "",
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
        "price": 39900.0,
        "category": "Maquinaria Agrícola",
        "condition": "Nuevo",
        "brand": "Bronco",
        "model": "Original",
        "stock": 5,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785271423/gzqotsaxhbqafhszdgzw.webp"
        ],
        "videos": [],
        "mercadolibreLink": "",
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
        "price": 41900.0,
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
        "mercadolibreLink": "",
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
        "price": 51900.0,
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
        "mercadolibreLink": "",
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
        "price": 2100.0,
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
        "price": 2300.0,
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
        "price": 2500.0,
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
        "price": 1634.75,
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
        "desc": "Repuesto para maquinaria agrícola. Código: 2507719. MEZCLADOR ECOTANK - KIT MANGUERA/PISTOLA DRON.",
        "price": 130.26,
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
        "desc": "Repuesto para maquinaria agrícola. Código: 2507739. MEZCLADOR ECOTANK P/DRONES - KIT BOMBA AGUA LIMPIA.",
        "price": 1701.49,
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
        "desc": "Repuesto para maquinaria agrícola. Código: 2507854. MEZCLADOR ECOTANK P/DRONES - CONJUNTO BASE.",
        "price": 10382.17,
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
        "desc": "Repuesto para maquinaria agrícola. Código: 2507855. MEZCLADOR ECOTANK P/DRONES - TANQUE 200.",
        "price": 1266.0,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "UDOR",
        "model": "EcoTank",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785250548/qm0cqouacw1ishqnsq3o.webp"
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
        "desc": "Repuesto para maquinaria agrícola. Código: 2507856. MEZCLADOR ECOTANK P/DRONES - TANQUE 500.",
        "price": 2980.13,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "UDOR",
        "model": "EcoTank",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785250550/jcgihsl38rxyk1irt4pt.webp"
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
        "desc": "Repuesto para maquinaria agrícola. Código: 2507857. MEZCLADOR ECOTANK P/DRONES - TANQUE 700.",
        "price": 3409.51,
        "category": "Drones DJI",
        "condition": "Nuevo",
        "brand": "UDOR",
        "model": "EcoTank",
        "stock": 2,
        "images": [
            "https://res.cloudinary.com/doissrwhj/image/upload/v1785250551/i1czg0egqkxk8mr5zlzo.webp"
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
        "desc": "Repuesto para maquinaria agrícola. Código: 2507889. PISTOLA DESPACHO DRON.",
        "price": 72.38,
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
        "desc": "Repuesto para maquinaria agrícola. Código: 2507893. CHASIS ECOTANK 200 DRON/FULL.",
        "price": 305.44,
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
        "desc": "Repuesto para maquinaria agrícola. Código: 6501099. MEZCLADOR ECOTANK P/DRONES 200/500.",
        "price": 12342.59,
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
        "desc": "Repuesto para maquinaria agrícola. Código: 6501100. MEZCLADOR ECOTANK P/DRONES 700/1000.",
        "price": 14810.81,
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
        "desc": "Repuesto para maquinaria agrícola. Código: 6501106. MEZCLADOR ECOTANK 200 DRON.",
        "price": 3649.26,
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
        "desc": "Repuesto para maquinaria agrícola. Código: 6501107. MEZCLADOR ECOTANK 500 DRON.",
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
        "desc": "Repuesto para maquinaria agrícola. Código: 6501110. MEZCLADOR ECOTANK 500 NEVADA / DRON.",
        "price": 4906.71,
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
            
            if (fbList.length > 0) {
                products = fbList;
            } else {
                let deletedCount = 0;
                try {
                    const delSnap = await getDocs(collection(db, "druetto_deleted_products"));
                    deletedCount = delSnap.docs.length;
                } catch (err) {}

                if (deletedCount === 0) {
                    // Catálogo vacío sin productos eliminados previamente: inicializar semilla
                    const batch = writeBatch(db);
                    for (const p of SEED_PRODUCTS) {
                        const docRef = doc(db, "druetto_products", p.id);
                        batch.set(docRef, p);
                    }
                    await batch.commit();
                    products = [...SEED_PRODUCTS];
                    console.log("[Firebase Seeding Store] Catálogo completo (" + SEED_PRODUCTS.length + " productos) sembrado con éxito en Firestore.");
                } else {
                    products = [];
                }
            }

        } else {
            // Local fallback
            const localList = await localDb.getCollection("products");
            if (localList.length > 0) {
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

// ═══════════════════════════════════════════════════════════════════
// CONFIGURACIÓN DE TARIFAS DE ENVÍOS (Calculadora) - Modificable
// ═══════════════════════════════════════════════════════════════════
window.SHIPPING_RATES = {
    local: {
        correo: { estandar: 5200, expreso: 7100 },
        andreani: { estandar: 6000, urgente: 8500 }
    },
    centro: {
        correo: { estandar: 7500, expreso: 10200 },
        andreani: { estandar: 8900, urgente: 12400 }
    },
    nacional: {
        correo: { estandar: 10500, expreso: 14800 },
        andreani: { estandar: 12800, urgente: 18500 }
    }
};

// ═══════════════════════════════════════════════════════════════════
// OBTENER COTIZACIÓN OFICIAL DEL DÓLAR (dolarapi.com)
// ═══════════════════════════════════════════════════════════════════
window.dollarRate = null;

async function getOrFetchDollarRate() {
    if (window.dollarRate) return window.dollarRate;
    
    const cachedRate = sessionStorage.getItem('dolar_oficial_venta');
    const cachedTime = sessionStorage.getItem('dolar_oficial_time');
    
    if (cachedRate && cachedTime && (Date.now() - parseInt(cachedTime) < 3600000)) {
        window.dollarRate = parseFloat(cachedRate);
        return window.dollarRate;
    }
    
    try {
        const response = await fetch('https://dolarapi.com/v1/dolares/oficial');
        if (!response.ok) throw new Error('API response error');
        const data = await response.json();
        if (data && data.venta) {
            window.dollarRate = parseFloat(data.venta);
            sessionStorage.setItem('dolar_oficial_venta', window.dollarRate);
            sessionStorage.setItem('dolar_oficial_time', Date.now());
            return window.dollarRate;
        }
    } catch (e) {
        console.warn('No se pudo obtener la cotización del dólar en tiempo real. Usando fallback de $1000 ARS.', e);
    }
    
    window.dollarRate = 1000.00;
    return window.dollarRate;
}

// ═══════════════════════════════════════════════════════════════════
// CLASIFICAR REGIÓN SEGÚN CÓDIGO POSTAL
// ═══════════════════════════════════════════════════════════════════
function getShippingRegion(zipCode) {
    zipCode = zipCode.trim().toUpperCase();
    if (!zipCode) return null;
    
    const firstChar = zipCode.charAt(0);
    if (isNaN(firstChar)) {
        if (firstChar === 'S') return 'local';
        if (['E', 'X', 'B', 'C', 'W'].includes(firstChar)) return 'centro';
        return 'nacional';
    }
    
    const num = parseInt(zipCode.substring(0, 4));
    if (isNaN(num)) return 'nacional';
    
    if ((num >= 2000 && num <= 2999) || (num >= 3000 && num <= 3099)) {
        return 'local';
    }
    if ((num >= 1000 && num <= 1999) || (num >= 5000 && num <= 5999) || (num >= 3100 && num <= 3999)) {
        return 'centro';
    }
    return 'nacional';
}

// ─── Lógica de Renderizado del Catálogo (tienda.html) ─────────────────
window.renderStoreCatalog = async function(containerId, filters = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Mostrar pantalla de carga GooeyLoader
    container.innerHTML = `
        <div class="gooey-loader-container">
            <svg style="position: absolute; width: 0; height: 0;">
                <defs>
                    <filter id="gooey-loader-filter">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
                        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 48 -7" result="goo" />
                        <feComposite in="SourceGraphic" in2="goo" operator="atop" />
                    </filter>
                </defs>
            </svg>
            <div class="gooey-loader"></div>
            <p style="color: var(--text-secondary); font-weight: 600; font-size: 0.88rem;">Cargando productos de Casa Druetto...</p>
        </div>
    `;

    await getOrFetchDollarRate();
    await new Promise(r => setTimeout(r, 300));

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
                <div class="store-card-price-row" style="display: flex; flex-direction: column; gap: 0.15rem; align-items: flex-start; margin-bottom: 0.75rem; width: 100%;">
                    <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
                        <span class="store-card-price" style="font-size: 1rem; font-weight: 700; color: #111827;">$${p.price.toLocaleString('es-AR', { minimumFractionDigits: 2 })} USD</span>
                        <span class="store-card-stock ${p.stock > 0 ? 'in-stock' : 'out-of-stock'}" style="margin: 0;">
                            ${p.stock > 0 ? `Stock: ${p.stock}` : 'Sin Stock'}
                        </span>
                    </div>
                    <span class="store-card-price-ars" style="font-size: 0.85rem; color: var(--success-color); font-weight: 700;">
                        $${(p.price * window.dollarRate).toLocaleString('es-AR', { maximumFractionDigits: 0 })} ARS
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
    await getOrFetchDollarRate();
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
    document.getElementById('detail-price').innerText = `$${p.price.toLocaleString('es-AR', { minimumFractionDigits: 2 })} USD`;
    
    const priceARS = p.price * window.dollarRate;
    const priceArsEl = document.getElementById('detail-price-ars');
    if (priceArsEl) {
        priceArsEl.innerHTML = `$${priceARS.toLocaleString('es-AR', { maximumFractionDigits: 0 })} ARS <span style="font-size: 0.8rem; color: var(--text-secondary); font-weight: normal; margin-left: 0.5rem;">(Tasa oficial: $${window.dollarRate.toLocaleString('es-AR', { minimumFractionDigits: 2 })})</span>`;
    }
    
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

    // Lógica de la calculadora de envíos
    const calcBtn = document.getElementById('calc-btn');
    const zipInput = document.getElementById('calc-zipcode');
    const resultsContainer = document.getElementById('calc-results');

    if (calcBtn && zipInput && resultsContainer) {
        resultsContainer.innerHTML = '';
        resultsContainer.style.display = 'none';
        zipInput.value = '';

        calcBtn.onclick = function() {
            const zip = zipInput.value.trim();
            if (!zip) {
                alert('Por favor ingrese un código postal');
                return;
            }

            resultsContainer.innerHTML = '';
            resultsContainer.style.display = 'flex';

            if (p.category === 'Maquinaria Agrícola') {
                resultsContainer.innerHTML = `
                    <div class="shipping-special-msg" style="padding: 0.8rem; background-color: #fff3cd; border: 1px solid #ffeeba; color: #856404; border-radius: 6px; font-size: 0.8rem; line-height: 1.45; display: flex; gap: 0.6rem; align-items: flex-start; text-align: left; width: 100%;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 1.2rem; color: #856404; margin-top: 2px;"></i>
                        <div>
                            <strong>Envío especial a convenir</strong><br>
                            Debido al peso y dimensiones de la maquinaria agrícola, el envío no se realiza por correo estándar.
                            Por favor contáctenos por WhatsApp al +54 9 3404 52-1246 para coordinar un flete o retiro especial.
                            <a href="https://wa.me/5493404521246?text=Hola,%20quiero%20cotizar%20el%20env%C3%ADo%20de%20${encodeURIComponent(p.name)}%20(Código:%20${p.code})" target="_blank" style="display: inline-block; margin-top: 0.5rem; color: #0056b3; font-weight: 600; text-decoration: underline;">
                                <i class="fab fa-whatsapp"></i> Cotizar por WhatsApp
                            </a>
                        </div>
                    </div>
                `;
                return;
            }

            const region = getShippingRegion(zip);
            const rates = window.SHIPPING_RATES[region] || window.SHIPPING_RATES.nacional;

            resultsContainer.innerHTML = `
                <div class="shipping-option" style="display: flex; align-items: center; gap: 0.8rem; padding: 0.6rem; background: #fff; border: 1px solid #e9ecef; border-radius: 6px; margin-bottom: 0.5rem; width: 100%; text-align: left;">
                    <span style="font-size: 1.3rem; color: #0056b3; display: flex; align-items: center;"><i class="fas fa-envelope-open-text"></i></span>
                    <div class="shipping-option-info" style="flex: 1; display: flex; flex-direction: column;">
                        <span class="shipping-option-name" style="font-weight: 600; font-size: 0.8rem; color: var(--text-primary);">Correo Argentino (Estándar)</span>
                        <span class="shipping-option-time" style="font-size: 0.7rem; color: var(--text-secondary);">Llega en 3-6 días hábiles</span>
                    </div>
                    <span class="shipping-option-price" style="font-weight: 700; font-size: 0.85rem; color: var(--success-color);">$${rates.correo.estandar.toLocaleString('es-AR', { minimumFractionDigits: 0 })}</span>
                </div>
                <div class="shipping-option" style="display: flex; align-items: center; gap: 0.8rem; padding: 0.6rem; background: #fff; border: 1px solid #e9ecef; border-radius: 6px; margin-bottom: 0.5rem; width: 100%; text-align: left;">
                    <span style="font-size: 1.3rem; color: #0056b3; display: flex; align-items: center;"><i class="fas fa-shipping-fast"></i></span>
                    <div class="shipping-option-info" style="flex: 1; display: flex; flex-direction: column;">
                        <span class="shipping-option-name" style="font-weight: 600; font-size: 0.8rem; color: var(--text-primary);">Correo Argentino (Expreso)</span>
                        <span class="shipping-option-time" style="font-size: 0.7rem; color: var(--text-secondary);">Llega en 1-3 días hábiles</span>
                    </div>
                    <span class="shipping-option-price" style="font-weight: 700; font-size: 0.85rem; color: var(--success-color);">$${rates.correo.expreso.toLocaleString('es-AR', { minimumFractionDigits: 0 })}</span>
                </div>
                <div class="shipping-option" style="display: flex; align-items: center; gap: 0.8rem; padding: 0.6rem; background: #fff; border: 1px solid #e9ecef; border-radius: 6px; margin-bottom: 0.5rem; width: 100%; text-align: left;">
                    <span style="font-size: 1.3rem; color: #e63020; display: flex; align-items: center;"><i class="fas fa-truck"></i></span>
                    <div class="shipping-option-info" style="flex: 1; display: flex; flex-direction: column;">
                        <span class="shipping-option-name" style="font-weight: 600; font-size: 0.8rem; color: var(--text-primary);">Andreani (Estándar)</span>
                        <span class="shipping-option-time" style="font-size: 0.7rem; color: var(--text-secondary);">Llega en 2-4 días hábiles</span>
                    </div>
                    <span class="shipping-option-price" style="font-weight: 700; font-size: 0.85rem; color: var(--success-color);">$${rates.andreani.estandar.toLocaleString('es-AR', { minimumFractionDigits: 0 })}</span>
                </div>
                <div class="shipping-option" style="display: flex; align-items: center; gap: 0.8rem; padding: 0.6rem; background: #fff; border: 1px solid #e9ecef; border-radius: 6px; margin-bottom: 0.5rem; width: 100%; text-align: left;">
                    <span style="font-size: 1.3rem; color: #e63020; display: flex; align-items: center;"><i class="fas fa-shipping-fast"></i></span>
                    <div class="shipping-option-info" style="flex: 1; display: flex; flex-direction: column;">
                        <span class="shipping-option-name" style="font-weight: 600; font-size: 0.8rem; color: var(--text-primary);">Andreani (Urgente)</span>
                        <span class="shipping-option-time" style="font-size: 0.7rem; color: var(--text-secondary);">Llega en 1-2 días hábiles</span>
                    </div>
                    <span class="shipping-option-price" style="font-weight: 700; font-size: 0.85rem; color: var(--success-color);">$${rates.andreani.urgente.toLocaleString('es-AR', { minimumFractionDigits: 0 })}</span>
                </div>
                <div class="shipping-option" style="display: flex; align-items: center; gap: 0.8rem; padding: 0.6rem; background: #fff; border: 1px solid #e9ecef; border-radius: 6px; margin-bottom: 0.5rem; width: 100%; text-align: left;">
                    <span style="font-size: 1.3rem; color: #28a745; display: flex; align-items: center;"><i class="fas fa-store"></i></span>
                    <div class="shipping-option-info" style="flex: 1; display: flex; flex-direction: column;">
                        <span class="shipping-option-name" style="font-weight: 600; font-size: 0.8rem; color: var(--text-primary);">Retiro en Sucursal (Gálvez, SF)</span>
                        <span class="shipping-option-time" style="font-size: 0.7rem; color: var(--text-secondary);">Av. Jorge Newbery 247 - Listo en 24hs</span>
                    </div>
                    <span class="shipping-option-price" style="font-weight: 700; font-size: 0.85rem; color: #28a745;">Gratis</span>
                </div>
            `;
        };

        zipInput.onkeyup = function(event) {
            if (event.key === 'Enter') {
                calcBtn.click();
            }
        };
    }
};

// Modal Medios de Pago
window.openPaymentModal = function() {
    const modal = document.getElementById('payment-modal');
    if (modal) modal.classList.add('active');
};

window.closePaymentModal = function() {
    const modal = document.getElementById('payment-modal');
    if (modal) modal.classList.remove('active');
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
