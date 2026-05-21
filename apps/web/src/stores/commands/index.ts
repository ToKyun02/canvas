import { NODE_DEFINITIONS } from '@/stores/nodes/registry';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { createCanvasSlice } from './slices/canvasSlice';
import { createEditorSlice } from './slices/editorSlice';
import { createHistorySlice } from './slices/historySlice';
import { createSelectionSlice } from './slices/selectionSlice';
import { AppState, Command } from './types';

const TOOL_COMMANDS: Command[] = [
  {
    id: 'tool.move',
    label: '이동',
    shortcut: 'v',
    icon: 'cursor',
    group: 'tools',
    isActive: (store) => store.tool === 'move',
    execute: (store) => store.setTool('move'),
  },
  ...Object.values(NODE_DEFINITIONS).map((definition) => ({
    id: `tool.${definition.tool}`,
    label: definition.label,
    shortcut: definition.shortcut,
    icon: definition.icon,
    group: 'tools',
    isActive: (store: AppState) => store.tool === definition.tool,
    execute: (store: AppState) => store.setTool(definition.tool as AppState['tool']),
  })),
];

export const COMMANDS: Command[] = [
  // tools
  ...TOOL_COMMANDS,

  // history
  {
    id: 'history.undo',
    label: '실행 취소',
    shortcut: 'mod+z',
    icon: 'arrow-back-up',
    group: 'history',
    isDisabled: (store) => !store.canUndo,
    execute: (store) => store.undo(),
  },
  {
    id: 'history.redo',
    label: '복원',
    shortcut: 'mod+shift+z',
    icon: 'arrow-forward-up',
    group: 'history',
    isDisabled: (store) => !store.canRedo,
    execute: (store) => store.redo(),
  },

  // selections
  {
    id: 'selection.selectAll',
    label: '전체 선택',
    shortcut: 'mod+a',
    group: 'selections',
    execute: (store) => store.selectAll(),
  },
  {
    id: 'selection.clearSelection',
    label: '선택 해제',
    shortcut: 'escape',
    group: 'selections',
    execute: (store) => {
      store.clearSelection();
      store.setTool('move');
    },
  },
  {
    id: 'selection.deleteSelection',
    label: '삭제',
    shortcut: 'delete',
    group: 'selections',
    isDisabled: (store) => store.selectedIds.length === 0,
    execute: (store) => store.deleteSelection(),
  },
  {
    id: 'selection.deleteSelectionByBackspace',
    label: '삭제',
    shortcut: 'backspace',
    group: 'selections',
    isDisabled: (store) => store.selectedIds.length === 0,
    execute: (store) => store.deleteSelection(),
  },

  // views
  {
    id: 'views.zoomIn',
    label: '확대',
    shortcut: 'mod+=',
    group: 'views',
    execute: (store) => store.zoomIn(),
  },
  {
    id: 'views.zoomOut',
    label: '축소',
    shortcut: 'mod+-',
    group: 'views',
    execute: (store) => store.zoomOut(),
  },
  {
    id: 'views.zoomToFit',
    label: '화면에 맞추기',
    shortcut: 'mod+0',
    group: 'views',
    execute: (store) => store.zoomToFit(),
  },

  // editor
  {
    id: 'editor.togglePropertiesSidebar',
    label: '속성 패널 토글',
    shortcut: 'mod+/',
    group: 'editor',
    execute: (store) => store.togglePropertiesSidebar(),
  },
];

export const COMMAND_MAP = new Map<string, Command>(COMMANDS.map((command) => [command.id, command]));

export const executeCommand = (id: string, store: AppState) => {
  const cmd = COMMAND_MAP.get(id);
  if (!cmd) return false;
  if (cmd.isDisabled?.(store)) return false;
  cmd.execute(store);
  return true;
};

export const useAppStore = create<AppState>()(
  devtools(
    (...a) => ({
      ...createCanvasSlice(...a),
      ...createHistorySlice(...a),
      ...createSelectionSlice(...a),
      ...createEditorSlice(...a),
    }),
    {
      name: 'app-store',
    },
  ),
);
