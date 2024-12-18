import React from 'react';
import { Button } from "@/components/ui/button";
import { shareToLinkedIn } from '@/utils/shareUtils';
import { useNavigate } from 'react-router-dom';

interface GameStatusProps {
  gameOver: boolean;
  gameWon: boolean;
  wordOfTheDay: string;
}

const GameStatus = ({ gameOver, gameWon, wordOfTheDay }: GameStatusProps) => {
  const navigate = useNavigate();

  if (!gameOver) return null;

  const shareText = `I solved today's Property Wordle in ${gameWon ? 'success!' : 'X'}/6! The word was ${wordOfTheDay}. Can you beat my score?`;

  return (
    <div className="text-center mb-4">
      <p className={`text-2xl font-bold ${gameWon ? 'text-green-500' : 'text-red-500'}`}>
        {wordOfTheDay}
      </p>
      <div className="flex justify-center gap-4 mt-4">
        <Button onClick={() => {
          navigator.clipboard.writeText(shareText);
          shareToLinkedIn(shareText);
        }}>
          Share on LinkedIn
        </Button>
        <Button onClick={() => navigate('/leaderboard')}>
          View Leaderboard
        </Button>
      </div>
    </div>
  );
};

export default GameStatus;