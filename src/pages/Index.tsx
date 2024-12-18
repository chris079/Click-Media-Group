import React, { useState, useEffect } from 'react';
import GameHeader from '@/components/GameHeader';
import SignUpDialog from '@/components/SignUpDialog';
import { toast } from "sonner";
import { initializeWordList } from '@/utils/wordValidation';
import { supabase } from "@/integrations/supabase/client";
import GameContainer from '@/components/GameContainer';

const Index = () => {
  const [showSignUp, setShowSignUp] = useState(false);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    initializeWordList();
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignUp = async (email: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });
      
      if (error) {
        if (error.message.includes('rate_limit')) {
          toast.error("Please wait a minute before requesting another email");
        } else {
          toast.error(error.message);
        }
        return;
      }
      
      toast.success("Check your email for the login link!");
      setShowSignUp(false);
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <GameHeader />
      
      <GameContainer 
        session={session}
        onShowSignUp={() => setShowSignUp(true)}
      />

      <SignUpDialog
        open={showSignUp}
        onOpenChange={setShowSignUp}
        onSignUp={handleSignUp}
      />
    </div>
  );
};

export default Index;