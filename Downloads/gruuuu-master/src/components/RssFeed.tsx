import { useEffect, useState } from "react";

interface RssItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
}

export default function RssFeed() {
  const [items, setItems] = useState<RssItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/rss")
      .then((res) => {
        if (!res.ok) throw new Error(`Statut HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Impossible de charger le flux RSS :", err);
        setError("Impossible de charger le flux RSS.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Chargement du flux RSS...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Flux RSS France Info (Politique)</h2>
      <ul>
        {items.map((item, index) => (
          <li key={index} style={{ marginBottom: "1em" }}>
            <a href={item.link} target="_blank" rel="noopener noreferrer">
              {item.title}
            </a>
            <p>{new Date(item.pubDate).toLocaleString()}</p>
            <p>{item.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
