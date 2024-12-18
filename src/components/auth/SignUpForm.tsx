import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import UsernameInput from '../UsernameInput';

interface SignUpFormProps {
  email: string;
  setEmail: (email: string) => void;
  emailError: string;
  isSubmitting: boolean;
  onSuccess: () => void;
  currentScore?: number;
  word?: string;
}

const SignUpForm = ({
  email,
  setEmail,
  emailError,
  isSubmitting,
  onSuccess,
  currentScore,
  word
}: SignUpFormProps) => {
  const [username, setUsername] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !termsAccepted) {
      toast.error("Please fill in all fields and accept the terms");
      return;
    }

    try {
      const { data: existingProfiles, error: checkError } = await supabase
        .from('profiles')
        .select('username, email')
        .or(`username.eq.${username},email.eq.${email}`);

      if (checkError) throw checkError;

      if (existingProfiles && existingProfiles.length > 0) {
        const existingProfile = existingProfiles[0];
        if (existingProfile.username === username) {
          toast.error("This username is already taken. Please choose another one.");
        } else if (existingProfile.email === email) {
          toast.error("This email is already registered. Please use another email.");
        }
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            username,
            email,
            terms_accepted: termsAccepted,
            email_verified: false
          }
        ])
        .select()
        .single();

      if (profileError) throw profileError;

      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          data: {
            username
          }
        }
      });

      if (authError) throw authError;

      if (currentScore && word && profile) {
        const { error: scoreError } = await supabase
          .from('scores')
          .insert([
            {
              profile_id: profile.id,
              word,
              attempts: currentScore,
            }
          ]);

        if (scoreError) throw scoreError;
      }

      toast.success("Check your email for the magic link to complete registration!");
      onSuccess();
    } catch (error: any) {
      console.error('Error during signup:', error);
      toast.error(error.message || "An error occurred during signup");
    }
  };

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