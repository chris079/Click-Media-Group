import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  emailError: string;
  isSubmitting: boolean;
}

const LoginForm = ({
  email,
  setEmail,
  emailError,
  isSubmitting
}: LoginFormProps) => {
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

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
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="login-email">Email</Label>
        <Input
          id="login-email"
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
      <Button 
        type="submit" 
        className="w-full bg-[#0047BB] text-white hover:bg-[#003899]" 
        disabled={isSubmitting || !!emailError}
      >
        {isSubmitting ? 'Sending link...' : 'Send Magic Link'}
      </Button>
    </form>
  );
};

export default LoginForm;