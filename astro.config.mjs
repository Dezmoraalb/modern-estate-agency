import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Домен сайту
  site: 'https://modern-estate-agency.com.ua',
  
  // Базовий шлях (порожній для кореневого домену)
  base: '/',
  
  integrations: [
    tailwind(), 
    react(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    })
  ],
});

