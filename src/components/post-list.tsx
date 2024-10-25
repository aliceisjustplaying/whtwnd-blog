import Link from "next/link";
import { getPosts } from "#/lib/api";

import { PostInfo } from "./post-info";
import { Title } from "./typography";

export async function PostList() {
  const posts = await getPosts();

  return posts.map((record) => {
    const post = record.value;
    const rkey = record.uri.split("/").pop();
    return (
      <Link key={record.uri} href={`/post/${rkey}`} className="group w-full">
        <article
          key={record.uri}
          className="relative flex w-full flex-row items-stretch border-b after:absolute after:inset-0 after:origin-bottom after:scale-y-0 after:bg-slate-800/10 after:transition-transform hover:after:scale-y-100 dark:after:bg-slate-100/10"
        >
          <div className="diagonal-pattern w-1.5 flex-shrink-0 opacity-20 transition-opacity group-hover:opacity-100" />
          <div className="flex-1 px-4 pb-2 pt-2">
            <Title className="text-lg" level="h3">
              {post.title}
            </Title>
            <PostInfo content={post.content} createdAt={post.createdAt} />
          </div>
        </article>
      </Link>
    );
  });
}
