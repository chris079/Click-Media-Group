import { useState } from 'react';
import { toast } from "sonner";
import { isValidWord } from '@/utils/wordValidation';

interface UseGameLogicProps {
  wordOfTheDay: string;
  onGameOver: (won: boolean, time: string) => void;
}

export const useGameLogic = ({ wordOfTheDay, onGameOver }: UseGameLogicProps) => {
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [usedLetters, setUsedLetters] = useState<{
    [key: string]: 'correct' | 'present' | 'absent' | undefined;
  }>({});
  const [invalidAttempts, setInvalidAttempts] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [startTime] = useState<Date>(new Date());

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
      setGameWon(won);
      setGameOver(true);
      onGameOver(won, time);
    }
  };

  return {
    currentGuess,
    setCurrentGuess,
    guesses,
    gameOver,
    gameWon,
    usedLetters,
    isShaking,
    submitGuess
  };
};