import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    transpilePackages: [
        "@piar/layout",
        "@piar/messages",
        "@piar/coming-soon",
        "@piar/health-client",
        "@piar/health-configuration",
        "@piar/health-api",
        "@piar/domain-fields",
        "@piar/domain-models",
        "@piar/ui-config",
        "@piar/ui-components"
    ],
};

export default nextConfig;
