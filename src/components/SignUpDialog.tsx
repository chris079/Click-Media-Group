import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SignUpForm from './auth/SignUpForm';

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
  gameWon
}: SignUpDialogProps) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <Dialog 
      open={open} 
      onOpenChange={(isOpen) => {
        // Only allow closing if we're opening the dialog or if form is submitted
        if (isOpen || !isSubmitting) {
          onOpenChange(isOpen);
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sign up to save your progress!</DialogTitle>
        </DialogHeader>
        <SignUpForm 
          email={email}
          setEmail={setEmail}
          emailError={emailError}
          isSubmitting={isSubmitting}
          onSuccess={onSuccess}
          currentScore={currentScore}
          word={word}
        />
      </DialogContent>
    </Dialog>
  );
};

export default SignUpDialog;