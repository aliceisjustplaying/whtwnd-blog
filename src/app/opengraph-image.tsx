import { ImageResponse } from "next/og";
import { DESCRIPTION, HOSTNAME } from "#/lib/config";

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div tw="h-full w-full bg-white flex flex-col justify-center items-center">
        <h1
          style={{
            fontFamily: "system",
            fontSize: 80,
            fontWeight: 700,
            fontStyle: "oblique",
          }}
        >
          {HOSTNAME}
        </h1>
        <h1
          style={{
            fontSize: 32,
            fontStyle: "italic",
            fontFamily: "system",
          }}
        >
          {DESCRIPTION}
        </h1>
      </div>
    ),
    {
      ...size,
    },
  );
}
