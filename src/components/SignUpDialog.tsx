import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import SignUpForm from './auth/SignUpForm';
import LoginForm from './auth/LoginForm';

interface SignUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  currentScore?: number;
  word?: string;
}

const SignUpDialog = ({ open, onOpenChange, onSuccess, currentScore, word }: SignUpDialogProps) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [activeTab, setActiveTab] = useState('signup');

  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (profile) {
        onSuccess();
        toast.success(`Welcome back, ${profile.username}!`);
      }
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleEmailChange = (newEmail: string) => {
    setEmail(newEmail);
    if (newEmail) {
      validateEmail(newEmail);
    } else {
      setEmailError('');
    }
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={() => {}} 
      modal
    >
      <DialogContent 
        className="sm:max-w-md bg-white text-gray-900 border-gray-200" 
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-[#0047BB]">Join Click Media Group Wordle!</DialogTitle>
          <DialogDescription className="text-gray-600">
            Sign up or log in to save your progress and compete with others!
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="signup" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 bg-gray-100">
            <TabsTrigger 
              value="signup"
              className="data-[state=active]:bg-[#0047BB] data-[state=active]:text-white"
            >
              Sign Up
            </TabsTrigger>
            <TabsTrigger 
              value="login"
              className="data-[state=active]:bg-[#0047BB] data-[state=active]:text-white"
            >
              Login
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signup">
            <SignUpForm
              email={email}
              setEmail={handleEmailChange}
              emailError={emailError}
              isSubmitting={isSubmitting}
              onSuccess={onSuccess}
              currentScore={currentScore}
              word={word}
            />
          </TabsContent>

          <TabsContent value="login">
            <LoginForm
              email={email}
              setEmail={handleEmailChange}
              emailError={emailError}
              isSubmitting={isSubmitting}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SignUpDialog;