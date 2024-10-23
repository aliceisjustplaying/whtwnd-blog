"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function purgeCache(formData: FormData) {
  const password = formData.get("password");
  if (password !== process.env.PURGE_PASSWORD) {
    revalidatePath("/", "page");
    revalidatePath("/post/[rkey]", "page");
  } else {
    throw new Error("Invalid password, got: " + password);
  }
  redirect('/')
}
