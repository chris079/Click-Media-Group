import React, { useState, useEffect } from 'react';
import WordGrid from '@/components/WordGrid';
import Keyboard from '@/components/Keyboard';
import GameHeader from '@/components/GameHeader';
import SignUpDialog from '@/components/SignUpDialog';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { VALID_WORDS, isValidWord } from '@/data/validWords';
import { shareToLinkedIn } from '@/utils/shareUtils';

const Index = () => {
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [wordOfTheDay] = useState('HOUSE');
  const [showSignUp, setShowSignUp] = useState(false);
  const [usedLetters, setUsedLetters] = useState<{
    [key: string]: 'correct' | 'present' | 'absent' | undefined;
  }>({});

  const handleKeyDown = (event: KeyboardEvent) => {
    if (gameOver || showSignUp) return;

    if (event.key === 'Enter' && currentGuess.length === 5) {
      if (!isValidWord(currentGuess)) {
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
      toast.error(`Game Over! The word was ${wordOfTheDay}`);
    } else if (newGuesses.length >= 3) {
      setShowSignUp(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <GameHeader />
        
        {gameOver && (
          <p className={`text-2xl font-bold mt-4 text-center ${gameWon ? 'text-green-500' : 'text-red-500'}`}>
            {wordOfTheDay}
          </p>
        )}

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
              if (!isValidWord(currentGuess)) {
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
          usedLetters={usedLetters}
        />

        {gameOver && (
          <div className="flex justify-center gap-4 mt-6">
            <Button onClick={() => shareToLinkedIn(guesses.length)}>
              Share on LinkedIn
            </Button>
            <Button onClick={() => toast.info("Leaderboard coming soon!")}>
              View Leaderboard
            </Button>
          </div>
        )}

        <SignUpDialog
          open={showSignUp}
          onOpenChange={setShowSignUp}
          onSignUp={() => {
            // This will be connected to Supabase later
            toast.success("Successfully signed up!");
          }}
        />
      </div>
    </div>
  );
};

export default Index;
