import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetProject } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';
import LoadingState, { ErrorState } from '../components/system/LoadingState';
import TaskBoard from '../components/collaboration/TaskBoard';
import MessageBoard from '../components/collaboration/MessageBoard';
import AccessDeniedScreen from '../components/system/AccessDeniedScreen';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function CollaborationSpacePage() {
  const { projectId } = useParams({ strict: false });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: project, isLoading } = useGetProject(projectId);

  const currentUserId = identity?.getPrincipal().toString();
  const isOwner = project && currentUserId === project.creator.toString();

  if (isLoading) {
    return <LoadingState message="Loading collaboration space..." />;
  }

  if (!project) {
    return <ErrorState message="Project not found" />;
  }

  if (!isOwner) {
    return <AccessDeniedScreen />;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate({ to: `/projects/${projectId}` })}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Project
        </Button>
        <h1 className="text-2xl font-bold">{project.title}</h1>
      </div>

      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tasks">Task Board</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>
        <TabsContent value="tasks" className="mt-6">
          <TaskBoard projectId={projectId || ''} />
        </TabsContent>
        <TabsContent value="messages" className="mt-6">
          <MessageBoard projectId={projectId || ''} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
