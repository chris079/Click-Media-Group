import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    if (minutes === 0) {
      return `${remainingSeconds}s`;
    }
    
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getMedalColor = (avgTime: number, allTimes: number[]) => {
    const sortedTimes = [...new Set(allTimes)]
      .filter(time => time) // Remove null/undefined values
      .sort((a, b) => a - b);

    const index = sortedTimes.indexOf(avgTime);
    switch(index) {
      case 0: return "text-yellow-500";
      case 1: return "text-gray-400";
      case 2: return "text-amber-600";
      default: return "";
    }
  };

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const allAvgTimes = data.map(entry => entry.avg_completion_time);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16 text-left">Rank</TableHead>
            <TableHead 
              className="cursor-pointer text-left"
              onClick={() => onRequestSort('username')}
            >
              Username 
              <span className="text-gray-400 ml-1">
                {sortConfig?.key === 'username' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}
              </span>
            </TableHead>
            <TableHead 
              className="cursor-pointer text-left"
              onClick={() => onRequestSort('avg_completion_time')}
            >
              Average Time 
              <span className="text-gray-400 ml-1">
                {sortConfig?.key === 'avg_completion_time' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}
              </span>
            </TableHead>
            <TableHead 
              className="cursor-pointer text-left"
              onClick={() => onRequestSort('games_played')}
            >
              Games Played 
              <span className="text-gray-400 ml-1">
                {sortConfig?.key === 'games_played' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}
              </span>
            </TableHead>
            <TableHead 
              className="cursor-pointer text-left"
              onClick={() => onRequestSort('avg_attempts')}
            >
              Average Attempts 
              <span className="text-gray-400 ml-1">
                {sortConfig?.key === 'avg_attempts' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}
              </span>
            </TableHead>
            <TableHead 
              className="cursor-pointer text-left"
              onClick={() => onRequestSort('best_completion_time')}
            >
              Best Time 
              <span className="text-gray-400 ml-1">
                {sortConfig?.key === 'best_completion_time' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}
              </span>
            </TableHead>
            <TableHead 
              className="cursor-pointer text-left"
              onClick={() => onRequestSort('best_score')}
            >
              Best Attempts 
              <span className="text-gray-400 ml-1">
                {sortConfig?.key === 'best_score' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}
              </span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((entry, index) => {
            const medalColor = getMedalColor(entry.avg_completion_time, allAvgTimes);
            return (
              <TableRow key={index}>
                <TableCell className="text-left">{index + 1}</TableCell>
                <TableCell className="font-medium text-left flex items-center gap-2">
                  {capitalizeFirstLetter(entry.username)}
                  {medalColor && (
                    <Award className={`h-4 w-4 ${medalColor}`} />
                  )}
                </TableCell>
                <TableCell className="text-left">
                  {formatTime(entry.avg_completion_time)}
                </TableCell>
                <TableCell className="text-left">
                  {entry.games_played}
                </TableCell>
                <TableCell className="text-left">
                  {Math.round(entry.avg_attempts)}
                </TableCell>
                <TableCell className="text-left">
                  {formatTime(entry.best_completion_time)}
                </TableCell>
                <TableCell className="text-left">
                  {Math.round(entry.best_score)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeaderboardTable;