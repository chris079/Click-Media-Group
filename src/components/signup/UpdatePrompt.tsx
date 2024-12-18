import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface UpdatePromptProps {
  existingUsername: string;
  newUsername: string;
  onUpdate: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const UpdatePrompt = ({
  existingUsername,
  newUsername,
  onUpdate,
  onCancel,
  isSubmitting
}: UpdatePromptProps) => {
  return (
    <div className="space-y-4">
      <Alert>
        <AlertDescription>
          This email is already registered with the username "{existingUsername}". 
          Would you like to update your username to "{newUsername}"?
        </AlertDescription>
      </Alert>
      <div className="flex gap-2">
        <Button 
          onClick={onUpdate} 
          disabled={isSubmitting}
          className="flex-1"
        >
          Yes, Update Username
        </Button>
        <Button 
          onClick={onCancel} 
          variant="outline"
          className="flex-1"
        >
          No, Keep Current
        </Button>
      </div>
    </div>
  );
};

export default UpdatePrompt;