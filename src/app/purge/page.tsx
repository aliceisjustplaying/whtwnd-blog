import { purgeCache } from "./actions";

export default async function Purge({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <form
      action={purgeCache}
      method="post"
      className="mx-auto mt-24 flex max-w-96 flex-col gap-4 p-2"
    >
      <input
        type="password"
        name="password"
        placeholder="Password"
        className="rounded-xs border p-2"
      />
      {error && <p className="text-red-500">wrong password mate</p>}
      <button type="submit" className="rounded-xs border p-2">
        Purge
      </button>
    </form>
  );
}
