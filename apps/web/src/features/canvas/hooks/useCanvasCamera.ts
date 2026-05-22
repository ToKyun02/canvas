import { isCanvasInteracting } from '@/features/canvas/utils/canvasSync';
import { zoomAtPoint } from '@/features/canvas/utils/zoomAtPoint';
import { useAppStore } from '@/stores';
import type * as fabric from 'fabric';
import { useEffect } from 'react';

export function useCanvasCamera(canvas: fabric.Canvas | null) {
  const position = useAppStore((s) => s.position);
  const zoom = useAppStore((s) => s.zoom);
  const panBy = useAppStore((s) => s.panBy);
  const setViewport = useAppStore((s) => s.setViewport);

  useEffect(() => {
    if (!canvas) return;

    canvas.setViewportTransform([zoom, 0, 0, zoom, position.x, position.y]);
    canvas.requestRenderAll();
  }, [canvas, position, zoom]);

  useEffect(() => {
    if (!canvas) return;

    const onWheel = (opt: fabric.TEvent<WheelEvent>) => {
      const e = opt.e;

      if (isCanvasInteracting(canvas)) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      const isMod = e.metaKey || e.ctrlKey;

      if (isMod) {
        const { zoom, position } = useAppStore.getState();
        const factor = e.deltaY > 0 ? 0.9 : 1.1;
        setViewport(zoomAtPoint(zoom, position, { x: e.offsetX, y: e.offsetY }, factor));
        return;
      }

      if (e.shiftKey) {
        panBy({ x: -e.deltaY, y: 0 });
      } else {
        panBy({ x: 0, y: -e.deltaY });
      }
    };

    canvas.on('mouse:wheel', onWheel);
    return () => {
      canvas.off('mouse:wheel', onWheel);
    };
  }, [canvas, panBy, setViewport]);
}
