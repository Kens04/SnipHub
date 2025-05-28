/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "fnwcubiimshyigxujqvz.supabase.co" },
    ],
  },
};

export default nextConfig;
