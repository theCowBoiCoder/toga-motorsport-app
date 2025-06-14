const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  ping: () => ipcRenderer.invoke('ping'),

  // we can also expose variables, not just functions
})

contextBridge.exposeInMainWorld('discord', {
  login: () => ipcRenderer.invoke('discord:login'),
  logout: () => ipcRenderer.invoke('discord:logout'),
  getUser: () => ipcRenderer.invoke('discord:get-user')
});

contextBridge.exposeInMainWorld('app', {
  getVersion: () => ipcRenderer.invoke('app:get-version')
});


