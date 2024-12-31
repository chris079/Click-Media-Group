import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from '@/pages/Index';
import Settings from '@/pages/Settings';
import Leaderboard from '@/pages/Leaderboard';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
          <Toaster />
          <SonnerToaster position="top-center" />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;