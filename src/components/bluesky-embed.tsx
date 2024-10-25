"use client";

import { useEffect, useId, useState } from "react";
import { usePathname } from "next/navigation";

const EMBED_URL = "https://embed.bsky.app";

export function BlueskyPostEmbed({ uri }: { uri: string }) {
  const id = useId();
  const path = usePathname();
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;
    window.addEventListener(
      "message",
      (event) => {
        if (event.origin !== EMBED_URL) {
          return;
        }

        const iframeId = (event.data as { id: string }).id;
        if (id !== iframeId) {
          return;
        }

        const internalHeight = (event.data as { height: number }).height;
        if (internalHeight && typeof internalHeight === "number") {
          setHeight(internalHeight);
        }
      },
      { signal },
    );

    return () => {
      abortController.abort();
    };
  }, [id]);

  return (
    <div
      className="mt-8 flex max-w-[600px] w-full bluesky-embed"
      data-uri={uri}
    >
      <iframe
        className="w-full block border-none flex-grow"
        style={{ height }}
        data-bluesky-uri={uri}
        src={`${EMBED_URL}/embed/${uri.slice("at://".length)}?id=${id}&ref_url=${encodeURIComponent(
          `https://mozzius.dev${path}`,
        )}`}
        width="100%"
        frameBorder="0"
        scrolling="no"
      />
    </div>
  );
}
