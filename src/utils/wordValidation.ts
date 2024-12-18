// Fetch words from the GitHub repository
const fetchValidWords = async () => {
  try {
    const response = await fetch('https://raw.githubusercontent.com/droyson/go-fetch-words/master/words.json');
    const words = await response.json();
    return new Set(words.filter((word: string) => word.length === 5).map((word: string) => word.toUpperCase()));
  } catch (error) {
    console.error('Error fetching words:', error);
    return null;
  }
};

let validWordsSet: Set<string> | null = null;

export const initializeWordList = async () => {
  validWordsSet = await fetchValidWords();
  return validWordsSet !== null;
};

export const isValidWord = (word: string): boolean => {
  if (!validWordsSet) return true; // Fallback to allow all words if list hasn't loaded
  return validWordsSet.has(word.toUpperCase());
};