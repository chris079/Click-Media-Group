import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SignUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  currentScore?: number;
  word?: string;
}

const SignUpDialog = ({ open, onOpenChange, onSuccess, currentScore, word }: SignUpDialogProps) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [activeTab, setActiveTab] = useState('signup');

  useEffect(() => {
    // Check for existing session on mount
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

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (newEmail) {
      validateEmail(newEmail);
    } else {
      setEmailError('');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single();

      if (!profile) {
        toast.error("No account found with this email");
        return;
      }

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          data: {
            username: profile.username
          }
        }
      });

      if (error) throw error;

      toast.success("Magic link sent! Check your email to log in.");
    } catch (error: any) {
      console.error('Error during login:', error);
      toast.error(error.message || "An error occurred during login");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !termsAccepted) {
      toast.error("Please fill in all fields and accept the terms");
      return;
    }

    if (!validateEmail(email)) {
      return;
    }

    setIsSubmitting(true);
    try {
      // First check if username or email already exists
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
        setIsSubmitting(false);
        return;
      }

      // If no existing profile found, proceed with creation
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

      // Send magic link for authentication
      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          data: {
            username
          }
        }
      });

      if (authError) throw authError;

      // If we have a score to record, save it
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={() => {}} // Prevent dialog from being closed
      modal
    >
      <DialogContent 
        className="sm:max-w-md" 
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Join the Game!</DialogTitle>
          <DialogDescription>
            Sign up or log in to save your progress and compete with others!
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="signup" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
            <TabsTrigger value="login">Login</TabsTrigger>
          </TabsList>

          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={handleEmailChange}
                  disabled={isSubmitting}
                  required
                  className={emailError ? "border-red-500" : ""}
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
                />
                <Label htmlFor="terms" className="text-sm">
                  I accept the terms and conditions. My email will not be displayed on the leaderboard.
                </Label>
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting || !!emailError}
              >
                {isSubmitting ? 'Signing up...' : 'Sign Up'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={handleEmailChange}
                  disabled={isSubmitting}
                  required
                  className={emailError ? "border-red-500" : ""}
                />
                {emailError && (
                  <Alert variant="destructive">
                    <AlertDescription>{emailError}</AlertDescription>
                  </Alert>
                )}
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting || !!emailError}
              >
                {isSubmitting ? 'Sending link...' : 'Send Magic Link'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SignUpDialog;