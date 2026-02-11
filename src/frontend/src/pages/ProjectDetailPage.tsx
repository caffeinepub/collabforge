import { useParams, useNavigate, Link } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetProject, useMarkProjectCompleted } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ExternalLink, MessageSquare, CheckCircle } from 'lucide-react';
import LoadingState, { ErrorState } from '../components/system/LoadingState';
import { toast } from 'sonner';

export default function ProjectDetailPage() {
  const { projectId } = useParams({ strict: false });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: project, isLoading } = useGetProject(projectId);
  const markCompletedMutation = useMarkProjectCompleted();

  const currentUserId = identity?.getPrincipal().toString();
  const isOwner = project && currentUserId === project.creator.toString();

  if (isLoading) {
    return <LoadingState message="Loading project..." />;
  }

  if (!project) {
    return <ErrorState message="Project not found" />;
  }

  const handleMarkCompleted = async () => {
    try {
      await markCompletedMutation.mutateAsync(project.id);
      toast.success('Project marked as completed!');
    } catch (error) {
      console.error('Error marking project completed:', error);
      toast.error('Failed to mark project as completed');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate({ to: '/projects' })}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>
        {isOwner && project.status !== 'completed' && (
          <Button onClick={handleMarkCompleted} disabled={markCompletedMutation.isPending}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Mark as Completed
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-3xl mb-2">{project.title}</CardTitle>
              <CardDescription className="text-base">{project.description}</CardDescription>
            </div>
            <Badge variant={project.status === 'open' ? 'default' : 'secondary'} className="text-sm">
              {project.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Genres & Styles</h3>
            <div className="flex flex-wrap gap-2">
              {project.genres.map((genre) => (
                <Badge key={genre} variant="outline">
                  {genre}
                </Badge>
              ))}
            </div>
          </div>

          {project.vibes.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Vibes</h3>
              <div className="flex flex-wrap gap-2">
                {project.vibes.map((vibe) => (
                  <Badge key={vibe} variant="secondary">
                    {vibe}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {project.goals.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Goals</h3>
              <div className="flex flex-wrap gap-2">
                {project.goals.map((goal) => (
                  <Badge key={goal}>{goal}</Badge>
                ))}
              </div>
            </div>
          )}

          {project.rolesNeeded.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Roles Needed</h3>
              <div className="space-y-2">
                {project.rolesNeeded.map((role, idx) => (
                  <Card key={idx}>
                    <CardHeader className="py-3">
                      <CardTitle className="text-base">{role.name}</CardTitle>
                      <CardDescription className="text-sm">{role.description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {project.externalLinks.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Links</h3>
              <div className="space-y-2">
                {project.externalLinks.map(([label, url], idx) => (
                  <a
                    key={idx}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {label}
                  </a>
                ))}
              </div>
            </div>
          )}

          {isOwner && (
            <div className="pt-4 border-t">
              <Link to="/collaboration/$projectId" params={{ projectId: project.id.toString() }}>
                <Button className="w-full">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Open Collaboration Space
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
