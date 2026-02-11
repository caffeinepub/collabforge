import { useState } from 'react';
import { useCreateProject } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ProjectStatus } from '../../backend';
import type { ProjectPosting, ProjectCategory } from '../../backend';
import { toast } from 'sonner';
import { Principal } from '@dfinity/principal';

interface ProjectFormProps {
  onSuccess: () => void;
}

const GENRE_OPTIONS = ['Hip-Hop', 'Pop', 'Rock', 'Electronic', 'Jazz', 'Fantasy', 'Sci-Fi', 'Horror', 'Game Dev', 'Web Dev'];
const VIBE_OPTIONS = ['Dark', 'Cute', 'Experimental', 'Chill', 'Aggressive', 'Cinematic'];
const GOAL_OPTIONS = ['Build Portfolio', 'Paid Work', 'Long-term Project', 'Just for Fun', 'Launch Startup'];

export default function ProjectForm({ onSuccess }: ProjectFormProps) {
  const createMutation = useCreateProject();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [genres, setGenres] = useState<string[]>([]);
  const [vibes, setVibes] = useState<string[]>([]);
  const [goals, setGoals] = useState<string[]>([]);

  const toggleGenre = (genre: string) => {
    setGenres(genres.includes(genre) ? genres.filter((g) => g !== genre) : [...genres, genre]);
  };

  const toggleVibe = (vibe: string) => {
    setVibes(vibes.includes(vibe) ? vibes.filter((v) => v !== vibe) : [...vibes, vibe]);
  };

  const toggleGoal = (goal: string) => {
    setGoals(goals.includes(goal) ? goals.filter((g) => g !== goal) : [...goals, goal]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const category: ProjectCategory = { __kind__: 'other', other: 'General' };

    const project: ProjectPosting = {
      id: BigInt(0),
      title: title.trim(),
      description: description.trim(),
      creator: Principal.anonymous(),
      category,
      genres,
      vibes,
      goals,
      timeline: BigInt(0),
      rolesNeeded: [],
      externalLinks: [],
      status: ProjectStatus.open,
      createdAt: BigInt(Date.now() * 1000000),
      updatedAt: BigInt(Date.now() * 1000000),
    };

    try {
      await createMutation.mutateAsync(project);
      toast.success('Project created successfully!');
      onSuccess();
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Project Title *</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter project title" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your project..."
          rows={4}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Genres & Styles</Label>
        <div className="flex flex-wrap gap-2">
          {GENRE_OPTIONS.map((genre) => (
            <Badge
              key={genre}
              variant={genres.includes(genre) ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => toggleGenre(genre)}
            >
              {genre}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Vibes</Label>
        <div className="flex flex-wrap gap-2">
          {VIBE_OPTIONS.map((vibe) => (
            <Badge
              key={vibe}
              variant={vibes.includes(vibe) ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => toggleVibe(vibe)}
            >
              {vibe}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Goals</Label>
        <div className="flex flex-wrap gap-2">
          {GOAL_OPTIONS.map((goal) => (
            <Badge
              key={goal}
              variant={goals.includes(goal) ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => toggleGoal(goal)}
            >
              {goal}
            </Badge>
          ))}
        </div>
      </div>

      <Button type="submit" disabled={createMutation.isPending} className="w-full">
        {createMutation.isPending ? 'Creating...' : 'Create Project'}
      </Button>
    </form>
  );
}
