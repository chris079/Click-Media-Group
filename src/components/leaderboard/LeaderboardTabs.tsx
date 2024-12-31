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
  // Set initial sort config for completion time
  React.useEffect(() => {
    if (!sortConfig) {
      onRequestSort('completion_time');
    }
  }, [sortConfig, onRequestSort]);

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
          data={companyStats.filter(stat => !isPersonalEmailDomain(stat.company))}
          sortConfig={sortConfig}
          onRequestSort={onRequestSort}
        />
      </TabsContent>
    </Tabs>
  );
};

// Function to check if an email domain is a personal email provider
const isPersonalEmailDomain = (domain: string): boolean => {
  const personalDomains = [
    'gmail.com',
    'yahoo.com',
    'hotmail.com',
    'outlook.com',
    'aol.com',
    'icloud.com',
    'mail.com',
    'protonmail.com',
    'zoho.com',
    'yandex.com',
    'live.com',
    'inbox.com',
    'gmx.com',
    'fastmail.com'
  ];
  
  return personalDomains.some(personalDomain => 
    domain.toLowerCase().includes(personalDomain.toLowerCase())
  );
};

export default LeaderboardTabs;