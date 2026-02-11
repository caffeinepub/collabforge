import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, X } from 'lucide-react';

interface MatchCardProps {
  displayName: string;
  bio: string;
  sharedTags: string[];
  onLike: () => void;
  onPass: () => void;
}

export default function MatchCard({ displayName, bio, sharedTags, onLike, onPass }: MatchCardProps) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">{displayName}</CardTitle>
        <CardDescription className="line-clamp-3">{bio}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {sharedTags.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2 text-muted-foreground">You both share:</h4>
            <div className="flex flex-wrap gap-2">
              {sharedTags.slice(0, 6).map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <Button variant="outline" size="lg" className="flex-1" onClick={onPass}>
            <X className="mr-2 h-5 w-5" />
            Pass
          </Button>
          <Button size="lg" className="flex-1" onClick={onLike}>
            <Heart className="mr-2 h-5 w-5" />
            Like
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
