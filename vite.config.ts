import { defineConfig } from 'vite'

// BASE_PATH=/estrategia-index/ no build do GitHub Pages (project page).
// Com domínio próprio no futuro, remover a variável (base volta a "/").
export default defineConfig({
  base: process.env.BASE_PATH || '/',
})
