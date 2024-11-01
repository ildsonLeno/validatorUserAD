const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const PowerShell = require('node-powershell');
const log = require('electron-log');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle('select-file', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [{ name: 'Text Files', extensions: ['txt'] }]
  });
  return result.filePaths[0];
});

ipcMain.handle('validate-users', async (event, filePath) => {
  const ps = new PowerShell({
    executionPolicy: 'Bypass',
    noProfile: true
  });

  try {
    await ps.addCommand(`
      Import-Module ActiveDirectory;
      $users = Get-Content "${filePath}" -Encoding UTF8;
      $results = @();
      foreach ($user in $users) {
        $adUser = Get-ADUser -Filter "DisplayName -like '*$user*'" -Properties Enabled,LastLogonDate;
        if ($adUser) {
          if (-not $adUser.Enabled) {
            $results += "DESATIVADO: $($adUser.DisplayName) | Último Acesso: $($adUser.LastLogonDate)";
          }
        } else {
          $results += "NÃO ENCONTRADO: $user";
        }
      }
      $results | ConvertTo-Json;
    `);

    const result = await ps.invoke();
    return JSON.parse(result);
  } catch (error) {
    log.error('PowerShell Error:', error);
    throw error;
  } finally {
    await ps.dispose();
  }
});