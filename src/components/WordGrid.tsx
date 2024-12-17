import React from 'react';

interface WordGridProps {
  guesses: string[];
  currentGuess: string;
  wordOfTheDay: string;
}

const WordGrid: React.FC<WordGridProps> = ({ guesses, currentGuess, wordOfTheDay }) => {
  const empties = Array(6 - (guesses.length + 1)).fill('');
  const currentGuessArray = currentGuess.split('').concat(Array(5 - currentGuess.length).fill(''));

  const getLetterClass = (letter: string, index: number, word: string) => {
    if (!letter) return "bg-gray-200 border-2 border-gray-300";
    if (word === guesses[guesses.length - 1]) {
      if (letter === wordOfTheDay[index]) {
        return "bg-green-500 text-white border-2 border-green-600";
      }
      if (wordOfTheDay.includes(letter)) {
        return "bg-yellow-500 text-white border-2 border-yellow-600";
      }
      return "bg-gray-400 text-white border-2 border-gray-500";
    }
    return "bg-gray-200 border-2 border-gray-300";
  };

  return (
    <div className="grid grid-rows-6 gap-2 mx-auto w-full max-w-sm p-4">
      {guesses.map((guess, i) => (
        <div key={i} className="grid grid-cols-5 gap-2">
          {guess.split('').map((letter, j) => (
            <div
              key={j}
              className={`w-full aspect-square flex items-center justify-center text-2xl font-bold rounded ${getLetterClass(
                letter,
                j,
                guess
              )}`}
            >
              {letter}
            </div>
          ))}
        </div>
      ))}
      {guesses.length < 6 && (
        <div className="grid grid-cols-5 gap-2">
          {currentGuessArray.map((letter, i) => (
            <div
              key={i}
              className="w-full aspect-square flex items-center justify-center text-2xl font-bold bg-gray-200 border-2 border-gray-300 rounded"
            >
              {letter}
            </div>
          ))}
        </div>
      )}
      {empties.map((_, i) => (
        <div key={i} className="grid grid-cols-5 gap-2">
          {Array(5)
            .fill('')
            .map((_, j) => (
              <div
                key={j}
                className="w-full aspect-square flex items-center justify-center text-2xl font-bold bg-gray-200 border-2 border-gray-300 rounded"
              />
            ))}
        </div>
      ))}
    </div>
  );
};

export default WordGrid;