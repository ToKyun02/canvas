import { BaseNodeState, createNodeId, initialBaseNodeState } from '../base';
import type { NodePlacement } from '../types';

export interface TextNodeState extends BaseNodeState {
  type: 'text';
  text: string;
  fontSize: number;
  color: string | null;
  fill: string | null;
  stroke: string | null;
}

export const initialTextNodeState: TextNodeState = {
  ...initialBaseNodeState,
  text: 'text',
  type: 'text',
  label: 'text',
  fontSize: 24,
  color: '#111827',
  fill: 'transparent',
  stroke: null,
};

export function createTextNodeState(placement: NodePlacement): TextNodeState {
  return {
    ...initialTextNodeState,
    id: createNodeId(),
    position: { x: placement.x, y: placement.y },
    size: {
      width: placement.width ?? initialTextNodeState.size.width,
      height: placement.height ?? initialTextNodeState.size.height,
    },
  };
}
