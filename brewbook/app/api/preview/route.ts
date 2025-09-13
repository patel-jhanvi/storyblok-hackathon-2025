import { draftMode } from "next/headers";

export async function GET() {
  const draft = await draftMode();  // ✅ await the promise
  draft.enable();

  return new Response("Draft mode is enabled", { status: 200 });
}
