// --- DYNAMIC BACKGROUND (Smooth Gradient Waves) ---
function initGradientBackground() {
  const canvas = document.getElementById('gradient-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let time = 0;

  function resize() {
    const parent = canvas.parentElement;
    width = canvas.width = parent.offsetWidth;
    height = canvas.height = parent.offsetHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function drawWave(yOffset, amplitude, frequency, phase, colorStart, colorEnd, opacity) {
    ctx.beginPath();
    ctx.moveTo(0, height);
    
    for (let x = 0; x <= width; x += 20) {
      let y = yOffset 
            + Math.sin(x * frequency + time + phase) * amplitude 
            + Math.cos(x * frequency * 0.7 - time * 0.8 + phase) * amplitude * 0.5;
      ctx.lineTo(x, y);
    }
    
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    
    const grad = ctx.createLinearGradient(0, yOffset - amplitude * 2, 0, height);
    grad.addColorStop(0, colorStart);
    grad.addColorStop(1, colorEnd);
    
    ctx.globalAlpha = opacity;
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.globalAlpha = 1.0;
  }

  function animate() {
    ctx.fillStyle = '#f0f4f8';
    ctx.fillRect(0, 0, width, height);

    drawWave(height * 0.4, height * 0.15, 0.0015, 0, '#1d5497', '#153f71', 0.8);
    drawWave(height * 0.55, height * 0.12, 0.002, 2, '#d32f2f', '#9a0007', 0.7);
    drawWave(height * 0.7, height * 0.1, 0.0018, 4, '#2a73cc', '#1d5497', 0.8);
    drawWave(height * 0.85, height * 0.08, 0.0025, 1, '#ffffff', '#e2e8f0', 0.9);

    time += 0.015;
    requestAnimationFrame(animate);
  }

  animate();
}

// --- MOBILE MENU (Mariño Slide-out Style) ---
function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  if (!menuToggle || !navLinks) return;

  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    navLinks.classList.toggle('active');
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && e.target !== menuToggle) {
      navLinks.classList.remove('active');
    }
  });

  // Close menu when clicking a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
    });
  });
}

// --- CATALOG RENDERING & FILTERING ---
function initCatalog() {
  const catalogContainer = document.getElementById('catalog-list');
  const filterCat = document.getElementById('filter-categoria');
  const filterMarca = document.getElementById('filter-marca');
  const filterEstado = document.getElementById('filter-estado');

  if (!catalogContainer) return;

  function renderCatalog(items) {
    catalogContainer.innerHTML = '';
    
    if(items.length === 0) {
      catalogContainer.innerHTML = '<p style="text-align:center; padding: 2rem;">No se encontraron productos.</p>';
      return;
    }

    items.forEach(item => {
      const priceTag = window.formatAgroPrice ? window.formatAgroPrice(item) : '';
      const html = `
        <article class="catalog-item" data-id="${item.id}">
          <div class="catalog-item-img-wrapper">
            <img src="${item.imagen}" alt="${item.nombre}" class="catalog-item-img">
          </div>
          <div class="catalog-item-content">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 6px; margin-bottom: 0.3rem;">
              <span class="product-category" style="margin-bottom:0;">${item.categoria} &bull; ${item.marca} &bull; ${item.estado}</span>
              ${priceTag}
            </div>
            <h3 class="product-title">${item.nombre}</h3>
            <p class="product-desc">${item.descripcionCorta}</p>
            <a href="m_producto-detalle.html?id=${item.id}" class="btn btn-outline">Ver detalles</a>
          </div>
        </article>
      `;
      catalogContainer.innerHTML += html;
    });

    if (window.attachCardAdminControls) {
      window.attachCardAdminControls();
    }
  }

  function applyFilters() {
    const currentCatalog = window.getAgroCatalog ? window.getAgroCatalog() : (typeof catalogo !== 'undefined' ? catalogo : []);
    const valCat = filterCat.value;
    const valMarca = filterMarca.value;
    const valEstado = filterEstado.value;

    const filtered = currentCatalog.filter(item => {
      return (valCat === 'todas' || item.categoria === valCat) &&
             (valMarca === 'todas' || item.marca === valMarca) &&
             (valEstado === 'todos' || item.estado === valEstado);
    });

    renderCatalog(filtered);
  }

  if(filterCat) filterCat.addEventListener('change', applyFilters);
  if(filterMarca) filterMarca.addEventListener('change', applyFilters);
  if(filterEstado) filterEstado.addEventListener('change', applyFilters);

  // View Mode Switcher Mobile
  const btnList = document.getElementById('view-mode-list');
  const btnGrid = document.getElementById('view-mode-grid');

  function setViewMode(mode) {
    if (mode === 'grid') {
      catalogContainer.classList.add('grid-view');
      if (btnGrid) btnGrid.classList.add('active');
      if (btnList) btnList.classList.remove('active');
      localStorage.setItem('agro_catalog_view', 'grid');
    } else {
      catalogContainer.classList.remove('grid-view');
      if (btnList) btnList.classList.add('active');
      if (btnGrid) btnGrid.classList.remove('active');
      localStorage.setItem('agro_catalog_view', 'list');
    }
  }

  if (btnList) btnList.addEventListener('click', () => setViewMode('list'));
  if (btnGrid) btnGrid.addEventListener('click', () => setViewMode('grid'));

  const savedView = localStorage.getItem('agro_catalog_view');
  if (savedView === 'grid') setViewMode('grid');

  const activeItems = window.getAgroCatalog ? window.getAgroCatalog() : (typeof catalogo !== 'undefined' ? catalogo : []);
  renderCatalog(activeItems);

  window.addEventListener('agroCatalogUpdated', (e) => {
    renderCatalog(e.detail || window.getAgroCatalog());
  });
}

// --- FEATURED PRODUCTS ---
function initFeatured() {
  const featuredContainer = document.getElementById('featured-grid');
  if(!featuredContainer) return;

  function renderFeatured() {
    const currentCatalog = window.getAgroCatalog ? window.getAgroCatalog() : (typeof catalogo !== 'undefined' ? catalogo : []);
    featuredContainer.innerHTML = '';
    const featured = currentCatalog.slice(0, 3);
    
    featured.forEach(item => {
      const priceTag = window.formatAgroPrice ? window.formatAgroPrice(item) : '';
      const html = `
        <a href="m_producto-detalle.html?id=${item.id}" class="product-card" data-id="${item.id}">
          <div class="product-card-img-wrapper">
            <span class="product-badge">${item.estado}</span>
            <img src="${item.imagen}" alt="${item.nombre}" class="product-card-img">
          </div>
          <div class="product-card-content">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.3rem;">
              <span class="product-category" style="margin-bottom:0;">${item.categoria}</span>
              ${priceTag}
            </div>
            <h3 class="product-title">${item.nombre}</h3>
            <p class="product-desc">${item.descripcionCorta}</p>
            <div style="color: var(--brand-blue); font-weight: 600;">Ver Detalles &rarr;</div>
          </div>
        </a>
      `;
      featuredContainer.innerHTML += html;
    });

    if (window.attachCardAdminControls) {
      window.attachCardAdminControls();
    }
  }

  renderFeatured();
  window.addEventListener('agroCatalogUpdated', renderFeatured);
}

// --- PRODUCT DETAILS ---
function initProductDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  
  const container = document.getElementById('product-detail-container');
  if(!container || !productId) return;

  const currentCatalog = window.getAgroCatalog ? window.getAgroCatalog() : (typeof catalogo !== 'undefined' ? catalogo : []);
  const product = currentCatalog.find(p => String(p.id) === String(productId));
  
  if(!product) {
    container.innerHTML = '<div class="container section"><h2>Producto no encontrado.</h2><a href="m_catalogo.html" class="btn btn-primary">Volver al catálogo</a></div>';
    return;
  }

  document.title = product.nombre + " - Agroguardati";

  let specsRows = '';
  if (product.especificaciones) {
    for (const [key, value] of Object.entries(product.especificaciones)) {
      specsRows += `<tr><th>${key}</th><td>${value}</td></tr>`;
    }
  }

  let galleryHtml = '';
  if (product.imagenes && product.imagenes.length > 0) {
    galleryHtml = `
      <div class="detail-image-gallery">
        <img src="${product.imagen}" alt="${product.nombre}" class="main-img" id="main-product-img">
        <div class="gallery-thumbnails">
          ${product.imagenes.map((img, index) => `
            <div class="gallery-thumbnail ${index === 0 ? 'active' : ''}" data-index="${index}">
              <img src="${img}" alt="${product.nombre} vista ${index + 1}">
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else {
    galleryHtml = `
      <div class="detail-image-gallery">
        <img src="${product.imagen}" alt="${product.nombre}" class="main-img">
      </div>
    `;
  }

  const detailPriceTag = window.formatAgroPrice ? window.formatAgroPrice(product) : '';

  container.innerHTML = `
    <div class="detail-hero">
      <div class="container">
        <span class="product-category" style="margin-bottom:1rem; display:block;">
          <a href="m_catalogo.html">Catálogo</a> / ${product.categoria} / ${product.marca}
        </span>
        <h1 class="product-detail-title" style="font-size: 1.8rem;">${product.nombre}</h1>
        <div style="display: flex; align-items: center; gap: 10px; margin-top: 0.8rem;">
          <span class="product-badge" style="display:inline-block;">${product.estado}</span>
          ${detailPriceTag}
        </div>
      </div>
    </div>
    <div class="container section">
      <div class="detail-grid">
        ${galleryHtml}
        <div class="detail-info">
          <h2>Descripción</h2>
          <p style="color: var(--text-muted); margin-bottom: 2rem;">${product.descripcionLarga}</p>
          
          <h2>Especificaciones</h2>
          <table class="specs-table" style="width:100%; border-collapse:collapse; margin-top:1rem;">
            <tbody>${specsRows}</tbody>
          </table>
          
          <div style="margin-top: 2rem;">
            <a href="https://wa.me/5493404638524?text=Hola,%20interés%20en:%20${encodeURIComponent(product.nombre)}" target="_blank" class="btn btn-primary" style="background-color: #25D366; border:none;">
              <i class="fab fa-whatsapp"></i> Consultar
            </a>
            <a href="m_catalogo.html" class="btn btn-outline">Volver</a>
          </div>
        </div>
      </div>
    </div>

    ${product.modelo3d ? `
      <div class="container" style="margin-top: 1rem; margin-bottom: 2.5rem;">
        <div style="text-align: center; margin-bottom: 1rem;">
          <h3 style="font-size: 1.3rem; color: var(--brand-blue-dark); display: flex; align-items: center; justify-content: center; gap: 6px;">
            <i class="fas fa-cube" style="color: var(--brand-blue);"></i> Vista <span class="text-gradient">3D Interactiva</span>
          </h3>
          <p style="color: var(--text-secondary); font-size: 0.88rem;">Girá e interactuá con el equipo</p>
        </div>
        <div class="model-container" style="height: 380px; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
          <model-viewer 
              src="${product.modelo3d}" 
              alt="Modelo 3D de ${product.nombre}"
              auto-rotate 
              camera-controls 
              shadow-intensity="1" 
              exposure="1"
              ar>
          </model-viewer>
        </div>
      </div>
    ` : ''}
  `;

  // Set up click listeners for thumbnails
  const thumbnails = container.querySelectorAll('.gallery-thumbnail');
  const mainImg = container.querySelector('#main-product-img');
  
  if (mainImg && thumbnails.length > 0) {
    thumbnails.forEach(thumb => {
      thumb.addEventListener('click', () => {
        if (thumb.classList.contains('active')) return;
        
        thumbnails.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        
        const newSrc = thumb.querySelector('img').src;
        mainImg.style.opacity = '0';
        
        setTimeout(() => {
          mainImg.src = newSrc;
          mainImg.style.opacity = '1';
        }, 150);
      });
    });
  }
}

// --- COUNTERS & TIMELINE ---
function animateCounter(el, target, duration = 1500) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { el.textContent = target; clearInterval(timer); }
    else { el.textContent = Math.floor(start); }
  }, 16);
}

function initCounters() {
  const counters = document.querySelectorAll('.stat-number, .badge-number');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = 'true';
        animateCounter(entry.target, parseInt(entry.target.dataset.target, 10));
      }
    });
  }, { threshold: 0.1 });
  counters.forEach(el => observer.observe(el));
}

function initTimelineReveal() {
  const items = document.querySelectorAll('.timeline-item');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  items.forEach(item => observer.observe(item));
}

document.addEventListener('DOMContentLoaded', () => {
  initGradientBackground();
  initMobileMenu();
  initFeatured();
  initCatalog();
  initProductDetails();
  initCounters();
  initTimelineReveal();
});
