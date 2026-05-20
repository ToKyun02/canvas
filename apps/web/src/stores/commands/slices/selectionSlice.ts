import { StateCreator } from 'zustand';
import { AppState, SelectionState } from '../types';

export const createSelectionSlice: StateCreator<AppState, [], [], SelectionState> = (set) => ({
  selectedIds: [],

  selectAll: () => set({ selectedIds: ['__all__'] }),
  clearSelection: () => set({ selectedIds: [] }),
  deleteSelection: () =>
    set((s) => {
      if (s.selectedIds.length === 0) return s;
      return { selectedIds: [] };
    }),
});
