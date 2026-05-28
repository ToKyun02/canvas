import { isCanvasInteracting } from '@/features/canvas/utils/canvasSync';
import { zoomAtPoint } from '@/features/canvas/utils/zoomAtPoint';
import { useAppStore } from '@/stores';
import type * as fabric from 'fabric';

type Point = { x: number; y: number };

const EDITABLE_SELECTOR = 'input, textarea, select, [contenteditable="true"]';

export function hasEditableFocus() {
  return document.activeElement instanceof Element && document.activeElement.matches(EDITABLE_SELECTOR);
}

export function getWheelAnchorFromCanvas(e: WheelEvent, canvasEl: HTMLCanvasElement | null): Point {
  if (!canvasEl) {
    return { x: 0, y: 0 };
  }

  const rect = canvasEl.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
}

export function blockWheelDefault(e: WheelEvent) {
  e.preventDefault();
  e.stopPropagation();
}

export function handleViewportWheel(e: WheelEvent, anchor: Point, options?: { canvas?: fabric.Canvas | null }) {
  if (options?.canvas && isCanvasInteracting(options.canvas)) {
    return;
  }

  const { panBy, setViewport } = useAppStore.getState();
  const isMod = e.metaKey || e.ctrlKey;

  if (isMod) {
    const { zoom, position } = useAppStore.getState();
    const factor = e.deltaY > 0 ? 0.9 : 1.1;
    setViewport(zoomAtPoint(zoom, position, anchor, factor));
    return;
  }

  if (e.shiftKey) {
    panBy({ x: -e.deltaY, y: 0 });
  } else {
    panBy({ x: 0, y: -e.deltaY });
  }
}
