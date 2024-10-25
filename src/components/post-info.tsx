import { ClockIcon } from "lucide-react";
import Image from "next/image";
import readingTime from "reading-time";
import me from "#/assets/me.png";
import { MY_DID } from "#/lib/config";
import { date } from "#/lib/date";

import { Paragraph } from "./typography";

export function PostInfo({
  createdAt,
  content,
  includeAuthor = false,
}: {
  createdAt?: string;
  content: string;
  includeAuthor?: boolean;
}) {
  return (
    <Paragraph>
      {includeAuthor && (
        <>
          <Image
            width={14}
            height={14}
            src={me}
            alt="alice's profile picture"
            className="mb-1 mr-1 inline rounded-full"
          />
          <a
            href={`https://bsky.app/profile/${MY_DID}`}
            className="hover:underline hover:underline-offset-4"
          >
            alice
          </a>{" "}
          &middot;{" "}
        </>
      )}
      {createdAt && (
        <>
          <time dateTime={createdAt}>{date(new Date(createdAt))}</time> &middot;{" "}
        </>
      )}
      <ClockIcon className="mb-0.5 inline size-3.5 text-inherit" />{" "}
      {readingTime(content).text}
    </Paragraph>
  );
}
