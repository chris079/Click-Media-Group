import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface SignUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  currentScore?: number;
  word?: string;
}

const SignUpDialog = ({ open, onOpenChange, onSuccess, currentScore, word }: SignUpDialogProps) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
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
      // First create the profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            username,
            email,
            terms_accepted: termsAccepted,
          }
        ])
        .select()
        .single();

      if (profileError) throw profileError;

      // If we have a score to record, save it
      if (currentScore && word && profile) {
        const { error: scoreError } = await supabase
          .from('scores')
          .insert([
            {
              profile_id: profile.id,
              word,
              attempts: currentScore,
            }
          ]);

        if (scoreError) throw scoreError;
      }

      toast.success("Successfully registered!");
      onSuccess();
    } catch (error: any) {
      if (error.message.includes('unique constraint')) {
        toast.error("Username or email already exists");
      } else {
        toast.error("An error occurred. Please try again.");
      }
      console.error('Error during signup:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={() => {}} // Prevent dialog from being closed
      modal
    >
      <DialogContent 
        className="sm:max-w-md" 
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Join the Leaderboard!</DialogTitle>
          <DialogDescription>
            Enter your details to save your progress and compete with others!
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
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
              I accept the terms and conditions. My email will not be displayed on the leaderboard.
            </Label>
          </div>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Join Leaderboard'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SignUpDialog;