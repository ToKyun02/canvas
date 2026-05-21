import type * as fabric from 'fabric';
import type { BaseNodeState } from './base';

export type NodePlacement = {
  x: number;
  y: number;
  width?: number;
  height?: number;
};

export type DrawingMode = 'click-or-drag' | 'drag';

export interface NodeDefinition {
  type: string;
  tool: string;
  label: string;
  shortcut?: string;
  icon?: string;
  cursor?: string;
  drawingMode: DrawingMode;
  createState: (placement: NodePlacement) => BaseNodeState;
  createFabricObject: (state: BaseNodeState) => fabric.FabricObject;
  onPlaced?: (object: fabric.FabricObject, canvas: fabric.Canvas) => void;
}
