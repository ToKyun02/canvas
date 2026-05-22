import type * as fabric from 'fabric';
import type { MutableRefObject } from 'react';

type TransformingCanvas = fabric.Canvas & {
  _currentTransform?: unknown;
};

export function markCanvasSyncStart(ref: MutableRefObject<boolean>) {
  ref.current = true;
}

export function markCanvasSyncEnd(ref: MutableRefObject<boolean>) {
  queueMicrotask(() => {
    ref.current = false;
  });
}

export function isCanvasInteracting(canvas: fabric.Canvas) {
  return Boolean((canvas as TransformingCanvas)._currentTransform);
}
