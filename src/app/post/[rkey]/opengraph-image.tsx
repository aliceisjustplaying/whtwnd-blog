import { ImageResponse } from "next/og";
import { getPost } from "#/lib/api";
import { HOSTNAME } from "#/lib/config";

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ rkey: string }>;
}) {
  const { rkey } = await params;

  const post = await getPost(rkey);

  return new ImageResponse(
    (
      <div tw="h-full w-full bg-white flex flex-col justify-center items-center px-20">
        <h1
          style={{
            fontFamily: "system",
            fontSize: 80,
            fontWeight: 700,
            fontStyle: "oblique",
            textAlign: "center",
          }}
        >
          {post.value.title?.toLocaleUpperCase()}
        </h1>
        <h1
          style={{
            fontSize: 32,
            fontStyle: "italic",
            fontFamily: "system",
          }}
        >
          {HOSTNAME}
        </h1>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Libre Baskerville",
          data: fontData,
        },
      ],
    },
  );
}
