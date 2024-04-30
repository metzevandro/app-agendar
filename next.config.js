const nextConfig = {
    webpack: (config, { isServer }) => {
        // Exclude 'bcrypt' from server-side webpack bundling
        if (isServer) {
            config.externals.push('bcrypt');
        }

        // Add TypeScript loader for files in 'design-system-zeroz' package
        config.module.rules.push({
            test: /\.tsx?$/,
            include: /design-system-zeroz/,
            use: {
                loader: 'ts-loader',
                options: {
                    allowTsInNodeModules: true,    },
            },
        });

        return config;
    },
}

module.exports = nextConfig;
