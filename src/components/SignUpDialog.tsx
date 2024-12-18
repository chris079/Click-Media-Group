import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import SignUpForm from './signup/SignUpForm';
import UpdatePrompt from './signup/UpdatePrompt';

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
  const [existingUsername, setExistingUsername] = useState('');
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);

  const createProfileAndScore = async () => {
    try {
      // Check if username is taken
      const { data: existingUsername } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .maybeSingle();

      if (existingUsername) {
        toast.error("This username is already taken. Please choose another one.");
        return false;
      }

      // Create new profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            email,
            username,
            terms_accepted: termsAccepted
          }
        ])
        .select()
        .maybeSingle();

      if (profileError) throw profileError;
      if (!profile) {
        toast.error("Failed to create profile");
        return false;
      }

      // Save score if game is complete
      if (currentScore !== undefined && word && profile && completionTime) {
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

      return true;
    } catch (error: any) {
      console.error('Error creating profile:', error);
      toast.error(error.message || "An error occurred while creating profile");
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !termsAccepted) {
      toast.error("Please fill in all fields and accept the terms");
      return;
    }

    setIsSubmitting(true);
    try {
      // First check if the email exists
      const { data: existingEmail } = await supabase
        .from('profiles')
        .select('username')
        .eq('email', email)
        .maybeSingle();

      if (existingEmail) {
        setExistingUsername(existingEmail.username);
        setShowUpdatePrompt(true);
        setIsSubmitting(false);
        return;
      }

      const success = await createProfileAndScore();
      if (success) {
        toast.success("Score saved successfully!");
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error during signup:', error);
      toast.error(error.message || "An error occurred during signup");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProceedWithNewUsername = async () => {
    setIsSubmitting(true);
    try {
      const success = await createProfileAndScore();
      if (success) {
        toast.success("Score saved successfully with new username!");
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error creating profile:', error);
      toast.error(error.message || "An error occurred while creating profile");
    } finally {
      setIsSubmitting(false);
      setShowUpdatePrompt(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Want to see your name climb to the top?</DialogTitle>
          <DialogDescription>
            Add your username and email to save your scores, compete with others, and claim your spot on the leaderboard.
          </DialogDescription>
        </DialogHeader>

        {showUpdatePrompt ? (
          <UpdatePrompt
            existingUsername={existingUsername}
            onProceed={handleProceedWithNewUsername}
            isSubmitting={isSubmitting}
          />
        ) : (
          <SignUpForm
            username={username}
            setUsername={setUsername}
            email={email}
            setEmail={setEmail}
            termsAccepted={termsAccepted}
            setTermsAccepted={setTermsAccepted}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SignUpDialog;