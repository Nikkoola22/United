// Fichier : /api/rss/route.js
import { NextResponse } from 'next/server';

// Cette route est entièrement dynamique et ne doit jamais être mise en cache statiquement
export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const feedUrl = searchParams.get('feedUrl');

  if (!feedUrl) {
    return NextResponse.json(
      { error: 'Le paramètre feedUrl est manquant' },
      { status: 400 }
    );
  }

  try {
    // Ajout d’un cache-buster pour éviter les caches Vercel ou navigateurs
    const urlAvecCacheBuster = `${feedUrl}?_=${new Date().getTime()}`;

    const response = await fetch(urlAvecCacheBuster, {
      cache: 'no-store',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Vercel Serverless)', // contournement CORS
        Accept: 'application/xml',
      },
    });

    if (!response.ok) {
      throw new Error(`Le serveur du flux a répondu avec le statut : ${response.status}`);
    }

    const xmlText = await response.text();

    // Définition des headers pour éviter tout cache
    const headers = new Headers();
    headers.set('Content-Type', 'application/xml');
    headers.set('Cache-Control', 'no-cache, no-store, max-age=0, must-revalidate');
    headers.set('Pragma', 'no-cache');
    headers.set('Expires', '0');

    return new Response(xmlText, { status: 200, headers });
  } catch (error) {
    console.error(`Erreur API pour le flux ${feedUrl}:`, error);
    return NextResponse.json(
      { error: 'Impossible de récupérer le flux RSS.', details: error.message },
      { status: 502 }
    );
  }
}
