import React from 'react';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  onEnter: () => void;
  onDelete: () => void;
  usedLetters: {
    [key: string]: 'correct' | 'present' | 'absent' | undefined;
  };
}

const Keyboard: React.FC<KeyboardProps> = ({
  onKeyPress,
  onEnter,
  onDelete,
  usedLetters,
}) => {
  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
  ];

  const getKeyClass = (key: string) => {
    const baseClass = "px-2 py-3 rounded font-semibold text-sm transition-colors";
    if (key === 'ENTER' || key === '⌫') {
      return `${baseClass} bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs w-12`; // Reduced width and size for special keys
    }
    
    const status = usedLetters[key];
    switch (status) {
      case 'correct':
        return `${baseClass} bg-green-500 text-white`;
      case 'present':
        return `${baseClass} bg-yellow-500 text-white`;
      case 'absent':
        return `${baseClass} bg-gray-400 text-white`;
      default:
        return `${baseClass} bg-gray-200 hover:bg-gray-300 text-gray-700`;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-2">
      {rows.map((row, i) => (
        <div key={i} className="flex justify-center gap-1 mb-1">
          {row.map((key) => (
            <button
              key={key}
              onClick={() => {
                if (key === 'ENTER') onEnter();
                else if (key === '⌫') onDelete();
                else onKeyPress(key);
              }}
              className={getKeyClass(key)}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;