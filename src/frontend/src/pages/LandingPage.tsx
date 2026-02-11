import LoginButton from '../components/auth/LoginButton';
import { Sparkles, Users, FolderOpen, Award } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <header className="container py-6">
        <div className="flex items-center justify-between">
          <img src="/assets/generated/collabforge-logo.dim_1024x256.png" alt="CollabForge" className="h-10" />
          <LoginButton />
        </div>
      </header>

      <main className="container">
        <section className="py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Find Your Perfect Creative Partner
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            CollabForge matches artists, singers, coders, and writers based on skills, style, and creative chemistry.
            Stop scrolling, start creating.
          </p>
          <div className="flex justify-center">
            <LoginButton />
          </div>
          <div className="mt-16">
            <img
              src="/assets/generated/creative-tools-illustration.dim_1200x800.png"
              alt="Creative collaboration"
              className="max-w-3xl mx-auto rounded-lg shadow-2xl"
            />
          </div>
        </section>

        <section className="py-20 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Smart Matching</h3>
            <p className="text-muted-foreground">
              Take a quiz and get matched with collaborators who share your style, goals, and vibe.
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <FolderOpen className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Project Discovery</h3>
            <p className="text-muted-foreground">
              Browse projects looking for collaborators or post your own and find the perfect team.
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Collaboration Tools</h3>
            <p className="text-muted-foreground">
              Built-in task boards and messaging to keep your projects organized and moving forward.
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Award className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Build Your Reputation</h3>
            <p className="text-muted-foreground">
              Rate collaborators after projects to build trust and showcase your reliability.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
