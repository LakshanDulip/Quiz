// js/performanceManager.js
class PerformanceManager {
  constructor() {
    this.observers = new Map();
    this.isVisible = true;
    this.animationFrameId = null;
    this.scheduledUpdates = new Set();
    
    this.init();
  }

  init() {
    // Track visibility
    document.addEventListener('visibilitychange', () => {
      this.isVisible = document.visibilityState === 'visible';
      
      if (this.isVisible) {
        this.resume();
      } else {
        this.pause();
      }
    });

    // Initial setup
    this.setupImageOptimization();
  }

  setupImageOptimization() {
    // Use Intersection Observer for lazy loading
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.getAttribute('data-src');
            
            if (src) {
              window.imageLoader.loadImage(src).then(() => {
                img.src = src;
                img.removeAttribute('data-src');
              }).catch(() => {
                // Show fallback
                img.closest('.question-image-wrap')?.classList.add('img-error');
              });
              
              observer.unobserve(img);
            }
          }
        });
      }, {
        rootMargin: '50px',
        threshold: 0.01
      });
      
      this.observers.set('lazyImages', observer);
    }
  }

  observeImage(element, src) {
    const observer = this.observers.get('lazyImages');
    if (observer && element) {
      element.setAttribute('data-src', src);
      observer.observe(element);
    }
  }

  // Batch DOM updates using requestAnimationFrame
  scheduleUpdate(callback, key) {
    if (this.scheduledUpdates.has(key)) return;
    this.scheduledUpdates.add(key);
    
    if (!this.animationFrameId) {
      this.animationFrameId = requestAnimationFrame(() => {
        this.scheduledUpdates.forEach((_, k) => {
          const cb = this.scheduledUpdates.get(k);
          if (typeof cb === 'function') cb();
        });
        this.scheduledUpdates.clear();
        this.animationFrameId = null;
      });
    }
    
    this.scheduledUpdates.set(key, callback);
  }

  pause() {
    // Pause animations
    document.body.style.setProperty('--animation-state', 'paused');
    
    // Clear any pending animation frames
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  resume() {
    document.body.style.setProperty('--animation-state', 'running');
  }

  cleanup() {
    // Clean up observers
    this.observers.forEach((observer, key) => {
      if (observer && typeof observer.disconnect === 'function') {
        observer.disconnect();
      }
    });
    this.observers.clear();
    
    // Clear scheduled updates
    this.scheduledUpdates.clear();
    
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  // Memory cleanup helper
  releaseReferences(obj) {
    if (obj && typeof obj === 'object') {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          obj[key] = null;
        }
      }
    }
  }
}

window.performanceManager = new PerformanceManager();