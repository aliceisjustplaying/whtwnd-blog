import { withPlausibleProxy } from "next-plausible";
import { PLAUSIBLE_DOMAIN, USE_PLAUSIBLE } from "./src/lib/config";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "oyster.us-east.host.bsky.network",
        pathname: "/xrpc/com.atproto.sync.getBlob",
        // search: '?did=did%3Aplc%3Ap2cp5gopk7mgjegy6wadk3ep&cid=**',
      },
    ],
  },
};

if (USE_PLAUSIBLE) {
  nextConfig = withPlausibleProxy({
    customDomain: `https://${PLAUSIBLE_DOMAIN}`,
  })(nextConfig);
}

export default nextConfig;
