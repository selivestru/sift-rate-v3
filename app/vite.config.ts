import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { intlayer } from 'vite-intlayer'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tailwindcss(),
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      routesDirectory: 'src/app/routes',
      generatedRouteTree: 'src/app/routeTree.gen.ts',
      routeFileIgnorePattern: '.content.(ts|tsx|js|mjs|cjs|jsx|json|jsonc|json5|md|mdx|yaml|yml)$',
    }),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    svgr(),
    intlayer(),
  ],
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
})
