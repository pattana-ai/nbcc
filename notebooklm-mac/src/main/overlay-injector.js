/**
 * Overlay Injector
 * Injects UI overlays (settings icon and version text) into the BrowserView
 */

/**
 * Get the overlay injection script
 * @param {string} version - App version number
 * @returns {string} JavaScript code to inject
 */
function getOverlayScript(version) {
  return `
    (function() {
      // Prevent multiple injections
      if (document.getElementById('electron-overlay-container')) {
        return;
      }

      // Create overlay container
      const overlayContainer = document.createElement('div');
      overlayContainer.id = 'electron-overlay-container';
      overlayContainer.style.cssText = \`
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 999999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      \`;

      // Settings icon (lower left)
      const settingsIcon = document.createElement('div');
      settingsIcon.id = 'electron-settings-icon';
      settingsIcon.innerHTML = \`
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M12 1v6m0 6v6m6-12l-5.2 3m-1.6 3L6 16m12-11l-5.2 5.2m-1.6 1.6L6 17"></path>
        </svg>
      \`;
      settingsIcon.style.cssText = \`
        position: absolute;
        bottom: 20px;
        left: 20px;
        width: 44px;
        height: 44px;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(10px);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        pointer-events: auto;
        transition: all 0.2s ease;
        color: white;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      \`;

      // Hover effect for settings icon
      settingsIcon.addEventListener('mouseenter', () => {
        settingsIcon.style.background = 'rgba(0, 0, 0, 0.85)';
        settingsIcon.style.transform = 'scale(1.1)';
      });
      settingsIcon.addEventListener('mouseleave', () => {
        settingsIcon.style.background = 'rgba(0, 0, 0, 0.7)';
        settingsIcon.style.transform = 'scale(1)';
      });

      // Settings icon click handler
      settingsIcon.addEventListener('click', () => {
        window.electronAPI?.openSettings?.();
      });

      // Version text (lower right)
      const versionText = document.createElement('div');
      versionText.id = 'electron-version-text';
      versionText.textContent = 'v${version}';
      versionText.style.cssText = \`
        position: absolute;
        bottom: 20px;
        right: 20px;
        padding: 6px 12px;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(10px);
        border-radius: 8px;
        color: rgba(255, 255, 255, 0.7);
        font-size: 11px;
        font-weight: 500;
        pointer-events: none;
        user-select: none;
      \`;

      // Append elements to container
      overlayContainer.appendChild(settingsIcon);
      overlayContainer.appendChild(versionText);

      // Inject into page
      document.body.appendChild(overlayContainer);

      console.log('Overlay injected successfully');
    })();
  `;
}

/**
 * Inject overlay into webContents
 * @param {WebContents} webContents - Electron WebContents object
 * @param {string} version - App version number
 */
async function injectOverlay(webContents, version) {
  try {
    await webContents.executeJavaScript(getOverlayScript(version));
    console.log('Overlay injection completed');
  } catch (error) {
    console.error('Failed to inject overlay:', error);
  }
}

module.exports = {
  injectOverlay
};
