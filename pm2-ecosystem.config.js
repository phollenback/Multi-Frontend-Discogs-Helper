module.exports = {
  apps: [
    {
      name: 'discogs-backend',
      script: 'dist/app.js',
      cwd: '/home/pi/discogs-app',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      error_file: '/home/pi/discogs-app/logs/backend-error.log',
      out_file: '/home/pi/discogs-app/logs/backend-out.log',
      log_file: '/home/pi/discogs-app/logs/backend-combined.log',
      time: true
    },
    {
      name: 'discogs-frontend',
      script: 'node_modules/serve/bin/serve.js',
      cwd: '/home/pi/discogs-app',
      args: ['-s', 'public', '-l', 3002],
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      },
      error_file: '/home/pi/discogs-app/logs/frontend-error.log',
      out_file: '/home/pi/discogs-app/logs/frontend-out.log',
      log_file: '/home/pi/discogs-app/logs/frontend-combined.log',
      time: true
    }
  ]
}; 