import { resetMoveCursor, setDrawingCursor } from '@/features/canvas/utils/cursor';
import { useAppStore } from '@/stores';
import type { CanvasNodeState } from '@/stores/nodes/types';
import type { NodeDefinition } from '@/stores/nodes/types';
import type * as fabric from 'fabric';
import { Rect, type TPointerEventInfo } from 'fabric';

const DRAG_THRESHOLD = 5;
const MIN_DRAG_SIZE = 20;

type PlacementOptions = {
  onComplete?: () => void;
};

type MouseDownEvent = TPointerEventInfo & {
  alreadySelected: boolean;
};

type ScenePoint = {
  x: number;
  y: number;
};

type DrawingSession = {
  detach: () => void;
};

function createDrawingSession(
  canvas: fabric.Canvas,
  definition: NodeDefinition,
  handlers: {
    onMouseDown: (opt: MouseDownEvent) => void;
    onMouseMove: (opt: TPointerEventInfo) => void;
    onMouseUp: (opt: TPointerEventInfo) => void;
  },
): DrawingSession {
  let detached = false;

  const detach = () => {
    if (detached) return;
    detached = true;

    canvas.off('mouse:down', handlers.onMouseDown);
    canvas.off('mouse:move', handlers.onMouseMove);
    canvas.off('mouse:up', handlers.onMouseUp);
    resetMoveCursor(canvas);
  };

  setDrawingCursor(canvas, definition);
  canvas.on('mouse:down', handlers.onMouseDown);
  canvas.on('mouse:move', handlers.onMouseMove);
  canvas.on('mouse:up', handlers.onMouseUp);

  return { detach };
}

export function attachPlacement(
  canvas: fabric.Canvas,
  definition: NodeDefinition,
  { onComplete }: PlacementOptions = {},
): () => void {
  let startPoint: ScenePoint | null = null;
  let preview: Rect | null = null;
  let isDrawing = false;

  const cleanupPreview = () => {
    if (!preview) return;
    canvas.remove(preview);
    preview = null;
  };

  const finishPlacement = (
    placement: { x: number; y: number; width?: number; height?: number },
    detach: () => void,
  ) => {
    const state = definition.createState(placement);
    const object = definition.createFabricObject(state);

    canvas.add(object);
    useAppStore.getState().addNode(state as CanvasNodeState);
    isDrawing = false;
    startPoint = null;
    cleanupPreview();
    detach();
    onComplete?.();
    definition.onPlaced?.(object, canvas);
    canvas.requestRenderAll();
  };

  const onMouseDown = (opt: MouseDownEvent) => {
    if (opt.target) return;

    startPoint = { x: opt.scenePoint.x, y: opt.scenePoint.y };
    isDrawing = true;
  };

  const onMouseMove = (opt: TPointerEventInfo) => {
    if (!isDrawing || !startPoint) return;

    const current = { x: opt.scenePoint.x, y: opt.scenePoint.y };
    const width = Math.abs(current.x - startPoint.x);
    const height = Math.abs(current.y - startPoint.y);

    if (width < DRAG_THRESHOLD && height < DRAG_THRESHOLD) return;

    const left = Math.min(startPoint.x, current.x);
    const top = Math.min(startPoint.y, current.y);

    if (!preview) {
      preview = new Rect({
        left,
        top,
        width,
        height,
        fill: 'transparent',
        stroke: '#3b82f6',
        strokeDashArray: [4, 4],
        selectable: false,
        evented: false,
      });
      canvas.add(preview);
    } else {
      preview.set({ left, top, width, height });
    }

    canvas.requestRenderAll();
  };

  const onMouseUp = (opt: TPointerEventInfo) => {
    if (!isDrawing || !startPoint) return;

    const endPoint = { x: opt.scenePoint.x, y: opt.scenePoint.y };
    const dragWidth = Math.abs(endPoint.x - startPoint.x);
    const dragHeight = Math.abs(endPoint.y - startPoint.y);
    const isClick = dragWidth < DRAG_THRESHOLD && dragHeight < DRAG_THRESHOLD;

    if (isClick) {
      finishPlacement({ x: startPoint.x, y: startPoint.y }, session.detach);
      return;
    }

    finishPlacement(
      {
        x: Math.min(startPoint.x, endPoint.x),
        y: Math.min(startPoint.y, endPoint.y),
        width: Math.max(dragWidth, MIN_DRAG_SIZE),
        height: Math.max(dragHeight, MIN_DRAG_SIZE),
      },
      session.detach,
    );
  };

  const session = createDrawingSession(canvas, definition, {
    onMouseDown,
    onMouseMove,
    onMouseUp,
  });

  return () => {
    cleanupPreview();
    session.detach();
    startPoint = null;
    isDrawing = false;
  };
}

export function attachDragPlacement(
  canvas: fabric.Canvas,
  definition: NodeDefinition,
  { onComplete }: PlacementOptions = {},
): () => void {
  let startPoint: ScenePoint | null = null;
  let preview: Rect | null = null;
  let isDrawing = false;

  const cleanupPreview = () => {
    if (!preview) return;
    canvas.remove(preview);
    preview = null;
  };

  const onMouseDown = (opt: MouseDownEvent) => {
    if (opt.target) return;

    startPoint = { x: opt.scenePoint.x, y: opt.scenePoint.y };
    isDrawing = true;
  };

  const onMouseMove = (opt: TPointerEventInfo) => {
    if (!isDrawing || !startPoint) return;

    const current = { x: opt.scenePoint.x, y: opt.scenePoint.y };
    const left = Math.min(startPoint.x, current.x);
    const top = Math.min(startPoint.y, current.y);
    const width = Math.abs(current.x - startPoint.x);
    const height = Math.abs(current.y - startPoint.y);

    if (!preview) {
      preview = new Rect({
        left,
        top,
        width,
        height,
        fill: 'transparent',
        stroke: '#3b82f6',
        strokeDashArray: [4, 4],
        selectable: false,
        evented: false,
      });
      canvas.add(preview);
    } else {
      preview.set({ left, top, width, height });
    }

    canvas.requestRenderAll();
  };

  const onMouseUp = (opt: TPointerEventInfo) => {
    if (!isDrawing || !startPoint) return;

    const origin = startPoint;
    const endPoint = { x: opt.scenePoint.x, y: opt.scenePoint.y };
    const dragWidth = Math.abs(endPoint.x - origin.x);
    const dragHeight = Math.abs(endPoint.y - origin.y);

    isDrawing = false;
    startPoint = null;

    if (dragWidth < DRAG_THRESHOLD && dragHeight < DRAG_THRESHOLD) {
      cleanupPreview();
      return;
    }

    cleanupPreview();

    const state = definition.createState({
      x: Math.min(origin.x, endPoint.x),
      y: Math.min(origin.y, endPoint.y),
      width: Math.max(dragWidth, MIN_DRAG_SIZE),
      height: Math.max(dragHeight, MIN_DRAG_SIZE),
    });
    const object = definition.createFabricObject(state);

    canvas.add(object);
    useAppStore.getState().addNode(state as CanvasNodeState);
    session.detach();
    onComplete?.();
    definition.onPlaced?.(object, canvas);
    canvas.requestRenderAll();
  };

  const session = createDrawingSession(canvas, definition, {
    onMouseDown,
    onMouseMove,
    onMouseUp,
  });

  return () => {
    cleanupPreview();
    session.detach();
    startPoint = null;
    isDrawing = false;
  };
}
