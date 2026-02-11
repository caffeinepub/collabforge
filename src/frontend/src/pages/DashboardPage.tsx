import { Link } from '@tanstack/react-router';
import { useGetCallerUserProfile, useGetAllProjects } from '../hooks/useQueries';
import { useQuizAnswers } from '../hooks/useQuizAnswers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Users, FolderOpen, AlertCircle } from 'lucide-react';
import LoadingState, { EmptyState } from '../components/system/LoadingState';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function DashboardPage() {
  const { data: profile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: projects, isLoading: projectsLoading } = useGetAllProjects();
  const { isComplete: quizComplete } = useQuizAnswers();

  if (profileLoading || projectsLoading) {
    return <LoadingState message="Loading your dashboard..." />;
  }

  const openProjects = projects?.filter((p) => p.status === 'open' || p.status === 'inProgress') || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Welcome back, {profile?.displayName}!</h1>
        <p className="text-muted-foreground">Here's what's happening with your collaborations</p>
      </div>

      {!quizComplete && (
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
      )}

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Smart Matches
            </CardTitle>
            <CardDescription>Find your perfect collaborators</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/matches">
              <Button className="w-full">Browse Matches</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-primary" />
              Projects
            </CardTitle>
            <CardDescription>{openProjects.length} active projects</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/projects">
              <Button className="w-full" variant="outline">
                View All Projects
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Your Profile
            </CardTitle>
            <CardDescription>Manage your creative profile</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/profile">
              <Button className="w-full" variant="outline">
                Edit Profile
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Recent Projects</h2>
        {openProjects.length === 0 ? (
          <EmptyState
            title="No active projects"
            description="Browse projects or create your own to start collaborating!"
            image="/assets/generated/collaboration-empty-state.dim_800x600.png"
          />
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {openProjects.slice(0, 4).map((project) => (
              <Card key={project.id.toString()}>
                <CardHeader>
                  <CardTitle className="line-clamp-1">{project.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.genres.slice(0, 3).map((genre) => (
                      <Badge key={genre} variant="secondary">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                  <Link to="/projects/$projectId" params={{ projectId: project.id.toString() }}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
