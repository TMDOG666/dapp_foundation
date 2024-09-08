/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // 环境变量
    env: {
        NETWORK_NAME: process.env.NETWORK_NAME,
        HTTP_URL: process.env.HTTP_URL,
        WEBSTOCK_URL: process.env.WEBSTOCK_URL
    }
};

export default nextConfig;
