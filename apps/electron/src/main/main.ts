import { app, BrowserWindow } from 'electron';
import * as path from 'path';

function createWindow() {
  const win = new BrowserWindow({
    width: 480,
    height: 900,
    minWidth: 360,
    minHeight: 640,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    },
    // The design states standard window behavior, no custom title bar explicitly requested
    // but the design says "Windows default window 480x900" so keeping it simple.
  });

  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, '../../dist/renderer/index.html'));
  } else {
    // Vite dev server
    win.loadURL('http://localhost:3000');
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
