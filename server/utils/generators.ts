export const getNextSeason = (currentSeason: string): string => {
  const isSummer = currentSeason.includes('Summer');
  if (isSummer) {
    // If it's summer, the next season is the school year
    // Extract the year and increment it by 1 for the next school year
    const year = parseInt(currentSeason.split(' ')[0]);
    return `${year}-${year + 1} School Year`;
  } else {
    // If it's a school year, the next season is the summer
    // Extract the second year and increment it by 1 for the next summer
    const year = parseInt(currentSeason.split('-')[1]);
    return `${year} Summer`;
  }
};
