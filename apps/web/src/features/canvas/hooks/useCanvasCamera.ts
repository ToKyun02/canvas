import { useAppStore } from '@/stores';
import type * as fabric from 'fabric';
import { Point } from 'fabric';
import { useEffect } from 'react';

export function useCanvasCamera(canvas: fabric.Canvas | null) {
  const position = useAppStore((s) => s.position);
  const zoom = useAppStore((s) => s.zoom);
  const panBy = useAppStore((s) => s.panBy);

  useEffect(() => {
    if (!canvas) return;

    canvas.setViewportTransform([zoom, 0, 0, zoom, position.x, position.y]);
    canvas.requestRenderAll();
  }, [canvas, position, zoom]);

  useEffect(() => {
    if (!canvas) return;

    const onWheel = (opt: fabric.TEvent<WheelEvent>) => {
      const e = opt.e;

      e.preventDefault();
      e.stopPropagation();

      const isMod = e.metaKey || e.ctrlKey;

      if (isMod) {
        const { zoom } = useAppStore.getState();
        const factor = e.deltaY > 0 ? 0.9 : 1.1;
        const nextZoom = Math.min(Math.max(+(zoom * factor).toFixed(2), 0.1), 8);
        canvas.zoomToPoint(new Point(e.offsetX, e.offsetY), nextZoom);
        const vpt = canvas.viewportTransform!;
        useAppStore.setState({
          zoom: vpt[0],
          position: { x: vpt[4], y: vpt[5] },
        });
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
  }, [canvas, panBy]);
}
