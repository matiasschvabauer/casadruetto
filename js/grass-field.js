/**
 * Agroguardati - Interactive Top-Down Grass Field Engine
 * Features:
 * - Ultra-lightweight Canvas 2D rendering (very low CPU/GPU usage)
 * - Procedural realistic top-down agricultural grass field background
 * - Top-down 2D realistic agricultural machinery (Tractors, Harvesters, Sprayers)
 * - Tire track trail marks that fade smoothly into the soil/grass
 * - Interactive Mouse Repulsion ("Scared" steering away from cursor)
 * - Autonomous Vehicle-Vehicle Collision Detection & Bouncing
 * - Pauses automatically via IntersectionObserver when off-screen (0% idle resource usage)
 */

(function () {
  'use me strict';

  class Particle {
    constructor(x, y, color, size, vx, vy, life) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.size = size;
      this.vx = vx;
      this.vy = vy;
      this.life = life;
      this.maxLife = life;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life--;
      this.size *= 0.96;
    }

    draw(ctx) {
      if (this.life <= 0) return;
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.life / this.maxLife);
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, Math.max(0.5, this.size), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  class Vehicle {
    constructor(x, y, type, canvasWidth, canvasHeight) {
      this.x = x;
      this.y = y;
      this.type = type; // 'tractor', 'harvester', 'sprayer'
      this.angle = Math.random() * Math.PI * 2;
      this.targetAngle = this.angle;
      this.baseSpeed = type === 'sprayer' ? 1.8 : type === 'harvester' ? 1.2 : 1.5;
      this.speed = this.baseSpeed;
      this.isScared = false;
      this.scaredTimer = 0;
      this.tracks = []; // [{x, y, angle}]
      this.smokeTimer = 0;

      // Color themes & radius
      if (type === 'tractor') {
        this.radius = 28;
        this.colorMain = '#2e7d32'; // John Deere Green
        this.colorAccent = '#fbc02d'; // Yellow
      } else if (type === 'harvester') {
        this.radius = 36;
        this.colorMain = '#e65100'; // Case/New Holland Orange/Red
        this.colorAccent = '#ffffff';
      } else {
        // Sprayer
        this.radius = 32;
        this.colorMain = '#0288d1'; // Sprayer Blue
        this.colorAccent = '#ffd600';
      }
    }

    update(width, height, mouse, allVehicles, particles) {
      // 1. Mouse Avoidance ("Espantar")
      if (mouse.x !== null && mouse.y !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        const scareRadius = 180;

        if (dist < scareRadius) {
          const escapeAngle = Math.atan2(dy, dx);
          this.targetAngle = escapeAngle;
          this.isScared = true;
          this.scaredTimer = 45; // frames of boost
        }
      }

      if (this.scaredTimer > 0) {
        this.scaredTimer--;
        this.speed = this.baseSpeed * 1.6;
      } else {
        this.isScared = false;
        this.speed = this.baseSpeed;
      }

      // 2. Boundary Repulsion
      const margin = 70;
      if (this.x < margin || this.x > width - margin || this.y < margin || this.y > height - margin) {
        const centerAngle = Math.atan2(height / 2 - this.y, width / 2 - this.x);
        this.targetAngle = centerAngle;
      }

      // 3. Collision with other vehicles
      for (let other of allVehicles) {
        if (other === this) continue;
        const dx = other.x - this.x;
        const dy = other.y - this.y;
        const dist = Math.hypot(dx, dy);
        const minDist = this.radius + other.radius;

        if (dist < minDist && dist > 0) {
          const colAngle = Math.atan2(dy, dx);
          // Both turn away
          this.targetAngle = colAngle + Math.PI + (Math.random() * 0.6 - 0.3);
          other.targetAngle = colAngle + (Math.random() * 0.6 - 0.3);

          // Push apart
          const overlap = (minDist - dist) / 2;
          this.x -= Math.cos(colAngle) * overlap;
          this.y -= Math.sin(colAngle) * overlap;

          // Dirt spark particles at contact
          const contactX = this.x + Math.cos(colAngle) * this.radius;
          const contactY = this.y + Math.sin(colAngle) * this.radius;
          for (let p = 0; p < 6; p++) {
            particles.push(new Particle(
              contactX, contactY,
              '#795548',
              Math.random() * 4 + 2,
              (Math.random() - 0.5) * 3,
              (Math.random() - 0.5) * 3,
              25
            ));
          }
        }
      }

      // 4. Smooth Steering & Movement
      let angleDiff = this.targetAngle - this.angle;
      // Normalize angle difference to [-PI, PI]
      angleDiff = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff));
      const turnRate = this.isScared ? 0.08 : 0.04;
      this.angle += angleDiff * turnRate;

      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;

      // 5. Tire Track recording
      if (Math.random() < 0.4) {
        this.tracks.push({
          x: this.x,
          y: this.y,
          angle: this.angle,
          opacity: 0.35,
          type: this.type
        });
        if (this.tracks.length > 40) {
          this.tracks.shift();
        }
      }

      // 6. Exhaust Smoke Particles
      this.smokeTimer++;
      const smokeInterval = this.isScared ? 3 : 8;
      if (this.smokeTimer % smokeInterval === 0) {
        const exhaustOffset = -15; // Behind cabin
        const exX = this.x + Math.cos(this.angle) * exhaustOffset;
        const exY = this.y + Math.sin(this.angle) * exhaustOffset;
        particles.push(new Particle(
          exX, exY,
          'rgba(200, 200, 200, 0.4)',
          Math.random() * 3 + 2,
          -Math.cos(this.angle) * 0.8 + (Math.random() - 0.5) * 0.5,
          -Math.sin(this.angle) * 0.8 + (Math.random() - 0.5) * 0.5,
          35
        ));
      }
    }

    drawTracks(ctx) {
      ctx.save();
      for (let t of this.tracks) {
        ctx.save();
        ctx.translate(t.x, t.y);
        ctx.rotate(t.angle);
        ctx.fillStyle = `rgba(15, 40, 15, ${t.opacity})`;

        // Twin tracks for wheels
        const trackWidth = t.type === 'sprayer' ? 1.5 : 3;
        const trackSpacing = t.type === 'harvester' ? 22 : t.type === 'sprayer' ? 26 : 18;

        ctx.fillRect(-4, -trackSpacing / 2, 6, trackWidth);
        ctx.fillRect(-4, trackSpacing / 2 - trackWidth, 6, trackWidth);
        ctx.restore();

        t.opacity -= 0.005; // Fade over time
      }
      ctx.restore();
      this.tracks = this.tracks.filter(t => t.opacity > 0);
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);

      // --- 3D Shadow ---
      ctx.save();
      ctx.translate(5, 6);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
      this.drawVehicleBody(ctx, true);
      ctx.restore();

      // --- Vehicle Render ---
      this.drawVehicleBody(ctx, false);

      ctx.restore();
    }

    drawVehicleBody(ctx, isShadow) {
      if (this.type === 'tractor') {
        this.drawTractor(ctx, isShadow);
      } else if (this.type === 'harvester') {
        this.drawHarvester(ctx, isShadow);
      } else {
        this.drawSprayer(ctx, isShadow);
      }
    }

    drawTractor(ctx, isShadow) {
      const colorBody = isShadow ? 'transparent' : this.colorMain;
      const colorRoof = isShadow ? 'transparent' : '#ffffff';
      const colorWheel = isShadow ? 'transparent' : '#212121';
      const colorRim = isShadow ? 'transparent' : this.colorAccent;

      // Trailing Implement (Sembradora/Arado)
      if (!isShadow) {
        ctx.fillStyle = '#616161';
        ctx.fillRect(-38, -2, 12, 4); // Tow bar
        // Frame
        ctx.fillStyle = '#37474f';
        ctx.fillRect(-48, -18, 10, 36);
        // Disc rows
        ctx.fillStyle = '#b0bec5';
        for (let i = -16; i <= 16; i += 8) {
          ctx.beginPath();
          ctx.arc(-43, i, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Large Rear Wheels
      ctx.fillStyle = colorWheel;
      ctx.fillRect(-12, -18, 14, 6);
      ctx.fillRect(-12, 12, 14, 6);
      if (!isShadow) {
        ctx.fillStyle = colorRim;
        ctx.fillRect(-9, -17, 8, 4);
        ctx.fillRect(-9, 13, 8, 4);
      }

      // Small Front Wheels
      ctx.fillStyle = colorWheel;
      ctx.fillRect(12, -14, 9, 4);
      ctx.fillRect(12, 10, 9, 4);

      // Main Hood & Body
      ctx.fillStyle = colorBody;
      ctx.beginPath();
      ctx.roundRect(-10, -11, 32, 22, [4, 8, 8, 4]);
      ctx.fill();

      if (!isShadow) {
        // Hood detail lines
        ctx.fillStyle = this.colorAccent;
        ctx.fillRect(4, -10, 14, 2);
        ctx.fillRect(4, 8, 14, 2);

        // Cabin Glass
        ctx.fillStyle = 'rgba(144, 202, 249, 0.85)';
        ctx.beginPath();
        ctx.roundRect(-8, -9, 14, 18, 3);
        ctx.fill();

        // Cabin Roof
        ctx.fillStyle = colorRoof;
        ctx.beginPath();
        ctx.roundRect(-6, -7, 10, 14, 2);
        ctx.fill();

        // GPS Dome on roof
        ctx.fillStyle = '#ffeb3b';
        ctx.beginPath();
        ctx.arc(-1, 0, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Headlights
        ctx.fillStyle = '#fffde7';
        ctx.shadowColor = '#fff59d';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(22, -8, 2, 0, Math.PI * 2);
        ctx.arc(22, 8, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    drawHarvester(ctx, isShadow) {
      const colorBody = isShadow ? 'transparent' : this.colorMain;
      const colorHeader = isShadow ? 'transparent' : '#263238';

      // Front Cutting Header (Plataforma)
      ctx.fillStyle = colorHeader;
      ctx.fillRect(20, -32, 12, 64);

      if (!isShadow) {
        // Spinning Reel Teeth
        ctx.fillStyle = '#cfd8dc';
        ctx.fillRect(24, -30, 4, 60);
        ctx.fillStyle = '#f57f17';
        ctx.fillRect(22, -30, 2, 60);
      }

      // Large Crawler Tracks / Tires
      ctx.fillStyle = isShadow ? 'transparent' : '#1a1a1a';
      ctx.fillRect(-2, -22, 18, 7);
      ctx.fillRect(-2, 15, 18, 7);

      // Rear Steering Wheels
      ctx.fillRect(-24, -14, 8, 5);
      ctx.fillRect(-24, 9, 8, 5);

      // Main Harvester Body Box
      ctx.fillStyle = colorBody;
      ctx.beginPath();
      ctx.roundRect(-26, -16, 44, 32, [4, 6, 6, 4]);
      ctx.fill();

      if (!isShadow) {
        // Unloading Auger Tube (Tubo de descarga)
        ctx.save();
        ctx.translate(-5, -16);
        ctx.rotate(-0.4);
        ctx.fillStyle = '#e0e0e0';
        ctx.fillRect(-20, -3, 24, 5);
        ctx.fillStyle = '#c62828';
        ctx.fillRect(-20, -3, 4, 5);
        ctx.restore();

        // Grain Tank Hatch
        ctx.fillStyle = '#424242';
        ctx.fillRect(-18, -10, 14, 20);
        ctx.fillStyle = '#ffb300'; // Golden corn/grain inside
        ctx.fillRect(-16, -8, 10, 16);

        // Glass Cabin
        ctx.fillStyle = 'rgba(144, 202, 249, 0.9)';
        ctx.beginPath();
        ctx.roundRect(4, -12, 12, 24, 4);
        ctx.fill();

        // Headlights
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#ffff8d';
        ctx.shadowBlur = 10;
        ctx.fillRect(18, -28, 3, 4);
        ctx.fillRect(18, 24, 3, 4);
        ctx.shadowBlur = 0;
      }
    }

    drawSprayer(ctx, isShadow) {
      const colorBody = isShadow ? 'transparent' : this.colorMain;

      // Extended Side Boom Arms (Botalones)
      ctx.fillStyle = isShadow ? 'transparent' : '#263238';
      ctx.fillRect(-6, -65, 4, 130); // Main lattice boom

      if (!isShadow) {
        // Nozzles / mist drops along boom
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        for (let y = -60; y <= 60; y += 12) {
          if (Math.abs(y) > 10) {
            ctx.fillRect(-8, y, 2, 2);
          }
        }
      }

      // Outrigger Wheel Legs & 4 Narrow Tall Wheels
      ctx.fillStyle = isShadow ? 'transparent' : '#212121';
      ctx.fillRect(12, -22, 10, 4);
      ctx.fillRect(12, 18, 10, 4);
      ctx.fillRect(-20, -22, 10, 4);
      ctx.fillRect(-20, 18, 10, 4);

      // Central Tank Body
      ctx.fillStyle = colorBody;
      ctx.beginPath();
      ctx.roundRect(-22, -10, 40, 20, 10);
      ctx.fill();

      if (!isShadow) {
        // Chemical Tank Cover
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-8, 0, 7, 0, Math.PI * 2);
        ctx.fill();

        // Front High Cabin
        ctx.fillStyle = 'rgba(129, 212, 250, 0.9)';
        ctx.beginPath();
        ctx.roundRect(8, -8, 10, 16, 4);
        ctx.fill();
      }
    }
  }

  // Engine Controller
  class GrassFieldEngine {
    constructor(container) {
      this.container = container;
      this.canvas = document.createElement('canvas');
      this.canvas.className = 'grass-canvas';
      this.canvas.style.position = 'absolute';
      this.canvas.style.top = '0';
      this.canvas.style.left = '0';
      this.canvas.style.width = '100%';
      this.canvas.style.height = '100%';
      this.canvas.style.zIndex = '0';
      this.canvas.style.pointerEvents = 'auto';
      this.ctx = this.canvas.getContext('2d');
      
      // Insert as first child so it stays behind content
      this.container.insertBefore(this.canvas, this.container.firstChild);

      this.width = 0;
      this.height = 0;
      this.vehicles = [];
      this.particles = [];
      this.mouse = { x: null, y: null };
      this.isRunning = false;
      this.animFrameId = null;
      this.grassPattern = null;

      this.init();
    }

    init() {
      this.resize();
      window.addEventListener('resize', () => this.resize());

      // Mouse & Touch events
      const updatePointer = (e) => {
        const rect = this.canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        this.mouse.x = clientX - rect.left;
        this.mouse.y = clientY - rect.top;
      };

      const clearPointer = () => {
        this.mouse.x = null;
        this.mouse.y = null;
      };

      this.container.addEventListener('mousemove', updatePointer);
      this.container.addEventListener('mouseleave', clearPointer);
      this.container.addEventListener('touchstart', updatePointer, { passive: true });
      this.container.addEventListener('touchmove', updatePointer, { passive: true });
      this.container.addEventListener('touchend', clearPointer);

      // Create Vehicles (1 Tractor, 1 Harvester, 1 Sprayer, 1 Extra Tractor)
      const types = ['tractor', 'harvester', 'sprayer', 'tractor'];
      for (let i = 0; i < types.length; i++) {
        const vx = Math.random() * (this.width - 160) + 80;
        const vy = Math.random() * (this.height - 160) + 80;
        this.vehicles.push(new Vehicle(vx, vy, types[i], this.width, this.height));
      }

      // Intersection Observer for 0% resource usage offscreen
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.start();
          } else {
            this.stop();
          }
        });
      }, { threshold: 0.05 });

      observer.observe(this.container);
    }

    generateGrassPattern() {
      const pCanvas = document.createElement('canvas');
      pCanvas.width = 120;
      pCanvas.height = 120;
      const pCtx = pCanvas.getContext('2d');

      // Base lush green
      pCtx.fillStyle = '#2d6226';
      pCtx.fillRect(0, 0, 120, 120);

      // Parallel mown grass rows (Agricultural field stripes)
      pCtx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      for (let y = 0; y < 120; y += 30) {
        pCtx.fillRect(0, y, 120, 15);
      }

      // Subtle grass blade specks
      for (let i = 0; i < 180; i++) {
        const x = Math.random() * 120;
        const y = Math.random() * 120;
        const tone = Math.random() > 0.5 ? '#377830' : '#244e1e';
        pCtx.fillStyle = tone;
        pCtx.fillRect(x, y, 1.5, Math.random() * 3 + 1);
      }

      this.grassPattern = this.ctx.createPattern(pCanvas, 'repeat');
    }

    resize() {
      const rect = this.container.getBoundingClientRect();
      this.width = this.canvas.width = Math.floor(rect.width || this.container.clientWidth || window.innerWidth);
      this.height = this.canvas.height = Math.floor(rect.height || this.container.clientHeight || 500);
      this.generateGrassPattern();
    }

    start() {
      if (!this.isRunning) {
        this.isRunning = true;
        this.loop();
      }
    }

    stop() {
      this.isRunning = false;
      if (this.animFrameId) {
        cancelAnimationFrame(this.animFrameId);
        this.animFrameId = null;
      }
    }

    loop() {
      if (!this.isRunning) return;

      // 1. Draw Grass Pattern Background
      if (this.grassPattern) {
        this.ctx.fillStyle = this.grassPattern;
        this.ctx.fillRect(0, 0, this.width, this.height);
      } else {
        this.ctx.fillStyle = '#2d6226';
        this.ctx.fillRect(0, 0, this.width, this.height);
      }

      // Soft field vignette shadow around edges
      const grad = this.ctx.createRadialGradient(
        this.width / 2, this.height / 2, Math.min(this.width, this.height) * 0.3,
        this.width / 2, this.height / 2, Math.max(this.width, this.height) * 0.7
      );
      grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0.22)');
      this.ctx.fillStyle = grad;
      this.ctx.fillRect(0, 0, this.width, this.height);

      // 2. Draw Tire Tracks
      for (let v of this.vehicles) {
        v.drawTracks(this.ctx);
      }

      // 3. Update & Draw Particles
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.update();
        p.draw(this.ctx);
        if (p.life <= 0) {
          this.particles.splice(i, 1);
        }
      }

      // 4. Update & Draw Vehicles
      for (let v of this.vehicles) {
        v.update(this.width, this.height, this.mouse, this.vehicles, this.particles);
        v.draw(this.ctx);
      }

      // 5. Draw Mouse Scare Ripple indicator if active
      if (this.mouse.x !== null && this.mouse.y !== null) {
        this.ctx.save();
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        this.ctx.lineWidth = 1.5;
        this.ctx.beginPath();
        this.ctx.arc(this.mouse.x, this.mouse.y, 25, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.restore();
      }

      this.animFrameId = requestAnimationFrame(() => this.loop());
    }
  }

  // Auto initialize on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    const targets = document.querySelectorAll('.grass-field-section, #nosotros');
    targets.forEach(el => {
      el.classList.add('grass-field-container');
      new GrassFieldEngine(el);
    });
  });
})();
