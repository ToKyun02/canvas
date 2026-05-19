import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: DefaultNotFoundComponent,
});

function RootComponent() {
  return (
    <>
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}

function DefaultNotFoundComponent() {
  return (
    <div className="p-2">
      <h3>404 Not Found</h3>
    </div>
  );
}
