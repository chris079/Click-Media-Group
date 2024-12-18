import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface UpdatePromptProps {
  existingUsername: string;
  onProceed: () => void;
  isSubmitting: boolean;
}

const UpdatePrompt = ({
  existingUsername,
  onProceed,
  isSubmitting
}: UpdatePromptProps) => {
  return (
    <div className="space-y-4">
      <Alert>
        <AlertDescription>
          This email was previously used with the username "{existingUsername}". 
          You can continue with your new username if you'd like.
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