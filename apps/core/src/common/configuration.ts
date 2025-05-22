export default () => ({
  nodeEnv: process.env.NODE_ENV,
  scheduled: {
    enabled: process.env.SCHEDULED_ENABLED === "true" || false
  }
});
