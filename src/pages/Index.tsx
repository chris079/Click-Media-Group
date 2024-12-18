import React, { useState, useEffect } from 'react';
import WordGrid from '@/components/WordGrid';
import Keyboard from '@/components/Keyboard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { z } from "zod";
import { Settings, BarChart2 } from 'lucide-react';
import { VALID_WORDS } from '@/data/validWords';

const userSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
});

const Index = () => {
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [wordOfTheDay, setWordOfTheDay] = useState('HOUSE');
  const [showSignUp, setShowSignUp] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  const handleKeyDown = (event: KeyboardEvent) => {
    if (gameOver || showSignUp) return;

    if (event.key === 'Enter' && currentGuess.length === 5) {
      if (!VALID_WORDS.includes(currentGuess.toLowerCase())) {
        toast.error("Not a valid word!");
        return;
      }
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
  }, [currentGuess, gameOver, showSignUp]);

  const submitGuess = () => {
    if (currentGuess.length !== 5) {
      toast.error("Word must be 5 letters!");
      return;
    }

    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);
    setCurrentGuess('');

    if (currentGuess === wordOfTheDay) {
      setGameWon(true);
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

  const shareToLinkedIn = () => {
    const text = `I solved Click's Property Wordle in ${guesses.length} tries! Can you beat my score?`;
    const url = 'https://www.linkedin.com/sharing/share-offsite/?' + new URLSearchParams({
      url: window.location.href,
      title: text,
    }).toString();
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-4 px-4">
            <Button variant="ghost" size="icon">
              <Settings className="h-6 w-6" />
            </Button>
            <img 
              src="/lovable-uploads/a052ec4b-df04-4768-80ea-fa2d304af6ef.png" 
              alt="Click Logo" 
              className="h-16 mx-auto"
            />
            <Button variant="ghost" size="icon">
              <BarChart2 className="h-6 w-6" />
            </Button>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-6">Click's Property Wordle</h2>
          {gameOver && (
            <p className={`text-2xl font-bold mt-4 ${gameWon ? 'text-green-500' : 'text-red-500'}`}>
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
            if (!showSignUp && currentGuess.length < 5) {
              setCurrentGuess(prev => prev + key);
            }
          }}
          onEnter={() => {
            if (!showSignUp && currentGuess.length === 5) {
              if (!VALID_WORDS.includes(currentGuess.toLowerCase())) {
                toast.error("Not a valid word!");
                return;
              }
              submitGuess();
            }
          }}
          onDelete={() => {
            if (!showSignUp) {
              setCurrentGuess(prev => prev.slice(0, -1));
            }
          }}
          usedLetters={{}}
        />

        {gameOver && (
          <div className="flex justify-center gap-4 mt-6">
            <Button onClick={shareToLinkedIn}>Share on LinkedIn</Button>
            <Button onClick={() => toast.info("Leaderboard coming soon!")}>View Leaderboard</Button>
          </div>
        )}

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
                  onKeyDown={(e) => e.stopPropagation()}
                />
              </div>
              <div>
                <Input
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  onKeyDown={(e) => e.stopPropagation()}
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  onKeyDown={(e) => e.stopPropagation()}
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