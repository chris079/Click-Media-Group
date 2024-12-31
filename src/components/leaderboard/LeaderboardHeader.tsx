import React from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ShareButtons from './ShareButtons';

const LeaderboardHeader = () => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">Leaderboard</h1>
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