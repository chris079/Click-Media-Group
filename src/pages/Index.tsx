import React, { useState, useEffect } from 'react';
import WordGrid from '@/components/WordGrid';
import Keyboard from '@/components/Keyboard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { z } from "zod";

const userSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
});

const Index = () => {
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [wordOfTheDay, setWordOfTheDay] = useState('HOUSE'); // Example word
  const [showSignUp, setShowSignUp] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  const handleKeyDown = (event: KeyboardEvent) => {
    if (gameOver) return;

    if (event.key === 'Enter' && currentGuess.length === 5) {
      submitGuess();
    } else if (event.key === 'Backspace') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (/^[A-Za-z]$/.test(event.key) && currentGuess.length < 5) {
      setCurrentGuess(prev => prev + event.key.toUpperCase());
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentGuess, gameOver]);

  const submitGuess = () => {
    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);
    setCurrentGuess('');

    if (currentGuess === wordOfTheDay) {
      setGameOver(true);
      toast.success("Congratulations! You've won!");
    } else if (newGuesses.length >= 6) {
      setGameOver(true);
    } else if (newGuesses.length >= 3) {
      setShowSignUp(true);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      userSchema.parse(formData);
      // Here you would typically send the data to your backend
      toast.success("Successfully signed up! You're now on the leaderboard!");
      setShowSignUp(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach(err => {
          toast.error(err.message);
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <img 
            src="/lovable-uploads/a052ec4b-df04-4768-80ea-fa2d304af6ef.png" 
            alt="Click Logo" 
            className="h-16 mx-auto mb-4"
          />
          {gameOver && (
            <p className={`text-2xl font-bold mt-4 ${guesses[guesses.length - 1] === wordOfTheDay ? 'text-green-500' : 'text-red-500'}`}>
              {wordOfTheDay}
            </p>
          )}
        </div>

        <WordGrid
          guesses={guesses}
          currentGuess={currentGuess}
          wordOfTheDay={wordOfTheDay}
          gameOver={gameOver}
        />
        
        <Keyboard
          onKeyPress={(key) => {
            if (currentGuess.length < 5) {
              setCurrentGuess(prev => prev + key);
            }
          }}
          onEnter={submitGuess}
          onDelete={() => setCurrentGuess(prev => prev.slice(0, -1))}
          usedLetters={{}}
        />

        <Dialog open={showSignUp} onOpenChange={setShowSignUp}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Join the Leaderboard!</DialogTitle>
              <DialogDescription>
                Sign up to track your progress and compete with other players.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <Input
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                />
              </div>
              <div>
                <Input
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <Button type="submit" className="w-full">Join Leaderboard</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Index;