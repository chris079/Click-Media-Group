import React from 'react';
import { Button } from '@/components/ui/button';

const ClickPromotion = () => {
  return (
    <div className="mt-12 bg-gray-50 rounded-lg p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Looking to Create Something Extraordinary?</h1>
      <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
        Click Media Group is your partner for stunning visuals and creative solutions 
        that leave a lasting impression. Perfect for property marketing and more.
      </p>
      <Button 
        className="bg-[#00A5E5] hover:bg-[#0094CE] text-white"
        onClick={() => window.open('https://www.clickmediagroup.co.uk', '_blank')}
      >
        Find Out More About Click
      </Button>
    </div>
  );
};

export default ClickPromotion;