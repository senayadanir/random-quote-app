export interface RandomNumberBounds {
  min: number;
  max: number;
}

export function getRandomNumber(min: number, max: number): number {
  if (!max) return 0;
  return Math.floor(Math.random() * (max - min)) + min;
}
