export const shareToLinkedIn = (text: string) => {
  const url = 'https://www.linkedin.com/sharing/share-offsite/?' + new URLSearchParams({
    url: window.location.href,
    title: text,
  }).toString();
  window.open(url, '_blank');
};