import React from 'react';
import TermsAndConditions from '@/components/settings/TermsAndConditions';

const Settings = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      <div className="max-w-4xl mx-auto">
        <TermsAndConditions />
      </div>
    </div>
  );
};

export default Settings;