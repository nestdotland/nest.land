import { NextSeoProps } from 'next-seo/lib/types';
import { SiGithub, SiDiscord } from 'react-icons/si';

const base = {
  name: 'Nest',
  social: '@nastdotland',
  description: 'An immutable module registry for Deno.',
  web:
    process.env.VERCEL_ENV == 'production'
      ? 'https://nest.land'
      : process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000',
};

export const seo: NextSeoProps = {
  title: base.name,
  defaultTitle: base.name,
  titleTemplate: `%s - ${base.name}`,
  description: base.description,
  canonical: base.web,
  openGraph: {
    url: base.web,
    site_name: base.name,
    description: base.description,
    type: 'website',
    locale: 'en_IE',
    images: [
      {
        url: 'https://og.nest.land/api/image?layoutName=Page&Title=Coming%20Soon%E2%84%A2&Subtitle=',
      },
    ],
  },
  twitter: {
    handle: base.social,
    site: base.social,
    cardType: 'summary_large_image',
  },
};

export const navbar = {
  pages: [
    { name: 'Modules', link: '#/x' },
    { name: 'Blog', link: '#/blog' },
    { name: 'Docs', link: '#/docs' },
    { name: 'Login', link: '#/login', active: true },
  ],
  socials: [
    { name: 'GitHub', link: '/github', icon: SiGithub },
    { name: 'Discord', link: '/discord', icon: SiDiscord },
  ],
};

export const main = {
  seo,
  navbar,
};

export default main;
