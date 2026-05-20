import { devCanvasRegistry } from '@/dev/registry';
import { assignRef } from '@/lib/utils';
import * as fabric from 'fabric';
import { useEffect, type Ref, type RefObject } from 'react';

type FabricCanvasOptions = NonNullable<ConstructorParameters<typeof fabric.Canvas>[1]>;

type UseFabricCanvasOptions = {
  ref?: Ref<fabric.Canvas>;
  onLoad?: (canvas: fabric.Canvas) => void;
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
  { ref, onLoad, options, containerRef }: UseFabricCanvasOptions = {},
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
    const canvas = new fabric.Canvas(el, {
      ...options,
      width: width || options?.width,
      height: height || options?.height,
    });

    const resize = () => {
      const size = measureContainer(container);
      if (size.width > 0 && size.height > 0) {
        canvas.setDimensions(size);
      }
    };

    const observer = new ResizeObserver(resize);
    observer.observe(container);

    assignRef(ref, canvas);
    devCanvasRegistry.register(canvas);
    onLoad?.(canvas);

    return () => {
      observer.disconnect();
      devCanvasRegistry.unregister(canvas);
      assignRef(ref, null);
      canvas.dispose();
    };
  }, [containerRef, domRef, onLoad, options, ref]);
}
