import { useFabricCanvas } from '@/features/canvas/hooks/useFabricCanvas';
import type * as fabric from 'fabric';
import { useRef, type Ref } from 'react';

type CanvasProps = {
  className?: string;
  onLoad?(canvas: fabric.Canvas): void;
  ref?: Ref<fabric.Canvas>;
};

export function Canvas({ className, onLoad, ref }: CanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const domRef = useRef<HTMLCanvasElement>(null);

  useFabricCanvas(domRef, { ref, onLoad, containerRef });

  return (
    <div ref={containerRef} className={className ?? 'h-full w-full'}>
      <canvas ref={domRef} />
    </div>
  );
}
