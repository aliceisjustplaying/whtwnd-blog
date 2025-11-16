import Link from "next/link";
import { getPosts } from "#/lib/api";
import { extractLeafletPlaintext } from "#/lib/leaflet/plaintext";
import { getLeafletPosts } from "#/lib/leaflet/api";
import { LEAFLET_PUBLICATION_DID } from "#/lib/config";

import { PostInfo } from "./post-info";
import { Title } from "./typography";

type ListEntry = {
  key: string;
  href: string;
  title: string;
  content: string;
  createdAt?: string;
};

export async function PostList() {
  const [whtwndPosts, leafletPosts] = await Promise.all([
    getPosts(),
    LEAFLET_PUBLICATION_DID ? getLeafletPosts().catch(() => []) : Promise.resolve([]),
  ]);

  const entries: ListEntry[] = [
    ...whtwndPosts.map((record) => {
      const post = record.value;
      const rkey = record.uri.split("/").pop();
      return {
        key: record.uri,
        href: `/post/${rkey}`,
        title: post.title ?? "Untitled",
        content: post.content,
        createdAt: post.createdAt,
      } satisfies ListEntry;
    }),
    ...leafletPosts.map((record) => {
      const rkey = record.uri.split("/").pop();
      return {
        key: record.uri,
        href: `/leaflet/${rkey}`,
        title: record.value.title ?? "Untitled",
        content: extractLeafletPlaintext(record.value),
        createdAt: record.value.publishedAt,
      } satisfies ListEntry;
    }),
  ];

  entries.sort((a, b) => {
    const aTime = a.createdAt ? Date.parse(a.createdAt) : 0;
    const bTime = b.createdAt ? Date.parse(b.createdAt) : 0;
    return bTime - aTime;
  });

  return entries.map((entry) => (
    <Link key={entry.key} href={entry.href} className="group w-full">
      <article className="relative flex w-full flex-row items-stretch border-b after:absolute after:inset-0 after:origin-bottom after:scale-y-0 after:bg-slate-800/10 after:transition-transform hover:after:scale-y-100 dark:after:bg-slate-100/10">
        <div className="diagonal-pattern w-1.5 flex-shrink-0 opacity-20 transition-opacity group-hover:opacity-100" />
        <div className="flex-1 px-4 pb-2 pt-2">
          <Title className="text-lg" level="h3">
            {entry.title}
          </Title>
          <PostInfo content={entry.content} createdAt={entry.createdAt} />
        </div>
      </article>
    </Link>
  ));
}
