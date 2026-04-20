export function getRandomNumber(min, max) {
  if (!max) return 0;
  return Math.floor(Math.random() * (max - min)) + min;
}
