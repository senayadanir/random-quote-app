import { RandomNumberBounds } from "@/types/quotes";

export function getRandomNumber({ min, max }: RandomNumberBounds): number {
  if (!max) return 0;
  return Math.floor(Math.random() * (max - min)) + min;
}
