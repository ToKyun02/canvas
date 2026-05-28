import { resetMoveCursor, setDrawingCursor } from '@/features/canvas/utils/cursor';
import { useAppStore } from '@/stores';
import { configureNodeTransform } from '@/stores/nodes/fabric';
import type { CanvasNodeState, NodeDefinition } from '@/stores/nodes/types';
import type * as fabric from 'fabric';
import { type TPointerEventInfo } from 'fabric';

type PlacementOptions = {
  onComplete?: () => void;
};

type MouseDownEvent = TPointerEventInfo & {
  alreadySelected: boolean;
};

function createDrawingSession(
  canvas: fabric.Canvas,
  definition: NodeDefinition,
  onMouseDown: (opt: MouseDownEvent) => void,
): () => void {
  let detached = false;

  const detach = () => {
    if (detached) return;
    detached = true;

    canvas.off('mouse:down', onMouseDown);
    resetMoveCursor(canvas);
  };

  setDrawingCursor(canvas, definition);
  canvas.on('mouse:down', onMouseDown);

  return detach;
}

export function attachPlacement(
  canvas: fabric.Canvas,
  definition: NodeDefinition,
  { onComplete }: PlacementOptions = {},
): () => void {
  const finishPlacement = (placement: { x: number; y: number }, detach: () => void) => {
    const state = definition.createState(placement);
    const object = definition.createFabricObject(state);
    configureNodeTransform(object);

    canvas.add(object);
    useAppStore.getState().addNode(state as CanvasNodeState);
    detach();
    onComplete?.();
    definition.onPlaced?.(object, canvas);
  };

  let detach: () => void;

  const onMouseDown = (opt: MouseDownEvent) => {
    if (opt.target) return;

    finishPlacement({ x: opt.scenePoint.x, y: opt.scenePoint.y }, detach);
  };

  detach = createDrawingSession(canvas, definition, onMouseDown);

  return detach;
}
