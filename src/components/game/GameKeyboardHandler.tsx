import { useEffect } from 'react';

interface GameKeyboardHandlerProps {
  onKeyPress: (key: string) => void;
  onEnter: () => void;
  onDelete: () => void;
  disabled: boolean;
}

const GameKeyboardHandler = ({ onKeyPress, onEnter, onDelete, disabled }: GameKeyboardHandlerProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (disabled) return;

      if (event.key === 'Enter') {
        onEnter();
      } else if (event.key === 'Backspace') {
        onDelete();
      } else if (/^[a-zA-Z]$/.test(event.key)) {
        onKeyPress(event.key.toUpperCase());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onKeyPress, onEnter, onDelete, disabled]);

  return null;
};

export default GameKeyboardHandler;