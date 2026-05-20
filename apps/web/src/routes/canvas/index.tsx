import { Canvas } from '@/components/canvas';
import { Position } from '@/components/canvas/position';
import { ZoomLevel } from '@/components/canvas/zoomLevel';
import { ModeToggle } from '@/components/ui/theme-mode-toggle';
import { useGlobalShortcuts } from '@/features/shortcuts/hooks/useGlobalShortcuts';
import { createFileRoute } from '@tanstack/react-router';
import type * as fabric from 'fabric';
import { Textbox } from 'fabric';
import { useCallback } from 'react';

export const Route = createFileRoute('/canvas/')({
  component: CanvasPage,
});

function CanvasPage() {
  useGlobalShortcuts();
  // FIX: Test용으로 나중에 삭제 예정입니다.
  const handleCanvasLoad = useCallback((canvas: fabric.Canvas) => {
    canvas.add(
      new Textbox('TextNode', {
        left: canvas.getWidth() / 2,
        top: canvas.getHeight() / 2,
        width: 100,
        fontSize: 14,
        fill: '#111827',
        backgroundColor: '#ffffff',
      }),
    );
    canvas.requestRenderAll();
  }, []);
  return (
    <>
      <ModeToggle className="fixed right-4 top-4 z-10 cursor-pointer" />
      <ZoomLevel />
      <Position />
      <Canvas onLoad={handleCanvasLoad} className="dark:bg-mist-700 h-full w-full bg-gray-200" />
    </>
  );
}
