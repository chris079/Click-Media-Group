import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface UpdatePromptProps {
  onProceed: () => void;
  isSubmitting: boolean;
}

const UpdatePrompt = ({
  onProceed,
  isSubmitting
}: UpdatePromptProps) => {
  return (
    <div className="space-y-4">
      <Alert variant="destructive">
        <AlertDescription>
          This username is already taken by another user. 
          Please choose a different username to continue.
        </AlertDescription>
      </Alert>
      <div className="flex justify-center">
        <Button 
          onClick={onProceed} 
          disabled={isSubmitting}
          className="w-full"
        >
          Choose Different Username
        </Button>
      </div>
    </div>
  );
};

export default UpdatePrompt;