import { useState } from 'react';
import { useGetTasks, useAddTask } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, RefreshCw } from 'lucide-react';
import LoadingState from '../system/LoadingState';
import { toast } from 'sonner';

interface TaskBoardProps {
  projectId: string;
}

export default function TaskBoard({ projectId }: TaskBoardProps) {
  const { data: tasks, isLoading, refetch } = useGetTasks(projectId);
  const addTaskMutation = useAddTask();
  const [newTask, setNewTask] = useState('');

  const handleAddTask = async () => {
    if (!newTask.trim()) return;

    try {
      await addTaskMutation.mutateAsync({ projectId: BigInt(projectId), task: newTask.trim() });
      setNewTask('');
      toast.success('Task added!');
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to add task');
    }
  };

  if (isLoading) {
    return <LoadingState message="Loading tasks..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddTask();
            }
          }}
        />
        <Button onClick={handleAddTask} disabled={addTaskMutation.isPending}>
          <Plus className="h-4 w-4" />
        </Button>
        <Button variant="outline" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tasks ({tasks?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {tasks && tasks.length > 0 ? (
            <ul className="space-y-2">
              {tasks.map((task, idx) => (
                <li key={idx} className="p-3 bg-muted rounded">
                  {task}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-center py-8">No tasks yet. Add one to get started!</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
