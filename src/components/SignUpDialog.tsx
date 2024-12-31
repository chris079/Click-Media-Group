import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import SignUpForm from './signup/SignUpForm';
import UpdatePrompt from './signup/UpdatePrompt';
import { validateSignUp } from './signup/SignUpValidation';
import DialogHeader from './signup/DialogHeader';
import { createProfileAndScore } from './signup/ProfileCreation';
import { toast } from "sonner";

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

      await createProfileAndScore({
        email,
        username,
        termsAccepted,
        gameWon,
        currentScore,
        word,
        completionTime,
        onSuccess
      });
    } catch (error: any) {
      console.error('Error during signup:', error);
      toast.error(error.message || "An error occurred during signup");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProceedWithNewUsername = () => {
    setShowUpdatePrompt(false);
    setUsername('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader />
        
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
            shouldCheckUsername={false}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SignUpDialog;