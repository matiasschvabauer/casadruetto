/**
 * tobogan-animation.js — Casa Druetto
 * Renderiza la animación del tobogán con cintas sólidas entrelazadas (#0a8742 y #eab308)
 * e incluye 4 elementos en perspectiva 3/4 en diagonal con animación Glowing Lenta:
 * - Izquierda: Drone (arriba) y Excavadora (abajo)
 * - Derecha: Tractor (arriba) y Pala Cargadora (abajo)
 */

(function () {
  function initToboganCanvas() {
    const canvas = document.getElementById('tobogan-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let time = 0;

    // Cargar las 4 imágenes vectoriales 3/4 originales
    const droneImg = new Image();
    droneImg.src = 'assets/img/drone-silhouette.svg';

    const tractorImg = new Image();
    tractorImg.src = 'assets/img/tractor-silhouette.svg';

    const excavatorImg = new Image();
    excavatorImg.src = 'assets/img/excavator-silhouette.svg';

    const loaderImg = new Image();
    loaderImg.src = 'assets/img/loader-silhouette.svg';

    function resizeCanvas() {
      const container = canvas.parentElement;
      if (!container) return;

      const dpr = window.devicePixelRatio || 1;
      width = container.offsetWidth;
      height = container.offsetHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';

      ctx.scale(dpr, dpr);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Color Glowing con velocidad LENTA alternando entre Verde (#0a8742) y Amarillo (#eab308)
    function getGlowingColor(phaseOffset) {
      const factor = (Math.sin(time * 0.45 + phaseOffset) + 1) / 2; // Transición suave
      const r = Math.round(10 + (234 - 10) * factor);
      const g = Math.round(135 + (179 - 135) * factor);
      const b = Math.round(66 + (8 - 66) * factor);
      return `rgb(${r}, ${g}, ${b})`;
    }

    // Dibujar Cintas Sólidas Entrelazadas
    function drawIntertwinedRibbons() {
      const stepCount = 140;
      const greenPoints = [];
      const yellowPoints = [];
      const zIndices = [];

      const startY = -100;
      const endY = height + 100;
      const totalDist = endY - startY;

      const ribbonWidth = Math.max(16, Math.min(width * 0.022, 32));
      const twistAmplitude = Math.max(25, Math.min(width * 0.045, 50));

      for (let i = 0; i <= stepCount; i++) {
        const t = i / stepCount;
        const currentY = startY + t * totalDist;

        const baseX = (width * 0.5) +
          Math.sin(t * Math.PI * 3.0 + time * 0.4) * (width * 0.28) +
          Math.cos(t * Math.PI * 1.5 - time * 0.2) * (width * 0.08);

        const twistAngle = t * Math.PI * 8.5 + time * 1.2;
        const offsetX = Math.cos(twistAngle) * twistAmplitude;
        const depth = Math.sin(twistAngle);

        greenPoints.push({ x: baseX + offsetX, y: currentY });
        yellowPoints.push({ x: baseX - offsetX, y: currentY });
        zIndices.push(depth);
      }

      function drawRibbonSegment(points, color, widthVal) {
        if (points.length < 2) return;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        for (let i = 1; i < points.length; i++) {
          const xc = (points[i].x + points[i - 1].x) / 2;
          const yc = (points[i].y + points[i - 1].y) / 2;
          ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
        }

        ctx.strokeStyle = color;
        ctx.lineWidth = widthVal;
        ctx.lineCap = 'butt';
        ctx.lineJoin = 'miter';
        ctx.stroke();
        ctx.restore();
      }

      const segmentSize = 3;
      const totalPoints = greenPoints.length;

      for (let i = 0; i < totalPoints - 1; i += segmentSize) {
        const endIndex = Math.min(i + segmentSize + 1, totalPoints);
        const gSub = greenPoints.slice(i, endIndex);
        const ySub = yellowPoints.slice(i, endIndex);
        const avgZ = zIndices[i];

        if (avgZ >= 0) {
          drawRibbonSegment(ySub, '#eab308', ribbonWidth);
          drawRibbonSegment(gSub, '#0a8742', ribbonWidth);
        } else {
          drawRibbonSegment(gSub, '#0a8742', ribbonWidth);
          drawRibbonSegment(ySub, '#eab308', ribbonWidth);
        }
      }
    }

    // Dibujar Imagen Vectorial Monocromática Teñida con Resplandor (Glowing) y Ángulo Diagonal
    function drawTintedImage(img, x, y, scale, angle, color, opacity) {
      if (!img.complete || img.naturalWidth === 0) return;

      const baseW = img.naturalWidth;
      const baseH = img.naturalHeight;

      const offCanvas = document.createElement('canvas');
      offCanvas.width = baseW;
      offCanvas.height = baseH;
      const offCtx = offCanvas.getContext('2d');

      offCtx.drawImage(img, 0, 0);
      offCtx.globalCompositeOperation = 'source-in';
      offCtx.fillStyle = color;
      offCtx.fillRect(0, 0, baseW, baseH);

      const drawW = baseW * scale;
      const drawH = baseH * scale;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle); // Inclinación diagonal

      ctx.shadowColor = color;
      ctx.shadowBlur = 18 + Math.sin(time * 0.8) * 6;
      ctx.globalAlpha = opacity;

      ctx.drawImage(offCanvas, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();
    }

    // Dibujar 4 Maquinarias (Drone, Excavadora a la izq; Tractor, Pala Cargadora a la der)
    function drawSideIcons() {
      const baseScale = Math.max(0.35, Math.min(width / 1300, 0.55));

      // --- LATERAL IZQUIERDO ---
      // 1. DRONE 3/4 (Arriba - Izquierda)
      const droneX = Math.max(75, width * 0.11);
      const droneY = height * 0.22 + Math.sin(time * 0.8) * 10;
      const droneColor = getGlowingColor(0);
      drawTintedImage(droneImg, droneX, droneY, baseScale, -0.35, droneColor, 0.88);

      // 2. EXCAVADORA 3/4 (Abajo - Izquierda, debajo del drone)
      const excavatorX = Math.max(80, width * 0.12);
      const excavatorY = height * 0.77 + Math.cos(time * 0.75) * 12;
      const excavatorColor = getGlowingColor(Math.PI * 0.5);
      drawTintedImage(excavatorImg, excavatorX, excavatorY, baseScale * 1.05, -0.22, excavatorColor, 0.88);

      // --- LATERAL DERECHO ---
      // 3. TRACTOR 3/4 (Arriba - Derecha)
      const tractorX = Math.min(width - 85, width * 0.88);
      const tractorY = height * 0.38 + Math.sin(time * 0.7) * 8;
      const tractorColor = getGlowingColor(Math.PI);
      drawTintedImage(tractorImg, tractorX, tractorY, baseScale, 0.28, tractorColor, 0.88);

      // 4. PALA CARGADORA 3/4 (Abajo - Derecha, debajo del tractor)
      const loaderX = Math.min(width - 85, width * 0.87);
      const loaderY = height * 0.82 + Math.cos(time * 0.85) * 10;
      const loaderColor = getGlowingColor(Math.PI * 1.5);
      drawTintedImage(loaderImg, loaderX, loaderY, baseScale * 1.08, 0.25, loaderColor, 0.88);
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      // 1. Dibujar cintas entrelazadas
      drawIntertwinedRibbons();

      // 2. Dibujar 4 elementos 3/4 en diagonal con Glowing lento
      drawSideIcons();

      time += 0.012;
      requestAnimationFrame(animate);
    }

    animate();
  }

  // --- COMPARISON SLIDER DRAG LOGIC ---
  function initComparisonSlider() {
    const slider = document.getElementById('restoration-slider');
    if (!slider) return;

    const beforeWrapper = slider.querySelector('.before-image-wrapper');
    const beforeImage = beforeWrapper.querySelector('.before-image');
    const handle = slider.querySelector('.slider-handle');
    let isDragging = false;

    function updateImageSize() {
      beforeImage.style.width = slider.offsetWidth + 'px';
    }
    window.addEventListener('resize', updateImageSize);
    updateImageSize();
    beforeImage.addEventListener('load', updateImageSize);

    function move(clientX) {
      const rect = slider.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));

      beforeWrapper.style.width = percentage + '%';
      handle.style.left = percentage + '%';
    }

    // Mouse events
    slider.addEventListener('mousedown', (e) => {
      isDragging = true;
      move(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      move(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch events
    slider.addEventListener('touchstart', (e) => {
      isDragging = true;
      if (e.touches[0]) {
        move(e.touches[0].clientX);
      }
    });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      if (e.touches[0]) {
        move(e.touches[0].clientX);
      }
    });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });
  }

  // --- HERO BACKGROUND CAROUSEL LOGIC ---
  function initHeroCarousel() {
    const section = document.querySelector('.hero-section');
    if (!section) return;

    const slides = section.querySelectorAll('.hero-slide');
    const indicators = section.querySelectorAll('.hero-indicators .indicator');
    const prevBtn = section.querySelector('.prev-control');
    const nextBtn = section.querySelector('.next-control');

    if (slides.length === 0) return;

    let currentSlide = 0;
    let autoPlayInterval = null;
    const intervalTime = 6000;

    function showSlide(index) {
      slides[currentSlide].classList.remove('active');
      if (indicators[currentSlide]) {
        indicators[currentSlide].classList.remove('active');
      }

      currentSlide = (index + slides.length) % slides.length;

      slides[currentSlide].classList.add('active');
      if (indicators[currentSlide]) {
        indicators[currentSlide].classList.add('active');
      }
    }

    function nextSlide() {
      showSlide(currentSlide + 1);
    }

    function prevSlide() {
      showSlide(currentSlide - 1);
    }

    function resetAutoplay() {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
      }
      autoPlayInterval = setInterval(nextSlide, intervalTime);
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoplay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoplay();
      });
    }

    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        showSlide(index);
        resetAutoplay();
      });
    });

    resetAutoplay();
  }

  // Ejecutar inicializaciones al cargar el DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initToboganCanvas();
      initComparisonSlider();
      initHeroCarousel();
    });
  } else {
    initToboganCanvas();
    initComparisonSlider();
    initHeroCarousel();
  }
})();

