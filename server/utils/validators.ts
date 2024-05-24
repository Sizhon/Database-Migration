export const validateEmail = (value: String): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.toString());
export const validateCBO = (value: String): boolean =>
  /^BYF\d{3}$/.test(value.toString());
export const validateEID = (value: String): boolean =>
  value.toString().length === 6;

export const validateSeason = (value: String): boolean => {
  const SYCheck: boolean = /\b(\d{4})-\d{4}\s+School\s+Year\b/.test(
    value.toString(),
  );
  const SumCheck: boolean = /\b\d{4}\s+Summer\b/.test(value.toString());
  if (SumCheck) return SumCheck;
  if (!SYCheck) return false;
  const years: string[] = value.toString().split(' ')[0].split('-');
  return Number(years[1]) - Number(years[0]) === 1;
};

export const validateTime = (value: String): boolean => {
  return /^(1[012]|0?[1-9]):([0-5][0-9]) (AM|PM)$/.test(value.toString());
};
