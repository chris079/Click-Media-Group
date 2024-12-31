import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDuration } from 'date-fns';
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings, Share } from 'lucide-react';
import { shareToLinkedIn } from '@/utils/shareUtils';

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Leaderboard</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Settings className="h-6 w-6" />
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => {
              const shareText = "Check out the Property Wordle leaderboard! Can you make it to the top?";
              shareToLinkedIn(shareText);
            }}
          >
            <Share className="h-5 w-5" />
            Share
          </Button>
        </div>
      </div>

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
                Number of Games {sortConfig?.key === 'games_played' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </TableHead>
              <TableHead 
                className="text-right cursor-pointer"
                onClick={() => requestSort('avg_attempts')}
              >
                Average Attempts {sortConfig?.key === 'avg_attempts' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
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
                Best Attempts {sortConfig?.key === 'best_score' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
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
      <div className="mt-12 bg-gray-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Discover Click Media Group</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Want to make your property listings as engaging as this game? 
          Click Media Group specializes in creating scroll-stopping content 
          that captures attention and drives results.
        </p>
        <Button 
          className="bg-[#00A5E5] hover:bg-[#0094CE] text-white"
          onClick={() => window.open('https://www.clickmediagroup.co.uk', '_blank')}
        >
          Learn More About Click
        </Button>
      </div>
    </div>
  );
};

export default Leaderboard;
