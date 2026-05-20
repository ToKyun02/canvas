import { Canvas } from '@/components/canvas';
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
      <ModeToggle className="fixed right-4 top-4 z-10 cursor-pointer" />
      <Canvas className="dark:bg-mist-700 h-full w-full bg-gray-200" />
    </>
  );
}
