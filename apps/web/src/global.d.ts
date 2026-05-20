import type { Canvas } from 'fabric';

export interface DevCanvasApi {
  store: Record<string, unknown>;
  api: { version: string };
  readonly canvas?: Canvas;
}

declare global {
  interface Window {
    devCanvas: DevCanvasApi;
  }
}
