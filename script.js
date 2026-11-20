/**
 * SUJITH — FULL-STACK & AI DEVELOPER PORTFOLIO
 * High-Performance Fullscreen Canvas Smooth Scroll Scrubbing Engine
 * Fully Responsive with Mobile Navigation Drawer
 */

(function () {
  'use strict';

  const TOTAL_FRAMES = 238;
  const FRAME_PREFIX = 'frames/ezgif-frame-';
  const FRAME_SUFFIX = '.jpg';
  const LERP_EASE = 0.12;

  const canvas = document.getElementById('scroll-canvas');
  const ctx = canvas.getContext('2d', { alpha: false });
  const hudFrameLabel = document.getElementById('hud-frame-label');
  const hudScrubFill = document.getElementById('hud-scrub-fill');
  const hudTrack = document.getElementById('hud-scrub-track');

  const desktopNavLinks = Array.from(document.querySelectorAll('.nav-link'));
  const mobileNavLinks = Array.from(document.querySelectorAll('.mobile-nav-link'));
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');

  const images = new Array(TOTAL_FRAMES);
  let targetFrame = 0;
  let currentFrame = 0;
  let lastDrawnIndex = -1;

  function getFrameSrc(index) {
    const padded = String(index + 1).padStart(3, '0');
    return `${FRAME_PREFIX}${padded}${FRAME_SUFFIX}`;
  }

  // Get nearest loaded frame to guarantee zero flicker and instant display
  function getClosestLoadedImage(index) {
    if (images[index] && images[index].complete && images[index].naturalWidth > 0) {
      return images[index];
    }
    for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
      const prev = index - offset;
      if (prev >= 0 && images[prev] && images[prev].complete && images[prev].naturalWidth > 0) {
        return images[prev];
      }
      const next = index + offset;
      if (next < TOTAL_FRAMES && images[next] && images[next].complete && images[next].naturalWidth > 0) {
        return images[next];
      }
    }
    return images[0] || null;
  }

  // Draw frame with cover aspect-ratio and integer pixel alignment
  function drawFrame(index) {
    const img = getClosestLoadedImage(index);
    if (!img) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth || 1920;
    const ih = img.naturalHeight || 1080;

    const ratio = Math.max(cw / iw, ch / ih);
    const nw = Math.round(iw * ratio);
    const nh = Math.round(ih * ratio);
    const cx = Math.round((cw - nw) / 2);
    const cy = Math.round((ch - nh) / 2);

    ctx.drawImage(img, 0, 0, iw, ih, cx, cy, nw, nh);
    lastDrawnIndex = index;
  }

  // High-DPI canvas setup with orientation handling
  function handleResize() {
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    drawFrame(Math.round(currentFrame));

    // Close mobile menu on desktop resize
    if (width > 860 && mobileNavDrawer && mobileNavDrawer.classList.contains('open')) {
      closeMobileMenu();
    }
  }

  // Map scroll progress (0.0 to 1.0) to frame index
  function updateScrollTarget() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll <= 0) {
      targetFrame = 0;
      return;
    }

    const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
    const fraction = Math.max(0, Math.min(1, scrollY / maxScroll));
    targetFrame = fraction * (TOTAL_FRAMES - 1);

    // Active Navigation Highlight for Desktop & Mobile
    const sections = ['hero', 'about', 'projects', 'contact'];
    const scrollPos = scrollY + 220;
    sections.forEach((secId) => {
      const el = document.getElementById(secId);
      if (el) {
        const top = el.offsetTop;
        const height = el.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          desktopNavLinks.forEach((link) => {
            if (link.getAttribute('href') === `#${secId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
          mobileNavLinks.forEach((link) => {
            if (link.getAttribute('href') === `#${secId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      }
    });
  }

  // 60-120 FPS LERP Render Loop
  function renderLoop() {
    const delta = targetFrame - currentFrame;

    if (Math.abs(delta) > 0.001) {
      currentFrame += delta * LERP_EASE;
    } else {
      currentFrame = targetFrame;
    }

    const frameToDraw = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(currentFrame)));
    if (frameToDraw !== lastDrawnIndex) {
      drawFrame(frameToDraw);

      // Update minimal HUD
      if (hudFrameLabel) {
        hudFrameLabel.textContent = `${String(frameToDraw + 1).padStart(3, '0')} / ${TOTAL_FRAMES}`;
      }
      if (hudScrubFill) {
        hudScrubFill.style.width = `${((frameToDraw / (TOTAL_FRAMES - 1)) * 100).toFixed(1)}%`;
      }
    }

    requestAnimationFrame(renderLoop);
  }

  // Preload all frames
  function preloadAllFrames() {
    // 1. Instantly paint Frame 1
    const firstImg = new Image();
    firstImg.src = getFrameSrc(0);
    firstImg.onload = () => {
      images[0] = firstImg;
      drawFrame(0);
    };

    // 2. Preload remaining frames in background
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      if (i === 0) continue;
      const img = new Image();
      img.src = getFrameSrc(i);
      img.onload = () => {
        images[i] = img;
        if (Math.round(currentFrame) === i) {
          drawFrame(i);
        }
      };
    }
  }

  // Interactive scrubber on HUD
  function setupScrubber() {
    if (!hudTrack) return;
    hudTrack.addEventListener('click', (e) => {
      const rect = hudTrack.getBoundingClientRect();
      const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({
        top: pos * maxScroll,
        behavior: 'smooth'
      });
    });
  }

  // Mobile Navigation Controls
  function toggleMobileMenu() {
    if (!mobileNavDrawer || !mobileMenuBtn) return;
    const isOpen = mobileNavDrawer.classList.contains('open');
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  function openMobileMenu() {
    if (!mobileNavDrawer || !mobileMenuBtn) return;
    mobileNavDrawer.classList.add('open');
    mobileNavDrawer.setAttribute('aria-hidden', 'false');
    mobileMenuBtn.classList.add('active');
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
  }

  function closeMobileMenu() {
    if (!mobileNavDrawer || !mobileMenuBtn) return;
    mobileNavDrawer.classList.remove('open');
    mobileNavDrawer.setAttribute('aria-hidden', 'true');
    mobileMenuBtn.classList.remove('active');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
  }

  function setupMobileNav() {
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMobileMenu();
      });
    }

    // Close when clicking any link inside the mobile drawer
    const drawerLinks = document.querySelectorAll('.mobile-nav-link, .mobile-nav-cta');
    drawerLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Close when clicking outside drawer
    document.addEventListener('click', (e) => {
      if (mobileNavDrawer && mobileNavDrawer.classList.contains('open')) {
        if (!mobileNavDrawer.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
          closeMobileMenu();
        }
      }
    });

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNavDrawer && mobileNavDrawer.classList.contains('open')) {
        closeMobileMenu();
      }
    });
  }

  function init() {
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', updateScrollTarget, { passive: true });

    handleResize();
    updateScrollTarget();
    preloadAllFrames();
    setupScrubber();
    setupMobileNav();
    requestAnimationFrame(renderLoop);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
