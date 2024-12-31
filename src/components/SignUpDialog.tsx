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
        // Only allow closing through the success callback
        if (isOpen) {
          onOpenChange(isOpen);
        }
      }}
      modal={true}
    >
      <DialogContent 
        className="sm:max-w-[425px]"
        onPointerDownOutside={(e) => {
          e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          e.preventDefault();
        }}
      >
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
          completionTime={completionTime}
          gameWon={gameWon}
        />
      </DialogContent>
    </Dialog>
  );
};

export default SignUpDialog;