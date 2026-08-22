// --- AGROGUARDATI - MODO ADMINISTRADOR EN-PÁGINA (ESTILO MARIÑO) ---

let currentModalImages = [];
let currentModalSpecs = {};

function initAdminBar() {
  const config = window.AGRO_CONFIG?.firebase;
  const emails = window.AGRO_CONFIG?.adminEmails || window.AGRO_ADMIN_EMAILS || ['matiasschvabauer@gmail.com', 'guillermoguardati@gmail.com', 'Lucioguardati1@gmail.com', 'lucioguardati1@gmail.com'];

  // Check local session key first
  if (localStorage.getItem('agro_admin_session') === 'true') {
    renderAdminUI({ email: 'matiasschvabauer@gmail.com' });
  }

  if (config && config.apiKey && typeof firebase !== 'undefined') {
    if (!firebase.apps.length) firebase.initializeApp(config);
    
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        if (user.email && emails.some(e => e.toLowerCase() === user.email.toLowerCase())) {
          localStorage.setItem('agro_admin_session', 'true');
          renderAdminUI(user);
        } else {
          firebase.auth().signOut();
          localStorage.removeItem('agro_admin_session');
          removeAdminUI();
        }
      }
    });
  }
}

function renderAdminUI(user) {
  if (!document.getElementById('agro-admin-bar-styles')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'agro-admin-bar-styles';
    styleEl.textContent = `
      #agro-admin-topbar {
        position: fixed;
        top: 0; left: 0; right: 0;
        min-height: 44px;
        background: #0f172a;
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 4px 1.25rem;
        font-size: 0.85rem;
        font-weight: 600;
        z-index: 99999;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        font-family: 'Inter', sans-serif;
      }
      @media (max-width: 768px) {
        #agro-admin-topbar {
          padding: 6px 0.6rem !important;
          flex-direction: column !important;
          align-items: stretch !important;
          gap: 6px !important;
          min-height: auto !important;
        }
        .bar-user-email {
          font-size: 0.76rem !important;
          justify-content: center !important;
        }
        .bar-actions {
          width: 100% !important;
          display: flex !important;
          justify-content: space-between !important;
          gap: 4px !important;
        }
        .bar-actions button, .bar-actions a {
          flex: 1 !important;
          font-size: 0.72rem !important;
          padding: 6px 2px !important;
          justify-content: center !important;
          text-align: center !important;
          white-space: nowrap !important;
        }
        .agro-modal-inner {
          padding: 1.25rem 1rem !important;
          max-height: 92vh !important;
          border-radius: 16px !important;
          width: 95% !important;
        }
        .agro-modal-inner .form-row {
          grid-template-columns: 1fr !important;
          gap: 0.8rem !important;
        }
        #modal-price-fields-container {
          grid-template-columns: 1fr !important;
          gap: 0.8rem !important;
        }
      }
    `;
    document.head.appendChild(styleEl);
  }

  // 1. Inject Top Admin Bar if not present
  if (!document.getElementById('agro-admin-topbar')) {
    const bar = document.createElement('div');
    bar.id = 'agro-admin-topbar';
    bar.innerHTML = `
      <div class="bar-user-email" style="display: flex; align-items: center; gap: 6px;">
        <span style="display: inline-block; width: 8px; height: 8px; background: #22c55e; border-radius: 50%;"></span>
        <span>Modo Admin: <strong style="color: #60a5fa;">${user.email}</strong></span>
      </div>
      <div class="bar-actions" style="display: flex; align-items: center; gap: 8px;">
        <button id="btn-admin-story" style="background: #e11d48; color: white; border: none; padding: 5px 10px; border-radius: 6px; cursor: pointer; font-size: 0.78rem; font-weight: 700; display: flex; align-items: center; gap: 4px;"><i class="fas fa-camera"></i> Historia</button>
        <button id="btn-admin-add" style="background: #1d5497; color: white; border: none; padding: 5px 10px; border-radius: 6px; cursor: pointer; font-size: 0.78rem; font-weight: 700; display: flex; align-items: center; gap: 4px;"><i class="fas fa-plus"></i> + Equipo</button>
        <a href="admin.html" style="background: #334155; color: white; text-decoration: none; padding: 5px 10px; border-radius: 6px; font-size: 0.78rem; font-weight: 600;"><i class="fas fa-cog"></i> Panel</a>
        <button id="btn-admin-logout" style="background: #ef4444; color: white; border: none; padding: 5px 8px; border-radius: 6px; cursor: pointer; font-size: 0.78rem; font-weight: 600;"><i class="fas fa-sign-out-alt"></i> Salir</button>
      </div>
    `;
    document.body.prepend(bar);

    // Push fixed navbar down so it does NOT get covered
    const navbar = document.querySelector('.navbar, header, .header');
    if (navbar) {
      navbar.style.top = '44px';
    }
    document.body.style.paddingTop = '124px';

    document.getElementById('btn-admin-story').addEventListener('click', () => openStoryUploaderModal());
    document.getElementById('btn-admin-add').addEventListener('click', () => openAdminModal());
    document.getElementById('btn-admin-logout').addEventListener('click', () => {
      if (typeof firebase !== 'undefined' && firebase.auth) firebase.auth().signOut();
      localStorage.removeItem('agro_admin_session');
      window.location.reload();
    });
  }

  // 2. Attach Admin Controls to Product Cards
  attachCardAdminControls();

  // 3. Attach Admin Controls to Product Detail Page
  attachDetailAdminControls();
}

function removeAdminUI() {
  const bar = document.getElementById('agro-admin-topbar');
  if (bar) {
    bar.remove();
    const navbar = document.querySelector('.navbar, header, .header');
    if (navbar) navbar.style.top = '0px';
    document.body.style.paddingTop = '80px';
  }
}

function attachCardAdminControls() {
  if (!window.isAgroAdmin || !window.isAgroAdmin()) return;

  document.querySelectorAll('.catalog-item, .product-card').forEach(card => {
    if (card.querySelector('.admin-card-actions')) return;

    let prodId = card.getAttribute('data-id');
    if (!prodId) {
      const link = card.getAttribute('href') || card.querySelector('a')?.getAttribute('href');
      if (link && link.includes('id=')) {
        prodId = link.split('id=')[1].split('&')[0];
      }
    }

    if (prodId) {
      card.style.position = 'relative';
      const actions = document.createElement('div');
      actions.className = 'admin-card-actions';
      actions.style.cssText = `
        position: absolute;
        top: 10px; right: 10px;
        display: flex; gap: 6px;
        z-index: 10;
      `;
      actions.innerHTML = `
        <button onclick="event.preventDefault(); event.stopPropagation(); openAdminModal('${prodId}')" style="background: rgba(29, 84, 151, 0.95); color: white; border: none; padding: 6px 12px; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 0.8rem; backdrop-filter: blur(4px); box-shadow: 0 4px 10px rgba(0,0,0,0.2);"><i class="fas fa-edit"></i> Editar</button>
        <button onclick="event.preventDefault(); event.stopPropagation(); confirmDeleteProduct('${prodId}')" style="background: rgba(211, 47, 47, 0.95); color: white; border: none; padding: 6px 12px; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 0.8rem; backdrop-filter: blur(4px); box-shadow: 0 4px 10px rgba(0,0,0,0.2);"><i class="fas fa-trash-alt"></i> Borrar</button>
      `;
      card.appendChild(actions);
    }
  });
}

// Confirm Delete Function
window.confirmDeleteProduct = async function(id) {
  const catalog = window.getAgroCatalog();
  const prod = catalog.find(p => String(p.id) === String(id));
  const name = prod ? prod.nombre : 'este equipo';

  if (confirm(`¿Estás seguro de que deseas eliminar "${name}" del catálogo?`)) {
    await window.deleteAgroProduct(id);
    document.querySelectorAll(`[data-id="${id}"]`).forEach(el => el.remove());
    if (window.initCatalog) window.initCatalog();
    if (window.initFeatured) window.initFeatured();
  }
};

// Modal Edit / Add
window.openAdminModal = function(id = null) {
  let modal = document.getElementById('agro-admin-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'agro-admin-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(15, 23, 42, 0.75);
      backdrop-filter: blur(6px);
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    `;
    modal.innerHTML = `
      <div class="agro-modal-inner" style="background: white; width: 100%; max-width: 680px; max-height: 90vh; overflow-y: auto; border-radius: 20px; padding: 2rem; box-shadow: 0 25px 50px rgba(0,0,0,0.3); font-family: 'Inter', sans-serif;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 1rem;">
          <h2 id="agro-modal-title" style="font-size: 1.4rem; color: #1e293b;">Agregar Equipo</h2>
          <button id="agro-modal-close" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #64748b;">&times;</button>
        </div>

        <form id="agro-modal-form">
          <input type="hidden" id="modal-prod-id">

          <div style="margin-bottom: 1.2rem;">
            <label style="display: block; font-weight: 600; font-size: 0.9rem; margin-bottom: 0.4rem; color: #334155;">Nombre del Equipo</label>
            <input type="text" id="modal-prod-nombre" required style="width: 100%; padding: 0.75rem 1rem; border-radius: 10px; border: 1px solid #cbd5e1; font-size: 0.95rem;">
          </div>

          <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.2rem;">
            <div>
              <label style="display: block; font-weight: 600; font-size: 0.9rem; margin-bottom: 0.4rem; color: #334155;">Categoría</label>
              <select id="modal-prod-categoria" required style="width: 100%; padding: 0.75rem 1rem; border-radius: 10px; border: 1px solid #cbd5e1; font-size: 0.95rem;">
                <option value="Tractores">Tractores</option>
                <option value="Cosechadoras">Cosechadoras</option>
                <option value="Sembradoras">Sembradoras</option>
                <option value="Pulverizadores">Pulverizadores</option>
                <option value="Herramientas">Herramientas</option>
                <option value="Acoplados">Acoplados</option>
                <option value="Embarcaciones">Embarcaciones</option>
              </select>
            </div>
            <div>
              <label style="display: block; font-weight: 600; font-size: 0.9rem; margin-bottom: 0.4rem; color: #334155;">Marca</label>
              <input type="text" id="modal-prod-marca" required style="width: 100%; padding: 0.75rem 1rem; border-radius: 10px; border: 1px solid #cbd5e1; font-size: 0.95rem;">
            </div>
          </div>

          <div style="margin-bottom: 1.2rem;">
            <label style="display: block; font-weight: 600; font-size: 0.9rem; margin-bottom: 0.4rem; color: #334155;">Estado</label>
            <select id="modal-prod-estado" required style="width: 100%; padding: 0.75rem 1rem; border-radius: 10px; border: 1px solid #cbd5e1; font-size: 0.95rem;">
              <option value="Nuevo">Nuevo</option>
              <option value="Usado">Usado</option>
            </select>
          </div>

          <!-- Control de Precio -->
          <div style="margin-bottom: 1.2rem; background: #eff6ff; padding: 1.2rem; border-radius: 12px; border: 1px solid #bfdbfe;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 0.5rem;">
              <input type="checkbox" id="modal-prod-mostrar-precio" style="width: 18px; height: 18px; cursor: pointer;">
              <label for="modal-prod-mostrar-precio" style="font-weight: 700; color: #1d5497; cursor: pointer; margin: 0; font-size: 0.92rem;">
                Habilitar Precio Público (Si no se activa, dirá "Consultar")
              </label>
            </div>

            <div id="modal-price-fields-container" style="display: none; grid-template-columns: 1fr 2fr; gap: 1rem; margin-top: 0.8rem;">
              <div>
                <label style="display: block; font-weight: 600; font-size: 0.85rem; margin-bottom: 0.3rem; color: #334155;">Moneda</label>
                <select id="modal-prod-moneda" style="width: 100%; padding: 0.6rem 0.8rem; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.9rem;">
                  <option value="USD">USD (Dólares)</option>
                  <option value="ARS">ARS (Pesos)</option>
                </select>
              </div>
              <div>
                <label style="display: block; font-weight: 600; font-size: 0.85rem; margin-bottom: 0.3rem; color: #334155;">Monto del Precio</label>
                <input type="text" id="modal-prod-precio" placeholder="Ej: 120.000 o 85.000.000" style="width: 100%; padding: 0.6rem 0.8rem; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.9rem;">
              </div>
            </div>
          </div>

          <!-- Gestor de Imágenes -->
          <div style="margin-bottom: 1.2rem; background: #f8fafc; padding: 1.2rem; border-radius: 12px; border: 1px solid #e2e8f0;">
            <label style="display: flex; justify-content: space-between; align-items: center; font-weight: 700; font-size: 0.9rem; margin-bottom: 0.6rem; color: #1e293b;">
              <span>Fotos del Producto</span>
              <span style="font-size: 0.78rem; font-weight: 500; color: #64748b;">Usá ⬅ ➡ para ordenar &bull; ❌ para borrar</span>
            </label>
            <div id="modal-images-grid" style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 1rem;"></div>

            <div id="modal-cloudinary-upload" style="border: 2px dashed #cbd5e1; border-radius: 10px; padding: 1rem; text-align: center; background: white; cursor: pointer;">
              <i class="fas fa-cloud-upload-alt" style="font-size: 1.8rem; color: #1d5497; margin-bottom: 0.3rem;"></i>
              <p style="font-size: 0.85rem; font-weight: 600; color: #334155; margin: 0;">Subir foto a Cloudinary</p>
              <input type="file" id="modal-file-input" multiple accept="image/*" style="display: none;">
            </div>
          </div>

          <!-- Modelo 3D (.glb) Opcional -->
          <div style="margin-bottom: 1.2rem; background: #f1f5f9; padding: 1.2rem; border-radius: 12px; border: 1px solid #cbd5e1;">
            <label style="display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 0.9rem; color: #1e293b; margin-bottom: 0.3rem;">
              <i class="fas fa-cube" style="color: #1d5497;"></i> Modelo 3D Interactivo (.glb) (Opcional)
            </label>
            <p style="font-size: 0.8rem; color: #64748b; margin-top: 2px; margin-bottom: 0.5rem;">
              Nombre del archivo .glb local (ej: <code>Tractor.glb</code>) o URL directa a internet.
            </p>
            <input type="text" id="modal-prod-modelo3d" placeholder="Ej: Tractor.glb o https://.../cosechadora.glb" style="width: 100%; padding: 0.75rem 1rem; border-radius: 10px; border: 1px solid #cbd5e1; font-size: 0.95rem;">
          </div>

          <div style="margin-bottom: 1.2rem;">
            <label style="display: block; font-weight: 600; font-size: 0.9rem; margin-bottom: 0.4rem; color: #334155;">Descripción Corta</label>
            <input type="text" id="modal-prod-desc-corta" required style="width: 100%; padding: 0.75rem 1rem; border-radius: 10px; border: 1px solid #cbd5e1; font-size: 0.95rem;">
          </div>

          <div style="margin-bottom: 1.2rem;">
            <label style="display: block; font-weight: 600; font-size: 0.9rem; margin-bottom: 0.4rem; color: #334155;">Descripción Detallada</label>
            <textarea id="modal-prod-desc-larga" rows="3" required style="width: 100%; padding: 0.75rem 1rem; border-radius: 10px; border: 1px solid #cbd5e1; font-size: 0.95rem; font-family: inherit;"></textarea>
          </div>

          <!-- Especificaciones Técnicas -->
          <div style="margin-bottom: 1.5rem; background: #f8fafc; padding: 1.2rem; border-radius: 12px; border: 1px solid #e2e8f0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem;">
              <label style="font-weight: 700; color: #1e293b; margin: 0;">Especificaciones Técnicas</label>
              <button type="button" id="modal-add-spec-btn" style="background: #1d5497; color: white; border: none; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; font-weight: 700; cursor: pointer;">+ Especificación</button>
            </div>
            <div id="modal-specs-container"></div>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 10px;">
            <button type="button" id="agro-modal-cancel" style="padding: 0.75rem 1.25rem; border-radius: 10px; border: none; background: #e2e8f0; font-weight: 600; cursor: pointer;">Cancelar</button>
            <button type="submit" style="padding: 0.75rem 1.5rem; border-radius: 10px; border: none; background: #1d5497; color: white; font-weight: 700; cursor: pointer;">Guardar Producto</button>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('agro-modal-close').onclick = () => modal.style.display = 'none';
    document.getElementById('agro-modal-cancel').onclick = () => modal.style.display = 'none';

    document.getElementById('modal-add-spec-btn').onclick = () => {
      const newKey = 'Característica ' + (Object.keys(currentModalSpecs).length + 1);
      currentModalSpecs[newKey] = '';
      renderModalSpecs();
    };

    const uploadBox = document.getElementById('modal-cloudinary-upload');
    const fileInput = document.getElementById('modal-file-input');
    uploadBox.onclick = () => fileInput.click();

    fileInput.onchange = async (e) => {
      const files = Array.from(e.target.files);
      if (!files.length) return;

      const cloudName = window.AGRO_CONFIG?.cloudinary?.cloudName || 'pfskomq5';
      const uploadPreset = window.AGRO_CONFIG?.cloudinary?.uploadPreset || 'nwrslkmw';
      const total = files.length;

      try {
        for (let i = 0; i < total; i++) {
          const file = files[i];
          const pct = Math.round(((i + 1) / total) * 90);
          if (window.showAgroUploadProgress) {
            window.showAgroUploadProgress(
              'Subiendo Foto a la Nube',
              `Subiendo foto ${i + 1} de ${total}: ${file.name}...`,
              pct
            );
          }

          const formData = new FormData();
          formData.append('file', file);
          formData.append('upload_preset', uploadPreset);

          uploadBox.querySelector('p').textContent = `Subiendo ${i + 1}/${total}...`;
          const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: 'POST', body: formData
          });
          const data = await res.json();
          if (data.secure_url) {
            currentModalImages.push(data.secure_url);
            renderModalThumbnails();
          } else if (data.error) {
            alert('Error Cloudinary: ' + data.error.message);
          }
        }
        if (window.showAgroUploadProgress) {
          window.showAgroUploadProgress('Subiendo Foto a la Nube', '¡Fotos subidas con éxito!', 100);
        }
      } catch (err) {
        alert("Error subiendo foto: " + err.message);
      } finally {
        uploadBox.querySelector('p').textContent = 'Subir foto a Cloudinary';
        if (window.hideAgroUploadProgress) setTimeout(window.hideAgroUploadProgress, 600);
      }
    };

    const chkPrice = document.getElementById('modal-prod-mostrar-precio');
    const priceFields = document.getElementById('modal-price-fields-container');
    if (chkPrice && priceFields) {
      chkPrice.onchange = () => {
        priceFields.style.display = chkPrice.checked ? 'grid' : 'none';
      };
    }

    document.getElementById('agro-modal-form').onsubmit = async (e) => {
      e.preventDefault();
      const idVal = document.getElementById('modal-prod-id').value;
      const nombre = document.getElementById('modal-prod-nombre').value;
      const categoria = document.getElementById('modal-prod-categoria').value;
      const marca = document.getElementById('modal-prod-marca').value;
      const estado = document.getElementById('modal-prod-estado').value;
      const mostrarPrecio = document.getElementById('modal-prod-mostrar-precio').checked;
      const moneda = document.getElementById('modal-prod-moneda').value;
      const precio = document.getElementById('modal-prod-precio').value.trim();
      const modelo3d = document.getElementById('modal-prod-modelo3d')?.value.trim() || '';
      const descCorta = document.getElementById('modal-prod-desc-corta').value;
      const descLarga = document.getElementById('modal-prod-desc-larga').value;

      const mainImg = currentModalImages.length > 0 ? currentModalImages[0] : 'AGLOGOCIRC.png';

      currentModalSpecs["Marca"] = marca;
      currentModalSpecs["Estado"] = estado;

      const prodData = {
        id: idVal ? idVal : undefined,
        nombre, categoria, marca, estado,
        mostrarPrecio, moneda, precio,
        modelo3d,
        imagen: mainImg,
        imagenes: currentModalImages.length > 0 ? currentModalImages : [mainImg],
        descripcionCorta: descCorta,
        descripcionLarga: descLarga,
        especificaciones: currentModalSpecs
      };

      try {
        if (window.showAgroUploadProgress) {
          window.showAgroUploadProgress('Guardando Producto', 'Guardando producto y subiendo a la nube (Firestore)...', 60);
        }
        await window.saveAgroProduct(prodData);
        if (window.showAgroUploadProgress) {
          window.showAgroUploadProgress('Guardando Producto', '¡Producto guardado y sincronizado exitosamente!', 100);
        }
        modal.style.display = 'none';
        if (window.initCatalog) window.initCatalog();
        if (window.initFeatured) window.initFeatured();
      } catch (err) {
        alert("Error guardando producto: " + err.message);
      } finally {
        if (window.hideAgroUploadProgress) setTimeout(window.hideAgroUploadProgress, 700);
      }
    };
  }

  if (id) {
    const catalog = window.getAgroCatalog();
    const prod = catalog.find(p => String(p.id) === String(id));
    if (prod) {
      document.getElementById('agro-modal-title').textContent = 'Editar Equipo';
      document.getElementById('modal-prod-id').value = prod.id;
      document.getElementById('modal-prod-nombre').value = prod.nombre;
      document.getElementById('modal-prod-categoria').value = prod.categoria;
      document.getElementById('modal-prod-marca').value = prod.marca;
      document.getElementById('modal-prod-estado').value = prod.estado;

      const m3d = document.getElementById('modal-prod-modelo3d');
      if (m3d) m3d.value = prod.modelo3d || '';

      const chkPrice = document.getElementById('modal-prod-mostrar-precio');
      const priceFields = document.getElementById('modal-price-fields-container');
      if (chkPrice) {
        chkPrice.checked = !!prod.mostrarPrecio;
        if (priceFields) priceFields.style.display = prod.mostrarPrecio ? 'grid' : 'none';
      }
      document.getElementById('modal-prod-moneda').value = prod.moneda || 'USD';
      document.getElementById('modal-prod-precio').value = prod.precio || '';

      document.getElementById('modal-prod-desc-corta').value = prod.descripcionCorta;
      document.getElementById('modal-prod-desc-larga').value = prod.descripcionLarga;
      currentModalImages = prod.imagenes ? [...prod.imagenes] : [prod.imagen];
      currentModalSpecs = prod.especificaciones ? { ...prod.especificaciones } : { "Marca": prod.marca, "Estado": prod.estado };
    }
  } else {
    document.getElementById('agro-modal-title').textContent = 'Agregar Nuevo Equipo';
    document.getElementById('modal-prod-id').value = '';
    document.getElementById('modal-prod-nombre').value = '';
    const m3d = document.getElementById('modal-prod-modelo3d');
    if (m3d) m3d.value = '';
    document.getElementById('modal-prod-desc-corta').value = '';
    document.getElementById('modal-prod-desc-larga').value = '';

    const chkPrice = document.getElementById('modal-prod-mostrar-precio');
    const priceFields = document.getElementById('modal-price-fields-container');
    if (chkPrice) {
      chkPrice.checked = false;
      if (priceFields) priceFields.style.display = 'none';
    }
    document.getElementById('modal-prod-precio').value = '';

    currentModalImages = [];
    currentModalSpecs = { "Marca": "", "Estado": "Nuevo" };
  }

  renderModalThumbnails();
  renderModalSpecs();
  modal.style.display = 'flex';
};

function moveModalImage(fromIndex, toIndex) {
  if (toIndex < 0 || toIndex >= currentModalImages.length) return;
  const item = currentModalImages.splice(fromIndex, 1)[0];
  currentModalImages.splice(toIndex, 0, item);
  renderModalThumbnails();
}

function renderModalThumbnails() {
  const container = document.getElementById('modal-images-grid');
  if (!container) return;
  container.innerHTML = '';

  currentModalImages.forEach((url, i) => {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = `
      position: relative; width: 85px; height: 85px;
      border-radius: 10px; overflow: hidden; border: 1px solid #cbd5e1;
      box-shadow: 0 2px 5px rgba(0,0,0,0.06);
    `;

    const isCover = i === 0;

    wrapper.innerHTML = `
      <img src="${url}" style="width: 100%; height: 100%; object-fit: cover;">

      ${isCover ? `<span style="position: absolute; top: 3px; left: 3px; background: #22c55e; color: white; font-size: 8px; font-weight: 800; padding: 2px 5px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.3); text-transform: uppercase;">Portada</span>` : ''}

      <div style="position: absolute; bottom: 3px; left: 3px; right: 3px; display: flex; justify-content: space-between; gap: 2px; z-index: 10;">
        ${i > 0 ? `<button type="button" class="btn-move-left" title="Mover a la izquierda" style="background: rgba(15, 23, 42, 0.85); color: white; border: none; width: 22px; height: 22px; border-radius: 4px; font-size: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center;"><i class="fas fa-arrow-left"></i></button>` : '<div></div>'}
        ${i < currentModalImages.length - 1 ? `<button type="button" class="btn-move-right" title="Mover a la derecha" style="background: rgba(15, 23, 42, 0.85); color: white; border: none; width: 22px; height: 22px; border-radius: 4px; font-size: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center;"><i class="fas fa-arrow-right"></i></button>` : '<div></div>'}
      </div>

      <button type="button" class="btn-delete-img" style="
        position: absolute; top: 3px; right: 3px;
        background: rgba(220, 38, 38, 0.9); color: white; border: none;
        width: 20px; height: 20px; border-radius: 50%;
        font-size: 10px; font-weight: 900; cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3); z-index: 10;
      ">&times;</button>
    `;

    const btnLeft = wrapper.querySelector('.btn-move-left');
    if (btnLeft) btnLeft.onclick = () => moveModalImage(i, i - 1);

    const btnRight = wrapper.querySelector('.btn-move-right');
    if (btnRight) btnRight.onclick = () => moveModalImage(i, i + 1);

    wrapper.querySelector('.btn-delete-img').onclick = () => {
      currentModalImages.splice(i, 1);
      renderModalThumbnails();
    };
    container.appendChild(wrapper);
  });
}

function renderModalSpecs() {
  const container = document.getElementById('modal-specs-container');
  if (!container) return;

  container.innerHTML = '';
  const entries = Object.entries(currentModalSpecs);
  if (entries.length === 0) {
    container.innerHTML = '<p style="font-size: 0.8rem; color: #94a3b8; margin: 0;">Sin especificaciones adicionales.</p>';
    return;
  }

  entries.forEach(([key, val]) => {
    const div = document.createElement('div');
    div.style.cssText = 'display: flex; gap: 8px; margin-bottom: 6px; align-items: center;';
    div.innerHTML = `
      <input type="text" value="${key}" placeholder="Nombre" style="flex: 1; padding: 0.5rem; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.85rem;" class="spec-key">
      <input type="text" value="${val}" placeholder="Valor" style="flex: 1; padding: 0.5rem; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.85rem;" class="spec-val">
      <button type="button" style="background:#fee2e2; color:#dc2626; border:none; width:30px; height:30px; border-radius:6px; font-weight:bold; cursor:pointer;">&times;</button>
    `;
    div.querySelector('button').onclick = () => {
      delete currentModalSpecs[key];
      renderModalSpecs();
    };
    div.querySelector('.spec-key').onchange = (e) => {
      const newK = e.target.value.trim();
      if (newK && newK !== key) {
        currentModalSpecs[newK] = currentModalSpecs[key];
        delete currentModalSpecs[key];
      }
    };
    div.querySelector('.spec-val').onchange = (e) => {
      currentModalSpecs[key] = e.target.value.trim();
    };
    container.appendChild(div);
  });
}

function attachDetailAdminControls() {
  if (!window.isAgroAdmin || !window.isAgroAdmin()) return;

  const urlParams = new URLSearchParams(window.location.search);
  const prodId = urlParams.get('id');
  if (!prodId) return;

  const titleEl = document.querySelector('.product-detail-title') || document.querySelector('h1');
  if (titleEl && !document.getElementById('detail-admin-bar')) {
    const div = document.createElement('div');
    div.id = 'detail-admin-bar';
    div.style.cssText = `display: flex; gap: 10px; margin: 1rem 0;`;
    div.innerHTML = `
      <button onclick="openAdminModal('${prodId}')" style="background: #1d5497; color: white; border: none; padding: 8px 16px; border-radius: 8px; font-weight: 700; cursor: pointer;"><i class="fas fa-edit"></i> Editar este equipo</button>
      <button onclick="confirmDeleteProduct('${prodId}')" style="background: #d32f2f; color: white; border: none; padding: 8px 16px; border-radius: 8px; font-weight: 700; cursor: pointer;"><i class="fas fa-trash-alt"></i> Borrar este equipo</button>
    `;
    titleEl.parentNode.insertBefore(div, titleEl.nextSibling);
  }
}

window.addEventListener('agroCatalogUpdated', () => {
  setTimeout(attachCardAdminControls, 100);
});

document.addEventListener('DOMContentLoaded', () => {
  initAdminBar();
  setTimeout(attachCardAdminControls, 300);
});

// Modal Uploader Masivo para Historias 24hs (Estilo Instagram/WhatsApp Web)
window.openStoryUploaderModal = function() {
  let modal = document.getElementById('agro-story-uploader-modal');
  let selectedFiles = [];

  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'agro-story-uploader-modal';
    modal.style.cssText = `
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(8px);
      z-index: 999999; display: flex; align-items: center; justify-content: center; padding: 1rem;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
    `;
    modal.innerHTML = `
      <div style="background: white; width: 100%; max-width: 540px; max-height: 90vh; overflow-y: auto; border-radius: 20px; padding: 1.8rem; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem;">
          <h3 style="margin: 0; font-size: 1.25rem; font-weight: 800; color: #0f172a; display: flex; align-items: center; gap: 8px;">
            <i class="fas fa-camera" style="color: #e11d48;"></i> Subida Masiva de Historias (24h)
          </h3>
          <button id="close-story-uploader" style="background: #f1f5f9; border: none; width: 32px; height: 32px; border-radius: 50%; font-size: 1.2rem; cursor: pointer; color: #64748b; font-weight: 700;">&times;</button>
        </div>

        <p style="font-size: 0.85rem; color: #64748b; margin-top: 0; margin-bottom: 1.2rem; line-height: 1.4;">
          Selecciona varias fotos o videos a la vez. Se publicarán en la web por 24 horas y se auto-eliminarán liberando espacio.
        </p>

        <!-- Reglas / Límites Claros -->
        <div style="background: #fff1f2; border-left: 4px solid #e11d48; padding: 0.75rem 1rem; border-radius: 8px; margin-bottom: 1.2rem; font-size: 0.8rem; color: #9f1239;">
          <strong><i class="fas fa-info-circle"></i> Límites de Subida:</strong>
          <ul style="margin: 4px 0 0 0; padding-left: 1.2rem;">
            <li><strong>Fotos:</strong> JPG, PNG, WEBP (hasta 15 MB c/u).</li>
            <li><strong>Videos:</strong> MP4, MOV, WEBM (hasta 60 seg / 100 MB c/u).</li>
            <li><strong>Capacidad:</strong> Hasta 20 archivos por envío.</li>
          </ul>
        </div>

        <!-- Zona de Carga / Drag & Drop -->
        <div id="story-dropzone" style="border: 2px dashed #cbd5e1; border-radius: 16px; padding: 1.8rem 1rem; text-align: center; background: #f8fafc; cursor: pointer; transition: all 0.2s ease;">
          <i class="fas fa-cloud-upload-alt" style="font-size: 2.5rem; color: #e11d48; margin-bottom: 0.5rem;"></i>
          <p style="font-size: 0.95rem; font-weight: 700; color: #1e293b; margin: 0;">Haz clic o arrastra fotos/videos aquí</p>
          <span style="font-size: 0.8rem; color: #94a3b8; display: block; margin-top: 4px;">Puedes seleccionar múltiples archivos juntos</span>
          <input type="file" id="story-file-input" accept="image/*,video/*" multiple style="display: none;">
        </div>

        <!-- Previsualización de Archivos Seleccionados -->
        <div id="story-previews-container" style="margin-top: 1.2rem; display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 10px; max-height: 160px; overflow-y: auto;"></div>

        <!-- Campo Pie de Foto Global / Opcional -->
        <div id="caption-wrapper" style="margin-top: 1.2rem;">
          <label style="display: block; font-weight: 700; font-size: 0.85rem; color: #334155; margin-bottom: 0.4rem;">Texto / Pie de Foto (Opcional)</label>
          <input type="text" id="story-caption-input" placeholder="Ej: ¡Ingresó hoy! Excelente estado y financiación" style="width: 100%; padding: 0.75rem; border-radius: 10px; border: 1px solid #cbd5e1; font-size: 0.9rem; outline: none;">
        </div>

        <!-- Barra de Progreso de Subida -->
        <div id="story-progress-wrapper" style="display: none; margin-top: 1.2rem;">
          <div style="display: flex; justify-content: space-between; font-size: 0.82rem; font-weight: 700; color: #334155; margin-bottom: 6px;">
            <span id="story-progress-text">Subiendo historias...</span>
            <span id="story-progress-percent">0%</span>
          </div>
          <div style="background: #e2e8f0; border-radius: 999px; height: 10px; overflow: hidden;">
            <div id="story-progress-bar" style="width: 0%; height: 100%; background: linear-gradient(90deg, #e11d48, #1d5497); border-radius: 999px; transition: width 0.3s ease;"></div>
          </div>
        </div>

        <!-- Botones de Acción -->
        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 1.5rem;">
          <button id="cancel-story-uploader" style="padding: 0.75rem 1.3rem; border-radius: 10px; border: none; background: #f1f5f9; color: #475569; font-weight: 700; cursor: pointer;">Cancelar</button>
          <button id="btn-submit-stories" style="padding: 0.75rem 1.5rem; border-radius: 10px; border: none; background: linear-gradient(135deg, #e11d48, #be123c); color: white; font-weight: 700; cursor: pointer; box-shadow: 0 4px 12px rgba(225, 29, 72, 0.3); display: flex; align-items: center; gap: 8px;">
            <i class="fas fa-paper-plane"></i> Publicar Historias
          </button>
        </div>

      </div>
    `;
    document.body.appendChild(modal);

    const closeBtn = document.getElementById('close-story-uploader');
    const cancelBtn = document.getElementById('cancel-story-uploader');
    const dropzone = document.getElementById('story-dropzone');
    const fileInput = document.getElementById('story-file-input');
    const previewsContainer = document.getElementById('story-previews-container');
    const btnSubmit = document.getElementById('btn-submit-stories');
    const progressWrapper = document.getElementById('story-progress-wrapper');
    const progressBar = document.getElementById('story-progress-bar');
    const progressText = document.getElementById('story-progress-text');
    const progressPercent = document.getElementById('story-progress-percent');

    closeBtn.onclick = () => resetAndCloseModal();
    cancelBtn.onclick = () => resetAndCloseModal();

    function resetAndCloseModal() {
      selectedFiles = [];
      previewsContainer.innerHTML = '';
      fileInput.value = '';
      document.getElementById('story-caption-input').value = '';
      progressWrapper.style.display = 'none';
      btnSubmit.disabled = false;
      modal.style.display = 'none';
    }

    dropzone.onclick = () => fileInput.click();

    fileInput.onchange = (e) => {
      const files = Array.from(e.target.files);
      if (files.length === 0) return;

      if (selectedFiles.length + files.length > 20) {
        alert("Puedes seleccionar un máximo de 20 archivos por envío.");
        return;
      }

      files.forEach(file => {
        // Validar tamaño de foto (15MB) y video (100MB)
        const isVideo = file.type.startsWith('video');
        const maxSize = isVideo ? 100 * 1024 * 1024 : 15 * 1024 * 1024;

        if (file.size > maxSize) {
          alert(`El archivo "${file.name}" supera el tamaño máximo permitido (${isVideo ? '100MB para videos' : '15MB para fotos'}).`);
          return;
        }

        selectedFiles.push(file);
      });

      renderPreviews();
    };

    function renderPreviews() {
      previewsContainer.innerHTML = '';
      selectedFiles.forEach((file, index) => {
        const item = document.createElement('div');
        item.style.cssText = 'position: relative; width: 100%; height: 80px; border-radius: 10px; overflow: hidden; background: #000; border: 1px solid #cbd5e1;';

        const removeBtn = document.createElement('button');
        removeBtn.innerHTML = '&times;';
        removeBtn.style.cssText = 'position: absolute; top: 4px; right: 4px; background: rgba(0,0,0,0.7); color: white; border: none; border-radius: 50%; width: 20px; height: 20px; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 10;';
        removeBtn.onclick = (e) => {
          e.stopPropagation();
          selectedFiles.splice(index, 1);
          renderPreviews();
        };

        if (file.type.startsWith('video')) {
          item.innerHTML = `<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; color:white; font-size:1.2rem;"><i class="fas fa-video"></i></div>`;
        } else {
          const img = document.createElement('img');
          img.src = URL.createObjectURL(file);
          img.style.cssText = 'width: 100%; height: 100%; object-fit: cover;';
          item.appendChild(img);
        }

        item.appendChild(removeBtn);
        previewsContainer.appendChild(item);
      });
    }

    btnSubmit.onclick = async () => {
      if (selectedFiles.length === 0) {
        alert("Por favor selecciona al menos una foto o video para publicar.");
        return;
      }

      if (window.setAgroUploadLock) window.setAgroUploadLock(true, "Se están subiendo historias a la nube. Si salís ahora, se cancelará la publicación.");

      const cloudName = window.AGRO_CONFIG?.cloudinary?.cloudName || 'pfskomq5';
      const uploadPreset = window.AGRO_CONFIG?.cloudinary?.uploadPreset || 'nwrslkmw';
      const globalCaption = document.getElementById('story-caption-input').value.trim();

      progressWrapper.style.display = 'block';
      btnSubmit.disabled = true;

      const uploadedStories = [];
      const total = selectedFiles.length;

      try {
        for (let i = 0; i < total; i++) {
          const file = selectedFiles[i];
          const isVideo = file.type.startsWith('video');

          progressText.textContent = `Subiendo ${i + 1} de ${total}: ${file.name}...`;
          const pct = Math.round(((i) / total) * 100);
          progressBar.style.width = pct + '%';
          progressPercent.textContent = pct + '%';

          const formData = new FormData();
          formData.append('file', file);
          formData.append('upload_preset', uploadPreset);

          const endpoint = isVideo 
            ? `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`
            : `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

          try {
            const res = await fetch(endpoint, { method: 'POST', body: formData });
            const data = await res.json();

            if (data.secure_url) {
              uploadedStories.push({
                tipo: isVideo ? 'video' : 'image',
                url: data.secure_url,
                public_id: data.public_id || '',
                caption: globalCaption
              });
            } else {
              console.error("Error en subida de " + file.name, data);
            }
          } catch (err) {
            console.error("Error subiendo " + file.name, err);
          }
        }

        progressBar.style.width = '100%';
        progressPercent.textContent = '100%';

        if (uploadedStories.length > 0) {
          await window.saveAgroStoriesBatch(uploadedStories);
          alert(`¡${uploadedStories.length} historias publicadas con éxito en la web!`);
          resetAndCloseModal();
        } else {
          alert("No se pudo publicar ninguna historia. Revisa tu conexión.");
          btnSubmit.disabled = false;
        }
      } finally {
        if (window.setAgroUploadLock) window.setAgroUploadLock(false);
      }
    };
  }

  modal.style.display = 'flex';
};
