import { Settings, BarChart2, Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const GameHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="text-center mb-8">
      <div className="flex justify-between items-center mb-4 px-4">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] sm:w-[280px]">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-4 mt-4">
              <Button variant="ghost" size="lg" className="justify-start" onClick={() => setIsOpen(false)}>
                <Settings className="h-5 w-5 mr-2" />
                Settings
              </Button>
              <Link to="/leaderboard" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" size="lg" className="w-full justify-start">
                  <BarChart2 className="h-5 w-5 mr-2" />
                  Leaderboard
                </Button>
              </Link>
            </div>
          </SheetContent>
        </Sheet>

        <div className="hidden md:flex gap-2">
          <Button variant="ghost" size="icon">
            <Settings className="h-6 w-6" />
          </Button>
        </div>

        <a 
          href="https://www.clickmediagroup.co.uk" 
          target="_blank" 
          rel="noopener noreferrer"
          className="mx-auto"
        >
          <img 
            src="/lovable-uploads/a052ec4b-df04-4768-80ea-fa2d304af6ef.png" 
            alt="Click Logo" 
            className="h-16 hover:opacity-90 transition-opacity"
          />
        </a>

        <Link to="/leaderboard" className="hidden md:block">
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