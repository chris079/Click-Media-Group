// Property-related 5-letter words for the game
export const propertyWords = [
  "AGENT", "ALARM", "APART", "ATTIC", "BANKS", "BLOCK", "BRICK", "BUILD", 
  "CHAIN", "CHEAP", "CLEAN", "CLOSE", "COURT", "DEEDS", "DELTA", "DOORS", 
  "DRIVE", "EAVES", "ELITE", "ENTRY", "FIXED", "FLOOR", "FRAME", "FRONT", 
  "GATES", "GRAND", "GRANT", "GREEN", "GROSS", "GUIDE", "HALLS", "HANDY", 
  "HOUSE", "INDEX", "LEASE", "LEVEL", "LIGHT", "LINKS", "LOANS", "MAJOR", 
  "METRO", "MEWS", "NORTH", "OFFER", "OPEN", "ORDER", "OWNER", "PLACE", 
  "PLAZA", "PRICE", "PRIME", "QUOTE", "RATES", "RENTS", "RIVER", "ROYAL", 
  "SPACE", "STATE", "STOCK", "STORE", "STYLE", "SUITE", "TOWER", "VALUE", 
  "URBAN", "ADDED", "SMART", "PITCH", "TRACK", "SCALE", "WORTH", "SITE", 
  "HOMES", "COURT", "BLOCK", "FRAME", "PRICE", "SPACE", "VALUE", "SITE", 
  "HOUSE", "OWNER", "PLACE", "RENTS", "METRO", "PRIME", "ELITE", "SMART", 
  "GRAND"
];

export const getWordOfTheDay = () => {
  const today = new Date();
  const index = today.getDate() % propertyWords.length;
  return propertyWords[index].toUpperCase();
};