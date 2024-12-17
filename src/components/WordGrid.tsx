import React from 'react';

interface WordGridProps {
  guesses: string[];
  currentGuess: string;
  wordOfTheDay: string;
}

const WordGrid: React.FC<WordGridProps> = ({ guesses, currentGuess, wordOfTheDay }) => {
  const empties = Array(6 - (guesses.length + 1)).fill('');
  
  const getCellClass = (letter: string, index: number, guess: string) => {
    const base = "w-14 h-14 border-2 flex items-center justify-center text-2xl font-bold rounded";
    if (!letter) return `${base} border-gray-300`;
    
    if (guess === guesses[guesses.length - 1]) {
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
            <div key={j} className={getCellClass(letter, j, guess)}>
              {letter}
            </div>
          ))}
        </div>
      ))}
      {guesses.length < 6 && (
        <div className="flex gap-2">
          {currentGuess.split('').concat(Array(5 - currentGuess.length).fill('')).map((letter, i) => (
            <div key={i} className={getCellClass(letter, i, '')}>
              {letter}
            </div>
          ))}
        </div>
      )}
      {empties.map((_, i) => (
        <div key={i} className="flex gap-2">
          {Array(5).fill('').map((_, j) => (
            <div key={j} className={getCellClass('', j, '')}>
              {''}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default WordGrid;