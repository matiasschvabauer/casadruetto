import os
import re
import pandas as pd
import json

base_dir = r"c:\Users\matia\OneDrive\Escritorio\Zike Labura\Casa Druetto\VERSION 0"
products_js_path = os.path.join(base_dir, "js", "products.js")
con_stock_csv = os.path.join(base_dir, "productos_importacion_con_stock.csv")
completo_csv = os.path.join(base_dir, "productos_importacion_completo.csv")

# Original 4 seed products
original_products = [
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
            "assets/img/0240d071b1e39076ef36b291c0212138.png"
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
    }
]

def generate_description(name, code, brand):
    name_lower = name.lower()
    
    if "mezclador" in name_lower and "dron" in name_lower:
        return f"Mezclador químico {name} marca {brand}. Diseñado especialmente para optimizar la premezcla de productos fitosanitarios y acelerar los tiempos de reabastecimiento en tierra para drones agrícolas DJI Agras. Fabricado con materiales de alta resistencia a la corrosión química."
    elif "tanque" in name_lower and "dron" in name_lower:
        return f"Tanque de repuesto o expansión para el sistema mezclador de drones EcoTank. Construido en polietileno de alta densidad con protección UV, ideal para soportar el almacenamiento y mezcla de agroquímicos concentrados sin degradación."
    elif "chasis" in name_lower and "dron" in name_lower:
        return f"Chasis metálico reforzado diseñado específicamente para soportar el tanque de mezcla EcoTank de drones. Estructura robusta para el traslado seguro del mezclador químico al campo."
    elif "pistola" in name_lower and "dron" in name_lower:
        return f"Pistola de despacho y carga rápida de alto caudal para la recarga limpia de drones de pulverización. Evita pérdidas de mezcla y agiliza el reabastecimiento en la zona de despegue."
    elif "boquilla" in name_lower or "aspersor" in name_lower:
        return f"Boquilla de pulverización de alta precisión original. Fabricada con materiales de alta calidad, resistente al desgaste y corrosión química, garantizando una distribución de gotas uniforme."
    elif "filtro" in name_lower:
        if "aceite" in name_lower:
            return f"Filtro de aceite motor original John Deere para maquinaria agrícola (Código: {code}). Proporciona un filtrado de alta eficiencia de impurezas, protegiendo las piezas internas del motor del desgaste mecánico."
        elif "aire" in name_lower:
            return f"Filtro de aire de motor original John Deere (Código: {code}). Diseñado para retener polvo e impurezas externas, asegurando el flujo de aire óptimo y limpio para la combustión en condiciones de polvo severo en el campo."
        elif "combustible" in name_lower or "gasoil" in name_lower:
            return f"Filtro de combustible original John Deere (Código: {code}). Separa el agua y retiene los sedimentos microscópicos del gasoil, resguardando la bomba de inyección y los inyectores Common Rail."
        elif "hidraulico" in name_lower or "hidr" in name_lower or "transm" in name_lower:
            return f"Filtro de fluido hidráulico y transmisión John Deere (Código: {code}). Diseñado para soportar altas presiones de trabajo en sistemas hidráulicos agrícolas, reteniendo micropartículas abrasivas."
        elif "cabina" in name_lower or "a/a" in name_lower:
            return f"Filtro de aire de cabina original John Deere (Código: {code}). Purifica el aire ingresado a la cabina, reteniendo partículas de polvo, polen y residuos de agroquímicos para la protección del operador."
        else:
            return f"Filtro/cartucho filtrante original John Deere. Mantiene la pureza de los fluidos del equipo (Código: {code}), previniendo el desgaste y la pérdida de rendimiento bajo trabajo intenso."
    else:
        return f"Repuesto original John Deere (Código: {code}) para maquinaria agrícola. Diseñado bajo especificaciones de fábrica para máxima fiabilidad, durabilidad y compatibilidad exacta con su tractor o cosechadora."

def main():
    print("Iniciando generación de datos...")
    
    # 1. Cargar productos con stock (menor)
    print("Leyendo productos con stock...")
    df_stock = pd.read_csv(con_stock_csv)
    
    # 2. Cargar productos completos y buscar drones
    print("Leyendo productos completos para buscar drones...")
    df_completo = pd.read_csv(completo_csv)
    df_drones = df_completo[df_completo['Nombre'].str.contains('dron|drone|dji|agras', case=False, na=False)]
    
    seed_products_list = list(original_products)
    existing_codes = {p["code"] for p in seed_products_list}
    
    # 3. Agregar repuestos John Deere con stock
    print(f"Procesando {len(df_stock)} repuestos con stock...")
    for idx, row in df_stock.iterrows():
        code = str(row['Codigo']).strip()
        if code in existing_codes:
            continue
            
        name = str(row['Nombre']).strip()
        # Limpiar caracteres rotos como 'hidr ulico'
        name = name.replace("hidr ulico", "hidráulico").replace("transmisi n", "transmisión")
        name = name.replace("filtro aire", "Filtro de aire").replace("Filtro de hidr ulico", "Filtro hidráulico")
        name = name.replace("combs", "combustible")
        
        # Categorías y marcas dinámicas de la fila del CSV
        category = str(row['Categoria']).strip() if (pd.notna(row.get('Categoria')) and str(row.get('Categoria')).strip()) else "Repuestos y Accesorios"
        brand = str(row['Marca']).strip() if (pd.notna(row.get('Marca')) and str(row.get('Marca')).strip()) else "John Deere"
        
        price = float(row['Precio']) if pd.notna(row['Precio']) else 0.0
        stock = int(row['Stock']) if pd.notna(row['Stock']) else 0
        
        # Descripción dinámica
        if pd.notna(row.get('Descripcion')) and str(row.get('Descripcion')).strip():
            desc = str(row['Descripcion']).strip()
        else:
            desc = generate_description(name, code, brand)
            
        # Imágenes dinámicas
        img_val = str(row.get('ImagenesUrls')).strip() if pd.notna(row.get('ImagenesUrls')) else ""
        images = img_val.split(';') if img_val else ["assets/img/casadruettologo1.png"]
        
        # Identificador único amigable
        brand_lower = brand.lower()
        if "vial" in code or "vial" in brand_lower:
            pid = f"vial_{code.lower().replace('-', '_')}"
        elif "2507" in code or "2508" in code or "spraytec" in brand_lower:
            pid = f"coa_{code.lower()}"
        else:
            pid = f"jd_{code.lower().replace('-', '_')}"
            
        product_obj = {
            "id": pid,
            "name": name,
            "code": code,
            "desc": desc,
            "price": price,
            "category": category,
            "condition": "Nuevo",
            "brand": brand,
            "model": "Original",
            "stock": stock,
            "images": images,
            "videos": [],
            "mercadolibreLink": "",
            "specs": {
                "Código de repuesto": code,
                "Marca": brand,
                "Estado": "Nuevo Original"
            }
        }
        
        seed_products_list.append(product_obj)
        existing_codes.add(code)
        
    # 4. Agregar drones de la lista completa (mixers de UDOR)
    print(f"Procesando {len(df_drones)} productos de drones de la otra lista...")
    for idx, row in df_drones.iterrows():
        code = str(row['Codigo']).strip()
        if code in existing_codes:
            continue
            
        name = str(row['Nombre']).strip()
        category = "Drones DJI" # Map to drones category
        brand = "UDOR"
        
        price = float(row['Precio']) if pd.notna(row['Precio']) else 0.0
        # Forzar un stock mínimo de 2 unidades para pruebas y compra en la tienda
        stock = 2
        
        # Descripción dinámica
        if pd.notna(row.get('Descripcion')) and str(row.get('Descripcion')).strip():
            desc = str(row['Descripcion']).strip()
        else:
            desc = generate_description(name, code, brand)
            
        # Imágenes dinámicas
        img_val = str(row.get('ImagenesUrls')).strip() if pd.notna(row.get('ImagenesUrls')) else ""
        images = img_val.split(';') if img_val else ["assets/img/casadruettologo1.png"]
        
        pid = f"udor_{code.lower().replace('-', '_')}"
        
        product_obj = {
            "id": pid,
            "name": name,
            "code": code,
            "desc": desc,
            "price": price,
            "category": category,
            "condition": "Nuevo",
            "brand": brand,
            "model": "EcoTank",
            "stock": stock,
            "images": images,
            "videos": [],
            "mercadolibreLink": "",
            "specs": {
                "Código de repuesto": code,
                "Marca": brand,
                "Compatibilidad": "Drones de pulverización (Agras T30/T40/T50)",
                "Origen": "Italia"
            }
        }
        seed_products_list.append(product_obj)
        existing_codes.add(code)
        
    print(f"Total productos en catálogo generado: {len(seed_products_list)}")
    
    # 5. Sobrescribir imágenes desde el archivo persistente mapped_images.json si existe
    mapped_json_path = os.path.join(base_dir, "mapped_images.json")
    if os.path.exists(mapped_json_path):
        try:
            with open(mapped_json_path, 'r', encoding='utf-8') as f:
                mapped_images = json.load(f)
            
            override_count = 0
            for product_obj in seed_products_list:
                pid = product_obj["id"]
                if pid in mapped_images:
                    product_obj["images"] = [u.strip() for u in mapped_images[pid].split(';') if u.strip()]
                    override_count += 1
            print(f"Sobrescritas {override_count} imágenes desde mapped_images.json.")
        except Exception as e:
            print(f"Error aplicando mapped_images.json: {e}")
            
    # 6. Escribir a js/products.js
    # Formatear la lista como JS literal
    products_js_content = json.dumps(seed_products_list, indent=4, ensure_ascii=False)
    
    with open(products_js_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Expresión regular para reemplazar el array de SEED_PRODUCTS
    pattern = r"const SEED_PRODUCTS = \[[\s\S]*?\];"
    replacement = f"const SEED_PRODUCTS = {products_js_content};"
    
    new_content, count = re.subn(pattern, replacement, content)
    if count == 0:
        print("Error: No se pudo encontrar el bloque const SEED_PRODUCTS en js/products.js")
        return
        
    with open(products_js_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
        
    print("¡js/products.js actualizado con éxito!")

if __name__ == '__main__':
    main()
