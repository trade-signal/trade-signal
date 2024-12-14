module.exports = {
  apps: [
    {
      name: "trade-signal",
      script: "./server.js",
      instances: 2,
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production"
      }
    },
    {
      name: "cron-jobs",
      script: "./.cron/index.cjs",
      instances: 1,
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
