// --- AGROGUARDATI - MÓDULO DE HISTORIAS / NOVEDADES 24HS (ESTILO INSTAGRAM/WHATSAPP) ---

const STORIES_KEY = 'agroguardati_stories_v1';

const DEFAULT_STORIES = [
  {
    id: 'story_init_1',
    tipo: 'image',
    url: 'https://res.cloudinary.com/pfskomq5/image/upload/v1786402390/ppkewsxmkf0uwqi1tn7g.jpg',
    caption: '¡Nuevos ingresos de maquinarias en Agroguardati! Consultá disponibilidad.',
    fecha: Date.now(),
    expira: Date.now() + (24 * 60 * 60 * 1000)
  }
];

// 1. Obtener historias activas (menos de 24hs de antigüedad)
window.getAgroStories = function() {
  const localData = localStorage.getItem(STORIES_KEY);
  let stories = [];
  if (localData) {
    try {
      stories = JSON.parse(localData);
    } catch (e) {
      console.error("Error leyendo historias locales:", e);
    }
  }

  const now = Date.now();
  let active = Array.isArray(stories) ? stories.filter(s => s && s.expira > now) : [];

  if (active.length !== stories.length) {
    localStorage.setItem(STORIES_KEY, JSON.stringify(active));
  }

  return active;
};

// 2. Guardar nueva historia (Foto o Video)
window.saveAgroStory = async function(storyData) {
  return await window.saveAgroStoriesBatch([storyData]);
};

// 2b. Guardar lote de historias (Subida Masiva)
window.saveAgroStoriesBatch = async function(storiesArray) {
  if (!Array.isArray(storiesArray) || storiesArray.length === 0) return [];

  let stories = window.getAgroStories();
  const now = Date.now();
  const formattedNewStories = storiesArray.map((st, idx) => ({
    id: st.id || 'story_' + (now + idx) + '_' + Math.floor(Math.random() * 1000),
    tipo: st.tipo || 'image',
    url: st.url,
    public_id: st.public_id || '',
    caption: st.caption || '',
    fecha: now,
    expira: now + (24 * 60 * 60 * 1000)
  }));

  stories = [...formattedNewStories, ...stories];
  localStorage.setItem(STORIES_KEY, JSON.stringify(stories));

  // Guardar en Firestore si está disponible
  if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
    try {
      const batch = firebase.firestore().batch();
      formattedNewStories.forEach(st => {
        const ref = firebase.firestore().collection('historias').doc(st.id);
        batch.set(ref, st);
      });
      await batch.commit();
    } catch (err) {
      console.warn("Firestore stories batch save fallback:", err.message);
    }
  }

  window.dispatchEvent(new CustomEvent('agroStoriesUpdated', { detail: stories }));
  return formattedNewStories;
};

// 3. Renderizar barra de historias en la web (Globo en el centro, Desplegable en Desktop, Modal en Mobile)
let desktopStoryIndex = 0;
let desktopStoryTimer = null;
let isDesktopDropdownOpen = false;

function renderStoriesBar() {
  const container = document.getElementById('stories-container');
  if (!container) return;

  const stories = window.getAgroStories();
  container.innerHTML = '';

  if (stories.length === 0) {
    container.style.display = 'none';
    return;
  }

  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';

  const wrapper = document.createElement('div');
  wrapper.className = 'story-avatar-wrapper';
  wrapper.style.cssText = 'cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; width: auto;';

  const thumbUrl = stories[0].tipo === 'video' ? 'AGLOGOCIRC.png' : stories[0].url;

  wrapper.innerHTML = `
    <div class="story-ring">
      <img src="${thumbUrl}" class="story-avatar-img">
    </div>
    <span class="story-avatar-label" style="display: flex; align-items: center; gap: 6px;">
      Novedades (24h) 
      <i class="fas fa-chevron-down story-dropdown-arrow" style="font-size: 0.75rem; transition: transform 0.3s ease;"></i>
    </span>
  `;

  wrapper.onclick = (e) => {
    e.stopPropagation();
    if (window.innerWidth <= 768) {
      openStoryViewer(0);
    } else {
      toggleDesktopStoryDropdown();
    }
  };

  container.appendChild(wrapper);

  // Dropdown container para Escritorio
  const dropdown = document.createElement('div');
  dropdown.id = 'stories-desktop-dropdown';
  dropdown.className = 'stories-desktop-dropdown';
  dropdown.style.display = 'none';
  container.appendChild(dropdown);

  // Si estaba desplegado, restablecer la vista
  if (isDesktopDropdownOpen && window.innerWidth > 768) {
    dropdown.style.display = 'block';
    showDesktopStorySlide(desktopStoryIndex);
  }
}

// Control del Desplegable en Desktop
window.toggleDesktopStoryDropdown = function() {
  const dropdown = document.getElementById('stories-desktop-dropdown');
  const arrow = document.querySelector('.story-dropdown-arrow');
  if (!dropdown) return;

  if (isDesktopDropdownOpen) {
    closeDesktopStoryDropdown();
  } else {
    isDesktopDropdownOpen = true;
    dropdown.style.display = 'block';
    if (arrow) arrow.style.transform = 'rotate(180deg)';
    showDesktopStorySlide(0);
  }
};

window.closeDesktopStoryDropdown = function() {
  const dropdown = document.getElementById('stories-desktop-dropdown');
  const arrow = document.querySelector('.story-dropdown-arrow');
  if (desktopStoryTimer) clearTimeout(desktopStoryTimer);
  isDesktopDropdownOpen = false;
  if (dropdown) dropdown.style.display = 'none';
  if (arrow) arrow.style.transform = 'rotate(0deg)';
};

window.showDesktopStorySlide = function(index) {
  const stories = window.getAgroStories();
  const dropdown = document.getElementById('stories-desktop-dropdown');
  if (!dropdown || stories.length === 0) return;

  if (index < 0) index = stories.length - 1;
  if (index >= stories.length) index = 0;

  desktopStoryIndex = index;
  const item = stories[index];

  dropdown.innerHTML = `
    <div class="story-dropdown-card">
      <!-- Barras de Progreso -->
      <div class="story-dropdown-progress">
        ${stories.map((_, i) => `
          <div class="story-dropdown-progress-bar ${i < index ? 'completed' : i === index ? 'active' : ''}"></div>
        `).join('')}
      </div>

      <!-- Encabezado -->
      <div class="story-dropdown-header">
        <div style="display: flex; align-items: center; gap: 8px;">
          <img src="AGLOGOCIRC.png" style="width: 28px; height: 28px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.3);">
          <span style="font-weight: 700; font-size: 0.9rem; color: white;">Agroguardati Novedades</span>
          <span style="font-size: 0.78rem; color: #94a3b8; margin-left: 6px;">${index + 1} de ${stories.length}</span>
        </div>
        <button class="story-dropdown-close-btn" onclick="closeDesktopStoryDropdown()" title="Cerrar desplegable">&times;</button>
      </div>

      <!-- Contenedor Multimedia + Botones de Navegación -->
      <div class="story-dropdown-media-container">
        <button class="story-dropdown-nav-btn prev-btn" onclick="prevDesktopStory()" title="Anterior"><i class="fas fa-chevron-left"></i></button>
        
        <div class="story-dropdown-media-box">
          ${(item.tipo === 'video' || item.url.includes('.mp4') || item.url.includes('.mov'))
            ? `<video src="${item.url}" autoplay playsinline style="width: 100%; height: 100%; object-fit: contain;" onended="nextDesktopStory()"></video>`
            : `<img src="${item.url}" style="width: 100%; height: 100%; object-fit: contain;">`
          }
        </div>

        <button class="story-dropdown-nav-btn next-btn" onclick="nextDesktopStory()" title="Siguiente"><i class="fas fa-chevron-right"></i></button>
      </div>

      ${item.caption ? `<div class="story-dropdown-caption">${item.caption}</div>` : ''}

      <!-- Tira de Miniaturas -->
      ${stories.length > 1 ? `
        <div class="story-dropdown-thumbs">
          ${stories.map((st, i) => `
            <div class="story-thumb-item ${i === index ? 'active' : ''}" onclick="showDesktopStorySlide(${i})" title="Ver historia ${i + 1}">
              <img src="${st.tipo === 'video' ? 'AGLOGOCIRC.png' : st.url}">
            </div>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `;

  if (desktopStoryTimer) clearTimeout(desktopStoryTimer);
  if (item.tipo !== 'video' && !item.url.includes('.mp4') && !item.url.includes('.mov')) {
    desktopStoryTimer = setTimeout(() => {
      nextDesktopStory();
    }, 5000);
  }
};

window.nextDesktopStory = function() {
  const stories = window.getAgroStories();
  if (desktopStoryIndex + 1 < stories.length) {
    showDesktopStorySlide(desktopStoryIndex + 1);
  } else {
    showDesktopStorySlide(0);
  }
};

window.prevDesktopStory = function() {
  showDesktopStorySlide(desktopStoryIndex - 1);
};

// 4. Visor interactivo a pantalla completa (Para celulares)
let currentStoryIndex = 0;
let storyTimer = null;

function openStoryViewer(index = 0) {
  const stories = window.getAgroStories();
  if (stories.length === 0) return;

  currentStoryIndex = index;
  let modal = document.getElementById('agro-story-modal');

  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'agro-story-modal';
    modal.innerHTML = `
      <div class="story-modal-overlay">
        <div class="story-modal-card">
          <!-- Barras de progreso -->
          <div id="story-progress-bars" class="story-progress-container"></div>

          <!-- Header -->
          <div class="story-modal-header">
            <div style="display: flex; align-items: center; gap: 8px;">
              <img src="AGLOGOCIRC.png" style="width: 32px; height: 32px; border-radius: 50%;">
              <span style="color: white; font-weight: 700; font-size: 0.9rem;">Agroguardati Novedades</span>
            </div>
            <button id="story-close-btn" class="story-close-btn">&times;</button>
          </div>

          <!-- Contenido Media -->
          <div id="story-media-content" class="story-media-box"></div>

          <!-- Pie de foto -->
          <div id="story-caption" class="story-caption-box"></div>

          <!-- Navegación por tap/click -->
          <div class="story-nav-left" onclick="prevStory()"></div>
          <div class="story-nav-right" onclick="nextStory()"></div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('story-close-btn').onclick = closeStoryViewer;
  }

  modal.style.display = 'flex';
  showStorySlide(currentStoryIndex);
}

function showStorySlide(index) {
  const stories = window.getAgroStories();
  if (index < 0 || index >= stories.length) {
    closeStoryViewer();
    return;
  }

  currentStoryIndex = index;
  const item = stories[index];

  const barsContainer = document.getElementById('story-progress-bars');
  barsContainer.innerHTML = '';
  stories.forEach((_, i) => {
    const bar = document.createElement('div');
    bar.className = `story-progress-bar ${i < index ? 'completed' : i === index ? 'active' : ''}`;
    barsContainer.appendChild(bar);
  });

  const mediaBox = document.getElementById('story-media-content');
  mediaBox.innerHTML = '';

  if (item.tipo === 'video' || item.url.includes('.mp4') || item.url.includes('.mov')) {
    const video = document.createElement('video');
    video.src = item.url;
    video.autoplay = true;
    video.playsInline = true;
    video.style.cssText = 'width: 100%; height: 100%; object-fit: contain;';
    video.onended = () => nextStory();
    mediaBox.appendChild(video);
  } else {
    const img = document.createElement('img');
    img.src = item.url;
    img.style.cssText = 'width: 100%; height: 100%; object-fit: contain;';
    mediaBox.appendChild(img);

    if (storyTimer) clearTimeout(storyTimer);
    storyTimer = setTimeout(() => nextStory(), 5000);
  }

  const captionEl = document.getElementById('story-caption');
  if (item.caption) {
    captionEl.textContent = item.caption;
    captionEl.style.display = 'block';
  } else {
    captionEl.style.display = 'none';
  }
}

window.nextStory = function() {
  const stories = window.getAgroStories();
  if (currentStoryIndex + 1 < stories.length) {
    showStorySlide(currentStoryIndex + 1);
  } else {
    closeStoryViewer();
  }
};

window.prevStory = function() {
  if (currentStoryIndex > 0) {
    showStorySlide(currentStoryIndex - 1);
  }
};

function closeStoryViewer() {
  if (storyTimer) clearTimeout(storyTimer);
  const modal = document.getElementById('agro-story-modal');
  if (modal) modal.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
  renderStoriesBar();

  if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
    firebase.firestore().collection('historias').onSnapshot(snapshot => {
      if (!snapshot.empty) {
        const stories = [];
        const now = Date.now();
        snapshot.forEach(doc => {
          const data = doc.data();
          if (data.expira > now) stories.push(data);
        });
        localStorage.setItem(STORIES_KEY, JSON.stringify(stories));
        renderStoriesBar();
      }
    }, () => {});
  }
});

window.addEventListener('agroStoriesUpdated', renderStoriesBar);

