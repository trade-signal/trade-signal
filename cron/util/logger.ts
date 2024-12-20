export const createLogger = (name: string) => (message: string) => {
  console.log(`[${name}] ${message}`);
};
