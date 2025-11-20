# NotebookLM for macOS

A native macOS wrapper for Google NotebookLM, providing a dedicated desktop experience with enhanced window management and filesystem integration.

## Overview

This Electron application wraps the [NotebookLM](https://notebooklm.google.com) web interface in a native macOS application, offering:

- **Native App Experience**: Dedicated dock presence, separate from browser tabs
- **Window State Persistence**: Remembers window size, position, and display across sessions
- **macOS Integration**: Native menu bar with keyboard shortcuts
- **Always-on-Top Mode**: Keep NotebookLM visible while working in other apps
- **Future Enhancements**: Filesystem integration and drag & drop (coming in Phase 2)

## Current Status

**Phase 1 - MVP (Basic Wrapper)** ✅

This is the initial release with core functionality:
- Loads NotebookLM in a secure BrowserView
- Native macOS menu bar with standard shortcuts
- Window state persistence
- Always-on-top toggle
- Google authentication support

## Requirements

- macOS 10.15 (Catalina) or later
- Node.js 16.x or later
- npm 7.x or later
- Active internet connection (NotebookLM requires online access)
- Google Account with NotebookLM access

## Installation

### For Development

1. **Clone or navigate to the project directory**:
   ```bash
   cd notebooklm-mac
   ```

2. **Install dependencies** (if not already installed):
   ```bash
   npm install
   ```

3. **Run in development mode**:
   ```bash
   npm run dev
   ```

### For Production Use

1. **Build the application**:
   ```bash
   npm run build:mac
   ```

2. **Install the app**:
   - The built app will be in the `dist/` directory
   - Open the `.dmg` file
   - Drag NotebookLM to your Applications folder

## Usage

### Running the App

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

Or launch from Applications folder after building.

### First Launch

1. The app will open and load NotebookLM
2. Sign in with your Google Account when prompted
3. Your session will persist across app restarts

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+Q` | Quit application |
| `Cmd+W` | Close window |
| `Cmd+R` | Reload NotebookLM |
| `Cmd+Shift+R` | Force reload (clear cache) |
| `Cmd+Shift+T` | Toggle always-on-top |
| `Cmd+O` | Open file (coming in Phase 2) |
| `Alt+Cmd+I` | Toggle Developer Tools |
| `Cmd+M` | Minimize window |
| `Cmd+H` | Hide application |

### Menu Bar

The app includes a full macOS menu bar:

- **NotebookLM**: About, Services, Hide, Quit
- **File**: Open File (future), Close
- **Edit**: Standard edit commands (Undo, Cut, Copy, Paste, etc.)
- **View**: Reload, Toggle Fullscreen, Always-on-Top, Developer Tools
- **Window**: Minimize, Zoom, Bring All to Front
- **Help**: NotebookLM Help, Visit Website, Report Issue

### Always-on-Top Mode

Toggle with `Cmd+Shift+T` or via **View → Toggle Always on Top**

Useful for keeping NotebookLM visible while:
- Writing in another application
- Referencing documents
- Taking notes in other apps

## Architecture

### Project Structure

```
notebooklm-mac/
├── src/
│   ├── main/
│   │   ├── index.js          # Main Electron process
│   │   └── menu-builder.js   # macOS menu configuration
│   ├── renderer/
│   │   └── preload.js        # Secure IPC bridge
│   └── assets/
│       └── icons/            # App icons (to be added)
├── package.json              # Project configuration
├── .gitignore
└── README.md
```

### Security

This app follows Electron security best practices:

- ✅ `nodeIntegration: false` - Renderer processes don't have Node.js access
- ✅ `contextIsolation: true` - Preload scripts run in isolated context
- ✅ `sandbox: true` - Renderer processes are sandboxed
- ✅ Navigation protection - Only allows NotebookLM and Google domains
- ✅ `contextBridge` - Secure main↔renderer communication

### Authentication

- Google OAuth is handled entirely by NotebookLM's web interface
- Session cookies are persisted by Electron's session storage
- No custom OAuth implementation or credential storage

## Troubleshooting

### App won't launch

1. Check Node.js version: `node --version` (should be 16+)
2. Reinstall dependencies: `rm -rf node_modules package-lock.json && npm install`
3. Try development mode: `npm run dev` (provides console output)

### "This browser is not secure" error

The app sets a proper user agent to avoid this. If you see it:
1. Update to the latest version
2. Check that `webView.webContents.setUserAgent()` is called in `src/main/index.js`

### NotebookLM won't load

1. Check internet connection
2. Verify NotebookLM is accessible in a regular browser
3. Try force reload: `Cmd+Shift+R`
4. Check console for errors: `Alt+Cmd+I`

### Window size/position not persisting

1. Check that `electron-window-state` is installed: `npm list electron-window-state`
2. Delete state file and restart: `rm ~/Library/Application\ Support/notebooklm-mac/window-state.json`

### Google login issues

1. Clear app data: Delete `~/Library/Application Support/notebooklm-mac/`
2. Restart the app and sign in again
3. Try logging into NotebookLM in a regular browser first

## Roadmap

### Phase 2: Filesystem Integration (Next)
- Drag & drop file support
- Native file picker integration
- Quick file upload with Cmd+O

### Phase 3: Enhanced Window Management
- Multiple window support
- Custom window presets
- Improved fullscreen experience

### Phase 4: Polish & Distribution
- App icon design
- Code signing and notarization
- Auto-update mechanism
- User preferences panel

### Future Possibilities (Depends on NotebookLM API)
- Desktop notifications
- Offline mode
- Export automation
- Integration with note-taking apps

## Development

### Building from Source

```bash
# Install dependencies
npm install

# Development mode (with hot reload)
npm run dev

# Build for macOS
npm run build:mac

# Output: dist/NotebookLM-0.1.0.dmg
```

### Adding Features

1. Main process logic: `src/main/index.js`
2. Menu items: `src/main/menu-builder.js`
3. Renderer bridge: `src/renderer/preload.js`

### Debugging

- Enable Developer Tools: `Alt+Cmd+I`
- Check console logs in terminal when running `npm run dev`
- Main process logs appear in terminal
- Renderer (NotebookLM) logs appear in DevTools console

## Known Limitations

1. **No Offline Mode**: Requires internet connection (NotebookLM is cloud-based)
2. **Limited Control**: Cannot modify NotebookLM's UI or behavior
3. **Dependent on Google**: App may break if NotebookLM changes structure
4. **File Upload**: Cannot fully automate file uploads (browser security limitation)

## License

MIT License - This is an unofficial wrapper, not affiliated with Google.

## Disclaimer

This is an **unofficial** application and is not affiliated with, endorsed by, or connected to Google LLC. NotebookLM is a trademark of Google LLC.

This wrapper is provided "as-is" for personal use. Use at your own risk and ensure compliance with Google's Terms of Service.

## Credits

- NotebookLM by Google: https://notebooklm.google.com
- Electron Framework: https://www.electronjs.org
- electron-window-state: https://github.com/mawie81/electron-window-state

## Support

For issues specific to this wrapper:
- Check this README for troubleshooting steps
- Review the implementation plan in `claudedocs/`

For NotebookLM functionality issues:
- Visit [NotebookLM Help](https://support.google.com/notebooklm)

---

**Version**: 0.1.0 (Phase 1 - MVP)
**Status**: Development
**Platform**: macOS
