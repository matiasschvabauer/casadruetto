# ═══════════════════════════════════════════════════════════════════
# mercadolibre_sync.py — Sincronizador Bidireccional de Catálogo
# ═══════════════════════════════════════════════════════════════════

import os
import json
import urllib.request
import urllib.parse
import sys

# Archivos locales de base de datos (Fallback local o exportaciones de Firebase)
PRODUCTS_FILE = "products.json"
CONFIG_FILE = "ml_config.json"

def load_local_db():
    if os.path.exists(PRODUCTS_FILE):
        try:
            with open(PRODUCTS_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error al leer {PRODUCTS_FILE}: {e}")
    return []

def save_local_db(data):
    try:
        with open(PRODUCTS_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
        print(f"Base de datos local actualizada en {PRODUCTS_FILE}")
    except Exception as e:
        print(f"Error al escribir en {PRODUCTS_FILE}: {e}")

def load_config():
    if os.path.exists(CONFIG_FILE):
        try:
            with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            pass
    return {
        "client_id": "YOUR_ML_CLIENT_ID",
        "client_secret": "YOUR_ML_CLIENT_SECRET",
        "access_token": "",
        "refresh_token": ""
    }

def save_config(cfg):
    try:
        with open(CONFIG_FILE, 'w', encoding='utf-8') as f:
            json.dump(cfg, f, indent=4)
    except Exception as e:
        print(f"Error al guardar config: {e}")

# ─── API MERCADO LIBRE HELPERS ────────────────────────────────────
def call_ml_api(endpoint, method="GET", data=None, token=None):
    url = f"https://api.mercadolibre.com{endpoint}"
    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    }
    if token:
        headers["Authorization"] = f"Bearer {token}"

    req_data = None
    if data:
        req_data = json.dumps(data).encode('utf-8')

    req = urllib.request.Request(url, data=req_data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            res_body = response.read().decode('utf-8')
            return json.loads(res_body)
    except urllib.error.HTTPError as e:
        err_msg = e.read().decode('utf-8')
        print(f"Error HTTP {e.code} en {endpoint}: {err_msg}")
        try:
            return {"error": True, "code": e.code, "details": json.loads(err_msg)}
        except:
            return {"error": True, "code": e.code, "message": err_msg}
    except Exception as e:
        print(f"Error al conectar con API: {e}")
        return {"error": True, "message": str(e)}

# Rotación y Refresco de Tokens de Acceso OAuth2
def refresh_access_token(cfg):
    print("Refrescando Access Token de Mercado Libre...")
    url = "https://api.mercadolibre.com/oauth/token"
    data = urllib.parse.urlencode({
        "grant_type": "refresh_token",
        "client_id": cfg["client_id"],
        "client_secret": cfg["client_secret"],
        "refresh_token": cfg["refresh_token"]
    }).encode('utf-8')

    req = urllib.request.Request(url, data=data, method="POST")
    try:
        with urllib.request.urlopen(req) as res:
            res_body = res.read().decode('utf-8')
            token_data = json.loads(res_body)
            cfg["access_token"] = token_data["access_token"]
            cfg["refresh_token"] = token_data["refresh_token"]
            save_config(cfg)
            print("¡Token refrescado con éxito!")
            return True
    except Exception as e:
        print(f"Error al refrescar token: {e}")
        return False

# ─── SYNC LOGIC ───────────────────────────────────────────────────
def sync_catalog():
    cfg = load_config()
    if not cfg["access_token"]:
        print("Sincronización pausada: Configure sus credenciales de Mercado Libre en ml_config.json")
        return

    products = load_local_db()
    if not products:
        # Si no existe, crear uno base para sincronizar
        print("Creando archivo de productos inicial a partir de los datos cargados.")
        return

    updated_db = False
    
    for p in products:
        print(f"\nProcesando producto: {p['name']} (SKU: {p['code']})")
        
        # Validaciones de publicación
        # Para publicar en ML se requiere categoría oficial de ML (ej: MLA408226 para Drones)
        # Por simplicidad buscaremos una categoría comodín de maquinarias
        ml_category_id = "MLA405786" # Categoría genérica: Agro > Maquinaria Agrícola
        if "dron" in p["category"].lower():
            ml_category_id = "MLA408226" # Categoría: Drones
        
        price = float(p["price"])
        if price <= 0:
            print("El producto no tiene precio asignado. Omitiendo...")
            continue

        item_data = {
            "title": p["name"][:60], # ML limita los títulos a 60 caracteres
            "category_id": ml_category_id,
            "price": price,
            "currency_id": "ARS", # Cambiar a USD si tienen cuenta habilitada en moneda extranjera
            "available_quantity": p["stock"],
            "buying_mode": "buy_it_now",
            "listing_type_id": "bronze", # Publicación Clásica estándar
            "condition": "new" if p["condition"] == "Nuevo" else "used",
            "pictures": [{"source": img} for img in p["images"] if img.startswith('http')],
            "attributes": [
                {"id": "BRAND", "value_name": p.get("brand", "Genérico")},
                {"id": "MODEL", "value_name": p.get("model", "Estándar")},
                {"id": "SELLER_ITEM_CODE", "value_name": p["code"]}
            ]
        }

        # Si no tiene imágenes con link HTTP absoluto, ML no permite cargarlas
        if not item_data["pictures"]:
            # Usar imagen de placeholder pública
            item_data["pictures"] = [{"source": "https://res.cloudinary.com/doissrwhj/image/upload/v1774992084/mh4hdrijm1lzsbcx2g5k.png"}]

        # ¿Ya fue publicado?
        ml_link = p.get("mercadolibreLink", "")
        ml_item_id = ""
        
        # Extraer MLA ID de la URL si existe
        if "MLA" in ml_link:
            import re
            match = re.search(r'MLA-?(\d+)', ml_link)
            if match:
                ml_item_id = f"MLA{match.group(1)}"

        if ml_item_id:
            # ACTUALIZAR PUBLICACIÓN EXISTENTE
            print(f"Publicación encontrada en Mercado Libre: {ml_item_id}. Actualizando precio y stock...")
            update_data = {
                "price": price,
                "available_quantity": p["stock"]
            }
            res = call_ml_api(f"/items/{ml_item_id}", "PUT", update_data, cfg["access_token"])
            
            # Si el token expiró (código 401), refrescarlo y reintentar una vez
            if isinstance(res, dict) and res.get("code") == 401:
                if refresh_access_token(cfg):
                    res = call_ml_api(f"/items/{ml_item_id}", "PUT", update_data, cfg["access_token"])
            
            if isinstance(res, dict) and not res.get("error"):
                print("¡Actualización en Mercado Libre completada!")
            else:
                print(f"Error al actualizar en Mercado Libre: {res.get('message', 'Desconocido')}")
        else:
            # CREAR NUEVA PUBLICACIÓN
            print("Publicando nuevo artículo en Mercado Libre...")
            res = call_ml_api("/items", "POST", item_data, cfg["access_token"])
            
            # Si el token expiró (código 401), refrescarlo y reintentar una vez
            if isinstance(res, dict) and res.get("code") == 401:
                if refresh_access_token(cfg):
                    res = call_ml_api("/items", "POST", item_data, cfg["access_token"])

            if isinstance(res, dict) and not res.get("error"):
                new_id = res.get("id")
                permalink = res.get("permalink")
                print(f"¡Publicado con éxito! ID: {new_id} - Link: {permalink}")
                p["mercadolibreLink"] = permalink
                updated_db = True
            else:
                print(f"Error al publicar en Mercado Libre: {res.get('message', 'Desconocido')}")

    if updated_db:
        save_local_db(products)

def main():
    print("┌────────────────────────────────────────────────────────┐")
    print("│ CASA DRUETTO - Asistente de Sincronización Mercado Libre│")
    print("└────────────────────────────────────────────────────────┘")
    
    # Crear archivo de configuración por defecto si no existe
    if not os.path.exists(CONFIG_FILE):
        cfg = load_config()
        save_config(cfg)
        print(f"Se ha creado el archivo de configuración en '{CONFIG_FILE}'.")
        print("Por favor complete su 'client_id' y 'client_secret' de Mercado Libre antes de continuar.")
        return

    sync_catalog()

if __name__ == '__main__':
    main()
