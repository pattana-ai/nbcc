const { BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let settingsWindow = null;

/**
 * Create and show the settings window
 * @param {BrowserWindow} parentWindow - Parent window for modal behavior
 */
function createSettingsWindow(parentWindow) {
  // If window already exists, focus it
  if (settingsWindow && !settingsWindow.isDestroyed()) {
    settingsWindow.focus();
    return;
  }

  // Create settings window
  settingsWindow = new BrowserWindow({
    width: 500,
    height: 400,
    resizable: false,
    parent: parentWindow,
    modal: true,
    title: 'Settings',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, '../renderer/preload.js')
    }
  });

  // Remove menu bar from settings window
  settingsWindow.setMenuBarVisibility(false);

  // Load settings HTML content
  settingsWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(getSettingsHTML())}`);

  // Handle window close
  settingsWindow.on('closed', () => {
    settingsWindow = null;
  });

  console.log('Settings window created');
}

/**
 * Get settings window HTML content
 * @returns {string} HTML content for settings window
 */
function getSettingsHTML() {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Settings</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #f5f5f7;
          padding: 20px;
        }

        .container {
          max-width: 460px;
          margin: 0 auto;
        }

        h1 {
          font-size: 28px;
          font-weight: 600;
          color: #1d1d1f;
          margin-bottom: 24px;
        }

        .section {
          background: white;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .section-title {
          font-size: 16px;
          font-weight: 600;
          color: #1d1d1f;
          margin-bottom: 12px;
        }

        .setting-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #e5e5e7;
        }

        .setting-row:last-child {
          border-bottom: none;
        }

        .setting-label {
          font-size: 14px;
          color: #1d1d1f;
        }

        .setting-description {
          font-size: 12px;
          color: #86868b;
          margin-top: 4px;
        }

        .toggle {
          position: relative;
          width: 51px;
          height: 31px;
        }

        .toggle input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          border-radius: 31px;
          transition: 0.3s;
        }

        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 27px;
          width: 27px;
          left: 2px;
          bottom: 2px;
          background-color: white;
          border-radius: 50%;
          transition: 0.3s;
        }

        .toggle input:checked + .toggle-slider {
          background-color: #007aff;
        }

        .toggle input:checked + .toggle-slider:before {
          transform: translateX(20px);
        }

        .info-section {
          text-align: center;
          padding: 20px;
          color: #86868b;
          font-size: 12px;
        }

        .version {
          font-weight: 600;
          color: #1d1d1f;
          margin-bottom: 8px;
        }

        button {
          background: #007aff;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
          margin-top: 12px;
        }

        button:hover {
          background: #0051d5;
        }

        button:active {
          background: #004bb8;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Settings</h1>

        <div class="section">
          <div class="section-title">General</div>

          <div class="setting-row">
            <div>
              <div class="setting-label">Launch at Login</div>
              <div class="setting-description">Start app when you log in</div>
            </div>
            <label class="toggle">
              <input type="checkbox" id="launch-at-login">
              <span class="toggle-slider"></span>
            </label>
          </div>

          <div class="setting-row">
            <div>
              <div class="setting-label">Show in Menu Bar</div>
              <div class="setting-description">Keep app icon in menu bar</div>
            </div>
            <label class="toggle">
              <input type="checkbox" id="menu-bar" checked>
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Developer</div>

          <div class="setting-row">
            <div>
              <div class="setting-label">Developer Tools</div>
              <div class="setting-description">Enable DevTools on startup</div>
            </div>
            <label class="toggle">
              <input type="checkbox" id="dev-tools">
              <span class="toggle-slider"></span>
            </label>
          </div>

          <div class="setting-row">
            <div>
              <div class="setting-label">Clear Cache</div>
              <div class="setting-description">Clear app cache and reload</div>
            </div>
            <button onclick="clearCache()">Clear Cache</button>
          </div>
        </div>

        <div class="info-section">
          <div class="version">Pattana RAG Demo v0.1.0</div>
          <div>Built with Electron</div>
        </div>
      </div>

      <script>
        // Placeholder for future settings persistence
        console.log('Settings window loaded');

        function clearCache() {
          alert('Cache cleared! App will reload.');
          // TODO: Implement cache clearing via IPC
        }

        // Load saved settings (future implementation)
        // For now, these are just UI elements
      </script>
    </body>
    </html>
  `;
}

module.exports = {
  createSettingsWindow
};
