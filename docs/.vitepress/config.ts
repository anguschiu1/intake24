import { defineConfig } from 'vitepress';
import { sidebar } from './sidebar';
import { nav } from './nav';
import { description } from '../../package.json';

export default defineConfig({
  title: 'Intake24',
  description,
  lang: 'en',

  head: [
    ['meta', { name: 'theme-color', content: '#EF6C00' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['link', { rel: 'icon', href: '/favicon.ico', type: "image/png", sizes: "16x16" }],
  ],

  vite: { server: { port: 8400 } },

  themeConfig: {
    repo: 'MRC-Epid-it24/intake24',
    logo: '/logo.png' ,
    docsDir: 'docs',
    editLinks: false,
    nav,
    sidebar,
  },
});
