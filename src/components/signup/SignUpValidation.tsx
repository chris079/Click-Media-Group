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
  // Check if username exists and get associated email
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('email')
    .eq('username', username.charAt(0).toUpperCase() + username.slice(1))
    .maybeSingle();

  if (!existingProfile) {
    return { isExisting: false, shouldUpdate: false };
  }

  // If username exists, check if email matches
  if (existingProfile.email === email) {
    return { isExisting: true, shouldUpdate: false };
  }

  // Username exists but email doesn't match
  return { isExisting: true, shouldUpdate: true };
};