import { ArrowLeftIcon } from "lucide-react";
import { type Metadata } from "next";
import Link from "next/link";

import { LeafletContent } from "#/components/leaflet/leaflet-content";
import { Footer } from "#/components/footer";
import { PostInfo } from "#/components/post-info";
import { Title } from "#/components/typography";
import { getLeafletPost, getLeafletPosts } from "#/lib/leaflet/api";
import { extractLeafletPlaintext } from "#/lib/leaflet/plaintext";
import type { LeafletDocumentRecord } from "#/lib/leaflet/types";
import { AUTHOR_NAME, HOSTNAME } from "#/lib/config";

export const dynamic = "force-static";
export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const posts = await getLeafletPosts();
    return posts
      .map((post) => ({ rkey: post.uri.split("/").pop() }))
      .filter((post): post is { rkey: string } => Boolean(post.rkey));
  } catch (error) {
    console.warn("Failed to prefetch Leaflet posts", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ rkey: string }>;
}): Promise<Metadata> {
  const { rkey } = await params;
  const post = await getLeafletPost(rkey);
  const record = post.value as LeafletDocumentRecord;
  const description = record.description || extractLeafletPlaintext(record).slice(0, 160);

  return {
    title: `${record.title} — ${HOSTNAME}`,
    description,
    alternates: {
      canonical: `https://${HOSTNAME}/leaflet/${rkey}`,
    },
    authors: [{ name: AUTHOR_NAME, url: `https://bsky.app/profile/${record.author}` }],
  };
}

export default async function LeafletPostPage({
  params,
}: {
  params: Promise<{ rkey: string }>;
}) {
  const { rkey } = await params;
  const post = await getLeafletPost(rkey);
  const record = post.value as LeafletDocumentRecord;
  const content = extractLeafletPlaintext(record);

  return (
    <div className="xs:px-8 grid min-h-dvh grid-rows-[10px_1fr_20px] justify-items-center gap-16 px-4 py-2 pb-20 sm:p-8">
      <link rel="alternate" href={post.uri} />
      <main className="row-start-2 flex w-full max-w-[600px] flex-col items-center gap-0 overflow-hidden sm:items-start">
        <article className="w-full space-y-4">
          <div className="w-full space-y-4">
            <Link
              href="/"
              className="font-medium hover:underline hover:underline-offset-4"
            >
              <ArrowLeftIcon className="mb-px mr-1 inline size-4 align-middle" />
              Back
            </Link>
            <Title>{record.title}</Title>
            <PostInfo content={content} createdAt={record.publishedAt} includeAuthor />
            <hr className="border-slate-800/10 dark:border-slate-100/10" />
          </div>
          <LeafletContent record={record} />
        </article>
      </main>
      <Footer />
    </div>
  );
}
