export interface RandomNumberBounds {
  min: number;
  max: number;
}

export function getRandomNumber({min, max}: RandomNumberBounds): number {
  if (!max) return 0;
  return Math.floor(Math.random() * (max - min)) + min;
}
