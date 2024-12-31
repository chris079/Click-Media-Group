import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home, BarChart2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import TermsAndConditions from '@/components/settings/TermsAndConditions';

const Settings = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>
        <div className="flex gap-2">
          <Link to="/">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Home className="h-6 w-6" />
            </Button>
          </Link>
          <Link to="/leaderboard">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <BarChart2 className="h-6 w-6" />
            </Button>
          </Link>
        </div>
      </div>
      <div className="max-w-4xl mx-auto">
        <TermsAndConditions />
      </div>
    </div>
  );
};

export default Settings;