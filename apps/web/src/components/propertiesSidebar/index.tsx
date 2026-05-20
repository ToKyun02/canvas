import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

export function PropertiesSidebar() {
  const tmp = [
    'Position',
    'Zoom',
    'Rotation',
    'Scale',
    'Opacity',
    'Visibility',
    'Lock',
    'Group',
    'Ungroup',
    'Bring to Front',
    'Send to Back',
  ];
  return (
    <Sidebar side="right">
      <SidebarHeader />
      <SidebarContent>
        <SidebarMenu>
          {tmp.map((item) => (
            <SidebarMenuItem key={item}>
              <SidebarMenuButton>{item}</SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
