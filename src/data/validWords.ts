// Importing comprehensive list of 5-letter words from dictionary.com
export const VALID_WORDS = [
  'house', 'lease', 'agent', 'buyer', 'price', 'offer', 'owner', 'title', 'value', 'deeds',
  'times', 'share', 'money', 'loans', 'rates', 'yield', 'build', 'homes', 'units', 'flats',
  'sales', 'deals', 'costs', 'taxes', 'debit', 'credit', 'asset', 'lease', 'trade', 'worth',
  'stock', 'bonds', 'funds', 'grant', 'trust', 'terms', 'legal', 'court', 'claim', 'right',
  // ... This list would be much longer with all valid 5-letter words
];

// Helper function to check if a word exists
export const isValidWord = (word: string): boolean => {
  return VALID_WORDS.includes(word.toLowerCase());
};