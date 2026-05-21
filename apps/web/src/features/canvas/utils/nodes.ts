import { getNodeId } from '@/features/canvas/utils/selection';
import { getNodeDefinitionByType } from '@/stores/nodes/registry';
import type { CanvasNodeState } from '@/stores/nodes/types';
import type * as fabric from 'fabric';

type NodeData = {
  nodeId?: string;
  nodeType?: string;
};

type NodeFabricObject = fabric.FabricObject & {
  data?: NodeData;
};

export function getNodeType(object: fabric.FabricObject): string | undefined {
  return (object as NodeFabricObject).data?.nodeType;
}

export function stateFromFabricObject(object: fabric.FabricObject): CanvasNodeState | null {
  const nodeType = getNodeType(object);
  if (!nodeType) return null;

  const definition = getNodeDefinitionByType(nodeType);
  if (!definition) return null;

  return definition.stateFromFabricObject(object);
}

export function applyStateToFabricObject(object: fabric.FabricObject, state: CanvasNodeState) {
  const definition = getNodeDefinitionByType(state.type);
  if (!definition) return;

  definition.applyStateToFabricObject(object, state);
  object.setCoords();
}

export function applyNodeStateToCanvas(canvas: fabric.Canvas, state: CanvasNodeState) {
  const object = canvas.getObjects().find((candidate) => getNodeId(candidate) === state.id);
  if (!object) return;

  applyStateToFabricObject(object, state);
  canvas.requestRenderAll();
}
