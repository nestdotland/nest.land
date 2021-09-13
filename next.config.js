/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  redirects() {
    return [
      {
        source: '/github',
        destination: 'https://github.com/nestdotland',
        permanent: true,
      },
      {
        source: '/discord',
        destination: 'https://discord.gg/hYUsX3H',
        permanent: true,
      },
    ];
  },
};
