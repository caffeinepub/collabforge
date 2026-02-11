import { Link } from '@tanstack/react-router';
import { useQuizAnswers } from '../hooks/useQuizAnswers';
import { useSmartMatching } from '../hooks/useSmartMatching';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import LoadingState, { EmptyState } from '../components/system/LoadingState';
import SwipeDeck from '../components/matching/SwipeDeck';

export default function MatchesPage() {
  const { isComplete } = useQuizAnswers();
  const { candidates, recordDecision } = useSmartMatching();

  if (!isComplete) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold">Smart Matches</h1>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Complete your{' '}
            <Link to="/quiz" className="font-medium underline">
              Creative Profile Quiz
            </Link>{' '}
            to start getting matched with collaborators!
          </AlertDescription>
        </Alert>
        <Link to="/quiz">
          <Button size="lg">Take the Quiz</Button>
        </Link>
      </div>
    );
  }

  if (candidates.length === 0) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold">Smart Matches</h1>
        <EmptyState
          title="No matches found"
          description="We couldn't find any collaborators matching your preferences right now. Check back later or browse projects directly!"
          image="/assets/generated/collaboration-empty-state.dim_800x600.png"
        />
        <Link to="/projects">
          <Button>Browse Projects</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Smart Matches</h1>
        <p className="text-muted-foreground">Swipe through collaborators that match your creative profile</p>
      </div>

      <SwipeDeck candidates={candidates} onDecision={recordDecision} />
    </div>
  );
}
