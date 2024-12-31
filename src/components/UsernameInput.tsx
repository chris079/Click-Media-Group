import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface UsernameInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  shouldCheck?: boolean;
}

const UsernameInput = ({ value, onChange, disabled }: UsernameInputProps) => {
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
      />
    </div>
  );
};

export default UsernameInput;