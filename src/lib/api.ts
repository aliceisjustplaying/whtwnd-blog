import { XRPCResponse } from "@atcute/client";
import {
  type ComAtprotoRepoListRecords,
  type ComWhtwndBlogEntry,
} from "@atcute/client/lexicons";

import { bsky } from "./bsky";
import { MY_DID } from "./config";

export async function getPosts() {
  let allPosts: ComAtprotoRepoListRecords.Record[] = [];
  let cursor;

  do {
    const page: XRPCResponse<ComAtprotoRepoListRecords.Output> = await bsky.get(
      "com.atproto.repo.listRecords",
      {
        params: {
          repo: MY_DID,
          collection: "com.whtwnd.blog.entry",
          cursor,
          limit: 100,
        },
      },
    );

    allPosts = [...allPosts, ...page.data.records];
    cursor = page.data.cursor;
  } while (cursor);

  return allPosts.filter(drafts) as (ComAtprotoRepoListRecords.Record & {
    value: ComWhtwndBlogEntry.Record;
  })[];
}

function drafts(record: ComAtprotoRepoListRecords.Record) {
  if (process.env.NODE_ENV === "development") return true;
  const post = record.value as ComWhtwndBlogEntry.Record;
  return post.visibility === "public";
}

export async function getPost(rkey: string) {
  const post = await bsky.get("com.atproto.repo.getRecord", {
    params: {
      repo: MY_DID,
      rkey: rkey,
      collection: "com.whtwnd.blog.entry",
    },
  });

  return post.data as ComAtprotoRepoListRecords.Record & {
    value: ComWhtwndBlogEntry.Record;
  };
}
