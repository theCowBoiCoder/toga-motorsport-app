// require('update-electron-app')()
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')
const fs = require('fs')
const discordLogin = require('./src/discord-login');


const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')
}

ipcMain.handle('discord:login', async () => {
  const result = await discordLogin.login();
  return result;
});

ipcMain.handle('discord:logout', () => {
  return discordLogin.logout();
});

ipcMain.handle('discord:get-user', () => {
  return discordLogin.getCurrentUser();
});

app.whenReady().then(() => {
  ipcMain.handle('ping', () => 'pong')
  createWindow()
const userDataDir = path.join(__dirname, '.user-data');
  if (!fs.existsSync(userDataDir)) {
    fs.mkdirSync(userDataDir, { recursive: true });
  }
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})