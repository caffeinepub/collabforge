import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../../hooks/useQueries';
import LoadingState from '../system/LoadingState';

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { identity, isInitializing } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      navigate({ to: '/' });
    }
  }, [isInitializing, isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated && isFetched && userProfile === null) {
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/onboarding')) {
        navigate({ to: '/onboarding' });
      }
    }
  }, [isAuthenticated, isFetched, userProfile, navigate]);

  if (isInitializing || profileLoading || !isFetched) {
    return <LoadingState message="Loading your profile..." />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
