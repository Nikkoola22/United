// api/proxy.js
export default async function handler(req, res) {
  const { feedUrl } = req.query;

  if (!feedUrl) {
    return res.status(400).json({ error: "Paramètre feedUrl manquant" });
  }

  try {
    const response = await fetch(feedUrl);
    if (!response.ok) throw new Error(`Erreur fetch: ${response.status}`);

    const xml = await response.text();

    res.setHeader("Content-Type", "application/xml");
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    return res.status(200).send(xml);
  } catch (error) {
    return res.status(500).json({ error: "Impossible de récupérer le flux RSS", details: error.message });
  }
}
