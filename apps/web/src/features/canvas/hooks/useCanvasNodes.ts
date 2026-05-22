import { applyNodeStateToCanvas, stateFromFabricObject } from '@/features/canvas/utils/nodes';
import { isCanvasInteracting, markCanvasSyncEnd, markCanvasSyncStart } from '@/features/canvas/utils/canvasSync';
import { normalizeTextboxScalesInTarget } from '@/features/canvas/utils/textboxScaling';
import { getNodeId } from '@/features/canvas/utils/selection';
import { getObjectTopLeft } from '@/stores/nodes/fabric';
import type { CanvasNodeState } from '@/stores/nodes/types';
import { useAppStore } from '@/stores';
import { ActiveSelection, type FabricObject } from 'fabric';
import type * as fabric from 'fabric';
import { useEffect, useRef } from 'react';

function syncObjectToStore(object: fabric.FabricObject) {
  const state = stateFromFabricObject(object);
  if (!state) return;

  const existing = useAppStore.getState().nodes[state.id];
  if (existing) {
    useAppStore.getState().setNode({
      ...state,
      label: existing.label,
    });
    return;
  }

  useAppStore.getState().setNode(state);
}

function syncPositionToStore(object: fabric.FabricObject) {
  const id = getNodeId(object);
  if (!id) return;

  const { x, y } = getObjectTopLeft(object);
  const existing = useAppStore.getState().nodes[id];
  if (!existing) return;

  if (existing.position.x === x && existing.position.y === y) return;

  useAppStore.getState().updateNode(id, { position: { x, y } });
}

function syncTargetToStore(target: FabricObject) {
  if (target instanceof ActiveSelection) {
    for (const object of target.getObjects()) {
      syncObjectToStore(object);
    }
    return;
  }

  syncObjectToStore(target);
}

function syncTargetPositionToStore(target: FabricObject) {
  if (target instanceof ActiveSelection) {
    target.setCoords();
    for (const object of target.getObjects()) {
      syncPositionToStore(object);
    }
    return;
  }

  syncPositionToStore(target);
}

function fabricNodeMatchesStore(fabricNode: CanvasNodeState, storeNode: CanvasNodeState) {
  const { label: _fl, ...fabricRest } = fabricNode;
  const { label: _sl, ...storeRest } = storeNode;
  return JSON.stringify(fabricRest) === JSON.stringify(storeRest);
}

function getActiveSelectionNodeIds(canvas: fabric.Canvas) {
  const activeObject = canvas.getActiveObject();

  if (!(activeObject instanceof ActiveSelection)) {
    return null;
  }

  return new Set(
    activeObject
      .getObjects()
      .map(getNodeId)
      .filter((id): id is string => Boolean(id)),
  );
}

export function useCanvasNodes(canvas: fabric.Canvas | null) {
  const nodes = useAppStore((s) => s.nodes);
  const nodeOrder = useAppStore((s) => s.nodeOrder);
  const syncingFromCanvasRef = useRef(false);

  useEffect(() => {
    if (!canvas) return;

    const onMoving = (event: { target?: fabric.FabricObject }) => {
      if (!event.target) return;

      markCanvasSyncStart(syncingFromCanvasRef);
      syncTargetPositionToStore(event.target);
      markCanvasSyncEnd(syncingFromCanvasRef);
    };

    const onResizing = (event: { target?: fabric.FabricObject }) => {
      if (!event.target) return;

      markCanvasSyncStart(syncingFromCanvasRef);
      syncTargetPositionToStore(event.target);
      markCanvasSyncEnd(syncingFromCanvasRef);
    };

    const onModified = (event: { target?: fabric.FabricObject }) => {
      if (!event.target) return;

      if (normalizeTextboxScalesInTarget(event.target)) {
        event.target.canvas?.requestRenderAll();
      }

      markCanvasSyncStart(syncingFromCanvasRef);
      syncTargetToStore(event.target);
      markCanvasSyncEnd(syncingFromCanvasRef);
    };

    const onScaling = (event: { target?: fabric.FabricObject }) => {
      if (!event.target) return;

      if (normalizeTextboxScalesInTarget(event.target)) {
        event.target.canvas?.requestRenderAll();
      }
    };

    const onRemoved = (event: { target?: fabric.FabricObject }) => {
      const id = event.target ? getNodeId(event.target) : undefined;
      if (!id) return;

      markCanvasSyncStart(syncingFromCanvasRef);
      useAppStore.getState().removeNodes([id]);
      markCanvasSyncEnd(syncingFromCanvasRef);
    };

    const onTransformStart = () => {
      markCanvasSyncStart(syncingFromCanvasRef);
    };

    const onTransformEnd = () => {
      markCanvasSyncEnd(syncingFromCanvasRef);
    };

    canvas.on('object:moving', onMoving);
    canvas.on('object:resizing', onResizing);
    canvas.on('object:modified', onModified);
    canvas.on('object:scaling', onScaling);
    canvas.on('text:changed', onModified);
    canvas.on('object:removed', onRemoved);
    canvas.on('mouse:down:before', onTransformStart);
    canvas.on('mouse:up', onTransformEnd);

    return () => {
      canvas.off('object:moving', onMoving);
      canvas.off('object:resizing', onResizing);
      canvas.off('object:modified', onModified);
      canvas.off('object:scaling', onScaling);
      canvas.off('text:changed', onModified);
      canvas.off('object:removed', onRemoved);
      canvas.off('mouse:down:before', onTransformStart);
      canvas.off('mouse:up', onTransformEnd);
    };
  }, [canvas]);

  useEffect(() => {
    if (!canvas || syncingFromCanvasRef.current || isCanvasInteracting(canvas)) return;

    const activeSelectionIds = getActiveSelectionNodeIds(canvas);

    for (const id of nodeOrder) {
      if (activeSelectionIds?.has(id)) continue;

      const storeNode = nodes[id];
      if (!storeNode) continue;

      const object = canvas.getObjects().find((candidate) => getNodeId(candidate) === id);
      if (!object) continue;

      const fabricNode = stateFromFabricObject(object);
      if (!fabricNode || fabricNodeMatchesStore(fabricNode, storeNode)) continue;

      applyNodeStateToCanvas(canvas, storeNode);
    }
  }, [canvas, nodeOrder, nodes]);
}
