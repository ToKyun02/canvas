import { hydrateCanvasFromStore } from '@/features/canvas/utils/hydrateCanvas';
import { useAppStore } from '@/stores';
import type * as fabric from 'fabric';
import { useEffect, useRef } from 'react';

export function useCanvasHydration(canvas: fabric.Canvas | null) {
  const hydratedCanvasRef = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    if (!canvas) return;

    const runHydration = () => {
      if (hydratedCanvasRef.current === canvas) return;

      hydratedCanvasRef.current = canvas;
      hydrateCanvasFromStore(canvas);
    };

    if (useAppStore.persist.hasHydrated()) {
      runHydration();
      return;
    }

    return useAppStore.persist.onFinishHydration(runHydration);
  }, [canvas]);
}
