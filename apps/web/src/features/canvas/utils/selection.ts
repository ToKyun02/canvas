import type * as fabric from 'fabric';

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
  return canvas.getObjects().filter((object) => Boolean(getNodeId(object)));
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
