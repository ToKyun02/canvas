import { StateCreator } from 'zustand';
import { AppState, EditorState } from '../types';

export const createEditorSlice: StateCreator<AppState, [], [], EditorState> = (set) => ({
  isPropertiesSidebarOpen: true,
  togglePropertiesSidebar: () => set((s) => ({ isPropertiesSidebarOpen: !s.isPropertiesSidebarOpen })),
});
