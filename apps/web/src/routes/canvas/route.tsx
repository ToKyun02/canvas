import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/canvas')({
  component: CanvasLayoutComponent,
});

function CanvasLayoutComponent() {
  return (
    <div className="h-screen w-full">
      <Outlet />
    </div>
  );
}
