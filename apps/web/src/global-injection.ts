import { devCanvasRegistry } from './dev/registry';

export function injectDevCanvasApi() {
  window.devCanvas = {
    store: {},
    api: { version: 'v1' },
    get canvas() {
      return devCanvasRegistry.current;
    },
  };
}
