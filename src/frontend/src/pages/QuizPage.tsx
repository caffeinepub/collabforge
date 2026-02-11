import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useQuizAnswers } from '../hooks/useQuizAnswers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { SkillLevel } from '../backend';
import { toast } from 'sonner';

interface SkillLevelOption {
  value: SkillLevel;
  label: string;
}

const SKILL_LEVELS: SkillLevelOption[] = [
  { value: SkillLevel.beginner, label: 'Beginner' },
  { value: SkillLevel.intermediate, label: 'Intermediate' },
  { value: SkillLevel.advanced, label: 'Advanced' },
  { value: SkillLevel.expert, label: 'Expert' },
];

const GENRE_OPTIONS = [
  'Hip-Hop',
  'Pop',
  'Rock',
  'Electronic',
  'Jazz',
  'Classical',
  'R&B',
  'Indie',
  'Fantasy',
  'Sci-Fi',
  'Horror',
  'Romance',
  'Game Dev',
  'Web Dev',
  'Mobile Dev',
  'AI/ML',
];

const GOAL_OPTIONS = [
  'Build Portfolio',
  'Paid Work',
  'Long-term Project',
  'Just for Fun',
  'Learn New Skills',
  'Launch Startup',
  'Create Album',
  'Publish Novel',
  'Release Game',
];

const VIBE_OPTIONS = [
  'Dark',
  'Cute',
  'Experimental',
  'Chill',
  'Aggressive',
  'Cinematic',
  'Minimalist',
  'Colorful',
  'Professional',
  'Casual',
];

export default function QuizPage() {
  const navigate = useNavigate();
  const { answers, setAnswers, isComplete } = useQuizAnswers();
  const [step, setStep] = useState(0);

  const handleSkillLevelChange = (value: string) => {
    const skillLevel = SKILL_LEVELS.find((s) => s.value === value)?.value || null;
    setAnswers({ ...answers, skillLevel });
  };

  const toggleGenre = (genre: string) => {
    const newGenres = answers.genres.includes(genre)
      ? answers.genres.filter((g) => g !== genre)
      : [...answers.genres, genre];
    setAnswers({ ...answers, genres: newGenres });
  };

  const toggleGoal = (goal: string) => {
    const newGoals = answers.goals.includes(goal) ? answers.goals.filter((g) => g !== goal) : [...answers.goals, goal];
    setAnswers({ ...answers, goals: newGoals });
  };

  const toggleVibe = (vibe: string) => {
    const newVibes = answers.vibes.includes(vibe) ? answers.vibes.filter((v) => v !== vibe) : [...answers.vibes, vibe];
    setAnswers({ ...answers, vibes: newVibes });
  };

  const addInspiration = (inspiration: string) => {
    if (inspiration.trim() && !answers.inspirations.includes(inspiration.trim())) {
      setAnswers({ ...answers, inspirations: [...answers.inspirations, inspiration.trim()] });
    }
  };

  const removeInspiration = (inspiration: string) => {
    setAnswers({ ...answers, inspirations: answers.inspirations.filter((i) => i !== inspiration) });
  };

  const handleComplete = () => {
    if (isComplete) {
      toast.success('Quiz completed! You can now browse matches.');
      navigate({ to: '/matches' });
    } else {
      toast.error('Please complete all required fields');
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <RadioGroup
            value={answers.skillLevel || ''}
            onValueChange={handleSkillLevelChange}
            className="space-y-3"
          >
            {SKILL_LEVELS.map((level) => (
              <div key={level.value} className="flex items-center space-x-2">
                <RadioGroupItem value={level.value} id={level.value} />
                <Label htmlFor={level.value} className="cursor-pointer">
                  {level.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );
      case 1:
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {GENRE_OPTIONS.map((genre) => (
              <div key={genre} className="flex items-center space-x-2">
                <Checkbox id={genre} checked={answers.genres.includes(genre)} onCheckedChange={() => toggleGenre(genre)} />
                <Label htmlFor={genre} className="cursor-pointer">
                  {genre}
                </Label>
              </div>
            ))}
          </div>
        );
      case 2:
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {GOAL_OPTIONS.map((goal) => (
              <div key={goal} className="flex items-center space-x-2">
                <Checkbox id={goal} checked={answers.goals.includes(goal)} onCheckedChange={() => toggleGoal(goal)} />
                <Label htmlFor={goal} className="cursor-pointer">
                  {goal}
                </Label>
              </div>
            ))}
          </div>
        );
      case 3:
        return (
          <Input
            value={answers.availability}
            onChange={(e) => setAnswers({ ...answers, availability: e.target.value })}
            placeholder="e.g., 10 hours/week, weekends only, flexible"
          />
        );
      case 4:
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {VIBE_OPTIONS.map((vibe) => (
              <div key={vibe} className="flex items-center space-x-2">
                <Checkbox id={vibe} checked={answers.vibes.includes(vibe)} onCheckedChange={() => toggleVibe(vibe)} />
                <Label htmlFor={vibe} className="cursor-pointer">
                  {vibe}
                </Label>
              </div>
            ))}
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <Input
              placeholder="Add an inspiration (artist, game, book, etc.)"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addInspiration(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
            <div className="flex flex-wrap gap-2">
              {answers.inspirations.map((inspiration) => (
                <Badge key={inspiration} variant="secondary" className="cursor-pointer" onClick={() => removeInspiration(inspiration)}>
                  {inspiration} ×
                </Badge>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const stepTitles = [
    'Skill Level',
    'Genres & Styles',
    'Goals',
    'Availability',
    'Vibe & Mood',
    'Inspirations',
  ];

  const stepDescriptions = [
    "What's your experience level?",
    'What genres or styles do you work with? (Select all that apply)',
    'What are you looking to achieve? (Select all that apply)',
    'How much time can you commit?',
    "What's your creative vibe? (Select all that apply)",
    'Who or what inspires you? (Optional)',
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate({ to: '/dashboard' })}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="text-sm text-muted-foreground">
          Step {step + 1} of {stepTitles.length}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{stepTitles[step]}</CardTitle>
          <CardDescription>{stepDescriptions[step]}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderStepContent()}

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            {step < stepTitles.length - 1 ? (
              <Button onClick={() => setStep(Math.min(stepTitles.length - 1, step + 1))}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleComplete} disabled={!isComplete}>
                <Check className="mr-2 h-4 w-4" />
                Complete Quiz
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
