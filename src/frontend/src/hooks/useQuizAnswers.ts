import { useState, useEffect } from 'react';
import { SkillLevel } from '../backend';

export interface QuizAnswers {
  skillLevel: SkillLevel | null;
  genres: string[];
  goals: string[];
  availability: string;
  vibes: string[];
  inspirations: string[];
}

const QUIZ_STORAGE_KEY = 'collabforge_quiz_answers';

const defaultAnswers: QuizAnswers = {
  skillLevel: null,
  genres: [],
  goals: [],
  availability: '',
  vibes: [],
  inspirations: [],
};

export function useQuizAnswers() {
  const [answers, setAnswers] = useState<QuizAnswers>(() => {
    try {
      const stored = localStorage.getItem(QUIZ_STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultAnswers;
    } catch {
      return defaultAnswers;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(answers));
    } catch (error) {
      console.error('Failed to save quiz answers:', error);
    }
  }, [answers]);

  const isComplete = () => {
    return (
      answers.skillLevel !== null &&
      answers.genres.length > 0 &&
      answers.goals.length > 0 &&
      answers.availability.length > 0 &&
      answers.vibes.length > 0
    );
  };

  const reset = () => {
    setAnswers(defaultAnswers);
    localStorage.removeItem(QUIZ_STORAGE_KEY);
  };

  return {
    answers,
    setAnswers,
    isComplete: isComplete(),
    reset,
  };
}
