import type * as fabric from 'fabric';
import { ActiveSelection } from 'fabric';

type NodeData = {
  nodeId?: string;
  nodeType?: string;
};
type NodeFabricObject = fabric.FabricObject & {
  data?: NodeData;
};

export function getNodeById(canvas: fabric.Canvas, id: string) {
  return findObjectsByIds(canvas, [id])[0];
}

export function getNodeId(object: fabric.FabricObject): string | undefined {
  return (object as NodeFabricObject).data?.nodeId;
}

export function getSelectedNodeIds(canvas: fabric.Canvas): string[] {
  return canvas
    .getActiveObjects()
    .map(getNodeId)
    .filter((id): id is string => Boolean(id));
}

export function getNodeObjects(canvas: fabric.Canvas): fabric.FabricObject[] {
  const nodes: fabric.FabricObject[] = [];

  for (const object of canvas.getObjects()) {
    const id = getNodeId(object);
    if (id) {
      nodes.push(object);
      continue;
    }

    if (object instanceof ActiveSelection) {
      for (const child of object.getObjects()) {
        if (getNodeId(child)) {
          nodes.push(child);
        }
      }
    }
  }

  return nodes;
}

export function sortObjectsByNodeOrder(
  objects: fabric.FabricObject[],
  nodeOrder: string[],
) {
  const index = new Map(nodeOrder.map((id, i) => [id, i]));

  return [...objects].sort((a, b) => {
    const ai = index.get(getNodeId(a) ?? '') ?? Number.MAX_SAFE_INTEGER;
    const bi = index.get(getNodeId(b) ?? '') ?? Number.MAX_SAFE_INTEGER;
    return ai - bi;
  });
}

export function isSameSelectionMembers(
  selection: ActiveSelection,
  objects: fabric.FabricObject[],
) {
  const current = selection.getObjects();
  if (current.length !== objects.length) return false;
  return current.every((object, index) => object === objects[index]);
}

export function findObjectsByIds(canvas: fabric.Canvas, ids: string[]): fabric.FabricObject[] {
  const byId = new Map<string, fabric.FabricObject>();

  for (const object of getNodeObjects(canvas)) {
    const id = getNodeId(object);
    if (id) {
      byId.set(id, object);
    }
  }

  return ids.flatMap((id) => {
    const object = byId.get(id);
    return object ? [object] : [];
  });
}

export function arraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((value, index) => value === b[index]);
}

export function setsEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;

  const setB = new Set(b);
  return a.every((value) => setB.has(value));
}
