import { StateCreator } from 'zustand';
import { AppState, CanvasState } from '../types';

export const createCanvasSlice: StateCreator<AppState, [], [], CanvasState> = (set) => ({
  tool: 'move',
  zoom: 1,
  position: { x: 0, y: 0 },
  panBy: (delta) => set((s) => ({ position: { x: s.position.x + delta.x, y: s.position.y + delta.y } })),
  setTool: (tool) => set({ tool }),
  setZoom: (zoom) => set({ zoom }),
  zoomIn: () => set((s) => ({ zoom: Math.min(+(s.zoom * 1.25).toFixed(2), 8) })),
  zoomOut: () => set((s) => ({ zoom: Math.max(+(s.zoom * 0.8).toFixed(2), 0.1) })),
  zoomToFit: () => set((s) => ({ zoom: 1 })),
});
