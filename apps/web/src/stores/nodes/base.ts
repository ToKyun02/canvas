export interface BaseNodeState {
  id: string;
  label: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
  visibility: boolean;
  locked: boolean;
  opacity: number;
}

export function createNodeId() {
  return crypto.randomUUID();
}

export const initialBaseNodeState: BaseNodeState = {
  id: '',
  label: 'node',
  type: '',
  position: { x: 0, y: 0 },
  size: { width: 100, height: 100 },
  visibility: true,
  locked: false,
  opacity: 1,
};
