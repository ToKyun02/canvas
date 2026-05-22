import { StateCreator } from 'zustand';
import { AppState, EditorState } from '../types';

export const createEditorSlice: StateCreator<AppState, [], [], EditorState> = (set) => ({
  isPropertiesSidebarOpen: true,
  isVisibleNodeLabels: true,
  toggleNodeLabelsVisibility: () => set((s) => ({ isVisibleNodeLabels: !s.isVisibleNodeLabels })),
  setPropertiesSidebarOpen: (open) => set({ isPropertiesSidebarOpen: open }),
  togglePropertiesSidebar: () => set((s) => ({ isPropertiesSidebarOpen: !s.isPropertiesSidebarOpen })),
});
