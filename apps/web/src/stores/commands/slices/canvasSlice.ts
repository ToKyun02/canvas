import { getViewportCenter, zoomAtPoint } from '@/features/canvas/utils/zoomAtPoint';
import { StateCreator } from 'zustand';
import { AppState, CanvasState } from '../types';

const ZOOM_IN_FACTOR = 1.25;
const ZOOM_OUT_FACTOR = 0.8;

export const createCanvasSlice: StateCreator<AppState, [], [], CanvasState> = (set) => ({
  tool: 'move',
  zoom: 1,
  position: { x: 0, y: 0 },
  canvasSize: { width: 0, height: 0 },

  panBy: (delta) => set((s) => ({ position: { x: s.position.x + delta.x, y: s.position.y + delta.y } })),
  setTool: (tool) => set({ tool }),
  setZoom: (zoom) => set({ zoom }),
  setCanvasSize: (canvasSize) => set({ canvasSize }),
  setViewport: ({ zoom, position }) => set({ zoom, position }),
  zoomIn: () =>
    set((s) => {
      if (s.canvasSize.width === 0 || s.canvasSize.height === 0) {
        return { zoom: Math.min(+(s.zoom * ZOOM_IN_FACTOR).toFixed(2), 8) };
      }
      return zoomAtPoint(s.zoom, s.position, getViewportCenter(s.canvasSize), ZOOM_IN_FACTOR);
    }),
  zoomOut: () =>
    set((s) => {
      if (s.canvasSize.width === 0 || s.canvasSize.height === 0) {
        return { zoom: Math.max(+(s.zoom * ZOOM_OUT_FACTOR).toFixed(2), 0.1) };
      }
      return zoomAtPoint(s.zoom, s.position, getViewportCenter(s.canvasSize), ZOOM_OUT_FACTOR);
    }),
  zoomToFit: () => set({ zoom: 1, position: { x: 0, y: 0 } }),
});
