import React, { useEffect } from 'react';
import WordGrid from '@/components/WordGrid';
import Keyboard from '@/components/Keyboard';
import { supabase } from "@/integrations/supabase/client";
import SignUpDialog from './SignUpDialog';
import GameResult from './game/GameResult';
import GameKeyboardHandler from './game/GameKeyboardHandler';
import { useGameLogic } from './game/GameLogic';

interface GameContainerProps {
  session?: any;
  onShowSignUp?: () => void;
}

const GameContainer = ({ session, onShowSignUp }: GameContainerProps) => {
  const [wordOfTheDay, setWordOfTheDay] = React.useState('');
  const [showSignUp, setShowSignUp] = React.useState(false);
  const [signedUp, setSignedUp] = React.useState(false);
  const [completionTime, setCompletionTime] = React.useState('');

  const handleGameOver = (won: boolean, time: string) => {
    setCompletionTime(time);
    if (won && !session) {
      // Add 3-second delay before showing the signup dialog
      setTimeout(() => {
        setShowSignUp(true);
      }, 3000);
    }
  };

  const {
    currentGuess,
    setCurrentGuess,
    guesses,
    gameOver,
    gameWon,
    usedLetters,
    isShaking,
    submitGuess
  } = useGameLogic({
    wordOfTheDay,
    onGameOver: handleGameOver
  });

  useEffect(() => {
    const fetchDailyWord = async () => {
      const { data, error } = await supabase
        .from('daily_words')
        .select('word')
        .eq('date', new Date().toISOString().split('T')[0])
        .single();

      if (error) {
        console.error('Error fetching daily word:', error);
        return;
      }

      if (data) {
        setWordOfTheDay(data.word);
      }
    };

    fetchDailyWord();
  }, []);

  const showKeyboard = !gameOver || gameWon;

  return (
    <div className={`max-w-2xl mx-auto ${isShaking ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
      <style>
        {`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
            20%, 40%, 60%, 80% { transform: translateX(2px); }
          }
        `}
      </style>
      
      <WordGrid
        guesses={guesses}
        currentGuess={currentGuess}
        wordOfTheDay={wordOfTheDay}
        gameOver={gameOver}
      />
      
      <GameResult 
        gameOver={gameOver}
        gameWon={gameWon}
        wordOfTheDay={wordOfTheDay}
        completionTime={completionTime}
        signedUp={signedUp}
      />

      {showKeyboard && (
        <>
          <GameKeyboardHandler
            onKeyPress={(key) => {
              if (!showSignUp && !gameOver && currentGuess.length < 5) {
                setCurrentGuess(prev => prev + key);
              }
            }}
            onEnter={() => {
              if (!showSignUp && !gameOver && currentGuess.length === 5) {
                submitGuess();
              }
            }}
            onDelete={() => {
              if (!showSignUp && !gameOver) {
                setCurrentGuess(prev => prev.slice(0, -1));
              }
            }}
            disabled={showSignUp || gameOver}
          />

          <Keyboard
            onKeyPress={(key) => {
              if (!showSignUp && !gameOver && currentGuess.length < 5) {
                setCurrentGuess(prev => prev + key);
              }
            }}
            onEnter={() => {
              if (!showSignUp && !gameOver && currentGuess.length === 5) {
                submitGuess();
              }
            }}
            onDelete={() => {
              if (!showSignUp && !gameOver) {
                setCurrentGuess(prev => prev.slice(0, -1));
              }
            }}
            usedLetters={usedLetters}
          />
        </>
      )}

      <SignUpDialog
        open={showSignUp}
        onOpenChange={setShowSignUp}
        onSuccess={() => {
          setSignedUp(true);
          setShowSignUp(false);
        }}
        currentScore={guesses.length}
        word={wordOfTheDay}
        completionTime={completionTime}
        gameWon={gameWon}
      />
    </div>
  );
};

export default GameContainer;