export const createLogger =
  (name: string, prefix?: string) => (message: string) => {
    console.log(`${prefix ? `[${prefix}]` : ""}[${name}] ${message}`);
  };
