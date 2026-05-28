import {
  blockWheelDefault,
  getWheelAnchorFromCanvas,
  handleViewportWheel,
  hasEditableFocus,
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
      blockWheelDefault(e);

      if (hasEditableFocus() && (e.metaKey || e.ctrlKey)) {
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
    };

    window.addEventListener('wheel', onWheel, { passive: false, capture: true });
    return () => window.removeEventListener('wheel', onWheel, { capture: true });
  }, [canvas, canvasContainerRef]);
}
