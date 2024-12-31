import React, { useState, useEffect } from 'react';
import WordGrid from '@/components/WordGrid';
import Keyboard from '@/components/Keyboard';
import { toast } from "sonner";
import { isValidWord } from '@/utils/wordValidation';
import { supabase } from "@/integrations/supabase/client";
import GameStatus from './GameStatus';
import SignUpDialog from './SignUpDialog';
import { shareToLinkedIn } from '@/utils/shareUtils';
import { Button } from './ui/button';
import { Facebook, Twitter, Mail } from 'lucide-react';

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
  const [signedUp, setSignedUp] = useState(false);
  const [hasShownSignUpPrompt, setHasShownSignUpPrompt] = useState(false);
  const [usedLetters, setUsedLetters] = useState<{
    [key: string]: 'correct' | 'present' | 'absent' | undefined;
  }>({});
  const [invalidAttempts, setInvalidAttempts] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [startTime] = useState<Date>(new Date());

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (gameOver || (showSignUp && !signedUp)) return;
      
      if (event.key === 'Enter') {
        submitGuess();
      } else if (event.key === 'Backspace') {
        setCurrentGuess(prev => prev.slice(0, -1));
      } else if (/^[A-Za-z]$/.test(event.key) && currentGuess.length < 5) {
        setCurrentGuess(prev => prev + event.key.toUpperCase());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentGuess, gameOver, showSignUp, signedUp]);

  const shakeScreen = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  const handleInvalidWord = () => {
    shakeScreen();
    setInvalidAttempts(prev => prev + 1);
    
    if (invalidAttempts >= 1) {
      toast.error("Not a valid word!");
      setInvalidAttempts(0);
    }
  };

  const calculateCompletionTime = (): string => {
    const endTime = new Date();
    const timeDiff = endTime.getTime() - startTime.getTime();
    return `${Math.floor(timeDiff / 1000)} seconds`;
  };

  const shareText = `I played Property Wordle! Can you solve today's word? See how you do!`;

  const handleShare = (platform: 'linkedin' | 'twitter' | 'facebook' | 'email') => {
    const url = window.location.href;
    switch (platform) {
      case 'linkedin':
        shareToLinkedIn(shareText);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'email':
        window.location.href = `mailto:?subject=Try Property Wordle!&body=${encodeURIComponent(shareText + '\n\n' + url)}`;
        break;
    }
  };

  const submitGuess = async () => {
    if (currentGuess.length !== 5) {
      toast.error("Word must be 5 letters!");
      return;
    }

    if (!isValidWord(currentGuess)) {
      handleInvalidWord();
      return;
    }

    setInvalidAttempts(0);
    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);
    setCurrentGuess('');

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

    const won = currentGuess === wordOfTheDay;
    
    if (won || newGuesses.length >= 6) {
      setGameWon(won);
      setGameOver(true);
      
      if (won && !signedUp) {
        // Add delay for winners before showing signup
        setTimeout(() => {
          setShowSignUp(true);
          toast.success("Congratulations! You've won!");
        }, 3000);
      } else if (!won) {
        toast.error(`Game Over! The word was ${wordOfTheDay}`);
      }
    }
  };

  return (
    <div className={`max-w-2xl mx-auto ${isShaking ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
      <style>
        {`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
            20%, 40%, 60%, 80% { transform: translateX(2px); }
          }
        `}
      </style>
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

      {gameOver && !gameWon && (
        <div className="flex flex-col gap-4 items-center mt-6">
          <p className="text-lg font-medium text-center">See how your colleagues or friends do?</p>
          <div className="flex gap-3">
            <Button onClick={() => handleShare('linkedin')} variant="outline" size="icon">
              <span className="sr-only">Share on LinkedIn</span>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"></path>
              </svg>
            </Button>
            <Button onClick={() => handleShare('twitter')} variant="outline" size="icon">
              <Twitter className="w-5 h-5" />
            </Button>
            <Button onClick={() => handleShare('facebook')} variant="outline" size="icon">
              <Facebook className="w-5 h-5" />
            </Button>
            <Button onClick={() => handleShare('email')} variant="outline" size="icon">
              <Mail className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}
      
      <Keyboard
        onKeyPress={(key) => {
          if (!showSignUp && !gameOver && currentGuess.length < 5) {
            setCurrentGuess(prev => prev + key);
          }
        }}
        onEnter={() => {
          if (!showSignUp && !gameOver && currentGuess.length === 5) {
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
        onSuccess={() => {
          setShowSignUp(false);
          setSignedUp(true);
        }}
        currentScore={guesses.length}
        word={wordOfTheDay}
        completionTime={calculateCompletionTime()}
        gameWon={gameWon}
      />
    </div>
  );
};

export default GameContainer;