import {
  blockWheelDefault,
  canEditableElementScroll,
  getWheelAnchorFromCanvas,
  handleViewportWheel,
  isEditableWheelContext,
  isEditableWheelTarget,
  shouldAllowNativeWheelScroll,
} from '@/features/canvas/utils/handleViewportWheel';
import type * as fabric from 'fabric';
import { useEffect, type RefObject } from 'react';

type UseCanvasViewportWheelOptions = {
  canvasContainerRef: RefObject<HTMLElement | null>;
  canvas: fabric.Canvas | null;
};

export function useCanvasViewportWheel({ canvasContainerRef, canvas }: UseCanvasViewportWheelOptions) {
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (shouldAllowNativeWheelScroll(e.target)) {
        return;
      }

      if (isEditableWheelContext(e.target) && (e.metaKey || e.ctrlKey)) {
        blockWheelDefault(e);
        return;
      }

      if (isEditableWheelTarget(e.target)) {
        if (canEditableElementScroll(e.target, e)) {
          return;
        }

        blockWheelDefault(e);
        return;
      }

      const canvasContainer = canvasContainerRef.current;
      const isOnCanvas = canvasContainer?.contains(e.target as Node) ?? false;

      if (isOnCanvas) {
        const canvasEl = canvas?.getElement() ?? null;
        const anchor = getWheelAnchorFromCanvas(e, canvasEl);
        handleViewportWheel(e, anchor, { canvas });
        return;
      }

      blockWheelDefault(e);
    };

    window.addEventListener('wheel', onWheel, { passive: false, capture: true });
    return () => window.removeEventListener('wheel', onWheel, { capture: true });
  }, [canvas, canvasContainerRef]);
}
