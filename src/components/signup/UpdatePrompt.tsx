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
      <Alert>
        <AlertDescription>
          This email is already associated with a different username. 
          Would you like to continue with your new username?
        </AlertDescription>
      </Alert>
      <div className="flex justify-center">
        <Button 
          onClick={onProceed} 
          disabled={isSubmitting}
          className="w-full"
        >
          Continue with New Username
        </Button>
      </div>
    </div>
  );
};

export default UpdatePrompt;