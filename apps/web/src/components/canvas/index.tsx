import { useCanvasCamera } from '@/features/canvas/hooks/useCanvasCamera';
import { useDrawingTools } from '@/features/canvas/hooks/useDrawingTools';
import { useFabricCanvas } from '@/features/canvas/hooks/useFabricCanvas';
import { assignRef } from '@/utils/assignRef';
import type * as fabric from 'fabric';
import { useCallback, useRef, useState, type Ref } from 'react';

type CanvasProps = {
  className?: string;
  onLoad?(canvas: fabric.Canvas): void;
  ref?: Ref<fabric.Canvas>;
};

export function Canvas({ className, onLoad, ref }: CanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const domRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);

  const mergeRef = useCallback(
    (instance: fabric.Canvas | null) => {
      setCanvas(instance);
      assignRef(ref, instance);
    },
    [ref],
  );

  useFabricCanvas(domRef, {
    ref: mergeRef,
    onLoad,
    containerRef,
  });
  useCanvasCamera(canvas);
  useDrawingTools(canvas);

  return (
    <div ref={containerRef} className={className ?? 'h-full w-full'}>
      <canvas ref={domRef} />
    </div>
  );
}
