import { contextBridge, ipcRenderer } from 'electron';

export const electronAPI = {
  onUpdateDevices(callback: (deviceList: unknown[]) => void) {
    ipcRenderer.on('update-devices', (_event, deviceList) => callback(deviceList));
  },
  onWindowBlurOrFocus(callback: (isFocus: boolean) => void) {
    ipcRenderer.on('window-blur-or-focus', (_event, isFocus) => callback(isFocus));
  },
  selectedDevice(id: string) {
    ipcRenderer.send('selected-device', id);
  },
  mouseChanged(inOrOut: boolean) {
    ipcRenderer.send('mouse-changed', inOrOut);
  },
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);
