import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  build: {
    target: ['chrome74'],
  },
  plugins: [
    vue(),
    {
      // 模拟采集端点：接收SDK上报（含sendBeacon），打印报文，仅dev环境生效
      name: 'mock-report',
      configureServer(server) {
        server.middlewares.use('/report', (req, res) => {
          let body = '';
          req.on('data', (chunk: Buffer) => {
            body += chunk;
          });
          req.on('end', () => {
            // eslint-disable-next-line no-console -- 模拟采集端点的功能即打印报文
            console.log('[analytics report]', body);
            res.statusCode = 204;
            res.end();
          });
        });
      },
    },
  ],
  resolve: {
    alias: {
      '@/': `${path.resolve(__dirname, './src')}/`,
    },
  },
  server: {
    port: 3200,
  },
});
