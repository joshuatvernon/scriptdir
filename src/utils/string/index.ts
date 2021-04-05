const isBlank = (str?: string | null): boolean => str === null || str === undefined || str === '';
const isNotBlank = (str?: string | null): boolean => str !== null && str !== undefined && str !== '';

export const StringUtils = {
  isBlank,
  isNotBlank
};
