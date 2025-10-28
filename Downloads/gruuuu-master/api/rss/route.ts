import { NextResponse } from "next/server";
import { parseStringPromise } from "xml2js";

export const dynamic = "force-dynamic";

export async function GET() {
  const feedUrl = "https://www.franceinfo.fr/politique.rss";

  try {
    // Cache-buster pour éviter les caches
    const urlAvecCacheBuster = `${feedUrl}?_=${new Date().getTime()}`;

    const response = await fetch(urlAvecCacheBuster, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Le serveur du flux a répondu avec le statut : ${response.status}`);
    }

    const xmlText = await response.text();

    // Convertir XML en JSON
    const jsonData = await parseStringPromise(xmlText, { trim: true, explicitArray: false });

    // Extraire uniquement les 10 dernières news
    let rssItems = jsonData?.rss?.channel?.item ?? [];
    rssItems = Array.isArray(rssItems) ? rssItems.slice(0, 10) : [rssItems];

    // Réponse JSON avec en-têtes CORS
    const headers = new Headers();
    headers.set("Content-Type", "application/json; charset=utf-8");
    headers.set("Cache-Control", "no-cache, no-store, max-age=0, must-revalidate");
    headers.set("Pragma", "no-cache");
    headers.set("Expires", "0");
    headers.set("Access-Control-Allow-Origin", "*");

    return new Response(JSON.stringify(rssItems), { status: 200, headers });
  } catch (error: any) {
    console.error("Erreur API RSS :", error);
    return NextResponse.json(
      { error: "Impossible de récupérer le flux RSS.", details: error.message },
      { status: 502 }
    );
  }
}
