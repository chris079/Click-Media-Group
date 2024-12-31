import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import LeaderboardHeader from "@/components/leaderboard/LeaderboardHeader";
import LeaderboardTabs from "@/components/leaderboard/LeaderboardTabs";
import ClickPromotion from "@/components/leaderboard/ClickPromotion";

const Leaderboard = () => {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  }>({
    key: 'completion_time',
    direction: 'asc'
  });

  const { data: leaderboardData, isLoading: isLoadingLeaderboard } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*');
      if (error) throw error;
      return data;
    },
  });

  const { data: todayScores, isLoading: isLoadingToday } = useQuery({
    queryKey: ['today_scores'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('today_scores')
        .select('*');
      if (error) throw error;
      return data;
    },
  });

  const { data: companyStats, isLoading: isLoadingCompany } = useQuery({
    queryKey: ['company_stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('company_stats')
        .select('*');
      if (error) throw error;
      return data;
    },
  });

  const sortData = (data: any[]) => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      
      // Convert interval strings to seconds for comparison if dealing with completion_time
      if (sortConfig.key === 'completion_time' && typeof aValue === 'string') {
        aValue = intervalToSeconds(aValue);
        bValue = intervalToSeconds(bValue);
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const intervalToSeconds = (interval: string): number => {
    if (!interval) return Infinity;
    
    if (interval.includes(':')) {
      const [hours, minutes, seconds] = interval.split(':').map(Number);
      return hours * 3600 + minutes * 60 + seconds;
    }
    
    return parseInt(interval.split(' ')[0]);
  };

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  if (isLoadingLeaderboard || isLoadingToday || isLoadingCompany) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );

  const sortedLeaderboardData = leaderboardData ? sortData(leaderboardData) : [];
  const sortedTodayScores = todayScores ? sortData(todayScores) : [];
  const sortedCompanyStats = companyStats ? sortData(companyStats) : [];

  return (
    <div className="container mx-auto py-8 px-4">
      <LeaderboardHeader />
      <LeaderboardTabs 
        leaderboardData={sortedLeaderboardData}
        todayScores={sortedTodayScores}
        companyStats={sortedCompanyStats}
        sortConfig={sortConfig}
        onRequestSort={requestSort}
      />
      <ClickPromotion />
    </div>
  );
};

export default Leaderboard;