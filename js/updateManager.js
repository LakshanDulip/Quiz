// js/cacheManager.js
class CacheManager {
  constructor() {
    this.cache = new Map();
    this.maxSize = 50; // Maximum number of cached items
    this.accessOrder = [];
  }

  set(key, value, ttl = 300000) { // Default TTL: 5 minutes
    // Evict oldest if at capacity
    while (this.cache.size >= this.maxSize) {
      const oldest = this.accessOrder.shift();
      this.cache.delete(oldest);
    }

    const expiry = Date.now() + ttl;
    this.cache.set(key, { value, expiry });
    
    // Update access order
    const index = this.accessOrder.indexOf(key);
    if (index > -1) this.accessOrder.splice(index, 1);
    this.accessOrder.push(key);
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    // Check expiry
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      const index = this.accessOrder.indexOf(key);
      if (index > -1) this.accessOrder.splice(index, 1);
      return null;
    }

    // Update access order (LRU)
    const index = this.accessOrder.indexOf(key);
    if (index > -1) this.accessOrder.splice(index, 1);
    this.accessOrder.push(key);
    
    return item.value;
  }

  has(key) {
    return this.get(key) !== null;
  }

  delete(key) {
    const index = this.accessOrder.indexOf(key);
    if (index > -1) this.accessOrder.splice(index, 1);
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
    this.accessOrder = [];
  }

  // Release memory for inactive data
  prune() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.delete(key);
      }
    }
  }
}

// Export for use
window.cacheManager = new CacheManager();