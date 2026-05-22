import type { CanvasNodeState } from '@/stores/nodes/types';
import { StateCreator } from 'zustand';
import { AppState, NodesState } from '../types';

export const createNodesSlice: StateCreator<AppState, [], [], NodesState> = (set) => ({
  nodes: {},
  nodeOrder: [],

  addNode: (node) =>
    set((s) => {
      if (s.nodes[node.id]) return s;

      return {
        nodes: { ...s.nodes, [node.id]: node },
        nodeOrder: [...s.nodeOrder, node.id],
      };
    }),

  setNode: (node) =>
    set((s) => {
      const exists = Boolean(s.nodes[node.id]);

      return {
        nodes: { ...s.nodes, [node.id]: node },
        nodeOrder: exists ? s.nodeOrder : [...s.nodeOrder, node.id],
      };
    }),

  updateNode: (id, patch) =>
    set((s) => {
      const current = s.nodes[id];
      if (!current) return s;

      return {
        nodes: {
          ...s.nodes,
          [id]: { ...current, ...patch } as CanvasNodeState,
        },
      };
    }),

  removeNodes: (ids) =>
    set((s) => {
      if (ids.length === 0) return s;

      const idSet = new Set(ids);
      const nodes = { ...s.nodes };

      for (const id of ids) {
        delete nodes[id];
      }

      return {
        nodes,
        nodeOrder: s.nodeOrder.filter((nodeId) => !idSet.has(nodeId)),
      };
    }),
});
