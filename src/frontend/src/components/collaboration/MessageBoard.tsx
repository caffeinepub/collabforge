import { useState, useEffect, useRef } from 'react';
import { useGetMessages, useAddMessage } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, RefreshCw } from 'lucide-react';
import LoadingState from '../system/LoadingState';
import { toast } from 'sonner';

interface MessageBoardProps {
  projectId: string;
}

export default function MessageBoard({ projectId }: MessageBoardProps) {
  const { data: messages, isLoading, refetch } = useGetMessages(projectId);
  const addMessageMutation = useAddMessage();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await addMessageMutation.mutateAsync({ projectId: BigInt(projectId), message: newMessage.trim() });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  if (isLoading) {
    return <LoadingState message="Loading messages..." />;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Messages ({messages?.length || 0})</CardTitle>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
            {messages && messages.length > 0 ? (
              messages.map(([author, text, timestamp], idx) => (
                <div key={idx} className="p-3 bg-muted rounded">
                  <p className="text-sm font-semibold mb-1">{author.toString().slice(0, 8)}...</p>
                  <p className="text-sm">{text}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(Number(timestamp) / 1000000).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-8">No messages yet. Start the conversation!</p>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex gap-2">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              rows={2}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button onClick={handleSendMessage} disabled={addMessageMutation.isPending}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
