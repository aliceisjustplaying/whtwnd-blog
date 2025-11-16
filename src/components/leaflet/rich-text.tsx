import { UnicodeString } from "@atproto/api";

import type {
  LeafletFacet,
  LeafletFacetFeature,
} from "#/lib/leaflet/types";

type Segment = {
  text: string;
  features?: LeafletFacetFeature[];
};

export function LeafletRichText({
  plaintext,
  facets,
}: {
  plaintext: string;
  facets?: LeafletFacet[];
}) {
  const segments = buildSegments(plaintext, facets);

  return (
    <>
      {segments.map((segment, index) => {
        const featureTypes = new Set(segment.features?.map((f) => f.$type));
        const id = segment.features?.find((f) => f.$type.endsWith("#id"));
        const link = segment.features?.find((f) => f.$type.endsWith("#link")) as
          | ({ $type: string; uri?: string } & LeafletFacetFeature)
          | undefined;
        const className = [
          featureTypes.has("pub.leaflet.richtext.facet#bold") && "font-semibold",
          featureTypes.has("pub.leaflet.richtext.facet#italic") && "italic",
          featureTypes.has("pub.leaflet.richtext.facet#underline") && "underline",
          featureTypes.has("pub.leaflet.richtext.facet#strikethrough") &&
            "line-through text-slate-500",
          featureTypes.has("pub.leaflet.richtext.facet#highlight") &&
            "bg-yellow-200 text-slate-900 px-1 rounded",
        ]
          .filter(Boolean)
          .join(" ");

        if (featureTypes.has("pub.leaflet.richtext.facet#code")) {
          return (
            <code key={index} className={`rounded bg-slate-800/10 px-1 py-0.5 font-mono text-sm ${className}`} id={(id as { id?: string })?.id}>
              {segment.text}
            </code>
          );
        }

        if (link?.uri) {
          return (
            <a
              key={index}
              href={link.uri}
              target="_blank"
              rel="noreferrer noopener"
              className={`text-blue-600 underline-offset-2 hover:underline ${className}`}
              id={(id as { id?: string })?.id}
            >
              {segment.text}
            </a>
          );
        }

        return (
          <span key={index} className={className} id={(id as { id?: string })?.id}>
            {segment.text}
          </span>
        );
      })}
    </>
  );
}

function buildSegments(plaintext: string, facets?: LeafletFacet[]) {
  const unicode = new UnicodeString(plaintext ?? "");
  if (!facets?.length) {
    return [{ text: unicode.utf16 }] as Segment[];
  }

  const normalized = [...facets]
    .filter((facet) => facet.index.byteStart <= facet.index.byteEnd)
    .sort((a, b) => a.index.byteStart - b.index.byteStart);
  const segments: Segment[] = [];

  let cursor = 0;
  for (const facet of normalized) {
    if (cursor < facet.index.byteStart) {
      segments.push({
        text: unicode.slice(cursor, facet.index.byteStart),
      });
    }
    if (facet.index.byteStart < facet.index.byteEnd) {
      segments.push({
        text: unicode.slice(facet.index.byteStart, facet.index.byteEnd),
        features: facet.features,
      });
    }
    cursor = facet.index.byteEnd;
  }

  if (cursor < unicode.length) {
    segments.push({ text: unicode.slice(cursor, unicode.length) });
  }

  return segments;
}
