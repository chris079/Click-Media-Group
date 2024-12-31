import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Award } from 'lucide-react';

interface TodayScore {
  username: string;
  completion_time: string;
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
  const formatTime = (timeString: string) => {
    if (!timeString) return 'N/A';
    
    // Parse the interval string (e.g., "00:01:30" or "90 seconds")
    let totalSeconds: number;
    if (timeString.includes(':')) {
      const [hours, minutes, seconds] = timeString.split(':').map(Number);
      totalSeconds = hours * 3600 + minutes * 60 + seconds;
    } else {
      totalSeconds = parseInt(timeString.split(' ')[0]);
    }
    
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = Math.floor(totalSeconds % 60);
    
    if (minutes === 0) {
      return `${remainingSeconds}s`;
    }
    
    return `${minutes}m ${remainingSeconds}s`;
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
    return (
      <div className="flex items-start gap-2">
        <span>{rank}</span>
        {index < 3 && (
          <Award className={`h-4 w-4 ${getMedalColor(index)}`} />
        )}
      </div>
    );
  };

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

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
              className="text-left cursor-pointer"
              onClick={() => onRequestSort('completion_time')}
            >
              Time 
              <span className="text-gray-400 ml-1">
                {sortConfig?.key === 'completion_time' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}
              </span>
            </TableHead>
            <TableHead 
              className="text-left cursor-pointer"
              onClick={() => onRequestSort('attempts')}
            >
              Attempts 
              <span className="text-gray-400 ml-1">
                {sortConfig?.key === 'attempts' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}
              </span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((entry, index) => (
            <TableRow key={index}>
              <TableCell>{getRankDisplay(index)}</TableCell>
              <TableCell className="font-medium">
                {capitalizeFirstLetter(entry.username)}
              </TableCell>
              <TableCell>
                {formatTime(entry.completion_time)}
              </TableCell>
              <TableCell>
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