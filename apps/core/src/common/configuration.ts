const checkIsEnabled = (value: string) => {
  return value ? value === "true" : true;
};

export default () => ({
  nodeEnv: process.env.NODE_ENV,
  scheduled: {
    enabled: checkIsEnabled(process.env.SCHEDULED_ENABLED)
  }
});
