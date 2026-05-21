import { arraysEqual, findObjectsByIds, getNodeObjects, getSelectedNodeIds } from '@/features/canvas/utils/selection';
import { useAppStore } from '@/stores';
import type * as fabric from 'fabric';
import { ActiveSelection } from 'fabric';
import { useEffect, useRef } from 'react';

const SELECT_ALL = '__all__';

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
      canvas.setActiveObject(objects[0]!);
      return;
    }

    canvas.setActiveObject(new ActiveSelection(objects));
    return;
  }

  const objects = findObjectsByIds(canvas, selectedIds);

  if (objects.length === 0) {
    canvas.discardActiveObject();
    return;
  }

  if (objects.length === 1) {
    canvas.setActiveObject(objects[0]!);
    return;
  }

  canvas.setActiveObject(new ActiveSelection(objects));
}

export function useCanvasSelection(canvas: fabric.Canvas | null) {
  const selectedIds = useAppStore((s) => s.selectedIds);
  const deleteSelectionRequest = useAppStore((s) => s.deleteSelectionRequest);
  const syncingFromCanvasRef = useRef(false);

  useEffect(() => {
    if (!canvas) return;

    const syncToStore = () => {
      syncingFromCanvasRef.current = true;
      useAppStore.getState().setSelectedIds(getSelectedNodeIds(canvas));
      syncingFromCanvasRef.current = false;
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
    if (!canvas || syncingFromCanvasRef.current) return;

    const canvasIds = getSelectedNodeIds(canvas);

    if (selectedIds.length === 1 && selectedIds[0] === SELECT_ALL) {
      applySelectionToCanvas(canvas, selectedIds);
      useAppStore.getState().setSelectedIds(getSelectedNodeIds(canvas));
      canvas.requestRenderAll();
      return;
    }

    if (arraysEqual(canvasIds, selectedIds)) return;

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
