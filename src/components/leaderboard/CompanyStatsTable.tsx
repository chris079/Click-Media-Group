import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDuration } from 'date-fns';

interface CompanyStats {
  company: string;
  players: number;
  games_played: number;
  avg_completion_time: number;
  avg_attempts: number;
}

interface CompanyStatsTableProps {
  data: CompanyStats[];
  sortConfig: {
    key: string;
    direction: 'asc' | 'desc';
  } | null;
  onRequestSort: (key: string) => void;
}

const CompanyStatsTable = ({ data, sortConfig, onRequestSort }: CompanyStatsTableProps) => {
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
              onClick={() => onRequestSort('company')}
            >
              Company {sortConfig?.key === 'company' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
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
              Games Played {sortConfig?.key === 'games_played' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead 
              className="text-right cursor-pointer"
              onClick={() => onRequestSort('avg_attempts')}
            >
              Average Attempts {sortConfig?.key === 'avg_attempts' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((entry, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{entry.company}</TableCell>
              <TableCell className="text-right">
                {formatTime(entry.avg_completion_time)}
              </TableCell>
              <TableCell className="text-right">
                {entry.games_played}
              </TableCell>
              <TableCell className="text-right">
                {entry.avg_attempts?.toFixed(1)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CompanyStatsTable;