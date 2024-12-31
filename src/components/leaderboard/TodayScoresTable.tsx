import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDuration } from 'date-fns';

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
    return formatDuration({
      seconds: Math.floor(seconds)
    }, { format: ['minutes', 'seconds'] });
  };

  const getRowColor = (index: number) => {
    switch(index) {
      case 0: return "bg-yellow-50/80 hover:bg-yellow-100/80";
      case 1: return "bg-gray-50/80 hover:bg-gray-100/80";
      case 2: return "bg-orange-50/80 hover:bg-orange-100/80";
      default: return "";
    }
  };

  const getUsernameColor = (index: number) => {
    switch(index) {
      case 0: return "text-yellow-700";
      case 1: return "text-gray-700";
      case 2: return "text-orange-700";
      default: return "";
    }
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
              onClick={() => onRequestSort('completion_time')}
            >
              Time {sortConfig?.key === 'completion_time' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead 
              className="text-right cursor-pointer"
              onClick={() => onRequestSort('attempts')}
            >
              Attempts {sortConfig?.key === 'attempts' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((entry, index) => (
            <TableRow key={index} className={getRowColor(index)}>
              <TableCell className={`font-medium ${getUsernameColor(index)}`}>
                {entry.username}
              </TableCell>
              <TableCell className="text-right">
                {formatTime(entry.completion_time)}
              </TableCell>
              <TableCell className="text-right">
                {entry.attempts}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TodayScoresTable;