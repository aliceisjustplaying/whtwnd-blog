import { type XRPCResponse } from "@atcute/client";
import {
  type ComAtprotoRepoListRecords,
  type ComAtprotoRepoGetRecord,
} from "@atcute/client/lexicons";

import { LEAFLET_PUBLICATION_DID } from "#/lib/config";
import { leafletBsky } from "#/lib/leaflet/client";
import type { LeafletDocumentRecord } from "#/lib/leaflet/types";

const COLLECTION_ID = "pub.leaflet.document";

type LeafletRecord = ComAtprotoRepoListRecords.Record & {
  value: LeafletDocumentRecord;
};

export async function getLeafletPosts() {
  ensureLeafletConfig();
  let cursor: string | undefined;
  let results: LeafletRecord[] = [];

  do {
    const page: XRPCResponse<ComAtprotoRepoListRecords.Output> =
      await leafletBsky.get("com.atproto.repo.listRecords", {
        params: {
          collection: COLLECTION_ID,
          cursor,
          repo: LEAFLET_PUBLICATION_DID!,
          limit: 100,
        },
      });

    const pageRecords = (page.data.records || [])
      .filter((record): record is LeafletRecord =>
        Boolean(
          record.value &&
            typeof record.value === "object" &&
            (record.value as Record<string, unknown>).$type === COLLECTION_ID,
        ),
      )
      .map((record) => record as LeafletRecord);

    results = results.concat(pageRecords);
    cursor = page.data.cursor;
  } while (cursor);

  return results;
}

export async function getLeafletPost(rkey: string) {
  ensureLeafletConfig();
  const post: XRPCResponse<ComAtprotoRepoGetRecord.Output> =
    await leafletBsky.get("com.atproto.repo.getRecord", {
      params: {
        collection: COLLECTION_ID,
        repo: LEAFLET_PUBLICATION_DID!,
        rkey,
      },
    });

  return post.data as LeafletRecord;
}

function ensureLeafletConfig() {
  if (!LEAFLET_PUBLICATION_DID) {
    throw new Error("LEAFLET_PUBLICATION_DID is not configured");
  }
}
