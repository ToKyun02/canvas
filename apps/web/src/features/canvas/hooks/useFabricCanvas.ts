import { devCanvasRegistry } from '@/dev/registry';
import { useAppStore } from '@/stores';
import * as fabric from 'fabric';
import { InteractiveFabricObject } from 'fabric';
import { useEffect, type RefObject } from 'react';

type FabricCanvasOptions = NonNullable<ConstructorParameters<typeof fabric.Canvas>[1]>;

type UseFabricCanvasOptions = {
  onCanvas?: (canvas: fabric.Canvas | null) => void;
  options?: FabricCanvasOptions;
  containerRef?: RefObject<HTMLElement | null>;
};

function measureContainer(container: HTMLElement) {
  const { width, height } = container.getBoundingClientRect();
  return {
    width: Math.floor(width),
    height: Math.floor(height),
  };
}

export function useFabricCanvas(
  domRef: RefObject<HTMLCanvasElement | null>,
  { onCanvas, options, containerRef }: UseFabricCanvasOptions = {},
) {
  useEffect(() => {
    const el = domRef.current;
    if (!el) {
      return;
    }

    const container = containerRef?.current ?? el.parentElement;
    if (!container) {
      return;
    }

    const { width, height } = measureContainer(container);

    Object.assign(InteractiveFabricObject.ownDefaults, {
      borderColor: '#6366f1',
      borderScaleFactor: 2,
      cornerColor: '#6366f1',
      cornerStrokeColor: '#ffffff',
      cornerSize: 10,
      touchCornerSize: 28,
      transparentCorners: false,
      cornerStyle: 'circle',
      padding: 4,
    });

    const canvas = new fabric.Canvas(el, {
      ...options,
      width: width || options?.width,
      height: height || options?.height,
    });

    const syncCanvasSize = (size: { width: number; height: number }) => {
      if (size.width > 0 && size.height > 0) {
        useAppStore.getState().setCanvasSize(size);
      }
    };

    const resize = () => {
      const size = measureContainer(container);
      if (size.width > 0 && size.height > 0) {
        canvas.setDimensions(size);
        syncCanvasSize(size);
      }
    };

    const observer = new ResizeObserver(resize);
    observer.observe(container);

    syncCanvasSize({ width, height });

    devCanvasRegistry.register(canvas);
    onCanvas?.(canvas);

    return () => {
      observer.disconnect();
      devCanvasRegistry.unregister(canvas);
      canvas.dispose();
      onCanvas?.(null);
    };
  }, [containerRef, domRef, options, onCanvas]);
}
