const { Menu, shell, dialog } = require('electron');

/**
 * Build and set the application menu for macOS
 * @param {BrowserWindow} mainWindow - The main application window
 * @param {BrowserView} webView - The BrowserView
 */
function buildMenu(mainWindow, webView) {
  const template = [
    // App Menu (macOS)
    {
      label: 'Pattana RAG Demo',
      submenu: [
        {
          label: 'About',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About',
              message: 'Pattana RAG Demo for macOS',
              detail: 'A native macOS wrapper for Pattana RAG Demo\n\nVersion: 0.1.0',
              buttons: ['OK']
            });
          }
        },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },

    // File Menu
    {
      label: 'File',
      submenu: [
        {
          label: 'Open File...',
          accelerator: 'CmdOrCtrl+O',
          click: () => {
            // TODO: Implement file picker in Phase 2
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'Coming Soon',
              message: 'File picker will be implemented in Phase 2',
              buttons: ['OK']
            });
          }
        },
        { type: 'separator' },
        { role: 'close' }
      ]
    },

    // Edit Menu
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'pasteAndMatchStyle' },
        { role: 'delete' },
        { role: 'selectAll' },
        { type: 'separator' },
        {
          label: 'Speech',
          submenu: [
            { role: 'startSpeaking' },
            { role: 'stopSpeaking' }
          ]
        }
      ]
    },

    // View Menu
    {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            webView.webContents.reload();
          }
        },
        {
          label: 'Force Reload',
          accelerator: 'CmdOrCtrl+Shift+R',
          click: () => {
            webView.webContents.reloadIgnoringCache();
          }
        },
        { type: 'separator' },
        { role: 'togglefullscreen' },
        {
          label: 'Toggle Always on Top',
          accelerator: 'CmdOrCtrl+Shift+T',
          click: () => {
            const isAlwaysOnTop = mainWindow.isAlwaysOnTop();
            mainWindow.setAlwaysOnTop(!isAlwaysOnTop);

            // Show confirmation
            const status = !isAlwaysOnTop ? 'enabled' : 'disabled';
            console.log(`Always on top ${status}`);
          }
        },
        { type: 'separator' },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'Alt+CmdOrCtrl+I',
          click: () => {
            if (webView.webContents.isDevToolsOpened()) {
              webView.webContents.closeDevTools();
            } else {
              webView.webContents.openDevTools();
            }
          }
        }
      ]
    },

    // Window Menu
    {
      role: 'window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        { type: 'separator' },
        { role: 'front' },
        { type: 'separator' },
        { role: 'window' }
      ]
    },

    // Help Menu
    {
      role: 'help',
      submenu: [
        {
          label: 'Help',
          click: async () => {
            await shell.openExternal('https://support.google.com/notebooklm');
          }
        },
        { type: 'separator' },
        {
          label: 'Report an Issue',
          click: async () => {
            // TODO: Update with actual repository URL if open-sourced
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'Report an Issue',
              message: 'This is a personal project. Issue tracking not yet configured.',
              buttons: ['OK']
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  console.log('Application menu built successfully');
}

module.exports = { buildMenu };
