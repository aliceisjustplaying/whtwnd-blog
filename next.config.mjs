import { withPlausibleProxy } from "next-plausible";

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

// TODO: janky
// const USE_PLAUSIBLE = true;
const PLAUSIBLE_DOMAIN = "plausible.bsky.sh";

// if (USE_PLAUSIBLE) {
nextConfig = withPlausibleProxy({
  customDomain: `https://${PLAUSIBLE_DOMAIN}`,
})(nextConfig);
// }

export default nextConfig;
