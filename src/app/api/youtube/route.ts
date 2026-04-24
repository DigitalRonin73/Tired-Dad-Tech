import { getLatestYouTubeVideo } from "@/lib/youtube";
import { NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  const video = await getLatestYouTubeVideo();

  if (!video) {
    return NextResponse.json({ error: "No video found" }, { status: 404 });
  }

  return NextResponse.json(video);
}
