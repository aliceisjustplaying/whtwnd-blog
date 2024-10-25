import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { HOSTNAME } from "#/lib/config";

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const fontData = await readFile(
    join(process.cwd(), "./src/app/fonts/LibreBaskerville-Italic.ttf"),
  ).then((res) => Uint8Array.from(res).buffer);
  return new ImageResponse(
    (
      <div tw="h-full w-full bg-white flex flex-col justify-center items-center">
        <h1
          style={{
            fontFamily: '"Libre Baskerville"',
            fontSize: 80,
            textTransform: "uppercase",
            fontWeight: 700,
            fontStyle: "italic",
          }}
        >
          {HOSTNAME}
        </h1>
        <h1 style={{ fontSize: 32 }}>a webbed site</h1>
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
