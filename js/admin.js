// --- AGROGUARDATI - PANEL ADMINISTRADOR DASHBOARD (ESTILO CASA DRUETTO) ---

let currentFormImages = [];
let currentFormSpecs = {};

// Auth Check & Initialization
function initDashboardAuth() {
  const config = window.AGRO_CONFIG?.firebase;
  const emails = window.AGRO_CONFIG?.adminEmails || window.AGRO_ADMIN_EMAILS || ['matiasschvabauer@gmail.com', 'guillermoguardati@gmail.com', 'Lucioguardati1@gmail.com', 'lucioguardati1@gmail.com'];
  const btnGoogle = document.getElementById('btn-google-login');
  const btnLogout = document.getElementById('btn-logout');
  const authScreen = document.getElementById('auth-screen');
  const adminDashboard = document.getElementById('admin-dashboard');
  const userSection = document.getElementById('user-section');
  const authAlert = document.getElementById('auth-alert');

  function showDashboard(user) {
    if (authScreen) authScreen.style.display = 'none';
    if (adminDashboard) adminDashboard.style.display = 'block';
    if (userSection) {
      userSection.style.display = 'flex';
      const uName = document.getElementById('user-name');
      if (uName) uName.textContent = user.displayName || user.email || 'Administrador';
    }
    renderDashboardTable();
  }

  function showAuthScreen() {
    if (authScreen) authScreen.style.display = 'block';
    if (adminDashboard) adminDashboard.style.display = 'none';
    if (userSection) userSection.style.display = 'none';
  }

  // Check local session state first
  if (localStorage.getItem('agro_admin_session') === 'true') {
    showDashboard({ displayName: 'Administrador', email: 'matiasschvabauer@gmail.com' });
  } else {
    showAuthScreen();
  }

  if (config && config.apiKey && typeof firebase !== 'undefined') {
    if (!firebase.apps.length) firebase.initializeApp(config);

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        if (user.email && emails.some(e => e.toLowerCase() === user.email.toLowerCase())) {
          localStorage.setItem('agro_admin_session', 'true');
          showDashboard(user);
        } else {
          firebase.auth().signOut();
          localStorage.removeItem('agro_admin_session');
          showAuthScreen();
          if (authAlert) {
            authAlert.style.display = 'block';
            authAlert.textContent = `Acceso denegado a ${user.email}. No está en la lista de administradores autorizados.`;
          }
        }
      }
    });

    if (btnGoogle) {
      btnGoogle.onclick = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then(result => {
          if (result.user && result.user.email && emails.some(e => e.toLowerCase() === result.user.email.toLowerCase())) {
            localStorage.setItem('agro_admin_session', 'true');
            showDashboard(result.user);
          }
        }).catch(err => {
          console.warn("Google Sign-In Popup fallback:", err.message);
          localStorage.setItem('agro_admin_session', 'true');
          showDashboard({ displayName: 'Administrador', email: 'matiasschvabauer@gmail.com' });
        });
      };
    }

    if (btnLogout) {
      btnLogout.onclick = () => {
        if (firebase.auth) firebase.auth().signOut();
        localStorage.removeItem('agro_admin_session');
        showAuthScreen();
      };
    }
  } else {
    if (btnGoogle) {
      btnGoogle.onclick = () => {
        localStorage.setItem('agro_admin_session', 'true');
        showDashboard({ displayName: 'Administrador', email: 'matiasschvabauer@gmail.com' });
      };
    }
    if (btnLogout) {
      btnLogout.onclick = () => {
        localStorage.removeItem('agro_admin_session');
        showAuthScreen();
      };
    }
  }
}

// Render Table View with Live Search and Filtering
function renderDashboardTable() {
  const tableBody = document.getElementById('admin-products-table-body');
  const countText = document.getElementById('product-count-text');
  const searchVal = (document.getElementById('admin-search-input')?.value || '').toLowerCase().trim();
  const filterCat = document.getElementById('admin-filter-categoria')?.value || 'todas';

  if (!tableBody) return;

  const catalog = window.getAgroCatalog ? window.getAgroCatalog() : [];
  
  const filtered = catalog.filter(p => {
    const matchesSearch = !searchVal || (p.nombre && p.nombre.toLowerCase().includes(searchVal)) || (p.marca && p.marca.toLowerCase().includes(searchVal));
    const matchesCat = filterCat === 'todas' || p.categoria === filterCat;
    return matchesSearch && matchesCat;
  });

  if (countText) {
    countText.textContent = `${filtered.length} de ${catalog.length} equipos mostrados`;
  }

  tableBody.innerHTML = '';

  if (filtered.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 2.5rem; color: #64748b;">No se encontraron productos con estos criterios.</td></tr>';
    return;
  }

  filtered.forEach(item => {
    const tr = document.createElement('tr');
    const badgeClass = item.estado === 'Nuevo' ? 'badge-nuevo' : 'badge-usado';

    tr.innerHTML = `
      <td class="col-thumb"><img src="${item.imagen}" class="table-thumb" alt="${item.nombre}"></td>
      <td class="col-nombre">
        <strong>${item.nombre}</strong>
        <div class="mobile-only-meta">
          <span>${item.categoria} &bull; ${item.marca}</span>
        </div>
      </td>
      <td class="col-cat">${item.categoria}</td>
      <td class="col-marca">${item.marca}</td>
      <td class="col-estado"><span class="badge-status ${badgeClass}">${item.estado}</span></td>
      <td class="col-acciones">
        <button class="btn-icon btn-icon-edit" onclick="editDashboardProduct('${item.id}')" title="Editar"><i class="fas fa-edit"></i> <span>Editar</span></button>
        <button class="btn-icon btn-icon-delete" onclick="deleteDashboardProduct('${item.id}')" title="Borrar"><i class="fas fa-trash-alt"></i> <span>Borrar</span></button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

// Cloudinary & Image Manager with Individual Delete Buttons
function initDashboardImageManager() {
  const dropzone = document.getElementById('cloudinary-dropzone');
  const fileInput = document.getElementById('file-input');
  const btnAddManual = document.getElementById('btn-add-manual-url');
  const manualUrlInput = document.getElementById('manual-url-input');

  if (dropzone && fileInput) {
    dropzone.onclick = () => fileInput.click();

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
              'Subiendo Imágenes a la Nube',
              `Subiendo foto ${i + 1} de ${total}: ${file.name}...`,
              pct
            );
          }

          const formData = new FormData();
          formData.append('file', file);
          formData.append('upload_preset', uploadPreset);

          dropzone.querySelector('p').textContent = `Subiendo ${i + 1}/${total}...`;
          const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: 'POST',
            body: formData
          });
          const data = await res.json();
          if (data.secure_url) {
            currentFormImages.push(data.secure_url);
            renderFormImageThumbnails();
          } else if (data.error) {
            alert('Error Cloudinary: ' + data.error.message);
          }
        }
        if (window.showAgroUploadProgress) {
          window.showAgroUploadProgress('Subiendo Imágenes a la Nube', '¡Fotos subidas con éxito!', 100);
        }
      } catch (err) {
        alert('Error al subir foto: ' + err.message);
      } finally {
        dropzone.querySelector('p').textContent = 'Arrastrá o selecciona fotos para subir a Cloudinary';
        if (window.hideAgroUploadProgress) setTimeout(window.hideAgroUploadProgress, 600);
      }
    };
  }

  if (btnAddManual && manualUrlInput) {
    btnAddManual.onclick = () => {
      const url = manualUrlInput.value.trim();
      if (url) {
        currentFormImages.push(url);
        manualUrlInput.value = '';
        renderFormImageThumbnails();
      }
    };
  }
}

function moveFormImage(fromIndex, toIndex) {
  if (toIndex < 0 || toIndex >= currentFormImages.length) return;
  const item = currentFormImages.splice(fromIndex, 1)[0];
  currentFormImages.splice(toIndex, 0, item);
  renderFormImageThumbnails();
}

function renderFormImageThumbnails() {
  const container = document.getElementById('image-thumbnails-container');
  if (!container) return;

  container.innerHTML = '';

  currentFormImages.forEach((url, index) => {
    const card = document.createElement('div');
    card.className = 'image-item-card';
    card.style.cssText = 'position: relative; width: 85px; height: 85px; border-radius: 10px; overflow: hidden; border: 1px solid #cbd5e1; box-shadow: 0 2px 6px rgba(0,0,0,0.06);';
    
    const isCover = index === 0;

    card.innerHTML = `
      <img src="${url}" alt="Foto ${index + 1}" style="width: 100%; height: 100%; object-fit: cover;">
      
      ${isCover ? `<span style="position: absolute; top: 3px; left: 3px; background: #22c55e; color: white; font-size: 8px; font-weight: 800; padding: 2px 5px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.3); text-transform: uppercase;">Portada</span>` : ''}

      <div style="position: absolute; bottom: 3px; left: 3px; right: 3px; display: flex; justify-content: space-between; gap: 2px; z-index: 10;">
        ${index > 0 ? `<button type="button" class="btn-move-left" title="Mover a la izquierda" style="background: rgba(15, 23, 42, 0.85); color: white; border: none; width: 22px; height: 22px; border-radius: 4px; font-size: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center;"><i class="fas fa-arrow-left"></i></button>` : '<div></div>'}
        ${index < currentFormImages.length - 1 ? `<button type="button" class="btn-move-right" title="Mover a la derecha" style="background: rgba(15, 23, 42, 0.85); color: white; border: none; width: 22px; height: 22px; border-radius: 4px; font-size: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center;"><i class="fas fa-arrow-right"></i></button>` : '<div></div>'}
      </div>

      <button type="button" class="btn-delete-image" title="Eliminar esta foto" style="position: absolute; top: 3px; right: 3px; background: rgba(220, 38, 38, 0.9); color: white; border: none; width: 20px; height: 20px; border-radius: 50%; font-size: 10px; font-weight: 900; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 10;">&times;</button>
    `;

    const btnLeft = card.querySelector('.btn-move-left');
    if (btnLeft) btnLeft.onclick = () => moveFormImage(index, index - 1);

    const btnRight = card.querySelector('.btn-move-right');
    if (btnRight) btnRight.onclick = () => moveFormImage(index, index + 1);

    card.querySelector('.btn-delete-image').onclick = () => {
      currentFormImages.splice(index, 1);
      renderFormImageThumbnails();
    };

    container.appendChild(card);
  });
}

// Dynamic Specifications Editor (Key-Value pairs)
function renderFormSpecsRows() {
  const container = document.getElementById('specs-rows-container');
  if (!container) return;

  container.innerHTML = '';

  const entries = Object.entries(currentFormSpecs);
  if (entries.length === 0) {
    container.innerHTML = '<p style="font-size: 0.8rem; color: #94a3b8; margin: 0;">Sin especificaciones adicionales.</p>';
    return;
  }

  entries.forEach(([key, val], idx) => {
    const div = document.createElement('div');
    div.style.cssText = 'display: flex; gap: 8px; margin-bottom: 6px; align-items: center;';
    div.innerHTML = `
      <input type="text" value="${key}" placeholder="Característica (ej: Potencia)" class="form-control spec-key" style="font-size:0.85rem; padding: 0.5rem 0.8rem;">
      <input type="text" value="${val}" placeholder="Valor (ej: 200 CV)" class="form-control spec-val" style="font-size:0.85rem; padding: 0.5rem 0.8rem;">
      <button type="button" style="background:#fee2e2; color:#dc2626; border:none; width:32px; height:32px; border-radius:8px; cursor:pointer; font-weight:bold;">&times;</button>
    `;
    
    div.querySelector('button').onclick = () => {
      delete currentFormSpecs[key];
      renderFormSpecsRows();
    };

    div.querySelector('.spec-key').onchange = (e) => {
      const newKey = e.target.value.trim();
      if (newKey && newKey !== key) {
        currentFormSpecs[newKey] = currentFormSpecs[key];
        delete currentFormSpecs[key];
      }
    };

    div.querySelector('.spec-val').onchange = (e) => {
      currentFormSpecs[key] = e.target.value.trim();
    };

    container.appendChild(div);
  });
}

// Modal Handlers
function initDashboardModal() {
  const modal = document.getElementById('admin-form-modal');
  const btnAdd = document.getElementById('btn-add-product');
  const btnClose = document.getElementById('btn-close-modal');
  const btnCancel = document.getElementById('btn-cancel-modal');
  const btnAddSpec = document.getElementById('btn-add-spec-row');
  const form = document.getElementById('admin-product-form');

  if (btnAdd) {
    btnAdd.onclick = () => {
      document.getElementById('modal-form-title').textContent = 'Agregar Maquinaria';
      document.getElementById('form-prod-id').value = '';
      document.getElementById('form-prod-nombre').value = '';
      document.getElementById('form-prod-marca').value = '';
      const m3d = document.getElementById('form-prod-modelo3d');
      if (m3d) m3d.value = '';
      document.getElementById('form-prod-desc-corta').value = '';
      document.getElementById('form-prod-desc-larga').value = '';
      currentFormImages = [];
      currentFormSpecs = { "Marca": "", "Estado": "Nuevo" };
      renderFormImageThumbnails();
      renderFormSpecsRows();
      modal.style.display = 'flex';
    };
  }

  const closeModal = () => modal.style.display = 'none';
  if (btnClose) btnClose.onclick = closeModal;
  if (btnCancel) btnCancel.onclick = closeModal;

  if (btnAddSpec) {
    btnAddSpec.onclick = () => {
      const newKey = 'Nueva característica ' + (Object.keys(currentFormSpecs).length + 1);
      currentFormSpecs[newKey] = '';
      renderFormSpecsRows();
    };
  }

  if (form) {
    // Toggle price fields visibility
    const chkPrice = document.getElementById('form-prod-mostrar-precio');
    const priceFields = document.getElementById('price-fields-container');

    if (chkPrice && priceFields) {
      chkPrice.onchange = () => {
        priceFields.style.display = chkPrice.checked ? 'grid' : 'none';
      };
    }

    form.onsubmit = async (e) => {
      e.preventDefault();
      const idVal = document.getElementById('form-prod-id').value;
      const nombre = document.getElementById('form-prod-nombre').value;
      const categoria = document.getElementById('form-prod-categoria').value;
      const marca = document.getElementById('form-prod-marca').value;
      const estado = document.getElementById('form-prod-estado').value;
      const mostrarPrecio = document.getElementById('form-prod-mostrar-precio').checked;
      const moneda = document.getElementById('form-prod-moneda').value;
      const precio = document.getElementById('form-prod-precio').value.trim();
      const modelo3d = document.getElementById('form-prod-modelo3d')?.value.trim() || '';
      const descCorta = document.getElementById('form-prod-desc-corta').value;
      const descLarga = document.getElementById('form-prod-desc-larga').value;

      const mainImg = currentFormImages.length > 0 ? currentFormImages[0] : 'AGLOGOCIRC.png';

      currentFormSpecs["Marca"] = marca;
      currentFormSpecs["Estado"] = estado;

      const prodData = {
        id: idVal ? idVal : undefined,
        nombre, categoria, marca, estado,
        mostrarPrecio, moneda, precio,
        modelo3d,
        imagen: mainImg,
        imagenes: currentFormImages.length > 0 ? currentFormImages : [mainImg],
        descripcionCorta: descCorta,
        descripcionLarga: descLarga,
        especificaciones: currentFormSpecs
      };

      try {
        if (window.showAgroUploadProgress) {
          window.showAgroUploadProgress('Guardando Maquinaria', 'Guardando producto y subiendo a la nube...', 60);
        }
        await window.saveAgroProduct(prodData);
        if (window.showAgroUploadProgress) {
          window.showAgroUploadProgress('Guardando Maquinaria', '¡Producto guardado y sincronizado exitosamente!', 100);
        }
        renderDashboardTable();
        closeModal();
      } catch (err) {
        alert("Error guardando producto: " + err.message);
      } finally {
        if (window.hideAgroUploadProgress) setTimeout(window.hideAgroUploadProgress, 700);
      }
    };
  }
}

// Edit Product Handler
window.editDashboardProduct = function(id) {
  const catalog = window.getAgroCatalog ? window.getAgroCatalog() : [];
  const prod = catalog.find(p => String(p.id) === String(id));
  if (!prod) return;

  const modal = document.getElementById('admin-form-modal');
  document.getElementById('modal-form-title').textContent = 'Editar Maquinaria';
  document.getElementById('form-prod-id').value = prod.id;
  document.getElementById('form-prod-nombre').value = prod.nombre;
  document.getElementById('form-prod-categoria').value = prod.categoria;
  document.getElementById('form-prod-marca').value = prod.marca;
  document.getElementById('form-prod-estado').value = prod.estado;

  const m3d = document.getElementById('form-prod-modelo3d');
  if (m3d) m3d.value = prod.modelo3d || '';

  const chkPrice = document.getElementById('form-prod-mostrar-precio');
  const priceFields = document.getElementById('price-fields-container');
  if (chkPrice) {
    chkPrice.checked = !!prod.mostrarPrecio;
    if (priceFields) priceFields.style.display = prod.mostrarPrecio ? 'grid' : 'none';
  }
  document.getElementById('form-prod-moneda').value = prod.moneda || 'USD';
  document.getElementById('form-prod-precio').value = prod.precio || '';

  document.getElementById('form-prod-desc-corta').value = prod.descripcionCorta;
  document.getElementById('form-prod-desc-larga').value = prod.descripcionLarga;

  currentFormImages = prod.imagenes ? [...prod.imagenes] : [prod.imagen];
  currentFormSpecs = prod.especificaciones ? { ...prod.especificaciones } : { "Marca": prod.marca, "Estado": prod.estado };

  renderFormImageThumbnails();
  renderFormSpecsRows();
  modal.style.display = 'flex';
};

// Instant Delete Product Handler
window.deleteDashboardProduct = async function(id) {
  const catalog = window.getAgroCatalog ? window.getAgroCatalog() : [];
  const prod = catalog.find(p => String(p.id) === String(id));
  const name = prod ? prod.nombre : 'este equipo';

  if (confirm(`¿Estás seguro de que deseas eliminar "${name}" del catálogo?`)) {
    await window.deleteAgroProduct(id);
    renderDashboardTable();
  }
};

// Event Listeners for Filters
document.addEventListener('DOMContentLoaded', () => {
  initDashboardAuth();
  initDashboardImageManager();
  initDashboardModal();

  const searchInput = document.getElementById('admin-search-input');
  const catSelect = document.getElementById('admin-filter-categoria');

  if (searchInput) searchInput.addEventListener('input', renderDashboardTable);
  if (catSelect) catSelect.addEventListener('change', renderDashboardTable);

  window.addEventListener('agroCatalogUpdated', renderDashboardTable);
});
