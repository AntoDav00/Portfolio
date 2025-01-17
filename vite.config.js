import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Carica le variabili d'ambiente
  const env = loadEnv(mode, process.cwd(), '');
  
  console.log('Variabili ambiente Vite:', {
    VITE_GITHUB_TOKEN: env.VITE_GITHUB_TOKEN ? 'Presente' : 'Assente',
    tokenLength: env.VITE_GITHUB_TOKEN?.length || 0
  });

  return {
    plugins: [react()],
    define: {
      // Passa esplicitamente le variabili d'ambiente
      'process.env.VITE_GITHUB_TOKEN': JSON.stringify(env.VITE_GITHUB_TOKEN),
      'import.meta.env.VITE_GITHUB_TOKEN': JSON.stringify(env.VITE_GITHUB_TOKEN)
    },
    // Assicura che le variabili d'ambiente siano caricate
    envPrefix: 'VITE_'
  }
})
