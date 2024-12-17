import React from 'react';
import { toast } from "sonner";

interface WordGridProps {
  guesses: string[];
  currentGuess: string;
  wordOfTheDay: string;
  gameOver: boolean;
}

const WordGrid: React.FC<WordGridProps> = ({ guesses, currentGuess, wordOfTheDay, gameOver }) => {
  const empties = Array(Math.max(0, 6 - (guesses.length + 1))).fill('');
  
  React.useEffect(() => {
    if (gameOver && guesses[guesses.length - 1] !== wordOfTheDay) {
      toast.error(`Good try! The word was ${wordOfTheDay}. Come back tomorrow!`, {
        description: (
          <div className="mt-2">
            <p>Want to learn more about the property market?</p>
            <a 
              href="https://www.clicksocials.co.uk" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 underline"
            >
              Click here to explore more
            </a>
          </div>
        ),
        duration: 5000,
      });
    }
  }, [gameOver, guesses, wordOfTheDay]);

  const getCellClass = (letter: string, index: number, rowIndex: number) => {
    const base = "w-14 h-14 border-2 flex items-center justify-center text-2xl font-bold rounded transition-colors duration-500";
    if (!letter) return `${base} border-gray-300`;
    
    // Only apply colors to completed rows
    if (rowIndex < guesses.length) {
      if (letter === wordOfTheDay[index]) {
        return `${base} border-green-500 bg-green-500 text-white`;
      }
      if (wordOfTheDay.includes(letter)) {
        return `${base} border-yellow-500 bg-yellow-500 text-white`;
      }
      return `${base} border-gray-400 bg-gray-400 text-white`;
    }
    
    return `${base} border-gray-300 bg-gray-100`;
  };

  return (
    <div className="grid gap-2 mx-auto mb-8">
      {guesses.map((guess, i) => (
        <div key={i} className="flex gap-2">
          {guess.split('').map((letter, j) => (
            <div key={j} className={getCellClass(letter, j, i)}>
              {letter}
            </div>
          ))}
        </div>
      ))}
      {guesses.length < 6 && (
        <div className="flex gap-2">
          {currentGuess.split('').concat(Array(5 - currentGuess.length).fill('')).map((letter, i) => (
            <div key={i} className={getCellClass(letter, i, guesses.length)}>
              {letter}
            </div>
          ))}
        </div>
      )}
      {empties.map((_, i) => (
        <div key={i + guesses.length + 1} className="flex gap-2">
          {Array(5).fill('').map((_, j) => (
            <div key={j} className={getCellClass('', j, i + guesses.length + 1)}>
              {''}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default WordGrid;