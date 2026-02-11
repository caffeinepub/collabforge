import { createRouter, RouterProvider, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import QuizPage from './pages/QuizPage';
import MatchesPage from './pages/MatchesPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import CollaborationSpacePage from './pages/CollaborationSpacePage';
import SettingsPage from './pages/SettingsPage';
import OnboardingProfileSetupPage from './pages/OnboardingProfileSetupPage';
import AppLayout from './components/layout/AppLayout';
import AuthGate from './components/auth/AuthGate';

function RootComponent() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  return (
    <AuthGate>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </AuthGate>
  );
}

const rootRoute = createRootRoute({
  component: RootComponent,
});

const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardPage,
});

const onboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/onboarding',
  component: OnboardingProfileSetupPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile/$userId',
  component: ProfilePage,
});

const myProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfilePage,
});

const quizRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/quiz',
  component: QuizPage,
});

const matchesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/matches',
  component: MatchesPage,
});

const projectsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/projects',
  component: ProjectsPage,
});

const projectDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/projects/$projectId',
  component: ProjectDetailPage,
});

const collaborationSpaceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/collaboration/$projectId',
  component: CollaborationSpacePage,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: SettingsPage,
});

const routeTree = rootRoute.addChildren([
  landingRoute,
  dashboardRoute,
  onboardingRoute,
  profileRoute,
  myProfileRoute,
  quizRoute,
  matchesRoute,
  projectsRoute,
  projectDetailRoute,
  collaborationSpaceRoute,
  settingsRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
