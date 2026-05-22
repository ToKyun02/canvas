import { isCanvasInteracting, markCanvasSyncEnd, markCanvasSyncStart } from '@/features/canvas/utils/canvasSync';
import {
  findObjectsByIds,
  getNodeObjects,
  getSelectedNodeIds,
  isSameSelectionMembers,
  setsEqual,
  sortObjectsByNodeOrder,
} from '@/features/canvas/utils/selection';
import { useAppStore } from '@/stores';
import { configureNodeTransform } from '@/stores/nodes/fabric';
import type * as fabric from 'fabric';
import { ActiveSelection } from 'fabric';
import { useEffect, useRef } from 'react';

const SELECT_ALL = '__all__';

function buildActiveSelection(canvas: fabric.Canvas, objects: fabric.FabricObject[]) {
  const nodeOrder = useAppStore.getState().nodeOrder;
  const ordered = sortObjectsByNodeOrder(objects, nodeOrder);
  const selection = new ActiveSelection(ordered, { canvas });
  configureNodeTransform(selection);
  selection.setCoords();
  return selection;
}

function setMultiSelection(canvas: fabric.Canvas, objects: fabric.FabricObject[]) {
  const nodeOrder = useAppStore.getState().nodeOrder;
  const ordered = sortObjectsByNodeOrder(objects, nodeOrder);
  const activeObject = canvas.getActiveObject();

  if (
    activeObject instanceof ActiveSelection &&
    isSameSelectionMembers(activeObject, ordered)
  ) {
    configureNodeTransform(activeObject);
    activeObject.setCoords();
    return;
  }

  canvas.setActiveObject(buildActiveSelection(canvas, objects));
}

function applySelectionToCanvas(canvas: fabric.Canvas, selectedIds: string[]) {
  if (selectedIds.length === 0) {
    canvas.discardActiveObject();
    return;
  }

  if (selectedIds.length === 1 && selectedIds[0] === SELECT_ALL) {
    const objects = getNodeObjects(canvas);

    if (objects.length === 0) {
      canvas.discardActiveObject();
      return;
    }

    if (objects.length === 1) {
      const object = objects[0]!;
      configureNodeTransform(object);
      canvas.setActiveObject(object);
      return;
    }

    setMultiSelection(canvas, objects);
    return;
  }

  const objects = findObjectsByIds(canvas, selectedIds);

  if (objects.length === 0) {
    canvas.discardActiveObject();
    return;
  }

  if (objects.length === 1) {
    const object = objects[0]!;
    const activeObject = canvas.getActiveObject();

    if (activeObject === object) {
      configureNodeTransform(object);
      return;
    }

    configureNodeTransform(object);
    canvas.setActiveObject(object);
    return;
  }

  setMultiSelection(canvas, objects);
}

export function useCanvasSelection(canvas: fabric.Canvas | null) {
  const selectedIds = useAppStore((s) => s.selectedIds);
  const deleteSelectionRequest = useAppStore((s) => s.deleteSelectionRequest);
  const syncingFromCanvasRef = useRef(false);

  useEffect(() => {
    if (!canvas) return;

    const syncSelectionFromCanvas = () => {
      markCanvasSyncStart(syncingFromCanvasRef);

      const ids = getSelectedNodeIds(canvas);

      if (ids.length > 1) {
        const objects = findObjectsByIds(canvas, ids);
        if (objects.length > 1) {
          setMultiSelection(canvas, objects);
        }
      }

      useAppStore.getState().setSelectedIds(getSelectedNodeIds(canvas));
      markCanvasSyncEnd(syncingFromCanvasRef);
      canvas.requestRenderAll();
    };

    const syncToStore = () => {
      markCanvasSyncStart(syncingFromCanvasRef);
      useAppStore.getState().setSelectedIds(getSelectedNodeIds(canvas));
      markCanvasSyncEnd(syncingFromCanvasRef);
    };

    canvas.on('selection:created', syncSelectionFromCanvas);
    canvas.on('selection:updated', syncSelectionFromCanvas);
    canvas.on('selection:cleared', syncToStore);

    return () => {
      canvas.off('selection:created', syncSelectionFromCanvas);
      canvas.off('selection:updated', syncSelectionFromCanvas);
      canvas.off('selection:cleared', syncToStore);
    };
  }, [canvas]);

  useEffect(() => {
    if (!canvas || syncingFromCanvasRef.current || isCanvasInteracting(canvas)) return;

    const canvasIds = getSelectedNodeIds(canvas);

    if (selectedIds.length === 1 && selectedIds[0] === SELECT_ALL) {
      applySelectionToCanvas(canvas, selectedIds);
      markCanvasSyncStart(syncingFromCanvasRef);
      useAppStore.getState().setSelectedIds(getSelectedNodeIds(canvas));
      markCanvasSyncEnd(syncingFromCanvasRef);
      canvas.requestRenderAll();
      return;
    }

    if (setsEqual(canvasIds, selectedIds)) return;

    applySelectionToCanvas(canvas, selectedIds);
    canvas.requestRenderAll();
  }, [canvas, selectedIds]);

  useEffect(() => {
    if (!canvas || deleteSelectionRequest === 0) return;

    const ids = useAppStore.getState().selectedIds;
    const objects = findObjectsByIds(canvas, ids);

    if (objects.length > 0) {
      canvas.remove(...objects);
    }

    canvas.discardActiveObject();
    useAppStore.getState().setSelectedIds([]);
    canvas.requestRenderAll();
  }, [canvas, deleteSelectionRequest]);
}
