import { Link, useNavigate } from '@tanstack/react-router';
import { Home, User, Sparkles, Users, FolderOpen, Settings } from 'lucide-react';
import LoginButton from '../auth/LoginButton';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center gap-2">
              <img src="/assets/generated/collabforge-logo.dim_1024x256.png" alt="CollabForge" className="h-8" />
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/dashboard"
                className="text-sm font-medium transition-colors hover:text-primary [&.active]:text-primary"
              >
                <Home className="inline-block mr-1.5 h-4 w-4" />
                Dashboard
              </Link>
              <Link
                to="/matches"
                className="text-sm font-medium transition-colors hover:text-primary [&.active]:text-primary"
              >
                <Users className="inline-block mr-1.5 h-4 w-4" />
                Matches
              </Link>
              <Link
                to="/projects"
                className="text-sm font-medium transition-colors hover:text-primary [&.active]:text-primary"
              >
                <FolderOpen className="inline-block mr-1.5 h-4 w-4" />
                Projects
              </Link>
              <Link
                to="/quiz"
                className="text-sm font-medium transition-colors hover:text-primary [&.active]:text-primary"
              >
                <Sparkles className="inline-block mr-1.5 h-4 w-4" />
                Quiz
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/profile"
              className="text-sm font-medium transition-colors hover:text-primary [&.active]:text-primary"
            >
              <User className="inline-block mr-1.5 h-4 w-4" />
              Profile
            </Link>
            <Link
              to="/settings"
              className="text-sm font-medium transition-colors hover:text-primary [&.active]:text-primary"
            >
              <Settings className="inline-block h-4 w-4" />
            </Link>
            <LoginButton />
          </div>
        </div>
      </header>
      <main className="container py-8">{children}</main>
      <footer className="border-t border-border/40 py-8 mt-16">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} CollabForge. All rights reserved.</p>
          <p className="text-sm text-muted-foreground">
            Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                window.location.hostname
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-primary"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
