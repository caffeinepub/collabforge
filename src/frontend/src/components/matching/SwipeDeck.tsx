import { useState } from 'react';
import MatchCard from './MatchCard';
import { EmptyState } from '../system/LoadingState';

interface MatchCandidate {
  profile: {
    displayName: string;
    bio: string;
  };
  userId: string;
  sharedTags: string[];
}

interface SwipeDeckProps {
  candidates: MatchCandidate[];
  onDecision: (userId: string, decision: 'like' | 'pass') => void;
}

export default function SwipeDeck({ candidates, onDecision }: SwipeDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (candidates.length === 0 || currentIndex >= candidates.length) {
    return (
      <EmptyState
        title="No more matches"
        description="You've reviewed all available matches. Check back later for more!"
        image="/assets/generated/collaboration-empty-state.dim_800x600.png"
      />
    );
  }

  const currentCandidate = candidates[currentIndex];

  const handleLike = () => {
    onDecision(currentCandidate.userId, 'like');
    setCurrentIndex(currentIndex + 1);
  };

  const handlePass = () => {
    onDecision(currentCandidate.userId, 'pass');
    setCurrentIndex(currentIndex + 1);
  };

  return (
    <div className="space-y-4">
      <div className="text-center text-sm text-muted-foreground">
        {currentIndex + 1} of {candidates.length}
      </div>
      <MatchCard
        displayName={currentCandidate.profile.displayName}
        bio={currentCandidate.profile.bio}
        sharedTags={currentCandidate.sharedTags}
        onLike={handleLike}
        onPass={handlePass}
      />
    </div>
  );
}
