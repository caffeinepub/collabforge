import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useQuizAnswers } from '../hooks/useQuizAnswers';
import { Badge } from '@/components/ui/badge';

export default function SettingsPage() {
  const { isComplete } = useQuizAnswers();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Creative Profile Quiz
          </CardTitle>
          <CardDescription>
            Your quiz answers help us match you with the right collaborators
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Quiz Status</p>
              <p className="text-sm text-muted-foreground">
                {isComplete ? 'Completed' : 'Not completed'}
              </p>
            </div>
            <Badge variant={isComplete ? 'default' : 'secondary'}>
              {isComplete ? 'Complete' : 'Incomplete'}
            </Badge>
          </div>
          <Link to="/quiz">
            <Button variant="outline" className="w-full">
              {isComplete ? 'Update Quiz Answers' : 'Complete Quiz'}
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
