import { ImageResponse } from "next/og";
import { HOSTNAME } from "#/lib/config";

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
            textTransform: "uppercase",
            fontWeight: 700,
            fontStyle: "normal",
          }}
        >
          {HOSTNAME}
        </h1>
        <h1 style={{ fontSize: 32 }}>a webbed site</h1>
      </div>
    ),
    {
      ...size,
    },
  );
}
