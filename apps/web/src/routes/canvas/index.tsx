import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/canvas/')({
  component: CanvasPage,
});

function CanvasPage() {
  return (
    <>
      <h1>Canvas</h1>
    </>
  );
}
