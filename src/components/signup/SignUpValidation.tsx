import { supabase } from "@/integrations/supabase/client";

export const validateEmail = async (email: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('validate-email', {
      body: { email }
    });

    if (error) throw error;
    return data.valid;
  } catch (error) {
    console.error('Error validating email:', error);
    return false;
  }
};

export const validateSignUp = async (email: string, username: string) => {
  try {
    // First check if username exists (case insensitive)
    const { data: existingProfiles, error } = await supabase
      .from('profiles')
      .select('email, username')
      .ilike('username', username);

    if (error) throw error;

    // No existing profiles found
    if (!existingProfiles || existingProfiles.length === 0) {
      return { isExisting: false, shouldUpdate: false };
    }

    // Check if there's an exact match with the same email
    const exactMatch = existingProfiles.find(
      profile => 
        profile.username.toLowerCase() === username.toLowerCase() && 
        profile.email === email
    );

    if (exactMatch) {
      return { isExisting: true, shouldUpdate: false };
    }

    // Username exists but with different email or case
    return { isExisting: true, shouldUpdate: true };
  } catch (error) {
    console.error('Error validating signup:', error);
    throw error;
  }
};