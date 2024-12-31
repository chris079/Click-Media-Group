import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Facebook, Twitter, Mail, LinkedinIcon } from 'lucide-react';
import confetti from 'canvas-confetti';
import { shareToLinkedIn } from '@/utils/shareUtils';

interface GameResultProps {
  gameOver: boolean;
  gameWon: boolean;
  wordOfTheDay: string;
  completionTime: string;
  signedUp: boolean;
}

const GameResult = ({ gameOver, gameWon, wordOfTheDay, completionTime, signedUp }: GameResultProps) => {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (gameWon) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [gameWon]);

  if (!gameOver) return null;

  const shareText = gameWon 
    ? `I solved today's Property Wordle in ${completionTime}! The word was ${wordOfTheDay}. Can you beat my score?`
    : `Try the Property Wordle game! Today's word was ${wordOfTheDay}. Come back tomorrow for a new challenge!`;

  const handleShare = (platform: 'linkedin' | 'twitter' | 'facebook' | 'email') => {
    const url = window.location.href;
    switch (platform) {
      case 'linkedin':
        shareToLinkedIn(shareText);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'email':
        window.location.href = `mailto:?subject=Try Property Wordle!&body=${encodeURIComponent(shareText + '\n\n' + url)}`;
        break;
    }
  };

  return (
    <div className="space-y-6 text-center">
      {gameWon ? (
        <>
          <div className="animate-fade-in space-y-2">
            <p className="text-2xl font-bold text-green-500">{wordOfTheDay}</p>
            <p className="text-gray-600">Completed in: {completionTime}</p>
          </div>
          {signedUp && (
            <Button 
              onClick={() => navigate('/leaderboard')}
              className="bg-[#00A5E5] hover:bg-[#0094CE] text-white"
            >
              View Leaderboard
            </Button>
          )}
        </>
      ) : (
        <div className="animate-fade-in space-y-4">
          <p className="text-2xl font-bold text-red-500">{wordOfTheDay}</p>
          <p className="text-gray-600">Come back tomorrow for a new word!</p>
          <div className="animate-bounce">😔</div>
        </div>
      )}

      <div className="space-y-4">
        <p className="text-lg font-medium">Share with colleagues and friends:</p>
        <div className="flex justify-center gap-3">
          <Button onClick={() => handleShare('linkedin')} variant="outline" size="icon">
            <LinkedinIcon className="w-5 h-5" />
          </Button>
          <Button onClick={() => handleShare('twitter')} variant="outline" size="icon">
            <Twitter className="w-5 h-5" />
          </Button>
          <Button onClick={() => handleShare('facebook')} variant="outline" size="icon">
            <Facebook className="w-5 h-5" />
          </Button>
          <Button onClick={() => handleShare('email')} variant="outline" size="icon">
            <Mail className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Find out more about Click</h3>
        <p className="text-gray-600 mb-4">
          Discover how we make your property listings truly stand out in the market!
        </p>
        <Button 
          onClick={() => window.open('https://www.clickmediagroup.co.uk', '_blank')}
          className="bg-[#00A5E5] hover:bg-[#0094CE] text-white"
        >
          Visit Click Media Group
        </Button>
      </div>
    </div>
  );
};

export default GameResult;