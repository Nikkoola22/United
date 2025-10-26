// app/api/proxy/route.js
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const feedUrl = searchParams.get("feedUrl") || "https://www.franceinfo.fr/politique.rss";

  try {
    const response = await fetch(feedUrl, { cache: "no-store" });
    const xml = await response.text();

    return new Response(xml, {
      status: 200,
      headers: { "Content-Type": "application/xml" },
    });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

