import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import SignUpForm from './signup/SignUpForm';
import UpdatePrompt from './signup/UpdatePrompt';
import { validateSignUp } from './signup/SignUpValidation';
import confetti from 'canvas-confetti';

interface SignUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  currentScore?: number;
  word?: string;
  completionTime?: string;
  gameWon?: boolean;
}

const SignUpDialog = ({ 
  open, 
  onOpenChange, 
  onSuccess, 
  currentScore, 
  word,
  completionTime,
  gameWon = false
}: SignUpDialogProps) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);

  const createProfileAndScore = async () => {
    try {
      const capitalizedUsername = username.charAt(0).toUpperCase() + username.slice(1);
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            email,
            username: capitalizedUsername,
            terms_accepted: termsAccepted
          }
        ])
        .select()
        .maybeSingle();

      if (profileError) {
        if (profileError.code === '23505') {
          toast.error("This email is already registered. Please use another email.");
          return false;
        }
        throw profileError;
      }

      if (!profile) {
        toast.error("Failed to create profile");
        return false;
      }

      // Only save score if game was won
      if (gameWon && currentScore !== undefined && word && completionTime) {
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
      const validation = await validateSignUp(email, username);

      if (validation.isExisting && !validation.shouldUpdate) {
        toast.success("Welcome back!");
        onSuccess();
        return;
      }

      if (validation.shouldUpdate) {
        setShowUpdatePrompt(true);
        return;
      }

      const success = await createProfileAndScore();
      if (success) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        toast.success("Profile created successfully!");
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
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
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
            shouldCheckUsername={!!email}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SignUpDialog;