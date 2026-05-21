import type * as fabric from 'fabric';
import type { BaseNodeState } from './base';
import type { TextNodeState } from './text';

export type CanvasNodeState = TextNodeState;

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
  stateFromFabricObject: (object: fabric.FabricObject) => CanvasNodeState;
  applyStateToFabricObject: (object: fabric.FabricObject, state: CanvasNodeState) => void;
  onPlaced?: (object: fabric.FabricObject, canvas: fabric.Canvas) => void;
}
