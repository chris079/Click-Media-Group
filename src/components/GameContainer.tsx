import React, { useState, useEffect } from 'react';
import WordGrid from '@/components/WordGrid';
import Keyboard from '@/components/Keyboard';
import { toast } from "sonner";
import { isValidWord } from '@/utils/wordValidation';
import { supabase } from "@/integrations/supabase/client";
import GameStatus from './GameStatus';
import SignUpDialog from './SignUpDialog';

interface GameContainerProps {
  session?: any;
  onShowSignUp?: () => void;
}

const GameContainer = ({ session, onShowSignUp }: GameContainerProps) => {
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

    // Update used letters
    const newUsedLetters = { ...usedLetters };
    currentGuess.split('').forEach((letter, index) => {
      if (letter === wordOfTheDay[index]) {
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

    if (currentGuess === wordOfTheDay) {
      setGameWon(true);
      setGameOver(true);
      setShowSignUp(true);
      toast.success("Congratulations! You've won!");
    } else if (newGuesses.length >= 6) {
      setGameOver(true);
      setShowSignUp(true);
      toast.error(`Game Over! The word was ${wordOfTheDay}`);
    } else if (newGuesses.length >= 3) {
      setShowSignUp(true);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <WordGrid
        guesses={guesses}
        currentGuess={currentGuess}
        wordOfTheDay={wordOfTheDay}
        gameOver={gameOver}
      />
      
      <GameStatus 
        gameOver={gameOver}
        gameWon={gameWon}
        wordOfTheDay={wordOfTheDay}
      />
      
      <Keyboard
        onKeyPress={(key) => {
          if (!showSignUp && !gameOver && currentGuess.length < 5) {
            setCurrentGuess(prev => prev + key);
          }
        }}
        onEnter={() => {
          if (!showSignUp && !gameOver && currentGuess.length === 5) {
            if (!isValidWord(currentGuess)) {
              toast.error("Not a valid word!");
              return;
            }
            submitGuess();
          }
        }}
        onDelete={() => {
          if (!showSignUp && !gameOver) {
            setCurrentGuess(prev => prev.slice(0, -1));
          }
        }}
        usedLetters={usedLetters}
      />

      <SignUpDialog
        open={showSignUp}
        onOpenChange={setShowSignUp}
        onSuccess={() => setShowSignUp(false)}
        currentScore={guesses.length}
        word={wordOfTheDay}
      />
    </div>
  );
};

export default GameContainer;
