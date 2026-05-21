import { Canvas } from '@/components/canvas';
import { Position } from '@/components/canvas/position';
import { ZoomLevel } from '@/components/canvas/zoomLevel';
import { ModeToggle } from '@/components/ui/theme-mode-toggle';
import { useGlobalShortcuts } from '@/features/shortcuts/hooks/useGlobalShortcuts';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/canvas/')({
  component: CanvasPage,
});

function CanvasPage() {
  useGlobalShortcuts();

  return (
    <>
      <ModeToggle className="fixed left-4 top-20 z-10 cursor-pointer" />
      <ZoomLevel />
      <Position />
      <Canvas className="dark:bg-mist-700 h-screen w-full bg-gray-200" />
    </>
  );
}
