import React from 'react';
import { Button } from '@/components/ui/button';
import { Facebook, Twitter, Mail, LinkedinIcon } from 'lucide-react';
import { shareToLinkedIn } from '@/utils/shareUtils';

const ShareButtons = () => {
  const handleShare = (platform: 'linkedin' | 'twitter' | 'facebook' | 'email') => {
    const shareText = "Check out the Property Wordle leaderboard! Can you make it to the top?";
    const url = window.location.href;

    switch (platform) {
      case 'linkedin':
        shareToLinkedIn(shareText);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'email':
        window.location.href = `mailto:?subject=Property Wordle Leaderboard&body=${encodeURIComponent(shareText + '\n\n' + url)}`;
        break;
    }
  };

  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="icon"
        onClick={() => handleShare('linkedin')}
      >
        <LinkedinIcon className="h-5 w-5" />
      </Button>
      <Button 
        variant="outline" 
        size="icon"
        onClick={() => handleShare('twitter')}
      >
        <Twitter className="h-5 w-5" />
      </Button>
      <Button 
        variant="outline" 
        size="icon"
        onClick={() => handleShare('facebook')}
      >
        <Facebook className="h-5 w-5" />
      </Button>
      <Button 
        variant="outline" 
        size="icon"
        onClick={() => handleShare('email')}
      >
        <Mail className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default ShareButtons;