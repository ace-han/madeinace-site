import { getPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Course',
      links: [
        {
          text: 'Neural Networks',
          href: getPermalink('/courses/neural-networks'),
        },
        {
          text: 'More...',
          href: getPermalink('/courses'),
        },
      ],
    },
    {
      text: 'Blog',
      href: getPermalink('/blog'),
    },
    {
      text: 'About',
      href: getPermalink('/about'),
    },
  ],
  // actions: [{ type: 'button', text: 'Download', href: 'https://github.com/ace-han/madeinace-site' }],
  actions: [],
};

export const footerData = {
  links: [
    {
      title: 'Product',
      links: [
        { text: 'Features', href: '#' },
        { text: 'Security', href: '#' },
        { text: 'Team', href: '#' },
        { text: 'Enterprise', href: '#' },
        { text: 'Customer stories', href: '#' },
        { text: 'Pricing', href: '#' },
        { text: 'Resources', href: '#' },
      ],
    },
    {
      title: 'Platform',
      links: [
        { text: 'Developer API', href: '#' },
        { text: 'Partners', href: '#' },
        { text: 'Atom', href: '#' },
        { text: 'Electron', href: '#' },
        { text: 'Madeinace Desktop', href: '#' },
      ],
    },
    {
      title: 'Support',
      links: [
        { text: 'Docs', href: '#' },
        { text: 'Community Forum', href: '#' },
        { text: 'Professional Services', href: '#' },
        { text: 'Skills', href: '#' },
        { text: 'Status', href: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { text: 'About', href: '#' },
        { text: 'Blog', href: '#' },
        { text: 'Careers', href: '#' },
        { text: 'Press', href: '#' },
        { text: 'Inclusion', href: '#' },
        { text: 'Social Impact', href: '#' },
        { text: 'Shop', href: '#' },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Terms', href: getPermalink('/terms') },
    { text: 'Privacy Policy', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    { ariaLabel: 'Twitter', icon: 'tabler:brand-twitter', href: '#' },
    { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: '#' },
    { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: '#' },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
    { ariaLabel: 'Github', icon: 'tabler:brand-github', href: 'https://github.com/ace-han/madeinace-site' },
  ],
  footNote: `
    By <a class="text-blue-600 hover:underline dark:text-gray-200" href="mailto:ace.jl.han@mail.com"> Ace Han</a> · Under License <a class="text-blue-600 hover:underline dark:text-gray-200" href="https://creativecommons.org/licenses/by-nc-nd/4.0/deed">CC BY-NC-ND 4.0</a>
  `,
};
