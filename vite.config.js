import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // github/server 模式是纯静态托管，启用 cloudflare() 会把
  // wrangler.json、.assetsignore 等内部配置打进产物并公网发布
  const useCloudflare = mode !== 'github' && mode !== 'server'

  return {
    base: env.VITE_SITE_BASE || '/',
    plugins: [vue(), ...(useCloudflare ? [cloudflare()] : [])],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    server: {
      host: '0.0.0.0',
      port: 5173
    }
  };
})