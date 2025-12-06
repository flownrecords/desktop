import { app, BrowserWindow } from 'electron';
import { handleCloseEvents } from './util.js';
import { createTray } from './tray.js';
import pkg from 'electron-updater';
const { autoUpdater } = pkg;
import path from 'path';
import { getUIPath } from './pathResolver.js';

const sessionStart = Date.now();

let splashWindow: BrowserWindow | null = null;
let mainWindow: BrowserWindow | null = null;

const createSplashWindow = () => {
    splashWindow = new BrowserWindow({
        title: 'Flown Records',
        icon: path.join(app.getAppPath(), '/src/assets/icon.png'),
        width: 300,
        height: 350,
        frame: true,
        transparent: false,
        backgroundColor: '#00000000',
        alwaysOnTop: false,
        center: true,
        resizable: false,
        hasShadow: true,
        titleBarStyle: 'hidden',
        titleBarOverlay: false,
        autoHideMenuBar: true,
        show: true,
        webPreferences: {
            devTools: false,
        },
    });

    console.log(path.join(getUIPath(), 'splash.html'))
    splashWindow.loadFile(path.join(getUIPath(), 'splash.html'));

    return splashWindow;
};

const createMainWindow = () => {
    mainWindow = new BrowserWindow({
        title: 'Flown Records',
        icon: path.join(app.getAppPath(), '/src/assets/icon.png'),
        autoHideMenuBar: true,
        show: false,
        center: true,
        webPreferences: {
            devTools: false,
        },
    });

    mainWindow.loadURL("https://flownrecords.live");


    mainWindow.once('ready-to-show', () => {
        mainWindow?.maximize();
        mainWindow?.show();
        if (splashWindow) {
            splashWindow.close();
        }

        if(mainWindow) {
            createTray(mainWindow);
            handleCloseEvents(mainWindow);
        }
    });
};

app.on('ready', () => {
    splashWindow = createSplashWindow();

    splashWindow.webContents.once('did-finish-load', () => {
        setTimeout(() => {
            createMainWindow();
        }, 2000);
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow();
        }
    });

    if (mainWindow) {
        createTray(mainWindow);
        handleCloseEvents(mainWindow);
    }

    // Auto Updater
    autoUpdater.checkForUpdatesAndNotify();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
