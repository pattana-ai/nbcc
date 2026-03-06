const { app, BrowserWindow, BrowserView, ipcMain } = require('electron');
const windowStateKeeper = require('electron-window-state');
const path = require('path');
const { buildMenu } = require('./menu-builder');
const { createSettingsWindow } = require('./settings-window');

let mainWindow;
let webView;
let overlayWindow;

function createOverlayWindow() {
  // Don't create if already exists
  if (overlayWindow && !overlayWindow.isDestroyed()) {
    return;
  }

  // Get main window bounds
  const bounds = mainWindow.getBounds();

  // Create transparent overlay window
  overlayWindow = new BrowserWindow({
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
    transparent: true,
    frame: false,
    hasShadow: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    movable: false,
    webPreferences: {
      preload: path.join(__dirname, '../renderer/preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Load overlay HTML
  overlayWindow.loadFile(path.join(__dirname, '../renderer/overlay.html'));

  // Make overlay fully click-through by default
  overlayWindow.setIgnoreMouseEvents(true, { forward: true });

  // Keep overlay synced with main window position and size
  mainWindow.on('move', () => {
    if (overlayWindow && !overlayWindow.isDestroyed()) {
      const bounds = mainWindow.getBounds();
      overlayWindow.setBounds(bounds);
    }
  });

  mainWindow.on('resize', () => {
    if (overlayWindow && !overlayWindow.isDestroyed()) {
      const bounds = mainWindow.getBounds();
      overlayWindow.setBounds(bounds);
    }
  });

  // Close overlay when main window closes
  mainWindow.on('close', () => {
    if (overlayWindow && !overlayWindow.isDestroyed()) {
      overlayWindow.close();
    }
  });

  console.log('Overlay window created');
}

function createWindow() {
  // Restore previous window state
  const mainWindowState = windowStateKeeper({
    defaultWidth: 1200,
    defaultHeight: 800
  });

  // Create main window
  mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    title: 'Pattana RAG Demo',
    movable: true,
    resizable: true,
    webPreferences: {
      preload: path.join(__dirname, '../renderer/preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    }
  });

  // Track window state for persistence
  mainWindowState.manage(mainWindow);

  // Create BrowserView
  webView = new BrowserView({
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    }
  });

  mainWindow.setBrowserView(webView);

  // Set BrowserView bounds to fill the window
  const { width, height } = mainWindow.getContentBounds();
  webView.setBounds({ x: 0, y: 0, width, height });
  webView.setAutoResize({ width: true, height: true });

  // Set user agent to avoid "browser not secure" warnings
  webView.webContents.setUserAgent(
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );

  webView.webContents.loadURL('https://notebooklm.google.com');

  // Handle window resize
  mainWindow.on('resize', () => {
    const { width, height } = mainWindow.getContentBounds();
    webView.setBounds({ x: 0, y: 0, width, height });
  });

  // Build application menu
  buildMenu(mainWindow, webView);

  // Open DevTools in development (optional)
  // if (process.env.NODE_ENV === 'development') {
  //   webView.webContents.openDevTools();
  // }

  // Handle webView navigation
  webView.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith('https://notebooklm.google.com') &&
        !url.startsWith('https://accounts.google.com')) {
      console.log('Blocked navigation to:', url);
      event.preventDefault();
    }
  });

  webView.webContents.on('did-finish-load', () => {
    console.log('Loaded successfully');

    // Create overlay window with UI elements
    createOverlayWindow();
  });

  // Handle loading errors
  webView.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
  });
}

// IPC handlers
ipcMain.on('open-settings', () => {
  createSettingsWindow(mainWindow);
});

// Handle overlay mouse events - toggle click-through based on cursor position
ipcMain.on('set-overlay-mouse-passthrough', (event, passthrough) => {
  if (overlayWindow && !overlayWindow.isDestroyed()) {
    overlayWindow.setIgnoreMouseEvents(passthrough, { forward: true });
  }
});

// App lifecycle events
app.whenReady().then(() => {
  createWindow();

  // macOS: Re-create window when dock icon is clicked and no windows are open
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle app quit
app.on('before-quit', () => {
  console.log('Closing app...');
});
