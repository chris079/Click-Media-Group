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
        onSuccess={() => setShowSignUp(false)}
      />
    </div>
  );
};

export default Index;