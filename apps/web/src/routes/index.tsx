import { Button } from '@/components/ui/button';
import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      <Button asChild>
        <Link to="/canvas">Go to Canvas</Link>
      </Button>
    </div>
  );
}
