import { type BrowserWindow, ipcMain } from 'electron';

let timer: unknown = null;

let _callback: ((deviceId: string) => void) | null = null;

export function registerBuletoothEvents(win: BrowserWindow) {
  win.webContents.on('select-bluetooth-device', (event, deviceList, callback) => {
    event.preventDefault();

    console.log('available devices => ', deviceList.length);

    // 将设备列表发送到渲染进程
    win.webContents.send('update-devices', deviceList);

    if (_callback) {
      _callback = null;
      timer = null;
      ipcMain.removeListener('selected-device', handleSelectedDevice);
    }

    if (!timer) {
      _callback = callback;
      // 监听来自渲染进程的选择结果
      timer = ipcMain.once('selected-device', handleSelectedDevice);
    }
  });

  return win;
}

function handleSelectedDevice(event: unknown, deviceId: string) {
  try {
    console.log('execute callback');
    if (_callback) {
      _callback(deviceId);
    }
    timer = null;
  } catch (error) {
    console.error('Error selecting device:', error);
  }
}
