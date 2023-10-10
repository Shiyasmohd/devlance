/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true,
    },
    reactStrictMode: true,
    webpack: config => {
        config.resolve.fallback = { fs: false, net: false, tls: false };
        return config;
    },
    images: {
        domains: [
            'ipfs.io',
            "btdg.s3.amazonaws.com",
            "gateway.ipfs.io",
            "ipfs.filebase.io",
            "ipfs.moralis.io",
            "cdn-ea.earnalliance.com"
        ],
    },
    env: {
        RAINBOWKIT_PROJECT_ID: process.env.RAINBOWKIT_PROJECT_ID,
        ALCHEMY_KEY: process.env.ALCHEMY_KEY,
    }
}

module.exports = nextConfig
