import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://kiran-pk-geo.github.io',
  base: '/vo-docs',
  integrations: [
    starlight({
      title: 'VO Docs',
      description: 'Functional documentation for the Voyage Optimization platform',
      sidebar: [
        {
          label: 'Services',
          items: [{ autogenerate: { directory: 'services' } }],
        },
        {
          label: 'Features',
          items: [{ autogenerate: { directory: 'features' } }],
        },
      ],
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/Geoservedmcc' },
      ],
    }),
  ],
});
