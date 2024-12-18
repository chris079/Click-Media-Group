// Fetch words from the GitHub repository
const fetchValidWords = async () => {
  try {
    // Using a more reliable word list source
    const response = await fetch('https://raw.githubusercontent.com/dwyl/english-words/master/words_dictionary.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const words = await response.json();
    // Convert object keys to array and filter 5-letter words
    return new Set(Object.keys(words).filter((word: string) => word.length === 5).map((word: string) => word.toUpperCase()));
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