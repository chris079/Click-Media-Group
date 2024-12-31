import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SignUpForm from './auth/SignUpForm';

interface SignUpDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const SignUpDialog = ({ isOpen, onOpenChange }: SignUpDialogProps) => {
  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        // Only allow closing if we're opening the dialog
        if (open) onOpenChange(open);
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sign up to save your progress!</DialogTitle>
        </DialogHeader>
        <SignUpForm onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default SignUpDialog;