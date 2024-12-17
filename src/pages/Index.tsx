import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import WordGrid from '@/components/WordGrid';
import Keyboard from '@/components/Keyboard';
import { getWordOfTheDay } from '@/data/propertyWords';
import { Building2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [wordOfTheDay, setWordOfTheDay] = useState('');
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [usedLetters, setUsedLetters] = useState<{
    [key: string]: 'correct' | 'present' | 'absent' | undefined;
  }>({});

  useEffect(() => {
    setWordOfTheDay(getWordOfTheDay());
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (gameOver) return;
    
    if (event.key === 'Enter' && currentGuess.length === 5) {
      onEnter();
    } else if (event.key === 'Backspace') {
      onDelete();
    } else if (/^[A-Za-z]$/.test(event.key) && currentGuess.length < 5) {
      onKeyPress(event.key.toUpperCase());
    }
  };

  const shareToLinkedIn = () => {
    const text = `I played Property Wordle and ${gameOver ? (guesses[guesses.length - 1] === wordOfTheDay ? 'won!' : 'tried my best!') : 'am playing!'} Try it yourself!`;
    const url = 'https://www.clicksocials.co.uk';
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=${encodeURIComponent(text)}`, '_blank');
  };

  const updateUsedLetters = (guess: string) => {
    const newUsedLetters = { ...usedLetters };
    
    guess.split('').forEach((letter, i) => {
      if (letter === wordOfTheDay[i]) {
        newUsedLetters[letter] = 'correct';
      } else if (wordOfTheDay.includes(letter)) {
        if (newUsedLetters[letter] !== 'correct') {
          newUsedLetters[letter] = 'present';
        }
      } else {
        if (!newUsedLetters[letter]) {
          newUsedLetters[letter] = 'absent';
        }
      }
    });

    setUsedLetters(newUsedLetters);
  };

  const onKeyPress = (key: string) => {
    if (gameOver) return;
    if (currentGuess.length < 5) {
      setCurrentGuess(currentGuess + key);
    }
  };

  const onEnter = () => {
    if (gameOver) return;
    if (currentGuess.length !== 5) {
      toast.error("Word must be 5 letters long");
      return;
    }

    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);
    updateUsedLetters(currentGuess);

    if (currentGuess === wordOfTheDay) {
      setGameOver(true);
      toast.success("Congratulations! You've won!");
    } else if (newGuesses.length >= 6) {
      setGameOver(true);
    } else if (newGuesses.length >= 3) {
      setShowSignUp(true);
    }

    setCurrentGuess('');
  };

  const onDelete = () => {
    if (gameOver) return;
    setCurrentGuess(currentGuess.slice(0, -1));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <Building2 className="h-8 w-8" />
            Property Wordle
          </h1>
          <p className="text-gray-600 mt-2">Guess the property-related word!</p>
          {gameOver && (
            <p className={`text-2xl font-bold mt-4 ${guesses[guesses.length - 1] === wordOfTheDay ? 'text-green-500' : 'text-red-500'}`}>
              {wordOfTheDay}
            </p>
          )}
        </div>

        <div className="flex flex-col items-center">
          <WordGrid
            guesses={guesses}
            currentGuess={currentGuess}
            wordOfTheDay={wordOfTheDay}
            gameOver={gameOver}
          />
          
          <Keyboard
            onKeyPress={onKeyPress}
            onEnter={onEnter}
            onDelete={onDelete}
            usedLetters={usedLetters}
          />

          {gameOver && (
            <Button onClick={shareToLinkedIn} className="mt-4">
              Share on LinkedIn
            </Button>
          )}
        </div>

        <Dialog open={showSignUp} onOpenChange={setShowSignUp}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Want to keep playing?</DialogTitle>
              <DialogDescription>
                Sign up to continue playing and track your progress!
                <div className="mt-4">
                  <Button onClick={() => window.location.href = 'https://www.clicksocials.co.uk'} className="w-full">
                    Sign Up Now
                  </Button>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Index;