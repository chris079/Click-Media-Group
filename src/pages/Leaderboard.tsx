import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDuration } from 'date-fns';

const Leaderboard = () => {
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

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Leaderboard</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 text-center">#</TableHead>
              <TableHead>Player</TableHead>
              <TableHead className="text-right">Avg Time</TableHead>
              <TableHead className="text-right">Best Time</TableHead>
              <TableHead className="text-right">Games</TableHead>
              <TableHead className="text-right">Avg Attempts</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboardData?.map((entry, index) => (
              <TableRow key={index} className={index < 3 ? "bg-yellow-50" : ""}>
                <TableCell className="text-center font-medium">
                  {index + 1}
                </TableCell>
                <TableCell className="font-medium">{entry.username}</TableCell>
                <TableCell className="text-right">
                  {formatTime(entry.avg_completion_time)}
                </TableCell>
                <TableCell className="text-right">
                  {formatTime(entry.best_completion_time)}
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
    </div>
  );
};

export default Leaderboard;