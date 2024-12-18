import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

interface UsernameInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const UsernameInput = ({ value, onChange, disabled }: UsernameInputProps) => {
  const [usernameError, setUsernameError] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const checkUsername = async () => {
      if (!value) {
        setUsernameError('');
        return;
      }

      setIsChecking(true);
      try {
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('username')
          .eq('username', value)
          .maybeSingle();

        if (existingProfile) {
          setUsernameError('This username is already taken');
        } else {
          setUsernameError('');
        }
      } catch (error) {
        console.error('Error checking username:', error);
        setUsernameError('');
      } finally {
        setIsChecking(false);
      }
    };

    const timeoutId = setTimeout(checkUsername, 500);
    return () => clearTimeout(timeoutId);
  }, [value]);

  return (
    <div className="space-y-2">
      <Label htmlFor="username">Username</Label>
      <Input
        id="username"
        placeholder="Enter your username"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required
        className={usernameError ? "border-red-500" : ""}
      />
      {usernameError && (
        <Alert variant="destructive">
          <AlertDescription>{usernameError}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default UsernameInput;