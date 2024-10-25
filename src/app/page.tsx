import { Footer } from "#/components/footer";
import { PostList } from "#/components/post-list";
import { Title } from "#/components/typography";
import { DESCRIPTION, TITLE } from "#/lib/config";

export const dynamic = "force-static";
export const revalidate = 3600; // 1 hour

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] justify-items-center min-h-dvh py-2 px-4 xs:px-8 pb-20 sm:p-8">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full max-w-[400px]">
        <div>
          <Title level="h1" className="m-0 flex flex-row justify-end">
            {TITLE}
          </Title>
          <span className="font-bold text-xs flex flex-row justify-end">{DESCRIPTION}</span>
        </div>

        <div className="flex flex-col gap-4 w-full">
          <PostList />
        </div>
      </main>
      <Footer />
    </div>
  );
}
