// Initial set of property-related 5-letter words
export const propertyWords = [
  "HOUSE", "LEASE", "AGENT", "BRICK", "FLOOR", "PRICE", "TITLE", "ROOMS", "DEEDS", "BUYER",
  "HOMES", "SALES", "BUILD", "PLOTS", "MANOR", "VILLA", "FLATS", "SHARE", "OWNED", "TOWER"
];

export const getWordOfTheDay = () => {
  const today = new Date();
  const index = today.getDate() % propertyWords.length;
  return propertyWords[index].toUpperCase();
};