import { supabase } from "@/integrations/supabase/client";

export const validateSignUp = async (email: string, username: string) => {
  // First check if the email exists with exact username match
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('username')
    .match({ email: email, username: username })
    .maybeSingle();

  if (existingProfile) {
    return { isExisting: true, shouldUpdate: false };
  }

  // Check if email exists with different username
  const { data: emailProfile } = await supabase
    .from('profiles')
    .select('username')
    .eq('email', email)
    .maybeSingle();

  if (emailProfile) {
    return { isExisting: true, shouldUpdate: true };
  }

  return { isExisting: false, shouldUpdate: false };
};