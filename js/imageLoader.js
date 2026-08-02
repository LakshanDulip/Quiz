// js/imageLoader.js
class ImageLoader {
  constructor() {
    this.loadedImages = new Set();
    this.loadingImages = new Map();
    this.maxConcurrent = 3;
    this.currentLoading = 0;
    this.queue = [];
  }

  loadImage(src) {
    // Skip if already loaded
    if (this.loadedImages.has(src)) {
      return Promise.resolve(src);
    }

    // Return existing promise if loading
    if (this.loadingImages.has(src)) {
      return this.loadingImages.get(src);
    }

    // Queue if max concurrent reached
    if (this.currentLoading >= this.maxConcurrent) {
      return new Promise((resolve, reject) => {
        this.queue.push({ src, resolve, reject });
      });
    }

    return this.startLoad(src);
  }

  startLoad(src) {
    this.currentLoading++;
    
    const promise = new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        this.currentLoading--;
        this.loadedImages.add(src);
        this.loadingImages.delete(src);
        this.processQueue();
        resolve(src);
      };
      
      img.onerror = () => {
        this.currentLoading--;
        this.loadingImages.delete(src);
        this.processQueue();
        reject(new Error(`Failed to load image: ${src}`));
      };
      
      img.src = src;
      this.loadingImages.set(src, promise);
    });

    return promise;
  }

  processQueue() {
    if (this.queue.length > 0 && this.currentLoading < this.maxConcurrent) {
      const next = this.queue.shift();
      this.startLoad(next.src).then(next.resolve).catch(next.reject);
    }
  }

  preloadCritical(images) {
    return Promise.allSettled(images.map(src => this.loadImage(src)));
  }

  clearCache() {
    this.loadedImages.clear();
    this.loadingImages.clear();
    this.queue = [];
  }
}

window.imageLoader = new ImageLoader();