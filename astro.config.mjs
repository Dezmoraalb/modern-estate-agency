import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  // 1. Ваша повна адреса сайту
  site: 'https://dezmoraalb.github.io',
  
  // 2. Назва репозиторію (ОБОВ'ЯЗКОВО зі слешем на початку)
  base: '/modern-estate-agency/',
  
  integrations: [tailwind(), react()],
});

