import { isCanvasInteracting, markCanvasSyncEnd, markCanvasSyncStart } from '@/features/canvas/utils/canvasSync';
import {
  findObjectsByIds,
  getNodeObjects,
  getSelectedNodeIds,
  setsEqual,
} from '@/features/canvas/utils/selection';
import { useAppStore } from '@/stores';
import { configureNodeTransform } from '@/stores/nodes/fabric';
import type * as fabric from 'fabric';
import { ActiveSelection } from 'fabric';
import { useEffect, useRef } from 'react';

const SELECT_ALL = '__all__';

function createActiveSelection(objects: fabric.FabricObject[]) {
  const selection = new ActiveSelection(objects);
  configureNodeTransform(selection);
  return selection;
}

function isSameActiveSelection(canvas: fabric.Canvas, selectedIds: string[]) {
  const activeObject = canvas.getActiveObject();

  if (!(activeObject instanceof ActiveSelection) || selectedIds.length <= 1) {
    return false;
  }

  return setsEqual(getSelectedNodeIds(canvas), selectedIds);
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

    canvas.setActiveObject(createActiveSelection(objects));
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

  if (isSameActiveSelection(canvas, selectedIds)) {
    configureNodeTransform(canvas.getActiveObject()!);
    return;
  }

  canvas.setActiveObject(createActiveSelection(objects));
}

export function useCanvasSelection(canvas: fabric.Canvas | null) {
  const selectedIds = useAppStore((s) => s.selectedIds);
  const deleteSelectionRequest = useAppStore((s) => s.deleteSelectionRequest);
  const syncingFromCanvasRef = useRef(false);

  useEffect(() => {
    if (!canvas) return;

    const syncToStore = () => {
      markCanvasSyncStart(syncingFromCanvasRef);
      useAppStore.getState().setSelectedIds(getSelectedNodeIds(canvas));
      markCanvasSyncEnd(syncingFromCanvasRef);
    };

    canvas.on('selection:created', syncToStore);
    canvas.on('selection:updated', syncToStore);
    canvas.on('selection:cleared', syncToStore);

    return () => {
      canvas.off('selection:created', syncToStore);
      canvas.off('selection:updated', syncToStore);
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
