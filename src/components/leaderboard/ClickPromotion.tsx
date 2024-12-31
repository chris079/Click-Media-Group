import React from 'react';
import { Button } from '@/components/ui/button';

const ClickPromotion = () => {
  return (
    <div className="mt-12 bg-gray-50 rounded-lg p-8 text-center">
      <h2 className="text-2xl font-semibold mb-4">Discover Click Media Group</h2>
      <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
        Want to make your property listings as engaging as this game? 
        Click Media Group specializes in creating scroll-stopping content 
        that captures attention and drives results.
      </p>
      <Button 
        className="bg-[#00A5E5] hover:bg-[#0094CE] text-white"
        onClick={() => window.open('https://www.clickmediagroup.co.uk', '_blank')}
      >
        Learn More About Click
      </Button>
    </div>
  );
};

export default ClickPromotion;