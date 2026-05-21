import type { CanvasNodeState } from '@/stores/nodes/types';
import type { Canvas } from 'fabric';

export interface DevCanvasApi {
  store: Record<string, unknown>;
  api: { version: string };
  readonly canvas?: Canvas;
  getSelectedNodeIds: () => string[];
  getNodeById: (id: string) => FabricObject | undefined;
  getNodes: () => Record<string, CanvasNodeState>;
  getNodeOrder: () => string[];
}

declare global {
  interface Window {
    devCanvas: DevCanvasApi;
  }
}
