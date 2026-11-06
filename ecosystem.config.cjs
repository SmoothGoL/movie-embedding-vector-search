module.exports = {
  apps: [
    {
      name: "movie-embedding",
      script: "./server.js",
      node_args: "--env-file=.env",
      env_development: {
        NODE_ENV: "development",
        PORT: 5173,
      },
      env: {
        NODE_ENV: "production",
        PORT: 8001,
      },
    },
  ],
};
