import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LeaderboardTable from './LeaderboardTable';
import TodayScoresTable from './TodayScoresTable';
import CompanyStatsTable from './CompanyStatsTable';

interface LeaderboardTabsProps {
  leaderboardData: any[];
  todayScores: any[];
  companyStats: any[];
  sortConfig: {
    key: string;
    direction: 'asc' | 'desc';
  } | null;
  onRequestSort: (key: string) => void;
}

const LeaderboardTabs = ({ 
  leaderboardData, 
  todayScores, 
  companyStats,
  sortConfig, 
  onRequestSort 
}: LeaderboardTabsProps) => {
  return (
    <Tabs defaultValue="today" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-4">
        <TabsTrigger value="today">Today</TabsTrigger>
        <TabsTrigger value="alltime">All Time</TabsTrigger>
        <TabsTrigger value="companies">Companies</TabsTrigger>
      </TabsList>
      <TabsContent value="today">
        <TodayScoresTable 
          data={todayScores}
          sortConfig={sortConfig}
          onRequestSort={onRequestSort}
        />
      </TabsContent>
      <TabsContent value="alltime">
        <LeaderboardTable 
          data={leaderboardData}
          sortConfig={sortConfig}
          onRequestSort={onRequestSort}
        />
      </TabsContent>
      <TabsContent value="companies">
        <CompanyStatsTable 
          data={companyStats}
          sortConfig={sortConfig}
          onRequestSort={onRequestSort}
        />
      </TabsContent>
    </Tabs>
  );
};

export default LeaderboardTabs;