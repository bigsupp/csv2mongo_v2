module.exports = {
  apps: [{
    name: 'csv2mongo',
    script: 'server.js',
    // instances: 1,
    autorestart: true,
    watch: ["libs", "models", "modelTargets", "routes", "server.js"],
    ignore_watch: ['node_modules', 'uploads', 'views', 'public'],
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      UPLOAD_DIRECTORY: "uploads",
      UPLOAD_MAXIMUM_FILE_SIZE: 4194304,
      UPLOAD_FIELD_NAME: "userAttachment"
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};