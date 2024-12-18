import React, { useState, useEffect } from 'react';
import WordGrid from '@/components/WordGrid';
import Keyboard from '@/components/Keyboard';
import GameHeader from '@/components/GameHeader';
import SignUpDialog from '@/components/SignUpDialog';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { isValidWord, initializeWordList } from '@/utils/wordValidation';
import { shareToLinkedIn } from '@/utils/shareUtils';
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [wordOfTheDay] = useState('HOUSE');
  const [showSignUp, setShowSignUp] = useState(false);
  const [session, setSession] = useState<any>(null);
  const navigate = useNavigate();
  const [usedLetters, setUsedLetters] = useState<{
    [key: string]: 'correct' | 'present' | 'absent' | undefined;
  }>({});

  useEffect(() => {
    // Initialize word list
    initializeWordList();

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (gameOver || showSignUp) return;

    if (event.key === 'Enter' && currentGuess.length === 5) {
      if (!isValidWord(currentGuess)) {
        toast.error("Not a valid word!");
        return;
      }
      submitGuess();
    } else if (event.key === 'Backspace') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (/^[A-Za-z]$/.test(event.key) && currentGuess.length < 5) {
      setCurrentGuess(prev => prev + event.key.toUpperCase());
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentGuess, gameOver, showSignUp]);

  const submitGuess = async () => {
    if (currentGuess.length !== 5) {
      toast.error("Word must be 5 letters!");
      return;
    }

    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);
    setCurrentGuess('');

    // Update used letters
    const newUsedLetters = { ...usedLetters };
    currentGuess.split('').forEach((letter, index) => {
      if (letter === wordOfTheDay[index]) {
        newUsedLetters[letter] = 'correct';
      } else if (wordOfTheDay.includes(letter)) {
        if (newUsedLetters[letter] !== 'correct') {
          newUsedLetters[letter] = 'present';
        }
      } else {
        if (!newUsedLetters[letter]) {
          newUsedLetters[letter] = 'absent';
        }
      }
    });
    setUsedLetters(newUsedLetters);

    if (currentGuess === wordOfTheDay) {
      setGameWon(true);
      setGameOver(true);
      toast.success("Congratulations! You've won!");
      if (session?.user) {
        // Save score to leaderboard
        const { error } = await supabase
          .from('scores')
          .insert([
            {
              user_id: session.user.id,
              word: wordOfTheDay,
              attempts: newGuesses.length,
            }
          ]);
        if (error) console.error('Error saving score:', error);
      }
    } else if (newGuesses.length >= 6) {
      setGameOver(true);
      toast.error(`Game Over! The word was ${wordOfTheDay}`);
    } else if (newGuesses.length >= 3 && !session) {
      setShowSignUp(true);
    }
  };

  const handleShare = () => {
    shareToLinkedIn(guesses.length, `I solved today's Wordle in ${gameWon ? guesses.length : 'X'}/6! Can you beat my score?`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <GameHeader />
        
        {gameOver && (
          <p className={`text-2xl font-bold mt-4 text-center ${gameWon ? 'text-green-500' : 'text-red-500'}`}>
            {wordOfTheDay}
          </p>
        )}

        <WordGrid
          guesses={guesses}
          currentGuess={currentGuess}
          wordOfTheDay={wordOfTheDay}
          gameOver={gameOver}
        />
        
        <Keyboard
          onKeyPress={(key) => {
            if (!showSignUp && currentGuess.length < 5) {
              setCurrentGuess(prev => prev + key);
            }
          }}
          onEnter={() => {
            if (!showSignUp && currentGuess.length === 5) {
              if (!isValidWord(currentGuess)) {
                toast.error("Not a valid word!");
                return;
              }
              submitGuess();
            }
          }}
          onDelete={() => {
            if (!showSignUp) {
              setCurrentGuess(prev => prev.slice(0, -1));
            }
          }}
          usedLetters={usedLetters}
        />

        {gameOver && (
          <div className="flex justify-center gap-4 mt-6">
            <Button onClick={handleShare}>
              Share on LinkedIn
            </Button>
            <Button onClick={() => navigate('/leaderboard')}>
              View Leaderboard
            </Button>
          </div>
        )}

        <SignUpDialog
          open={showSignUp}
          onOpenChange={setShowSignUp}
          onSignUp={async (email: string) => {
            const { error } = await supabase.auth.signInWithOtp({
              email,
              options: {
                emailRedirectTo: window.location.origin,
              },
            });
            
            if (error) {
              toast.error(error.message);
            } else {
              toast.success("Check your email for the login link!");
              setShowSignUp(false);
            }
          }}
        />
      </div>
    </div>
  );
};

export default Index;