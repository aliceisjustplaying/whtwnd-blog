import { Footer } from "#/components/footer";
import { PostList } from "#/components/post-list";
import { Title } from "#/components/typography";
import { DESCRIPTION, TITLE } from "#/lib/config";

export const dynamic = "force-static";
export const revalidate = 3600; // 1 hour

export default function Home() {
  return (
    <div className="xs:px-8 grid min-h-dvh grid-rows-[20px_1fr_20px] justify-items-center px-4 py-2 pb-20 sm:p-8">
      <main className="row-start-2 flex w-full max-w-[400px] flex-col items-center gap-8 sm:items-start">
        <div>
          <Title level="h1" className="m-0 flex flex-row justify-end">
            {TITLE}
          </Title>
          <span className="flex flex-row justify-end text-xs font-bold">
            {DESCRIPTION}
          </span>
        </div>

        <div className="flex w-full flex-col gap-4">
          <PostList />
        </div>
      </main>
      <Footer />
    </div>
  );
}
