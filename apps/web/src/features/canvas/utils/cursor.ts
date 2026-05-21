import type { NodeDefinition } from '@/stores/nodes/types';
import type * as fabric from 'fabric';

export function setDrawingCursor(canvas: fabric.Canvas, definition: NodeDefinition) {
  canvas.selection = false;
  canvas.defaultCursor = definition.cursor ?? 'crosshair';
  canvas.setCursor(canvas.defaultCursor);
}

export function resetMoveCursor(canvas: fabric.Canvas) {
  canvas.selection = true;
  canvas.defaultCursor = 'default';
  canvas.setCursor('default');
}
