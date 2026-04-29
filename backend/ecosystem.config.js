module.exports = {
  apps: [
    {
      name: "plus",
      script: "index.js",
      cwd: __dirname,
      interpreter: "node",
      instances: 1,
      exec_mode: "fork",
      watch: false,
      autorestart: true,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
