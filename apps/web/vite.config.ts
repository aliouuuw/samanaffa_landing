import { defineConfig, type PluginOption } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(async (): Promise<any> => {
  let nitroPlugin: PluginOption | undefined
  try {
    const { nitro } = await import('nitro/vite')
    nitroPlugin = nitro({
      preset: 'bun',
      sourcemap: false,
    })
  } catch (err) {
    console.warn('Nitro plugin not available; skipping.', err)
  }

  return {
    server: {
      port: Number(process.env.PORT) || 3000,
      proxy: {
        '/api': {
          target: 'http://localhost:8787',
          changeOrigin: true,
        },
      },
    },
    plugins: [
      tailwindcss(),
      tsconfigPaths(),
      tanstackStart({
        srcDirectory: 'src',
        start: {
          entry: 'src/start.ts',
        },
        router: {
          routesDirectory: 'app',
          routeFileIgnorePattern: '(^|/)(page\\.tsx$|.*\\/page\\.tsx$|route\\.ts$|.*\\/route\\.ts$|columns\\.tsx$|queries\\.ts$)',
        },
      }),
      nitroPlugin,
      viteReact(),
    ].filter(Boolean) as any,
  }
})
