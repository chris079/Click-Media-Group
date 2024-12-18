import React from 'react';
import { DialogHeader as BaseDialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const DialogHeader = () => {
  return (
    <BaseDialogHeader>
      <DialogTitle>Want to see your name climb to the top?</DialogTitle>
      <DialogDescription>
        Add your username and email to save your scores, compete with others, and claim your spot on the leaderboard.
      </DialogDescription>
    </BaseDialogHeader>
  );
};

export default DialogHeader;