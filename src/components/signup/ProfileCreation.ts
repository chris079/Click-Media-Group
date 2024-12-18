import React from 'react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import confetti from 'canvas-confetti';

interface ProfileCreationProps {
  email: string;
  username: string;
  termsAccepted: boolean;
  gameWon: boolean;
  currentScore?: number;
  word?: string;
  completionTime?: string;
  onSuccess: () => void;
}

export const createProfileAndScore = async ({
  email,
  username,
  termsAccepted,
  gameWon,
  currentScore,
  word,
  completionTime,
  onSuccess
}: ProfileCreationProps) => {
  try {
    const capitalizedUsername = username.charAt(0).toUpperCase() + username.slice(1);
    
    // Check if profile exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .match({ email, username: capitalizedUsername })
      .maybeSingle();

    if (existingProfile) {
      toast.success("Welcome back!");
      onSuccess();
      return true;
    }

    // Create new profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          email,
          username: capitalizedUsername,
          terms_accepted: termsAccepted
        }
      ])
      .select()
      .maybeSingle();

    if (profileError) {
      if (profileError.code === '23505') {
        if (profileError.message?.includes('profiles_email_key')) {
          toast.error("This email is already registered with a different username");
          return false;
        }
        if (profileError.message?.includes('profiles_username_key')) {
          toast.error("This username is already taken by another user");
          return false;
        }
      }
      throw profileError;
    }

    if (!profile) {
      toast.error("Failed to create profile");
      return false;
    }

    // Save score regardless of win/loss if we have the required data
    if (currentScore !== undefined && word && completionTime) {
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

    // Only trigger confetti for wins
    if (gameWon) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
    
    toast.success("Profile created successfully!");
    onSuccess();
    return true;
  } catch (error: any) {
    console.error('Error creating profile:', error);
    toast.error(error.message || "An error occurred while creating profile");
    return false;
  }
};