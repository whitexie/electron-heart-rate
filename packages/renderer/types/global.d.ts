// global.d.ts

import type { electronAPI } from '../../preload/src/registerElectronAPI';


declare global {

  interface Window {
    electronAPI: typeof electronAPI;
  }
}
