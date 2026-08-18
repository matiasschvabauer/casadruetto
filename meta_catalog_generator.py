# ═══════════════════════════════════════════════════════════════════
# meta_catalog_generator.py — Generador de Catalog Feed para Meta & WhatsApp
# ═══════════════════════════════════════════════════════════════════
# Este script toma los productos de `products.json` y genera un archivo CSV
# 100% compatible con Meta Commerce Manager (Facebook / Instagram / WhatsApp Catalog).
#
# Características:
# - Conversión opcional de USD a ARS según cotización configurable.
# - Formateo de imágenes, categorías, enlaces de producto y stock.
# - Compatible con importación masiva directa y Data Feed programado.
# ═══════════════════════════════════════════════════════════════════

import os
import json
import csv
import sys
import argparse

PRODUCTS_FILE = "products.json"
OUTPUT_CSV = "meta_catalog_feed.csv"
DEFAULT_DOMAIN = "https://casadruetto.com.ar"  # Cambiar por el dominio final del cliente

# Mapeo de condición a estándares de Meta (new, refurbished, used)
CONDITION_MAP = {
    "nuevo": "new",
    "usado": "used",
    "restaurado": "refurbished",
    "reacondicionado": "refurbished"
}

def load_products():
    if os.path.exists(PRODUCTS_FILE):
        try:
            with open(PRODUCTS_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error al leer {PRODUCTS_FILE}: {e}")

    # Fallback si no existe products.json pero sí js/products.js
    if os.path.exists("js/products.js"):
        try:
            with open("js/products.js", 'r', encoding='utf-8') as f:
                content = f.read()
                if "SEED_PRODUCTS =" in content:
                    json_str = content.split("SEED_PRODUCTS =")[1].split(";\n\n")[0].strip()
                    return json.loads(json_str)
        except Exception as e:
            print(f"Error cargando desde js/products.js: {e}")

    return []

def clean_text(text):
    if not text:
        return ""
    # Reemplazar saltos de línea molestos en descripciones
    return str(text).replace('\r', ' ').replace('\n', ' ').strip()

def generate_feed(usd_rate=1.0, currency="ARS", domain=DEFAULT_DOMAIN, output_file=OUTPUT_CSV):
    products = load_products()
    if not products:
        print("No se encontraron productos para exportar.")
        return False

    # Encabezados Estándar de Meta Commerce Manager Feed
    fieldnames = [
        'id',
        'title',
        'description',
        'availability',
        'condition',
        'price',
        'link',
        'image_link',
        'additional_image_link',
        'brand',
        'category',
        'custom_label_0' # Guardar la moneda original o categoría interna
    ]

    count = 0
    with open(output_file, 'w', newline='', encoding='utf-8-sig') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()

        for p in products:
            p_id = p.get('id') or p.get('code')
            if not p_id:
                continue

            name = clean_text(p.get('name', 'Producto'))
            desc = clean_text(p.get('desc', name))
            
            # Stock & disponibilidad
            stock = p.get('stock', 1)
            availability = "in stock" if stock > 0 else "out of stock"

            # Condición
            cond_raw = str(p.get('condition', 'nuevo')).lower().strip()
            condition = CONDITION_MAP.get(cond_raw, "new")

            # Precio y conversión
            raw_price = float(p.get('price', 0))
            if currency == "ARS" and usd_rate > 1.0:
                final_price = raw_price * usd_rate
            else:
                final_price = raw_price

            # Meta requiere formato "123.45 ARS" o "123.45 USD"
            price_str = f"{final_price:.2f} {currency}"

            # Enlaces
            # Estructura del link de detalle en la web
            product_url = f"{domain.rstrip('/')}/producto-detalle.html?id={p_id}"
            
            # Imágenes
            images = p.get('images', [])
            main_image = images[0] if len(images) > 0 else ""
            extra_images = ",".join(images[1:]) if len(images) > 1 else ""

            brand = p.get('brand', 'Casa Druetto')
            category = p.get('category', '')

            row = {
                'id': p_id,
                'title': name,
                'description': desc,
                'availability': availability,
                'condition': condition,
                'price': price_str,
                'link': product_url,
                'image_link': main_image,
                'additional_image_link': extra_images,
                'brand': brand,
                'category': category,
                'custom_label_0': f"Precio Base: USD {raw_price}"
            }

            writer.writerow(row)
            count += 1

    print(f"[SUCCESS] Feed generado exitosamente: '{output_file}' con {count} productos.")
    print(f"          Cotización aplicada: USD 1 = {usd_rate} {currency}")
    return True

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Generador de Feed de Meta/WhatsApp para Casa Druetto")
    parser.add_argument("--rate", type=float, default=1.0, help="Tipo de cambio USD a ARS (Ejemplo: --rate 1250)")
    parser.add_argument("--currency", type=str, default="ARS", choices=["ARS", "USD"], help="Moneda del feed (ARS o USD)")
    parser.add_argument("--domain", type=str, default=DEFAULT_DOMAIN, help="Dominio base del sitio web")
    parser.add_argument("--out", type=str, default=OUTPUT_CSV, help="Archivo de salida CSV")

    args = parser.parse_args()
    generate_feed(usd_rate=args.rate, currency=args.currency, domain=args.domain, output_file=args.out)
