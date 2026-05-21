import { applyNodeStateToCanvas, stateFromFabricObject } from '@/features/canvas/utils/nodes';
import { getNodeId } from '@/features/canvas/utils/selection';
import { useAppStore } from '@/stores';
import type * as fabric from 'fabric';
import { useEffect, useRef } from 'react';

function syncObjectToStore(object: fabric.FabricObject) {
  const state = stateFromFabricObject(object);
  if (!state) return;

  useAppStore.getState().setNode(state);
}

function nodesEqual(a: unknown, b: unknown) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function useCanvasNodes(canvas: fabric.Canvas | null) {
  const nodes = useAppStore((s) => s.nodes);
  const nodeOrder = useAppStore((s) => s.nodeOrder);
  const syncingFromCanvasRef = useRef(false);

  useEffect(() => {
    if (!canvas) return;

    const onModified = (event: { target?: fabric.FabricObject }) => {
      if (!event.target) return;
      syncingFromCanvasRef.current = true;
      syncObjectToStore(event.target);
      syncingFromCanvasRef.current = false;
    };

    const onRemoved = (event: { target?: fabric.FabricObject }) => {
      const id = event.target ? getNodeId(event.target) : undefined;
      if (!id) return;

      syncingFromCanvasRef.current = true;
      useAppStore.getState().removeNodes([id]);
      syncingFromCanvasRef.current = false;
    };

    canvas.on('object:modified', onModified);
    canvas.on('text:changed', onModified);
    canvas.on('object:removed', onRemoved);

    return () => {
      canvas.off('object:modified', onModified);
      canvas.off('text:changed', onModified);
      canvas.off('object:removed', onRemoved);
    };
  }, [canvas]);

  useEffect(() => {
    if (!canvas || syncingFromCanvasRef.current) return;

    for (const id of nodeOrder) {
      const storeNode = nodes[id];
      if (!storeNode) continue;

      const object = canvas.getObjects().find((candidate) => getNodeId(candidate) === id);
      if (!object) continue;

      const fabricNode = stateFromFabricObject(object);
      if (!fabricNode || nodesEqual(fabricNode, storeNode)) continue;

      applyNodeStateToCanvas(canvas, storeNode);
    }
  }, [canvas, nodeOrder, nodes]);
}
