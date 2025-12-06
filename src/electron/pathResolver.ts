import path from 'path';
import { app } from 'electron';
import { isDev } from './util.js';

export function getAssetPath() {
    return path.join(app.getAppPath(), isDev() ? '.' : '..', '/src/assets');
}

export function getUIPath() {
    console.log(app.getAppPath());
  return path.join(app.getAppPath(), isDev() ? '.' : '..', '/src/ui');
}
