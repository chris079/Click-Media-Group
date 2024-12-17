import React from 'react';
import { Button } from "@/components/ui/button";

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  onEnter: () => void;
  onDelete: () => void;
  usedLetters: {
    [key: string]: 'correct' | 'present' | 'absent' | undefined;
  };
}

const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, onEnter, onDelete, usedLetters }) => {
  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
  ];

  const getKeyClass = (key: string) => {
    if (key === 'ENTER' || key === '⌫') return '';
    const status = usedLetters[key];
    switch (status) {
      case 'correct':
        return 'bg-green-500 text-white hover:bg-green-600';
      case 'present':
        return 'bg-yellow-500 text-white hover:bg-yellow-600';
      case 'absent':
        return 'bg-gray-400 text-white hover:bg-gray-500';
      default:
        return 'bg-gray-200 hover:bg-gray-300';
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      {rows.map((row, i) => (
        <div key={i} className="flex justify-center gap-1 my-1">
          {row.map((key) => (
            <Button
              key={key}
              onClick={() => {
                if (key === 'ENTER') onEnter();
                else if (key === '⌫') onDelete();
                else onKeyPress(key);
              }}
              className={`${getKeyClass(key)} px-2 py-4 text-sm font-bold rounded ${
                key === 'ENTER' ? 'px-4' : ''
              }`}
              variant="secondary"
            >
              {key}
            </Button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;