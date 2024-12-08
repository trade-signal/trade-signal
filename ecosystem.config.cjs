module.exports = {
  apps: [
    {
      name: "trade-signal",
      script: "npm run start",
      instances: 2,
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production"
      }
    },
    {
      name: "cron",
      script: "./cron/index.js",
      instances: 1
    }
  ]
};
