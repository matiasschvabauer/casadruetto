import os
import pandas as pd
import csv
import re

base_dir = r"c:\Users\matia\OneDrive\Escritorio\Zike Labura\Casa Druetto"

# Paths
f1_path = os.path.join(base_dir, "Lista de Precios II al 10.07.2025.xlsx")
f2_path = os.path.join(base_dir, "Lista de precios en USD.xlsx")
f3_path = os.path.join(base_dir, "STOCK REPUESTOS  21-03-22 (2).xls")

output_con_stock_path = os.path.join(base_dir, "productos_importacion_con_stock.csv")
output_completo_path = os.path.join(base_dir, "productos_importacion_completo.csv")

def clean_text(text):
    if pd.isna(text):
        return ""
    text_str = str(text).strip()
    # Replace double quotes with single quotes to protect the webpage's regex parser
    text_str = text_str.replace('"', "'")
    # Replace newlines with space
    text_str = re.sub(r'\s+', ' ', text_str)
    return text_str

def parse_code(code_val):
    if pd.isna(code_val):
        return ""
    # Convert float codes to int representation if they end with .0 (like 1234.0 -> 1234)
    code_str = str(code_val).strip()
    if code_str.endswith(".0"):
        try:
            return str(int(float(code_str)))
        except ValueError:
            pass
    return code_str

def main():
    print("Iniciando la fusión de catálogos...")
    catalog = {}

    # 1. CARGAR FILE 2 (Lista de precios en USD.xlsx) - ~834k productos
    # Columnas: 'Repuesto', 'Detalle', 'Costo (Reposición)', 'Precio de lista', 'Reemplazado por'
    print("Cargando Lista de precios en USD.xlsx (~834,000 filas)...")
    df2 = pd.read_excel(f2_path, sheet_name="Sheet")
    df2.columns = ['code_raw', 'name_raw', 'cost_raw', 'price_raw', 'replaced_raw']
    
    print("Procesando Lista de precios en USD.xlsx...")
    for idx, row in df2.iterrows():
        code = parse_code(row['code_raw'])
        if not code:
            continue
        
        name = clean_text(row['name_raw'])
        if not name:
            name = f"Repuesto {code}"
            
        price = float(row['price_raw']) if pd.notna(row['price_raw']) else 0.0
        
        catalog[code] = {
            'code': code,
            'name': name,
            'price': price,
            'stock': 0,
            'brand': 'John Deere',
            'condition': 'Nuevo',
            'category': 'Repuestos'
        }
    print(f"Productos cargados desde File 2: {len(catalog)}")

    # 2. CARGAR FILE 3 (STOCK REPUESTOS 21-03-22 (2).xls) - ~5.9k productos con Stock
    # Columnas: Col 0: Code, Col 2: Name, Col 5: Stock, Col 10: Cost, Col 12: Price
    print("Cargando STOCK REPUESTOS  21-03-22 (2).xls...")
    df3 = pd.read_excel(f3_path, sheet_name="Hoja1", header=None)
    df3_clean = df3.iloc[11:].copy() # data starts at row 11
    
    print("Procesando STOCK REPUESTOS...")
    for idx, row in df3_clean.iterrows():
        code = parse_code(row[0])
        if not code:
            continue
        
        name = clean_text(row[2]) or f"Repuesto {code}"
        try:
            stock = int(row[5]) if pd.notna(row[5]) else 0
        except (ValueError, TypeError):
            stock = 0
            
        try:
            price = float(row[12]) if pd.notna(row[12]) else 0.0
        except (ValueError, TypeError):
            price = 0.0

        if code in catalog:
            # Producto existente: actualizamos stock
            catalog[code]['stock'] = stock
            # Si el precio en F2 era 0, usamos el de F3
            if catalog[code]['price'] == 0.0:
                catalog[code]['price'] = price
            # Si no tenía nombre en F2, usamos el de F3
            if not catalog[code]['name'] and name:
                catalog[code]['name'] = name
        else:
            # Nuevo producto de stock que no estaba en F2
            catalog[code] = {
                'code': code,
                'name': name or f"Repuesto {code}",
                'price': price,
                'stock': stock,
                'brand': 'John Deere',
                'condition': 'Nuevo',
                'category': 'Repuestos'
            }

    # 3. CARGAR FILE 1 (Lista de Precios II al 10.07.2025.xlsx) - ~12.8k productos
    # Columnas: 'Código', 'Descripción', 'Precio U$D S/IVA', 'Precio Publico U$D S/IVA', 'Precio Publico U$D C/IVA'
    print("Cargando Lista de Precios II al 10.07.2025.xlsx...")
    df1 = pd.read_excel(f1_path, sheet_name="Hoja1")
    df1.columns = ['code_raw', 'name_raw', 'price_s_iva', 'price_publico_s_iva', 'price_publico_c_iva']
    
    print("Procesando Lista de Precios II (Precedencia alta)...")
    for idx, row in df1.iterrows():
        code = parse_code(row['code_raw'])
        if not code:
            continue
        
        name = clean_text(row['name_raw'])
        if not name:
            name = f"Repuesto {code}"
            
        price = float(row['price_publico_c_iva']) if pd.notna(row['price_publico_c_iva']) else 0.0
        
        # Como es la lista más nueva, sobreescribimos los campos excepto el stock (si ya existía stock, lo preservamos)
        if code in catalog:
            catalog[code]['name'] = name
            catalog[code]['price'] = price
            catalog[code]['brand'] = 'UDOR' # Generalmente bombas y accesorios de aspersión
        else:
            catalog[code] = {
                'code': code,
                'name': name,
                'price': price,
                'stock': 0,
                'brand': 'UDOR',
                'condition': 'Nuevo',
                'category': 'Repuestos'
            }

    # 4. GENERAR ARCHIVOS CSV DE SALIDA
    print("Escribiendo archivos CSV de salida...")
    
    def should_keep_product(name):
        if not name:
            return False
        name_lower = name.lower()
        
        # 1. Filtros
        is_filtro = "filtro" in name_lower or "filter" in name_lower
        
        # 2. Drones (excluyendo falsos positivos como hidroneumático / hidrone)
        is_dron = ("dron" in name_lower or "drone" in name_lower) and "hidrone" not in name_lower
        
        # 3. Fumigación
        fumig_keywords = ["fumig", "pulveriz", "aspers", "boquilla", "pastilla", "pico", "portapico", "portapastilla"]
        is_fumigacion = any(kw in name_lower for kw in fumig_keywords)
        
        # Debe pertenecer a alguna de las categorías deseadas
        if not (is_filtro or is_dron or is_fumigacion):
            return False
            
        # 4. Exclusiones: No tornillos, no otros items chicos
        small_item_keywords = [
            "tornillo", "arandela", "tuerca", "bulon", "bulón", "pasador", "chaveta", 
            "o-ring", "o ring", "oring", "reten", "retén", "seguro", "tapon", "tapón", 
            "abrazadera", "anillo", "resorte"
        ]
        
        # Evitar falsos positivos de "retén" en "retención"
        name_for_reten = name_lower.replace("retencion", "").replace("retención", "")
        
        for kw in small_item_keywords:
            if kw in ["reten", "retén"]:
                if kw in name_for_reten:
                    return False
            elif kw in name_lower:
                return False
                
        return True

    # Lista de todos los productos y lista filtrada con stock > 0
    all_products = [p for p in catalog.values() if should_keep_product(p['name'])]
    con_stock_products = [p for p in all_products if p['stock'] > 0]
    
    print(f"Total productos fusionados (Filtrados): {len(all_products)}")
    print(f"Total productos con stock > 0 (Filtrados): {len(con_stock_products)}")

    # Función para escribir el CSV personalizado
    def write_custom_csv(filepath, products_list):
        # Escribimos de forma manual para tener un control exacto de las comillas y comas
        with open(filepath, 'w', encoding='utf-8', newline='') as f:
            writer = csv.writer(f, quoting=csv.QUOTE_ALL)
            # Escribir encabezado
            writer.writerow(['Codigo', 'Nombre', 'Categoria', 'Marca', 'Condicion', 'Precio', 'Stock', 'ImagenesUrls', 'Descripcion'])
            
            for p in products_list:
                desc = f"Repuesto para maquinaria agrícola. Código: {p['code']}. {p['name']}."
                writer.writerow([
                    p['code'],
                    p['name'],
                    p['category'],
                    p['brand'],
                    p['condition'],
                    f"{p['price']:.2f}",
                    str(p['stock']),
                    "",
                    desc
                ])
                
    print(f"Guardando archivo con stock en: {output_con_stock_path}")
    write_custom_csv(output_con_stock_path, con_stock_products)
    
    print(f"Guardando archivo completo en: {output_completo_path}")
    write_custom_csv(output_completo_path, all_products)
    
    print("¡Fusión completada con éxito!")

if __name__ == '__main__':
    main()
