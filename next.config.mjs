/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "fnwcubiimshyigxujqvz.supabase.co" },
    ],
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
