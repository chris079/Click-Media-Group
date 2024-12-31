import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import UsernameInput from '../UsernameInput';
import { validateEmail } from '../signup/SignUpValidation';
import { validateSignUp } from '../signup/SignUpValidation';

interface SignUpFormProps {
  email: string;
  setEmail: (email: string) => void;
  emailError: string;
  isSubmitting: boolean;
  onSuccess: () => void;
  currentScore?: number;
  word?: string;
  completionTime?: string;
  gameWon?: boolean;
}

const SignUpForm = ({
  email,
  setEmail,
  emailError,
  isSubmitting,
  onSuccess,
  currentScore,
  word,
  completionTime,
  gameWon
}: SignUpFormProps) => {
  const [username, setUsername] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !termsAccepted) {
      toast.error("Please fill in all fields and accept the terms");
      return;
    }

    try {
      // First validate email format and domain
      const isEmailValid = await validateEmail(email);
      if (!isEmailValid) {
        toast.error("Please enter a valid email address");
        return;
      }

      // Check username and email combination
      const { isExisting, shouldUpdate } = await validateSignUp(email, username);

      if (isExisting && !shouldUpdate) {
        // Username and email match - welcome back!
        toast.success("Welcome back!");
        onSuccess();
        return;
      }

      if (isExisting && shouldUpdate) {
        // Username exists but email doesn't match
        toast.error("This username is already taken by another user. Please choose a different username.");
        setShowUpdatePrompt(true);
        return;
      }

      // Create new profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            username,
            email,
            terms_accepted: termsAccepted,
          }
        ])
        .select()
        .single();

      if (profileError) throw profileError;

      if (currentScore !== undefined && word && profile) {
        const { error: scoreError } = await supabase
          .from('scores')
          .insert([
            {
              profile_id: profile.id,
              word,
              attempts: currentScore,
              completion_time: completionTime,
              is_win: gameWon
            }
          ]);

        if (scoreError) throw scoreError;
      }

      toast.success("Profile created successfully!");
      onSuccess();
    } catch (error: any) {
      console.error('Error during signup:', error);
      toast.error(error.message || "An error occurred during signup");
    }
  };

  if (showUpdatePrompt) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertDescription>
            This username is already associated with a different email address. 
            Please choose a different username to continue.
          </AlertDescription>
        </Alert>
        <Button 
          onClick={() => setShowUpdatePrompt(false)} 
          className="w-full"
        >
          Choose Different Username
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      <UsernameInput
        value={username}
        onChange={setUsername}
        disabled={isSubmitting}
      />
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
          required
          className={`${emailError ? "border-red-500" : ""} bg-white border-gray-200 text-gray-900`}
        />
        {emailError && (
          <Alert variant="destructive">
            <AlertDescription>{emailError}</AlertDescription>
          </Alert>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="terms"
          checked={termsAccepted}
          onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
          disabled={isSubmitting}
          className="border-gray-300 data-[state=checked]:bg-[#0047BB]"
        />
        <Label htmlFor="terms" className="text-sm text-gray-600">
          I accept the terms and conditions. My email will not be displayed on the leaderboard.
        </Label>
      </div>
      <Button 
        type="submit" 
        className="w-full bg-[#0047BB] text-white hover:bg-[#003899]" 
        disabled={isSubmitting || !!emailError}
      >
        {isSubmitting ? 'Signing up...' : 'Sign Up'}
      </Button>
    </form>
  );
};

export default SignUpForm;