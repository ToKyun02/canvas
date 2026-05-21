import { devCanvasRegistry } from './dev/registry';
import { getNodeId } from './features/canvas/utils/selection';
import { useAppStore } from './stores';

export function injectDevCanvasApi() {
  window.devCanvas = {
    store: {
      app: useAppStore,
    },
    api: { version: 'v1' },
    get canvas() {
      return devCanvasRegistry.current;
    },

    getSelectedNodeIds() {
      return devCanvasRegistry.current?.getActiveObjects().map((object) => getNodeId(object) ?? '') ?? [];
    },

    getNodeById(id: string) {
      return devCanvasRegistry.current?.getObjects().find((object) => getNodeId(object) === id);
    },

    getNodes() {
      return useAppStore.getState().nodes;
    },

    getNodeOrder() {
      return useAppStore.getState().nodeOrder;
    },
  };
}
