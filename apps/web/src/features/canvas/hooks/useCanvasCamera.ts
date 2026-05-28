import { useAppStore } from '@/stores';
import type * as fabric from 'fabric';
import { useEffect } from 'react';

export function useCanvasCamera(canvas: fabric.Canvas | null) {
  const position = useAppStore((s) => s.position);
  const zoom = useAppStore((s) => s.zoom);

  useEffect(() => {
    if (!canvas) return;

    canvas.setViewportTransform([zoom, 0, 0, zoom, position.x, position.y]);
  }, [canvas, position, zoom]);
}
