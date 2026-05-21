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
  const idSet = new Set(ids);
  return getNodeObjects(canvas).filter((object) => {
    const id = getNodeId(object);
    return id ? idSet.has(id) : false;
  });
}

export function arraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((value, index) => value === b[index]);
}
