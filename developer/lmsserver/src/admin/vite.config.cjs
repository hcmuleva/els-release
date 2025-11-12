const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react');
const { resolve } = require('path');

module.exports = defineConfig(({ mode }) => {
  const allowedHosts = process.env.ALLOWED_HOSTS
    ? process.env.ALLOWED_HOSTS.split(',')
    : ['localhost', '127.0.0.1', 'els-lmsserver.local', 'elslms.local'];

  return {
    root: __dirname,
    plugins: [react()],
    server: {
      port: 1337,
      allowedHosts,
    },
    build: {
      outDir: resolve(__dirname, '../../build'),
      emptyOutDir: true,
      rollupOptions: {
        input: resolve(__dirname, 'app.tsx'),
      },
    },
    resolve: {
      alias: {
        '@': resolve(__dirname),
      },
    },
  };
});
