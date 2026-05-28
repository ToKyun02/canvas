import { useCanvasCamera } from '@/features/canvas/hooks/useCanvasCamera';
import { useCanvasHydration } from '@/features/canvas/hooks/useCanvasHydration';
import { useCanvasNodes } from '@/features/canvas/hooks/useCanvasNodes';
import { useCanvasSelection } from '@/features/canvas/hooks/useCanvasSelection';
import { useCanvasViewportWheel } from '@/features/canvas/hooks/useCanvasViewportWheel';
import { useDrawingTools } from '@/features/canvas/hooks/useDrawingTools';
import { useFabricCanvas } from '@/features/canvas/hooks/useFabricCanvas';
import { NodeLabelsOverlay } from '@/features/canvas/labels/NodeLabelsOverlay';
import { useGlobalShortcuts } from '@/features/shortcuts/hooks/useGlobalShortcuts';
import type * as fabric from 'fabric';
import { useRef, useState } from 'react';

type CanvasProps = {
  className?: string;
};

export function Canvas({ className }: CanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const domRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);

  useFabricCanvas(domRef, {
    onCanvas: setCanvas,
    containerRef,
  });
  useGlobalShortcuts();
  useCanvasCamera(canvas);
  useCanvasViewportWheel({ canvasContainerRef: containerRef, canvas });
  useCanvasHydration(canvas);
  useDrawingTools(canvas);
  useCanvasSelection(canvas);
  useCanvasNodes(canvas);

  return (
    <div ref={containerRef} className={`relative touch-none overscroll-none ${className ?? 'h-full w-full'}`}>
      <canvas ref={domRef} />
      <NodeLabelsOverlay canvas={canvas} />
    </div>
  );
}
