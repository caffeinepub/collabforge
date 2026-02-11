import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useGetCreativeProfile, useSaveOrUpdateCreativeProfile } from '../hooks/useQueries';
import CreativeProfileForm from '../components/profile/CreativeProfileForm';
import CreativeProfileView from '../components/profile/CreativeProfileView';
import { Button } from '@/components/ui/button';
import { Edit, ArrowLeft } from 'lucide-react';
import LoadingState, { ErrorState } from '../components/system/LoadingState';

export default function ProfilePage() {
  const { userId } = useParams({ strict: false });
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const currentUserId = identity?.getPrincipal().toString();
  const isOwnProfile = !userId || userId === currentUserId;

  const { data: ownProfile, isLoading: ownLoading } = useGetCallerUserProfile();
  const { data: otherProfile, isLoading: otherLoading } = useGetCreativeProfile(userId);

  const profile = isOwnProfile ? ownProfile : otherProfile;
  const isLoading = isOwnProfile ? ownLoading : otherLoading;

  if (isLoading) {
    return <LoadingState message="Loading profile..." />;
  }

  if (!profile) {
    return <ErrorState message="Profile not found" />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate({ to: '/dashboard' })}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        {isOwnProfile && !isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        )}
      </div>

      {isEditing && isOwnProfile ? (
        <CreativeProfileForm profile={profile} onCancel={() => setIsEditing(false)} onSave={() => setIsEditing(false)} />
      ) : (
        <CreativeProfileView profile={profile} userId={userId || currentUserId || ''} isOwnProfile={isOwnProfile} />
      )}
    </div>
  );
}
