import React from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ShareButtons from './ShareButtons';

const LeaderboardHeader = () => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6">
      <h1 className="text-3xl font-bold text-left">Leaderboard</h1>
      <div className="flex gap-2">
        <Button variant="outline" size="icon">
          <Settings className="h-6 w-6" />
        </Button>
        <ShareButtons />
      </div>
    </div>
  );
};

export default LeaderboardHeader;