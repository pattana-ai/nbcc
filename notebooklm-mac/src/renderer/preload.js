const { contextBridge, ipcRenderer } = require('electron');

/**
 * Provides secure bridge between main and renderer processes
 *
 * This script runs in a sandboxed context with access to Node.js APIs
 * but exposes only safe, whitelisted APIs to the renderer process.
 */

// Expose safe APIs to renderer process via contextBridge
contextBridge.exposeInMainWorld('electronAPI', {
  // Platform information
  platform: process.platform,

  // File operations (to be implemented in Phase 2)
  selectFile: () => ipcRenderer.invoke('select-file'),
  uploadFile: (filePath) => ipcRenderer.invoke('upload-file', filePath),

  // Window operations
  toggleAlwaysOnTop: () => ipcRenderer.send('toggle-always-on-top'),
  openSettings: () => ipcRenderer.send('open-settings'),
  setOverlayMousePassthrough: (passthrough) => ipcRenderer.send('set-overlay-mouse-passthrough', passthrough),

  // Event listeners
  onFilePickerOpen: (callback) => {
    ipcRenderer.on('open-file-picker', callback);
  }
});

// Log preload script loaded
console.log('Preload script loaded');
