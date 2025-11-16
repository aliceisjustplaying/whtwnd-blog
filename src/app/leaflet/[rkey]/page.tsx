import { ArrowLeftIcon } from "lucide-react";
import { type Metadata } from "next";
import Link from "next/link";

import { LeafletContent } from "#/components/leaflet/leaflet-content";
import { Footer } from "#/components/footer";
import { PostInfo } from "#/components/post-info";
import { Title } from "#/components/typography";
import { leafletBlobToImageSrc } from "#/lib/leaflet/images";
import { getLeafletPost, getLeafletPosts } from "#/lib/leaflet/api";
import { extractLeafletPlaintext } from "#/lib/leaflet/plaintext";
import type {
  LeafletBlock,
  LeafletDocumentRecord,
  LeafletImageBlock,
  LeafletListItem,
} from "#/lib/leaflet/types";
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
  const canonical = `https://${HOSTNAME}/leaflet/${rkey}`;
  const firstImage = findFirstLeafletImage(record);
  const imageUrl = firstImage ? leafletBlobToImageSrc(firstImage.image, record.author) : null;

  return {
    title: `${record.title} — ${HOSTNAME}`,
    description,
    alternates: {
      canonical,
    },
    authors: [{ name: AUTHOR_NAME, url: `https://bsky.app/profile/${record.author}` }],
    openGraph: {
      type: "article",
      url: canonical,
      title: record.title,
      description,
      publishedTime: record.publishedAt,
      authors: [AUTHOR_NAME],
      images: imageUrl ? [{ url: imageUrl, alt: firstImage?.alt ?? record.title }] : undefined,
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title: record.title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
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

function findFirstLeafletImage(record: LeafletDocumentRecord): LeafletImageBlock | null {
  for (const page of record.pages) {
    if (page.$type !== "pub.leaflet.pages.linearDocument") continue;
    for (const block of page.blocks) {
      const found = findImageInBlock(block.block);
      if (found) return found;
    }
  }
  return null;
}

function findImageInBlock(block: LeafletBlock): LeafletImageBlock | null {
  switch (block.$type) {
    case "pub.leaflet.blocks.image":
      return block;
    case "pub.leaflet.blocks.unorderedList":
    case "pub.leaflet.blocks.orderedList":
      for (const child of block.children) {
        const found = findImageInListItem(child);
        if (found) return found;
      }
      return null;
    default:
      return null;
  }
}

function findImageInListItem(item: LeafletListItem): LeafletImageBlock | null {
  const direct = findImageInBlock(item.content);
  if (direct) return direct;
  if (item.children) {
    for (const child of item.children) {
      const nested = findImageInListItem(child);
      if (nested) return nested;
    }
  }
  return null;
}
