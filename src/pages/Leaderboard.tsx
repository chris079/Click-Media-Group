import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Leaderboard</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Player</TableHead>
            <TableHead>Games Played</TableHead>
            <TableHead>Average Attempts</TableHead>
            <TableHead>Best Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaderboardData?.map((entry, index) => (
            <TableRow key={index}>
              <TableCell>{entry.username}</TableCell>
              <TableCell>{entry.games_played}</TableCell>
              <TableCell>{Number(entry.avg_attempts).toFixed(1)}</TableCell>
              <TableCell>{entry.best_score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Leaderboard;