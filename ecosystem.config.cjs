module.exports = {
  apps: [
    {
      name: "trade-signal",
      script: "npm",
      args: "start",
      instances: 2,
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production"
      }
    },
    {
      name: "cron-jobs",
      script: "./cron/index.js",
      instances: 1,
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
