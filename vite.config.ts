import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/soft-landing/',
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist',
    manifest: true, // Generate manifest.json for file mapping
    cssCodeSplit: true, // Split CSS into separate files
    rollupOptions: {
      input: {
        // Main editor app
        editor: fileURLToPath(new URL('./index.html', import.meta.url)),
        // Viewer app for downloadable sites
        viewer: fileURLToPath(new URL('./src/viewer/index.html', import.meta.url)),
      },
      output: {
        // Organize output files into folders
        entryFileNames: 'js/[name]-[hash].js',
        chunkFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name ?? '';
          if (name.endsWith('.css')) {
            return 'css/[name]-[hash][extname]';
          }
          // Images, fonts, etc.
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
});
