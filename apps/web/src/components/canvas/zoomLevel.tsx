import { useAppStore } from '@/stores';
import { Badge } from '../ui/badge';

export function ZoomLevel() {
  const zoom = useAppStore((s) => s.zoom);

  return (
    <div className="absolute bottom-4 left-4 z-10">
      <Badge className="h-8 w-28 text-lg">zoom: {zoom.toFixed(2)}</Badge>
    </div>
  );
}
