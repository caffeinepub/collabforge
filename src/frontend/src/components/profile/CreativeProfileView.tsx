import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Star } from 'lucide-react';
import type { CreativeProfile } from '../../backend';
import { useGetCollaborationRatings } from '../../hooks/useQueries';

interface CreativeProfileViewProps {
  profile: CreativeProfile;
  userId: string;
  isOwnProfile: boolean;
}

export default function CreativeProfileView({ profile, userId, isOwnProfile }: CreativeProfileViewProps) {
  const { data: ratings } = useGetCollaborationRatings(userId);

  const avgCommunication =
    ratings && ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.communication, 0) / ratings.length
      : 0;
  const avgReliability =
    ratings && ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.reliability, 0) / ratings.length
      : 0;
  const avgSkillAccuracy =
    ratings && ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.skillAccuracy, 0) / ratings.length
      : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{profile.displayName}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {profile.bio && (
            <div>
              <h3 className="font-semibold mb-2">Bio</h3>
              <p className="text-muted-foreground">{profile.bio}</p>
            </div>
          )}

          {profile.skillTags.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skillTags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
            </div>
          )}

          {profile.lookingFor && (
            <div>
              <h3 className="font-semibold mb-2">Looking For</h3>
              <p className="text-muted-foreground">{profile.lookingFor}</p>
            </div>
          )}

          {profile.availability && (
            <div>
              <h3 className="font-semibold mb-2">Availability</h3>
              <p className="text-muted-foreground">{profile.availability}</p>
            </div>
          )}

          {profile.portfolioLinks.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Portfolio</h3>
              <div className="space-y-2">
                {profile.portfolioLinks.map(([label, url], idx) => (
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

          {ratings && ratings.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Collaboration Ratings</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="font-semibold">{avgCommunication.toFixed(1)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Communication</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="font-semibold">{avgReliability.toFixed(1)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Reliability</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="font-semibold">{avgSkillAccuracy.toFixed(1)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Skill Accuracy</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Based on {ratings.length} rating{ratings.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
