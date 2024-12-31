import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDuration } from 'date-fns';

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
    return formatDuration({
      seconds: Math.floor(seconds)
    }, { format: ['minutes', 'seconds'] });
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="w-12 text-center cursor-pointer"
              onClick={() => onRequestSort('username')}
            >
              Username {sortConfig?.key === 'username' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead 
              className="text-right cursor-pointer"
              onClick={() => onRequestSort('avg_completion_time')}
            >
              Average Time {sortConfig?.key === 'avg_completion_time' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead 
              className="text-right cursor-pointer"
              onClick={() => onRequestSort('games_played')}
            >
              Number of Games {sortConfig?.key === 'games_played' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead 
              className="text-right cursor-pointer"
              onClick={() => onRequestSort('avg_attempts')}
            >
              Average Attempts {sortConfig?.key === 'avg_attempts' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead 
              className="text-right cursor-pointer"
              onClick={() => onRequestSort('best_completion_time')}
            >
              Best Time {sortConfig?.key === 'best_completion_time' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead 
              className="text-right cursor-pointer"
              onClick={() => onRequestSort('best_score')}
            >
              Best Attempts {sortConfig?.key === 'best_score' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((entry, index) => (
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
  );
};

export default LeaderboardTable;