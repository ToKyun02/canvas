import { StateCreator } from 'zustand';
import { AppState, HistoryState } from '../types';

type Snapshot = {
  tool: AppState['tool'];
};

const takeSnapshot = (state: AppState): Snapshot => {
  return {
    tool: state.tool,
  };
};

const applySnapshot = (state: AppState, snapshot: Snapshot): Partial<AppState> => {
  return { tool: snapshot.tool };
};

type HistorySliceState = HistoryState & {
  _past: Snapshot[];
  _future: Snapshot[];
};

export const createHistorySlice: StateCreator<AppState, [], [], HistoryState> = (set) => ({
  canUndo: false,
  canRedo: false,
  undo: () =>
    set((s) => {
      const past = (s as unknown as HistorySliceState)._past ?? [];
      if (past.length === 0) return s;

      const snapshot = past[past.length - 1]!;
      const newPast = past.slice(0, -1);
      const future = (s as unknown as HistorySliceState)._future ?? [];

      return {
        ...applySnapshot(s, snapshot),
        _past: newPast,
        _future: [takeSnapshot(s), ...future],
        canUndo: newPast.length > 0,
        canRedo: true,
      } as Partial<AppState>;
    }),

  redo: () =>
    set((s) => {
      const future = (s as unknown as HistorySliceState)._future ?? [];
      if (future.length === 0) return s;

      const [snapshot, ...newFuture] = future;
      const past = (s as unknown as HistorySliceState)._past ?? [];

      return {
        ...applySnapshot(s, snapshot as Snapshot),
        _past: [...past, takeSnapshot(s)],
        _future: newFuture,
        canUndo: true,
        canRedo: newFuture.length > 0,
      } as Partial<AppState>;
    }),
});

export function pushHistory(get: () => AppState, set: (fn: (s: AppState) => Partial<AppState>) => void) {
  const snapshot = takeSnapshot(get());
  set((s) => {
    const past = (s as unknown as HistorySliceState)._past ?? [];
    return {
      _past: [...past, snapshot],
      _future: [],
      canUndo: true,
      canRedo: false,
    } as Partial<AppState>;
  });
}
