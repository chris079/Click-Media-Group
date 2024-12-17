import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import WordGrid from '@/components/WordGrid';
import Keyboard from '@/components/Keyboard';
import { getWordOfTheDay } from '@/data/propertyWords';
import { Building2 } from "lucide-react";

const Index = () => {
  const [wordOfTheDay, setWordOfTheDay] = useState('');
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [usedLetters, setUsedLetters] = useState<{
    [key: string]: 'correct' | 'present' | 'absent' | undefined;
  }>({});

  useEffect(() => {
    setWordOfTheDay(getWordOfTheDay());
  }, []);

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
      toast.success("Congratulations! You've won!");
      setGameOver(true);
    } else if (newGuesses.length >= 6) {
      setGameOver(true);
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
        </div>

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
      </div>
    </div>
  );
};

export default Index;