// Fichier : /api/rss/route.js
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Middleware CORS centralisé
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*', // ⚠️ mettre ton domaine en prod
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

// Gestion des pré-requêtes (OPTIONS)
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(),
  });
}

// Gestion des requêtes GET (flux RSS)
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const feedUrl = searchParams.get('feedUrl');

  if (!feedUrl) {
    return NextResponse.json(
      { error: 'Le paramètre feedUrl est manquant' },
      { status: 400, headers: corsHeaders() }
    );
  }

  try {
    const urlAvecCacheBuster = `${feedUrl}?_=${Date.now()}`;
    const response = await fetch(urlAvecCacheBuster, { cache: 'no-store' });

    if (!response.ok) {
      throw new Error(`Le serveur du flux a répondu avec le statut : ${response.status}`);
    }

    const xmlText = await response.text();

    const headers = {
      ...corsHeaders(),
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    };

    return new Response(xmlText, { status: 200, headers });
  } catch (error) {
    console.error(`Erreur API pour le flux ${feedUrl}:`, error);
    return NextResponse.json(
      { error: 'Impossible de récupérer le flux RSS.', details: error.message },
      { status: 502, headers: corsHeaders() }
    );
  }
}
