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

  if (activeObject instanceof ActiveSelection && isSameSelectionMembers(activeObject, ordered)) {
    configureNodeTransform(activeObject);
    activeObject.setCoords();
    return;
  }

  canvas.setActiveObject(buildActiveSelection(canvas, objects));
}

function applySelectionToCanvas(canvas: fabric.Canvas, selectedIds: string[]) {
  // [] — clearSelection / Esc: 선택 박스 제거
  if (selectedIds.length === 0) {
    canvas.discardActiveObject();
    return;
  }

  // ['__all__'] — Cmd+A 전체 선택: id 목록 없이 캔버스에 있는 노드 전부
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

  // 스토어 id에 해당하는 Fabric 객체가 없음(아직 미배치 등)
  if (objects.length === 0) {
    canvas.discardActiveObject();
    return;
  }

  // 단일 id — 라벨·노드 하나 선택 시
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

  // 다중 id — nodeOrder 순 ActiveSelection
  setMultiSelection(canvas, objects);
}

export function useCanvasSelection(canvas: fabric.Canvas | null) {
  const selectedIds = useAppStore((s) => s.selectedIds);
  const deleteSelectionRequest = useAppStore((s) => s.deleteSelectionRequest);
  const syncingFromCanvasRef = useRef(false);

  // [캔버스 → 스토어] 사용자가 Fabric 위에서 선택할 때만 동작.
  // 예시 : 캔버스 내 노드 클릭, 드래그로 멀티 선택
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

  // [스토어 → 캔버스] 캔버스 밖에서 `selectedIds`가 바뀔 때 Fabric selection을 맞춤.
  // 대표 예시 : 노드 라벨 클릭, 단축키를 통한 노드 선택
  // 스킵 조건:
  // `syncingFromCanvasRef`: 캔버스가 동기화 중인 경우
  // `isCanvasInteracting`: 드래그/리사이즈 중(_currentTransform) 덮어쓰기 방지
  // `setsEqual(canvasIds, selectedIds)`: 이미 같은 집합이면 pass
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

  // [삭제] 단축키 Delete/Backspace → `deleteSelection()` 전용.
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
