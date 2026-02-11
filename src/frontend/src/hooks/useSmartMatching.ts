import { useState, useEffect } from 'react';
import { useGetCallerUserProfile, useGetAllProjects } from './useQueries';
import { useQuizAnswers } from './useQuizAnswers';
import { SkillLevel } from '../backend';
import type { CreativeProfile } from '../backend';

interface MatchCandidate {
  profile: CreativeProfile;
  userId: string;
  score: number;
  sharedTags: string[];
}

interface MatchDecision {
  userId: string;
  decision: 'like' | 'pass';
  timestamp: number;
}

const DECISIONS_STORAGE_KEY = 'collabforge_match_decisions';

export function useSmartMatching() {
  const { data: currentProfile } = useGetCallerUserProfile();
  const { data: allProjects } = useGetAllProjects();
  const { answers, isComplete } = useQuizAnswers();
  const [decisions, setDecisions] = useState<MatchDecision[]>(() => {
    try {
      const stored = localStorage.getItem(DECISIONS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(DECISIONS_STORAGE_KEY, JSON.stringify(decisions));
    } catch (error) {
      console.error('Failed to save match decisions:', error);
    }
  }, [decisions]);

  const recordDecision = (userId: string, decision: 'like' | 'pass') => {
    setDecisions((prev) => [...prev.filter((d) => d.userId !== userId), { userId, decision, timestamp: Date.now() }]);
  };

  const getCandidates = (): MatchCandidate[] => {
    if (!currentProfile || !allProjects || !isComplete) return [];

    const decidedUserIds = new Set(decisions.map((d) => d.userId));
    const candidates: MatchCandidate[] = [];

    allProjects.forEach((project) => {
      const userId = project.creator.toString();
      if (decidedUserIds.has(userId)) return;

      const sharedGenres = project.genres.filter((g) => answers.genres.includes(g));
      const sharedGoals = project.goals.filter((g) => answers.goals.includes(g));
      const sharedVibes = project.vibes.filter((v) => answers.vibes.includes(v));

      const score = sharedGenres.length * 3 + sharedGoals.length * 2 + sharedVibes.length * 2;

      if (score > 0) {
        const sharedTags = [...sharedGenres, ...sharedGoals, ...sharedVibes];
        candidates.push({
          profile: {
            displayName: `Project Creator`,
            bio: project.description,
            skillTags: [],
            skillLevel: SkillLevel.intermediate,
            genres: project.genres,
            goals: project.goals,
            availability: '',
            moodTags: project.vibes,
            inspirations: [],
            portfolioLinks: project.externalLinks,
            lookingFor: project.title,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
          },
          userId,
          score,
          sharedTags: [...new Set(sharedTags)],
        });
      }
    });

    return candidates.sort((a, b) => b.score - a.score);
  };

  return {
    candidates: getCandidates(),
    recordDecision,
    decisions,
  };
}
