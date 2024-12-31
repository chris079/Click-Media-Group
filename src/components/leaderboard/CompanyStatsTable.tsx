import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Award } from 'lucide-react';

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
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    if (minutes === 0) return `${remainingSeconds}s`;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatCompanyName = (company: string) => {
    return company
      .replace(/\.(com|co\.uk|net|org)$/i, '')  // Remove common domain extensions
      .replace(/\s+/g, ' ')  // Remove extra spaces
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
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

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Rank</TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => onRequestSort('company')}
            >
              Company 
              <span className="text-gray-400 ml-1">
                {sortConfig?.key === 'company' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}
              </span>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => onRequestSort('avg_completion_time')}
            >
              Average Time 
              <span className="text-gray-400 ml-1">
                {sortConfig?.key === 'avg_completion_time' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}
              </span>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => onRequestSort('games_played')}
            >
              Games Played 
              <span className="text-gray-400 ml-1">
                {sortConfig?.key === 'games_played' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}
              </span>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => onRequestSort('avg_attempts')}
            >
              Average Attempts 
              <span className="text-gray-400 ml-1">
                {sortConfig?.key === 'avg_attempts' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}
              </span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((entry, index) => (
            <TableRow key={index}>
              <TableCell>{getRankDisplay(index)}</TableCell>
              <TableCell className="font-medium">
                {formatCompanyName(entry.company)}
              </TableCell>
              <TableCell>
                {formatTime(entry.avg_completion_time)}
              </TableCell>
              <TableCell>
                {entry.games_played}
              </TableCell>
              <TableCell>
                {Math.round(entry.avg_attempts)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CompanyStatsTable;