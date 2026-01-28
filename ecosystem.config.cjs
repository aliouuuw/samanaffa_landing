module.exports = {
  apps: [
    {
      name: 'samanaffa-web',
      cwd: './apps/web',
      script: '.output/server/index.mjs',
      interpreter: 'node',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
    },
    {
      name: 'samanaffa-backend',
      cwd: './apps/backend',
      script: 'src/server.ts',
      interpreter: 'bun',
      env: {
        NODE_ENV: 'production',
        PORT: 8787,
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
    },
  ],
}
