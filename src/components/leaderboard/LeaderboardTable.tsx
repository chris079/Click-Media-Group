import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDuration } from 'date-fns';
import { Award } from 'lucide-react';

interface LeaderboardEntry {
  username: string;
  avg_completion_time: number;
  games_played: number;
  avg_attempts: number;
  best_completion_time: number;
  best_score: number;
}

interface LeaderboardTableProps {
  data: LeaderboardEntry[];
  sortConfig: {
    key: string;
    direction: 'asc' | 'desc';
  } | null;
  onRequestSort: (key: string) => void;
}

const LeaderboardTable = ({ data, sortConfig, onRequestSort }: LeaderboardTableProps) => {
  const formatTime = (seconds: number) => {
    if (!seconds) return 'N/A';
    if (seconds < 60) return `${Math.floor(seconds)} seconds`;
    return formatDuration({
      seconds: Math.floor(seconds)
    }, { format: ['minutes', 'seconds'] });
  };

  const getMedalColor = (index: number) => {
    switch(index) {
      case 0: return "text-yellow-500";
      case 1: return "text-gray-400";
      case 2: return "text-amber-600";
      default: return "";
    }
  };

  const getRankDisplay = (index: number) => {
    const rank = index + 1;
    const suffix = ['st', 'nd', 'rd'][index] || 'th';
    return (
      <div className="flex items-center gap-1">
        <span>{rank}{suffix}</span>
        {index < 3 && (
          <Award className={`h-4 w-4 ${getMedalColor(index)}`} />
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Rank</TableHead>
            <TableHead 
              className="cursor-pointer group"
              onClick={() => onRequestSort('username')}
            >
              <div className="flex items-center gap-2">
                Username 
                <span className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {sortConfig?.key === 'username' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}
                </span>
              </div>
            </TableHead>
            <TableHead 
              className="text-right cursor-pointer group"
              onClick={() => onRequestSort('avg_completion_time')}
            >
              <div className="flex items-center justify-end gap-2">
                Average Time 
                <span className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {sortConfig?.key === 'avg_completion_time' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}
                </span>
              </div>
            </TableHead>
            <TableHead 
              className="text-right cursor-pointer group"
              onClick={() => onRequestSort('games_played')}
            >
              <div className="flex items-center justify-end gap-2">
                Games Played 
                <span className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {sortConfig?.key === 'games_played' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}
                </span>
              </div>
            </TableHead>
            <TableHead 
              className="text-right cursor-pointer group"
              onClick={() => onRequestSort('avg_attempts')}
            >
              <div className="flex items-center justify-end gap-2">
                Average Attempts 
                <span className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {sortConfig?.key === 'avg_attempts' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}
                </span>
              </div>
            </TableHead>
            <TableHead 
              className="text-right cursor-pointer group"
              onClick={() => onRequestSort('best_completion_time')}
            >
              <div className="flex items-center justify-end gap-2">
                Best Time 
                <span className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {sortConfig?.key === 'best_completion_time' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}
                </span>
              </div>
            </TableHead>
            <TableHead 
              className="text-right cursor-pointer group"
              onClick={() => onRequestSort('best_score')}
            >
              <div className="flex items-center justify-end gap-2">
                Best Attempts 
                <span className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {sortConfig?.key === 'best_score' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}
                </span>
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((entry, index) => (
            <TableRow key={index}>
              <TableCell>{getRankDisplay(index)}</TableCell>
              <TableCell className="font-medium">{entry.username}</TableCell>
              <TableCell className="text-right">
                {formatTime(entry.avg_completion_time)}
              </TableCell>
              <TableCell className="text-right">
                {entry.games_played}
              </TableCell>
              <TableCell className="text-right">
                {Math.round(entry.avg_attempts)}
              </TableCell>
              <TableCell className="text-right">
                {formatTime(entry.best_completion_time)}
              </TableCell>
              <TableCell className="text-right">
                {Math.round(entry.best_score)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeaderboardTable;