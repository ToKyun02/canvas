export function injectDevCanvasApi() {
  window.devCanvas = {
    store: {},
    api: { version: 'v1' },
  };
}
