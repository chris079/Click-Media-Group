import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { z } from "zod";
import { useState } from "react";

const userSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

interface SignUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSignUp: (email: string) => void;
}

const SignUpDialog = ({ open, onOpenChange, onSignUp }: SignUpDialogProps) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      userSchema.parse({ email });
      setIsSubmitting(true);
      await onSignUp(email);
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach(err => {
          toast.error(err.message);
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Join the Leaderboard!</DialogTitle>
          <DialogDescription>
            Enter your email to sign up and track your progress.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Continue with Email'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SignUpDialog;