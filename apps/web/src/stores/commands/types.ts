export type Tool = 'move' | 'text';

export interface CanvasState {
  tool: Tool;
  zoom: number;
  position: {
    x: number;
    y: number;
  };
  panBy: (delta: { x: number; y: number }) => void;
  setTool: (tool: Tool) => void;
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  zoomToFit: () => void;
}

export interface HistoryState {
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
}

export interface SelectionState {
  selectedIds: string[];
  selectAll: () => void;
  clearSelection: () => void;
  deleteSelection: () => void;
}

export type AppState = CanvasState & HistoryState & SelectionState;

export interface Command {
  id: string;
  label: string;
  shortcut?: string;
  icon?: string;
  group?: string;
  isActive?: (store: AppState) => boolean;
  isDisabled?: (store: AppState) => boolean;
  execute: (store: AppState) => void;
}
