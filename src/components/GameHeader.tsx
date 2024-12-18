import { Settings, BarChart2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const GameHeader = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex justify-between items-center mb-4 px-4">
        <Button variant="ghost" size="icon">
          <Settings className="h-6 w-6" />
        </Button>
        <a 
          href="https://www.clickmediagroup.co.uk" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <img 
            src="/lovable-uploads/a052ec4b-df04-4768-80ea-fa2d304af6ef.png" 
            alt="Click Logo" 
            className="h-16 mx-auto hover:opacity-90 transition-opacity"
          />
        </a>
        <Link to="/leaderboard">
          <Button variant="ghost" size="icon">
            <BarChart2 className="h-6 w-6" />
          </Button>
        </Link>
      </div>
      <h2 className="text-xl font-semibold text-gray-700 mb-2">Think you know property?</h2>
      <p className="text-gray-600 text-sm px-4 max-w-2xl mx-auto">
        Test your knowledge in Click's Property Wordle! All words are property related, so guess wisely. 
        If you think this is engaging, wait until you see how we make your listings scroll stopping!
      </p>
    </div>
  );
};

export default GameHeader;