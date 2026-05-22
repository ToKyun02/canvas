import { getNodeById } from '@/features/canvas/utils/selection';
import type * as fabric from 'fabric';
import type { Point } from './coords';

export function moveNodeOnCanvas(
  canvas: fabric.Canvas,
  nodeId: string,
  position: Point,
) {
  const object = getNodeById(canvas, nodeId);
  if (!object) return;

  object.set({ left: position.x, top: position.y });
  object.setCoords();
  canvas.requestRenderAll();
}
