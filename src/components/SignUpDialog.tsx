import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import UsernameInput from './UsernameInput';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface SignUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  currentScore?: number;
  word?: string;
  completionTime?: string;
}

const SignUpDialog = ({ 
  open, 
  onOpenChange, 
  onSuccess, 
  currentScore, 
  word,
  completionTime 
}: SignUpDialogProps) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !termsAccepted) {
      toast.error("Please fill in all fields and accept the terms");
      return;
    }

    setIsSubmitting(true);
    try {
      // Check for existing username/email combinations
      const { data: existingProfiles } = await supabase
        .from('profiles')
        .select('*')
        .or(`username.eq.${username},email.eq.${email}`);

      if (existingProfiles && existingProfiles.length > 0) {
        const existingProfile = existingProfiles[0];
        
        if (existingProfile.username === username && existingProfile.email !== email) {
          toast.error("This username is already taken. Please choose another one.");
          setIsSubmitting(false);
          return;
        }
        
        if (existingProfile.email === email && existingProfile.username !== username) {
          if (!confirm("You're using a different username than before. Are you sure you want to continue?")) {
            setIsSubmitting(false);
            return;
          }
        }
      }

      // Create or update profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .upsert([
          {
            email,
            username,
            terms_accepted: termsAccepted
          }
        ])
        .select()
        .single();

      if (profileError) throw profileError;

      // Save score if game is complete
      if (currentScore !== undefined && word && profile) {
        const { error: scoreError } = await supabase
          .from('scores')
          .insert([
            {
              profile_id: profile.id,
              word,
              attempts: currentScore,
              completion_time: completionTime
            }
          ]);

        if (scoreError) throw scoreError;
      }

      toast.success("Score saved successfully!");
      onSuccess();
    } catch (error: any) {
      console.error('Error during signup:', error);
      toast.error(error.message || "An error occurred during signup");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Want to see your name climb to the top?</DialogTitle>
          <DialogDescription>
            Add your username and email to save your scores, compete with others, and claim your spot on the leaderboard.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <UsernameInput
            value={username}
            onChange={setUsername}
            disabled={isSubmitting}
          />
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
              disabled={isSubmitting}
            />
            <Label htmlFor="terms" className="text-sm">
              I accept the terms and conditions
            </Label>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Score'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SignUpDialog;