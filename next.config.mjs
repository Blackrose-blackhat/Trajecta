/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript:{
    ignoreBuildErrors:true
  },
  eslint:{
    ignoreDuringBuilds:true
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        
        hostname :"images.unsplash.com"
      },
      {
        protocol: 'https',
        
        hostname :"assets.aceternity.com"
      },
      {
        protocol: 'https',
        
        hostname :"m.youtube.com"
      },
      {
        protocol: 'https',
        
        hostname :"img.youtube.com"
      },
      
    ],
  },
};

export default nextConfig;
