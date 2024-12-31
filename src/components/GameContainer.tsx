import React, { useState, useEffect } from 'react';
import WordGrid from '@/components/WordGrid';
import Keyboard from '@/components/Keyboard';
import { toast } from "sonner";
import { isValidWord } from '@/utils/wordValidation';
import { supabase } from "@/integrations/supabase/client";
import SignUpDialog from './SignUpDialog';
import GameResult from './game/GameResult';

interface GameContainerProps {
  session?: any;
  onShowSignUp?: () => void;
}

const GameContainer = ({ session, onShowSignUp }: GameContainerProps) => {
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [wordOfTheDay, setWordOfTheDay] = useState('');
  const [showSignUp, setShowSignUp] = useState(false);
  const [signedUp, setSignedUp] = useState(false);
  const [usedLetters, setUsedLetters] = useState<{
    [key: string]: 'correct' | 'present' | 'absent' | undefined;
  }>({});
  const [invalidAttempts, setInvalidAttempts] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [startTime] = useState<Date>(new Date());
  const [completionTime, setCompletionTime] = useState('');

  useEffect(() => {
    const fetchDailyWord = async () => {
      const { data, error } = await supabase
        .from('daily_words')
        .select('word')
        .eq('date', new Date().toISOString().split('T')[0])
        .single();

      if (error) {
        console.error('Error fetching daily word:', error);
        return;
      }

      if (data) {
        setWordOfTheDay(data.word);
      }
    };

    fetchDailyWord();
  }, []);

  // Add keyboard event listener
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (gameOver || showSignUp) return;

      if (event.key === 'Enter') {
        if (currentGuess.length === 5) {
          submitGuess();
        }
      } else if (event.key === 'Backspace') {
        setCurrentGuess(prev => prev.slice(0, -1));
      } else if (/^[a-zA-Z]$/.test(event.key) && currentGuess.length < 5) {
        setCurrentGuess(prev => prev + event.key.toUpperCase());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentGuess, gameOver, showSignUp]);

  const calculateCompletionTime = (): string => {
    const endTime = new Date();
    const timeDiff = endTime.getTime() - startTime.getTime();
    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
  };

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
      const time = calculateCompletionTime();
      setCompletionTime(time);
      setGameWon(won);
      setGameOver(true);
      
      if (won && !signedUp) {
        setTimeout(() => {
          setShowSignUp(true);
          toast.success("Congratulations! You've won!");
        }, 3000);
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
      
      <GameResult 
        gameOver={gameOver}
        gameWon={gameWon}
        wordOfTheDay={wordOfTheDay}
        completionTime={completionTime}
        signedUp={signedUp}
      />

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
        completionTime={completionTime}
        gameWon={gameWon}
      />
    </div>
  );
};

export default GameContainer;