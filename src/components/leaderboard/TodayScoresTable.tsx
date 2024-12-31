import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDuration } from 'date-fns';
import { Award } from 'lucide-react';

interface TodayScore {
  username: string;
  completion_time: number;
  attempts: number;
  word: string;
}

interface TodayScoresTableProps {
  data: TodayScore[];
  sortConfig: {
    key: string;
    direction: 'asc' | 'desc';
  } | null;
  onRequestSort: (key: string) => void;
}

const TodayScoresTable = ({ data, sortConfig, onRequestSort }: TodayScoresTableProps) => {
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
              onClick={() => onRequestSort('completion_time')}
            >
              <div className="flex items-center justify-end gap-2">
                Time 
                <span className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {sortConfig?.key === 'completion_time' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}
                </span>
              </div>
            </TableHead>
            <TableHead 
              className="text-right cursor-pointer group"
              onClick={() => onRequestSort('attempts')}
            >
              <div className="flex items-center justify-end gap-2">
                Attempts 
                <span className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {sortConfig?.key === 'attempts' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}
                </span>
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((entry, index) => (
            <TableRow key={index}>
              <TableCell>{getRankDisplay(index)}</TableCell>
              <TableCell className="font-medium">
                {entry.username}
              </TableCell>
              <TableCell className="text-right">
                {formatTime(Number(entry.completion_time))}
              </TableCell>
              <TableCell className="text-right">
                {Math.round(entry.attempts)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TodayScoresTable;