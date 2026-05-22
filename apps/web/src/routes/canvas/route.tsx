import { PropertiesSidebar } from '@/components/propertiesSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useAppStore } from '@/stores';
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/canvas')({
  component: CanvasLayoutComponent,
});

function CanvasLayoutComponent() {
  const open = useAppStore((state) => state.isPropertiesSidebarOpen);
  const setOpen = useAppStore((state) => state.setPropertiesSidebarOpen);
  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <Outlet />
      <PropertiesSidebar />
    </SidebarProvider>
  );
}
