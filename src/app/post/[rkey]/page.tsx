import { ArrowLeftIcon } from "lucide-react";
import Markdown from "react-markdown";
import { type Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { type ComWhtwndBlogEntry } from "@atcute/client/lexicons";
import { Code as SyntaxHighlighter } from "bright";
import readingTime from "reading-time";
import rehypeSanitize from "rehype-sanitize";

import { Footer } from "#/components/footer";
import { PostInfo } from "#/components/post-info";
import { Code, Paragraph, Title } from "#/components/typography";
import { getPosts } from "#/lib/api";
import { bsky } from "#/lib/bsky";
import { HOSTNAME, MY_DID } from "#/lib/config";
export const dynamic = "force-static";
export const revalidate = 3600; // 1 hour

export async function generateMetadata({
  params,
}: {
  params: Promise<{ rkey: string }>;
}): Promise<Metadata> {
  const { rkey } = await params;

  const post = await bsky.get("com.atproto.repo.getRecord", {
    params: {
      repo: MY_DID,
      rkey: rkey,
      collection: "com.whtwnd.blog.entry",
    },
  });

  const entry = post.data.value as ComWhtwndBlogEntry.Record;

  return {
    title: entry.title + ` — ${HOSTNAME}`,
    authors: [{ name: "alice", url: `https://bsky.app/profile/${MY_DID}` }],
    description: `by alice · ${readingTime(entry.content).text}`,
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ rkey: string }>;
}) {
  const { rkey } = await params;

  const post = await bsky.get("com.atproto.repo.getRecord", {
    params: {
      repo: MY_DID,
      rkey: rkey,
      collection: "com.whtwnd.blog.entry",
    },
  });

  const entry = post.data.value as ComWhtwndBlogEntry.Record;

  return (
    <div className="grid grid-rows-[10px_1fr_20px] justify-items-center min-h-dvh py-2 px-4 xs:px-8 pb-20 sm:p-8">
      <main className="flex flex-col gap-0 row-start-2 items-center sm:items-start w-full max-w-[600px] overflow-hidden">
        <article className="w-full space-y-4">
          <div className="space-y-4 w-full">
            <Link
              href="/"
              className="hover:underline hover:underline-offset-4 font-medium"
            >
              <ArrowLeftIcon className="inline size-4 align-middle mb-px mr-1" />
              Back
            </Link>
            <Title>{entry.title}</Title>
            <PostInfo
              content={entry.content}
              createdAt={entry.createdAt}
              includeAuthor
            />
            <hr className="border-slate-800/10 dark:border-slate-100/10" />
          </div>
          <Markdown
            rehypePlugins={[rehypeSanitize]}
            components={{
              h1: (props) => <Title level="h1" {...props} />,
              h2: (props) => <Title level="h2" {...props} />,
              h3: (props) => <Title level="h3" {...props} />,
              h4: (props) => <Title level="h4" {...props} />,
              h5: (props) => <Title level="h5" {...props} />,
              h6: (props) => <Title level="h6" {...props} />,
              p: (props) => (
                <Paragraph
                  className="leading-7 [&:not(:first-child)]:mt-2"
                  {...props}
                />
              ),
              blockquote: (props) => (
                <blockquote
                  className="mt-6 border-l-2 pl-4 italic border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-400"
                  {...props}
                />
              ),
              ul: (props) => (
                <ul
                  className="my-6 ml-6 list-disc [&>ul]:my-2 [&>ol]:my-2 [&>li]:mt-2"
                  {...props}
                />
              ),
              ol: (props) => (
                <ol
                  className="my-6 ml-6 list-decimal [&>ul]:my-2 [&>ol]:my-2 [&>li]:mt-2"
                  {...props}
                />
              ),
              li: (props) => <li className="leading-7" {...props} />,
              code: (props) => {
                const { children, className, ...rest } = props;
                const match = /language-(\w+)/.exec(className || "");
                if (match) {
                  return (
                    <SyntaxHighlighter
                      {...rest}
                      // eslint-disable-next-line react/no-children-prop
                      children={String(children).replace(/\n$/, "")}
                      lang={match[1]}
                      className="!mt-8 text-sm !max-w-full overflow-hidden"
                    />
                  );
                } else {
                  return <Code {...props} />;
                }
              },
              a: ({ href, ...props }) => (
                <a
                  href={href}
                  className="font-medium underline underline-offset-4"
                  {...props}
                />
              ),
              img: ({ src, alt }) => (
                <span className="block mt-8 w-full aspect-video relative">
                  <Image
                    src={src!}
                    alt={alt!}
                    className="object-contain"
                    quality={90}
                    fill
                  />
                </span>
              ),
            }}
          >
            {entry.content}
          </Markdown>
        </article>
      </main>
      <Footer />
    </div>
  );
}

// prefetch at build time
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({
    rkey: post.uri.split("/").pop(),
  }));
}
