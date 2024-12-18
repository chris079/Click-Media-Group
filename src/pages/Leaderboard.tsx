import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDuration } from 'date-fns';
import { Input } from "@/components/ui/input";
import { useState } from "react";

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

  const formatTime = (seconds: number) => {
    if (!seconds) return 'N/A';
    return formatDuration({
      seconds: Math.floor(seconds)
    }, { format: ['minutes', 'seconds'] });
  };

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
      ))
    : [];

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Leaderboard</h1>
      <div className="mb-4">
        <Input
          placeholder="Search by username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="w-12 text-center cursor-pointer"
                onClick={() => requestSort('username')}
              >
                Username {sortConfig?.key === 'username' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead 
                className="text-right cursor-pointer"
                onClick={() => requestSort('avg_completion_time')}
              >
                Average Time {sortConfig?.key === 'avg_completion_time' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead 
                className="text-right cursor-pointer"
                onClick={() => requestSort('games_played')}
              >
                Games Played {sortConfig?.key === 'games_played' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead 
                className="text-right cursor-pointer"
                onClick={() => requestSort('avg_attempts')}
              >
                Avg Attempts {sortConfig?.key === 'avg_attempts' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead 
                className="text-right cursor-pointer"
                onClick={() => requestSort('best_completion_time')}
              >
                Best Time {sortConfig?.key === 'best_completion_time' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead 
                className="text-right cursor-pointer"
                onClick={() => requestSort('best_score')}
              >
                Best Score {sortConfig?.key === 'best_score' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((entry, index) => (
              <TableRow key={index} className={index < 3 ? "bg-yellow-50" : ""}>
                <TableCell className="font-medium">{entry.username}</TableCell>
                <TableCell className="text-right">
                  {formatTime(entry.avg_completion_time)}
                </TableCell>
                <TableCell className="text-right">
                  {entry.games_played}
                </TableCell>
                <TableCell className="text-right">
                  {entry.avg_attempts?.toFixed(1)}
                </TableCell>
                <TableCell className="text-right">
                  {formatTime(entry.best_completion_time)}
                </TableCell>
                <TableCell className="text-right">
                  {entry.best_score}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Leaderboard;