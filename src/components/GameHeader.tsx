import { Settings, BarChart2 } from 'lucide-react';
import { Button } from "@/components/ui/button";

const GameHeader = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex justify-between items-center mb-4 px-4">
        <Button variant="ghost" size="icon">
          <Settings className="h-6 w-6" />
        </Button>
        <img 
          src="/lovable-uploads/a052ec4b-df04-4768-80ea-fa2d304af6ef.png" 
          alt="Click Logo" 
          className="h-16 mx-auto"
        />
        <Button variant="ghost" size="icon">
          <BarChart2 className="h-6 w-6" />
        </Button>
      </div>
      <h2 className="text-xl font-semibold text-gray-700 mb-6">Click's Property Wordle</h2>
    </div>
  );
};

export default GameHeader;