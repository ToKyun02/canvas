import { useAppStore } from '@/stores';
import { Badge } from '../ui/badge';

export function Position() {
  const position = useAppStore((s) => s.position);
  return (
    <div className="absolute left-4 top-4 z-10">
      <Badge className="w-100 h-8 text-lg">
        position: {position.x.toFixed(2)}, {position.y.toFixed(2)}
      </Badge>
    </div>
  );
}
