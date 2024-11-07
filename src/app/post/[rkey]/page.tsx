import { Code as SyntaxHighlighter } from "bright";
import { ArrowLeftIcon } from "lucide-react";
import { type Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Markdown from "react-markdown";
import readingTime from "reading-time";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { BlueskyPostEmbed } from "#/components/bluesky-embed";
import { Footer } from "#/components/footer";
import { PostInfo } from "#/components/post-info";
import { Code, Paragraph, Title } from "#/components/typography";
import { getPost, getPosts } from "#/lib/api";
import { MY_DID, HOSTNAME, DESCRIPTION, AUTHOR_NAME } from "#/lib/config";

export const dynamic = "force-static";
export const revalidate = 3600; // 1 hour

export async function generateMetadata({
  params,
}: {
  params: Promise<{ rkey: string }>;
}): Promise<Metadata> {
  const { rkey } = await params;

  const post = await getPost(rkey);

  return {
    title: post.value.title + ` — ${HOSTNAME}`,
    authors: [{ name: AUTHOR_NAME, url: `https://bsky.app/profile/${MY_DID}` }],
    description: `by ${AUTHOR_NAME} · ${readingTime(post.value.content).text}`,
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ rkey: string }>;
}) {
  const { rkey } = await params;

  const post = await getPost(rkey);

  return (
    <div className="xs:px-8 grid min-h-dvh grid-rows-[10px_1fr_20px] justify-items-center px-4 py-2 pb-20 sm:p-8 gap-16">
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
            <Title>{post.value.title}</Title>
            <PostInfo
              content={post.value.content}
              createdAt={post.value.createdAt}
              includeAuthor
            />
            <hr className="border-slate-800/10 dark:border-slate-100/10" />
          </div>
          <Markdown
            remarkPlugins={[remarkGfm]}
            remarkRehypeOptions={{ allowDangerousHtml: true }}
            rehypePlugins={[
              rehypeRaw,
              [
                rehypeSanitize,
                {
                  ...defaultSchema,
                  attributes: {
                    ...defaultSchema.attributes,
                    blockquote: [
                      ...(defaultSchema.attributes?.blockquote ?? []),
                      "dataBlueskyUri",
                      "dataBlueskyCid",
                    ],
                  },
                } satisfies typeof defaultSchema,
              ],
            ]}
            className="[&>.bluesky-embed]:mb-0 [&>.bluesky-embed]:mt-8"
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
              blockquote: (props) =>
                "data-bluesky-uri" in props ?
                  <BlueskyPostEmbed uri={props["data-bluesky-uri"] as string} />
                : <blockquote
                    className="mt-6 border-l-2 border-slate-200 pl-4 italic text-slate-600 dark:border-slate-800 dark:text-slate-400"
                    {...props}
                  />,
              ul: (props) => (
                <ul
                  className="my-6 ml-6 list-disc [&>li]:mt-2 [&>ol]:my-2 [&>ul]:my-2"
                  {...props}
                />
              ),
              ol: (props) => (
                <ol
                  className="my-6 ml-6 list-decimal [&>li]:mt-2 [&>ol]:my-2 [&>ul]:my-2"
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
                      className="!mt-8 !max-w-full overflow-hidden text-sm"
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
                <span className="relative mt-8 block aspect-video w-full">
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
            {post.value.content}
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
