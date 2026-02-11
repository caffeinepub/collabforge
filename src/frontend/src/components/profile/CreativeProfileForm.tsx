import { useState } from 'react';
import { useSaveOrUpdateCreativeProfile } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import type { CreativeProfile } from '../../backend';
import { toast } from 'sonner';

interface CreativeProfileFormProps {
  profile: CreativeProfile;
  onCancel: () => void;
  onSave: () => void;
}

export default function CreativeProfileForm({ profile, onCancel, onSave }: CreativeProfileFormProps) {
  const saveMutation = useSaveOrUpdateCreativeProfile();
  const [formData, setFormData] = useState({
    displayName: profile.displayName,
    bio: profile.bio,
    skillTags: profile.skillTags,
    lookingFor: profile.lookingFor,
    availability: profile.availability,
  });
  const [newSkillTag, setNewSkillTag] = useState('');
  const [newPortfolioLabel, setNewPortfolioLabel] = useState('');
  const [newPortfolioUrl, setNewPortfolioUrl] = useState('');
  const [portfolioLinks, setPortfolioLinks] = useState<Array<[string, string]>>(profile.portfolioLinks);

  const addSkillTag = () => {
    if (newSkillTag.trim() && !formData.skillTags.includes(newSkillTag.trim())) {
      setFormData({ ...formData, skillTags: [...formData.skillTags, newSkillTag.trim()] });
      setNewSkillTag('');
    }
  };

  const removeSkillTag = (tag: string) => {
    setFormData({ ...formData, skillTags: formData.skillTags.filter((t) => t !== tag) });
  };

  const addPortfolioLink = () => {
    if (newPortfolioLabel.trim() && newPortfolioUrl.trim()) {
      try {
        new URL(newPortfolioUrl);
        setPortfolioLinks([...portfolioLinks, [newPortfolioLabel.trim(), newPortfolioUrl.trim()]]);
        setNewPortfolioLabel('');
        setNewPortfolioUrl('');
      } catch {
        toast.error('Please enter a valid URL');
      }
    }
  };

  const removePortfolioLink = (index: number) => {
    setPortfolioLinks(portfolioLinks.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedProfile: CreativeProfile = {
      ...profile,
      ...formData,
      portfolioLinks,
      updatedAt: BigInt(Date.now() * 1000000),
    };

    try {
      await saveMutation.mutateAsync(updatedProfile);
      toast.success('Profile updated successfully!');
      onSave();
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to update profile');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name *</Label>
            <Input
              id="displayName"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
              placeholder="Tell others about yourself..."
            />
          </div>

          <div className="space-y-2">
            <Label>Skill Tags</Label>
            <div className="flex gap-2">
              <Input
                value={newSkillTag}
                onChange={(e) => setNewSkillTag(e.target.value)}
                placeholder="Add a skill (e.g., Singer, Coder, Writer)"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkillTag();
                  }
                }}
              />
              <Button type="button" onClick={addSkillTag} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.skillTags.map((tag) => (
                <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeSkillTag(tag)}>
                  {tag} <X className="ml-1 h-3 w-3" />
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lookingFor">Looking For</Label>
            <Textarea
              id="lookingFor"
              value={formData.lookingFor}
              onChange={(e) => setFormData({ ...formData, lookingFor: e.target.value })}
              rows={3}
              placeholder="What kind of collaborators are you looking for?"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="availability">Availability</Label>
            <Input
              id="availability"
              value={formData.availability}
              onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
              placeholder="e.g., 10 hours/week, weekends only"
            />
          </div>

          <div className="space-y-2">
            <Label>Portfolio Links</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={newPortfolioLabel}
                  onChange={(e) => setNewPortfolioLabel(e.target.value)}
                  placeholder="Label (e.g., SoundCloud)"
                  className="flex-1"
                />
                <Input
                  value={newPortfolioUrl}
                  onChange={(e) => setNewPortfolioUrl(e.target.value)}
                  placeholder="URL"
                  className="flex-1"
                />
                <Button type="button" onClick={addPortfolioLink} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {portfolioLinks.map(([label, url], idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-muted rounded">
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">
                      {label}
                    </a>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removePortfolioLink(idx)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={saveMutation.isPending} className="flex-1">
              {saveMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
