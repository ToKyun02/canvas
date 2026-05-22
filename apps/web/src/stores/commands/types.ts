import type { NodeTool } from '@/stores/nodes/registry';
import type { CanvasNodeState } from '@/stores/nodes/types';

export type Tool = 'move' | NodeTool;

export interface CanvasSize {
  width: number;
  height: number;
}

export interface CanvasState {
  tool: Tool;
  zoom: number;
  position: {
    x: number;
    y: number;
  };
  canvasSize: CanvasSize;
  panBy: (delta: { x: number; y: number }) => void;
  setTool: (tool: Tool) => void;
  setZoom: (zoom: number) => void;
  setCanvasSize: (size: CanvasSize) => void;
  setViewport: (viewport: { zoom: number; position: { x: number; y: number } }) => void;
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
  deleteSelectionRequest: number;
  setSelectedIds: (ids: string[]) => void;
  selectAll: () => void;
  clearSelection: () => void;
  deleteSelection: () => void;
}

export interface EditorState {
  isPropertiesSidebarOpen: boolean;
  togglePropertiesSidebar: () => void;
}

export interface NodesState {
  nodes: Record<string, CanvasNodeState>;
  nodeOrder: string[];
  addNode: (node: CanvasNodeState) => void;
  setNode: (node: CanvasNodeState) => void;
  updateNode: (id: string, patch: Partial<CanvasNodeState>) => void;
  removeNodes: (ids: string[]) => void;
}

export type AppState = CanvasState & HistoryState & SelectionState & EditorState & NodesState;

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
