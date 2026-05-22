import { isCanvasInteracting } from '@/features/canvas/utils/canvasSync';
import { zoomAtPoint } from '@/features/canvas/utils/zoomAtPoint';
import { useAppStore } from '@/stores';
import type * as fabric from 'fabric';

type Point = { x: number; y: number };

const EDITABLE_SELECTOR = 'input, textarea, select, [contenteditable="true"]';

function isEditableElement(element: Element | null) {
  return Boolean(element?.closest(EDITABLE_SELECTOR));
}

export function isEditableWheelTarget(target: EventTarget | null) {
  return target instanceof Element && isEditableElement(target);
}

export function hasEditableFocus() {
  return isEditableElement(document.activeElement);
}

export function isEditableWheelContext(target: EventTarget | null) {
  return isEditableWheelTarget(target) || hasEditableFocus();
}

export function shouldAllowNativeWheelScroll(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return Boolean(target.closest('[data-allow-native-scroll]'));
}

export function canEditableElementScroll(target: EventTarget | null, e: WheelEvent) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const scrollable = target.closest('textarea, [data-allow-native-scroll]');
  if (!(scrollable instanceof HTMLElement)) {
    return false;
  }

  if (scrollable.scrollHeight <= scrollable.clientHeight) {
    return false;
  }

  if (e.deltaY > 0) {
    return scrollable.scrollTop + scrollable.clientHeight < scrollable.scrollHeight;
  }

  if (e.deltaY < 0) {
    return scrollable.scrollTop > 0;
  }

  return false;
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

export function handleViewportWheel(
  e: WheelEvent,
  anchor: Point,
  options?: { canvas?: fabric.Canvas | null },
) {
  if (options?.canvas && isCanvasInteracting(options.canvas)) {
    return;
  }

  e.preventDefault();
  e.stopPropagation();

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
