"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function purgeLeafletCache(formData: FormData) {
  const rkey = formData.get("rkey");
  const password = formData.get("password");

  if (typeof rkey !== "string" || rkey.length === 0) {
    throw new Error("Missing rkey");
  }

  if (password === process.env.PURGE_PASSWORD) {
    revalidatePath(`/leaflet/${rkey}`, "page");
    revalidatePath("/", "page");
    redirect(`/leaflet/${rkey}`);
  } else {
    console.error(`Invalid purge password attempt for Leaflet post ${rkey}`);
    redirect(`/leaflet/${rkey}/purge?error=yeah`);
  }
}
