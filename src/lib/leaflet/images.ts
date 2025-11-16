import type { LeafletBlobRef } from "#/lib/leaflet/types";

export function leafletBlobToImageSrc(
  blob: LeafletBlobRef | undefined,
  did: string,
  variant: "feed_fullsize" | "feed_thumbnail" = "feed_fullsize",
) {
  const cid = blob?.ref?.$link;
  if (!cid) return null;
  const encodedDid = encodeURIComponent(did);
  return `https://cdn.bsky.app/img/${variant}/plain/${encodedDid}/${cid}@jpeg`;
}
