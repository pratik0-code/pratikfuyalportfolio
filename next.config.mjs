/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export so the site can be served from GitHub Pages
  output: 'export',
  
  // Ensures clean URL structures and prevents 404s on direct page refreshes
  trailingSlash: true,
  
  // Disables Next.js image optimization servers (mandatory for GitHub static hosting)
  images: { 
    unoptimized: true 
  },
  
  reactStrictMode: true,
};

export default nextConfig;
