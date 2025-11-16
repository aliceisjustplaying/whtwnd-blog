import Image from "next/image";
import Link from "next/link";
import type { JSX } from "react";

import { LeafletRichText } from "#/components/leaflet/rich-text";
import type {
  LeafletBlock,
  LeafletBskyPostBlock,
  LeafletDocumentRecord,
  LeafletLinearBlock,
  LeafletLinearPage,
  LeafletListItem,
  LeafletOrderedListBlock,
  LeafletUnorderedListBlock,
} from "#/lib/leaflet/types";

const alignmentClasses: Record<string, string> = {
  "lex:pub.leaflet.pages.linearDocument#textAlignLeft": "items-start text-left",
  "lex:pub.leaflet.pages.linearDocument#textAlignCenter": "items-center text-center",
  "lex:pub.leaflet.pages.linearDocument#textAlignRight": "items-end text-right",
  "lex:pub.leaflet.pages.linearDocument#textAlignJustify": "items-stretch text-justify",
};

export function LeafletContent({
  record,
}: {
  record: LeafletDocumentRecord;
}) {
  const pages = record.pages.filter(
    (page): page is LeafletLinearPage =>
      page?.$type === "pub.leaflet.pages.linearDocument",
  );

  return (
    <div className="flex w-full flex-col gap-6">
      {pages.map((page, pageIndex) => (
        <div key={page.id ?? pageIndex} className="flex flex-col gap-4">
          {page.blocks.map((block, blockIndex) => (
            <LeafletBlockRenderer
              key={`${pageIndex}-${blockIndex}`}
              block={block}
              authorDid={record.author}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function LeafletBlockRenderer({
  block,
  authorDid,
}: {
  block: LeafletLinearBlock;
  authorDid: string;
}) {
  const alignment =
    block.alignment ? alignmentClasses[block.alignment] : undefined;
  return (
    <div className={`flex w-full flex-col gap-2 ${alignment ?? "text-left"}`}>
      {renderLeafletBlock(block.block, authorDid)}
    </div>
  );
}

function renderLeafletBlock(block: LeafletBlock, authorDid: string): React.ReactNode {
  switch (block.$type) {
    case "pub.leaflet.blocks.text":
      return (
        <p className="leading-7">
          <LeafletRichText plaintext={block.plaintext} facets={block.facets} />
        </p>
      );
    case "pub.leaflet.blocks.header": {
      const level = Math.min(Math.max(block.level ?? 1, 1), 6);
      const HeadingTag = (`h${level}` as unknown) as keyof JSX.IntrinsicElements;
      return (
        <HeadingTag className="font-semibold tracking-tight">
          <LeafletRichText plaintext={block.plaintext} facets={block.facets} />
        </HeadingTag>
      );
    }
    case "pub.leaflet.blocks.blockquote":
      return (
        <blockquote className="border-l-2 border-slate-200 pl-4 italic text-slate-600 dark:border-slate-800 dark:text-slate-300">
          <LeafletRichText plaintext={block.plaintext} facets={block.facets} />
        </blockquote>
      );
    case "pub.leaflet.blocks.horizontalRule":
      return <hr className="border-slate-800/10 dark:border-slate-100/10" />;
    case "pub.leaflet.blocks.image": {
      const src = blobRefToUrl(block.image, authorDid);
      if (!src) return null;
      const { width, height } = block.aspectRatio;
      const safeHeight = height || 1;
      return (
        <div className="relative w-full" style={{ aspectRatio: `${width} / ${safeHeight}` }}>
          <Image
            src={src}
            alt={block.alt || ""}
            fill
            className="rounded-md object-contain"
            sizes="(max-width: 768px) 100vw, 600px"
          />
        </div>
      );
    }
    case "pub.leaflet.blocks.code":
      return (
        <pre className="overflow-x-auto rounded-md bg-slate-900/5 p-4 text-sm font-mono">
          {block.plaintext}
        </pre>
      );
    case "pub.leaflet.blocks.math":
      return (
        <pre className="overflow-x-auto rounded-md bg-slate-900/5 p-4 font-mono">
          {block.tex}
        </pre>
      );
    case "pub.leaflet.blocks.website":
      return (
        <a
          href={block.src}
          target="_blank"
          rel="noreferrer noopener"
          className="rounded-md border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-slate-400 dark:border-slate-800 dark:bg-slate-950"
        >
          <p className="text-sm font-semibold">{block.title || block.src}</p>
          {block.description && (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {block.description}
            </p>
          )}
        </a>
      );
    case "pub.leaflet.blocks.iframe":
      return (
        <iframe
          className="w-full rounded-md border border-slate-200"
          src={block.url}
          height={block.height ?? 480}
          allow="fullscreen"
          loading="lazy"
        />
      );
    case "pub.leaflet.blocks.button":
      return (
        <a
          href={block.url}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900"
        >
          {block.text}
        </a>
      );
    case "pub.leaflet.blocks.unorderedList":
      return renderUnorderedList(block, authorDid);
    case "pub.leaflet.blocks.orderedList":
      return renderOrderedList(block, authorDid);
    case "pub.leaflet.blocks.page":
      return (
        <p className="text-sm text-slate-500">
          Linked page: <span className="font-mono">{block.id}</span>
        </p>
      );
    case "pub.leaflet.blocks.bskyPost":
      return <BskyPostPreview block={block} />;
    case "pub.leaflet.blocks.poll":
      return (
        <div className="rounded-md border border-slate-200 p-4 text-sm text-slate-500">
          Poll block (not yet supported here).
        </div>
      );
    default: {
      const _exhaustiveCheck: never = block;
      void _exhaustiveCheck;
      return (
        <div className="rounded-md border border-dashed border-slate-200 p-4 text-sm text-slate-500">
          Unsupported block type
        </div>
      );
    }
  }
}

function renderUnorderedList(block: LeafletUnorderedListBlock, authorDid: string) {
  return (
    <ul className="ml-6 list-disc space-y-2">
      {block.children.map((child, index) => (
        <LeafletListItemRenderer
          key={index}
          item={child}
          authorDid={authorDid}
          variant="unordered"
        />
      ))}
    </ul>
  );
}

function renderOrderedList(block: LeafletOrderedListBlock, authorDid: string) {
  return (
    <ol
      className="ml-6 list-decimal space-y-2"
      start={typeof block.startIndex === "number" ? block.startIndex : undefined}
    >
      {block.children.map((child, index) => (
        <LeafletListItemRenderer
          key={index}
          item={child}
          authorDid={authorDid}
          variant="ordered"
        />
      ))}
    </ol>
  );
}

function LeafletListItemRenderer({
  item,
  authorDid,
  variant,
}: {
  item: LeafletListItem;
  authorDid: string;
  variant: "ordered" | "unordered";
}) {
  return (
    <li className="leading-7">
      {renderLeafletBlock(item.content, authorDid)}
      {item.children?.length ? (
        <div className="mt-2">
          {variant === "ordered"
            ? renderOrderedList(
                {
                  $type: "pub.leaflet.blocks.orderedList",
                  children: item.children,
                } as LeafletOrderedListBlock,
                authorDid,
              )
            : renderUnorderedList(
                {
                  $type: "pub.leaflet.blocks.unorderedList",
                  children: item.children,
                } as LeafletUnorderedListBlock,
                authorDid,
              )}
        </div>
      ) : null}
    </li>
  );
}

function blobRefToUrl(blob: { ref?: { $link?: string } } | undefined, did: string) {
  const cid = blob?.ref?.$link;
  if (!cid) return null;
  return `https://cdn.bsky.app/img/feed_fullsize/plain/${encodeURIComponent(did)}/${cid}@jpeg`;
}

function BskyPostPreview({ block }: { block: LeafletBskyPostBlock }) {
  const uri = block.postRef.uri;
  const parsed = uri.split("/");
  const did = parsed[2];
  const rkey = parsed[parsed.length - 1];
  const href = `https://bsky.app/profile/${did}/post/${rkey}`;
  return (
    <Link
      href={href}
      target="_blank"
      className="rounded-md border border-slate-200 p-4 text-sm text-slate-600 hover:border-slate-400"
    >
      View Bluesky post
    </Link>
  );
}
