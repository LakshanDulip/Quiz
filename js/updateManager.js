<script>
// ============ Update Manager (FIXED) ============
class UpdateManager {
  constructor() {
    this.currentVersion = '1.0.0';
    this.versionUrl = 'version.json';
    this.checkInterval = 300000; // 5 minutes
    this.isChecking = false;
    this.updateAvailable = false;
    this.newVersion = null;
    this.popupShown = false;
    this.pendingQuizCheck = false;
    this.visibilityInterval = null;
    this.updateDismissed = false;
    this.lastDismissedVersion = localStorage.getItem('dismissedVersion') || null;
    this.init();
  }

  init() {
    // Don't check immediately if version was dismissed
    if (this.lastDismissedVersion) {
      console.log('[Update] Version ' + this.lastDismissedVersion + ' was previously dismissed');
    }
    
    // Delay initial check to not block page load
    setTimeout(() => this.checkForUpdates(), 2000);

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && !this.updateDismissed) {
        this.checkForUpdates();
      } else {
        if (this.visibilityInterval) {
          clearInterval(this.visibilityInterval);
          this.visibilityInterval = null;
        }
      }
    });

    this.visibilityInterval = setInterval(() => {
      if (document.visibilityState === 'visible' && !this.updateDismissed) {
        this.checkForUpdates();
      }
    }, this.checkInterval);

    // Listen for service worker update messages
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'UPDATE_AVAILABLE' && !this.updateDismissed) {
          this.updateAvailable = true;
          this.newVersion = event.data.version;
          this.showUpdatePrompt();
        }
      });
    }
  }

  async checkForUpdates() {
    if (this.isChecking || this.updateAvailable || this.updateDismissed) return;
    this.isChecking = true;

    try {
      const response = await fetch(this.versionUrl + '?t=' + Date.now(), {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      });

      if (!response.ok) throw new Error('Version check failed');

      const data = await response.json();
      const newVersion = data.version;

      // Check if this version was already dismissed
      if (newVersion === this.lastDismissedVersion) {
        console.log('[Update] Version ' + newVersion + ' already dismissed by user');
        this.isChecking = false;
        return;
      }

      if (newVersion !== this.currentVersion) {
        this.updateAvailable = true;
        this.newVersion = newVersion;
        this.showUpdatePrompt();
      }
    } catch (error) {
      console.warn('Update check failed:', error);
    } finally {
      this.isChecking = false;
    }
  }

  showUpdatePrompt() {
    // Check if already showing
    if (this.popupShown) return;
    
    // Check if dismissed
    if (this.updateDismissed) return;

    // Check if quiz is active - delay popup
    if (window.appState && window.appState.quiz && !window.appState.quiz.showResult && !window.appState.quiz.gameOver) {
      this.pendingQuizCheck = true;
      const checkInterval = setInterval(() => {
        if (!window.appState.quiz || window.appState.quiz.showResult || window.appState.quiz.gameOver) {
          clearInterval(checkInterval);
          this.createUpdatePopup();
        }
      }, 2000);
    } else {
      this.createUpdatePopup();
    }
  }

  createUpdatePopup() {
    if (this.popupShown) return;
    
    // Remove any existing popup
    const existingPopup = document.getElementById('updateOverlay');
    if (existingPopup) existingPopup.remove();
    
    this.popupShown = true;

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay active';
    overlay.style.zIndex = '9999';
    overlay.id = 'updateOverlay';

    overlay.innerHTML = `
      <div class="modal-content" style="max-width:400px;text-align:center;">
        <span style="font-size:3rem;display:block;margin-bottom:10px;">🚀</span>
        <h2 class="modal-title">New Update Available!</h2>
        <p style="color:var(--text-secondary);margin-bottom:20px;">
          Version <strong>${this.newVersion}</strong> is now available with improvements and fixes.
        </p>
        <div style="display:flex;gap:10px;flex-direction:column;">
          <button class="btn btn-primary" id="updateNowBtn" style="width:100%;justify-content:center;">
            <i class="fas fa-download"></i> Update Now
          </button>
          <button class="btn btn-outline" id="updateLaterBtn" style="width:100%;justify-content:center;">
            <i class="fas fa-clock"></i> Later
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Add event listeners directly
    document.getElementById('updateNowBtn').addEventListener('click', () => {
      this.applyUpdate();
    });

    document.getElementById('updateLaterBtn').addEventListener('click', () => {
      this.dismissUpdate();
    });

    // Close on overlay click (but not on content click)
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        this.dismissUpdate();
      }
    });
  }

  applyUpdate() {
    console.log('[Update] Applying update to version:', this.newVersion);
    
    // Clear the popup immediately
    this.removePopup();
    
    // Update current version to prevent re-prompt
    this.currentVersion = this.newVersion;
    this.updateAvailable = false;
    this.updateDismissed = false;
    localStorage.removeItem('dismissedVersion');
    
    // Clear all caches
    if (window.cacheManager) window.cacheManager.clear();
    if (window.imageLoader) window.imageLoader.clearCache();
    
    // Clear service worker caches
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' });
    }
    
    // Clear all browser caches
    if ('caches' in window) {
      caches.keys().then(names => {
        const deletePromises = names.map(name => caches.delete(name));
        return Promise.all(deletePromises);
      }).then(() => {
        // Force reload with cache busting
        this.forceReload();
      }).catch(() => {
        this.forceReload();
      });
    } else {
      this.forceReload();
    }
  }

  forceReload() {
    // Add version parameter to bypass cache
    const url = new URL(window.location.href);
    url.searchParams.set('v', this.newVersion || Date.now().toString());
    
    // Use location.replace to prevent back button issues
    window.location.replace(url.toString());
    
    // Fallback: force reload after short delay
    setTimeout(() => {
      window.location.reload(true);
    }, 500);
  }

  dismissUpdate() {
    console.log('[Update] User dismissed update to version:', this.newVersion);
    
    // Store dismissed version in localStorage
    if (this.newVersion) {
      localStorage.setItem('dismissedVersion', this.newVersion);
      this.lastDismissedVersion = this.newVersion;
    }
    
    this.updateDismissed = true;
    this.updateAvailable = false;
    this.popupShown = false;
    
    // Remove the popup
    this.removePopup();
    
    // Reset after 1 hour so it can check again
    setTimeout(() => {
      this.updateDismissed = false;
      this.lastDismissedVersion = null;
      localStorage.removeItem('dismissedVersion');
      console.log('[Update] Dismiss timeout expired, will check for updates again');
    }, 3600000); // 1 hour
  }

  removePopup() {
    const overlay = document.getElementById('updateOverlay');
    if (overlay) {
      overlay.classList.remove('active');
      // Remove after transition
      setTimeout(() => {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      }, 300);
    }
    this.popupShown = false;
  }

  // Manual reset - can be called from console for testing
  reset() {
    this.updateDismissed = false;
    this.updateAvailable = false;
    this.popupShown = false;
    this.newVersion = null;
    this.lastDismissedVersion = null;
    localStorage.removeItem('dismissedVersion');
    this.removePopup();
    console.log('[Update] Manager reset');
  }

  destroy() {
    if (this.visibilityInterval) clearInterval(this.visibilityInterval);
    this.removePopup();
  }
}

// Initialize update manager
window.updateManager = new UpdateManager();

// Expose reset function for debugging
console.log('[Update] Update Manager initialized. Use window.updateManager.reset() to reset if needed.');
</script>
