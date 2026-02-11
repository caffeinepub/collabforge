import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';

export default function AccessDeniedScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <ShieldAlert className="h-16 w-16 text-destructive" />
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-muted-foreground max-w-md">
          You don't have permission to access this resource. Please contact the project owner if you believe this is an
          error.
        </p>
      </div>
      <Button onClick={() => navigate({ to: '/dashboard' })}>Return to Dashboard</Button>
    </div>
  );
}
