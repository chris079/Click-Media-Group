import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import LeaderboardHeader from "@/components/leaderboard/LeaderboardHeader";
import LeaderboardTable from "@/components/leaderboard/LeaderboardTable";
import ClickPromotion from "@/components/leaderboard/ClickPromotion";

const Leaderboard = () => {
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  const { data: leaderboardData, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*');
      if (error) throw error;
      return data;
    },
  });

  const sortData = (data: any[]) => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredData = leaderboardData
    ? sortData(leaderboardData.filter(entry => 
        entry.username.toLowerCase().includes(search.toLowerCase())
      )).map(entry => ({
        ...entry,
        username: entry.username.charAt(0).toUpperCase() + entry.username.slice(1)
      }))
    : [];

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <LeaderboardHeader />
      <div className="mb-4">
        <Input
          placeholder="Search by username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <LeaderboardTable 
        data={filteredData}
        sortConfig={sortConfig}
        onRequestSort={requestSort}
      />
      <ClickPromotion />
    </div>
  );
};

export default Leaderboard;