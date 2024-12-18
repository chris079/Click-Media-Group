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

  return (
    <div className="text-center">
      <p className={`text-2xl font-bold mt-4 ${gameWon ? 'text-green-500' : 'text-red-500'}`}>
        {wordOfTheDay}
      </p>
      <div className="flex justify-center gap-4 mt-6">
        <Button onClick={() => shareToLinkedIn(`I solved today's Wordle in ${gameWon ? 'success!' : 'X'}/6! Can you beat my score?`)}>
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