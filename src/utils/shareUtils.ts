export const shareToLinkedIn = (guessCount: number) => {
  const text = `I solved Click's Property Wordle in ${guessCount} ${guessCount === 1 ? 'try' : 'tries'}! Can you beat my score?`;
  const url = 'https://www.linkedin.com/sharing/share-offsite/?' + new URLSearchParams({
    url: window.location.href,
    title: text,
  }).toString();
  window.open(url, '_blank');
};