export const delay = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

export const delayRandom = (min: number = 1000, max: number = 3000) =>
  delay(Math.floor(Math.random() * (max - min + 1)) + min);
