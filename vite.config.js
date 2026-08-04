import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { cloudflare } from '@cloudflare/vite-plugin'

// https://vite.dev/config/
// Structure aligns with create-cloudflare Vue (Workers) template.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // github / server：纯静态产物，禁用 Cloudflare 插件以免打入 Worker 元数据
  const useCloudflare = mode !== 'github' && mode !== 'server'

  /** @type {import('vite').UserConfig} */
  const config = {
    base: env.VITE_SITE_BASE || '/',
    plugins: [
      vue(),
      ...(useCloudflare ? [cloudflare()] : [])
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      host: '0.0.0.0',
      port: 5173
    }
  }

  // Vendor split only for the client SPA graph (not the Worker environment)
  const clientChunks = {
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ['vue', 'vue-router']
        }
      }
    }
  }

  if (useCloudflare) {
    config.environments = {
      client: {
        build: clientChunks
      }
    }
  } else {
    config.build = clientChunks
  }

  return config
})
