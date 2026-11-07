const { app, BrowserWindow, protocol, net } = require('electron/main');
const path = require('path');
const { pathToFileURL } = require('url');

// Register a custom "app://" scheme before the app is ready.
// Serving files through this scheme (instead of file://) gives sound files
// a clean path like /assets/tick.wav, which p5.sound can load without
// mangling spaces or the drive letter in the Windows path.
protocol.registerSchemesAsPrivileged([
    {
        scheme: 'app',
        privileges: { standard: true, secure: true, supportFetchAPI: true }
    }
]);

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 800
    });

    // Load the page through the custom scheme instead of loadFile()
    win.loadURL('app://local/index.html');
}

app.whenReady().then(() => {
    // Map every app:// request to a file in the project root
    // (the folder that contains package.json)
    protocol.handle('app', (request) => {
        const { pathname } = new URL(request.url);
        const filePath = path.join(app.getAppPath(), decodeURIComponent(pathname));
        return net.fetch(pathToFileURL(filePath).toString());
    });

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