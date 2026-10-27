module.exports = {
  apps: [
    {
      name: "movie-embedding",
      script: "./server.js",
      node_args: "--env-file=.env",
      env: {
        NODE_ENV: "development",
        PORT: 5173,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 8001,
      },
    },
  ],
};
