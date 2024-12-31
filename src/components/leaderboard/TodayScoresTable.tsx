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

  const getMedalColor = (completionTime: string, allTimes: string[]) => {
    const sortedTimes = [...new Set(allTimes)]
      .filter(time => time) // Remove null/undefined values
      .sort((a, b) => {
      const timeA = a.includes(':') ? 
        a.split(':').reduce((acc, time) => acc * 60 + parseInt(time), 0) :
        parseInt(a.split(' ')[0]);
      const timeB = b.includes(':') ? 
        b.split(':').reduce((acc, time) => acc * 60 + parseInt(time), 0) :
        parseInt(b.split(' ')[0]);
      return timeA - timeB;
    });

    const index = sortedTimes.indexOf(completionTime);
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

  const allCompletionTimes = data.map(entry => entry.completion_time);

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
              onClick={() => onRequestSort('completion_time')}
            >
              Time 
              <span className="text-gray-400 ml-1">
                {sortConfig?.key === 'completion_time' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}
              </span>
            </TableHead>
            <TableHead 
              className="cursor-pointer text-left"
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
          {data.map((entry, index) => {
            const medalColor = getMedalColor(entry.completion_time, allCompletionTimes);
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
                  {formatTime(entry.completion_time)}
                </TableCell>
                <TableCell className="text-left">
                  {entry.attempts}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default TodayScoresTable;