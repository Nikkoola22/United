import React, { useEffect, useState } from "react";

interface NewsItem {
  id: number;
  title: string;
  content: string;
}

const NewsList: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNews = async () => {
      try {
        // Vérification de la disponibilité du serveur
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // Timeout de 5 secondes
        
        const response = await fetch("http://localhost:4000/api/news", {
          signal: controller.signal,
          mode: 'cors'
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        setNews(data);
        setLoading(false);
      } catch (err) {
        // Erreur silencieuse - affichée dans l'interface utilisateur
        setError("Impossible de se connecter au serveur d'actualités. Veuillez vérifier que le serveur est démarré sur le port 4000.");
        setLoading(false);
      }
    };
    
    loadNews();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1>📰 Dernières actualités</h1>
        <p>Chargement des actualités...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "2rem" }}>
        <h1>📰 Dernières actualités</h1>
        <div style={{ 
          background: "#ffebee", 
          border: "1px solid #f44336", 
          borderRadius: "8px", 
          padding: "1rem", 
          color: "#c62828" 
        }}>
          <h3>⚠️ Erreur de connexion</h3>
          <p>{error}</p>
          <p style={{ marginTop: "0.5rem", fontSize: "0.9em" }}>
            Pour démarrer le serveur d'actualités, exécutez : <code>npm run server</code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>📰 Dernières actualités</h1>
      {news.length === 0 ? (
        <p>Aucune actualité pour le moment.</p>
      ) : (
        <ul>
          {news.map((item) => (
            <li
              key={item.id}
              style={{
                marginBottom: "1rem",
                padding: "1rem",
                border: "1px solid #ddd",
                borderRadius: "8px",
              }}
            >
              <h3>{item.title}</h3>
              <p>{item.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NewsList;
