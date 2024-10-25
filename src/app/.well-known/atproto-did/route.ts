import { MY_DID } from "#/lib/config";

export async function GET(request: Request) {
  return new Response(MY_DID, {
    status: 200,
    headers: { "content-type": "text/plain" },
  });
}
