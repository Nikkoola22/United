import React, { useState, useEffect } from "react";

interface RssConfig {
  url: string;
  enabled: boolean;
}

const AdminNews: React.FC = () => {
  const [rssConfig, setRssConfig] = useState<RssConfig>({ url: "", enabled: false });
  const [rssTestResult, setRssTestResult] = useState<string | null>(null);

  useEffect(() => {
    loadRssConfig();
  }, []);

  const loadRssConfig = () => {
    const saved = localStorage.getItem('rssConfig');
    if (saved) {
      setRssConfig(JSON.parse(saved));
    }
  };

  const saveRssConfig = (config: RssConfig) => {
    localStorage.setItem('rssConfig', JSON.stringify(config));
    setRssConfig(config);
  };

  const testRssFeed = async (url: string) => {
    try {
      setRssTestResult("Test en cours...");
      const proxyUrl = "https://api.allorigins.win/get?url=";
      const response = await fetch(proxyUrl + encodeURIComponent(url));
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      const xml = data.contents;
      const doc = new DOMParser().parseFromString(xml, "text/xml");
      const items = doc.querySelectorAll("item");
      
      if (items.length > 0) {
        setRssTestResult(`✅ Flux RSS valide ! ${items.length} articles trouvés.`);
      } else {
        setRssTestResult("⚠️ Flux RSS valide mais aucun article trouvé.");
      }
    } catch (err) {
      setRssTestResult(`❌ Erreur: ${err instanceof Error ? err.message : 'Flux RSS invalide'}`);
    }
  };

  // Fonction supprimée - plus besoin de se connecter au serveur

  // Fonctions de gestion des actualités supprimées - focus sur la configuration RSS

  // Suppression des conditions d'erreur - page toujours accessible

  return (
    <div style={{ padding: "2rem" }}>
      <h1>⚙️ Administration des actualités</h1>
      
      {/* Configuration RSS */}
      <div style={{ 
        marginBottom: "2rem", 
        padding: "1.5rem", 
        border: "1px solid #ddd", 
        borderRadius: "8px",
        backgroundColor: "#f9f9f9"
      }}>
        <h2>📡 Configuration du flux RSS</h2>
        <p style={{ color: "#666", marginBottom: "1rem" }}>
          Configurez un flux RSS personnalisé qui remplacera le flux par défaut dans l'application principale.
        </p>
        
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
            URL du flux RSS :
          </label>
          <input
            type="url"
            placeholder="https://example.com/rss.xml"
            value={rssConfig.url}
            onChange={(e) => setRssConfig({ ...rssConfig, url: e.target.value })}
            style={{ 
              width: "100%", 
              padding: "0.5rem", 
              marginBottom: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "4px"
            }}
          />
        </div>
        
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <input
              type="checkbox"
              checked={rssConfig.enabled}
              onChange={(e) => setRssConfig({ ...rssConfig, enabled: e.target.checked })}
            />
            Activer ce flux RSS
          </label>
        </div>
        
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
          <button
            type="button"
            onClick={() => testRssFeed(rssConfig.url)}
            disabled={!rssConfig.url}
            style={{ 
              padding: "0.5rem 1rem", 
              backgroundColor: "#007bff", 
              color: "white", 
              border: "none", 
              borderRadius: "4px",
              cursor: rssConfig.url ? "pointer" : "not-allowed",
              opacity: rssConfig.url ? 1 : 0.5
            }}
          >
            Tester le flux
          </button>
          
          <button
            type="button"
            onClick={() => saveRssConfig(rssConfig)}
            style={{ 
              padding: "0.5rem 1rem", 
              backgroundColor: "#28a745", 
              color: "white", 
              border: "none", 
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Sauvegarder
          </button>
        </div>
        
        {rssTestResult && (
          <div style={{ 
            padding: "0.5rem", 
            backgroundColor: rssTestResult.includes("✅") ? "#d4edda" : rssTestResult.includes("❌") ? "#f8d7da" : "#fff3cd",
            border: `1px solid ${rssTestResult.includes("✅") ? "#c3e6cb" : rssTestResult.includes("❌") ? "#f5c6cb" : "#ffeaa7"}`,
            borderRadius: "4px",
            color: rssTestResult.includes("✅") ? "#155724" : rssTestResult.includes("❌") ? "#721c24" : "#856404"
          }}>
            {rssTestResult}
          </div>
        )}
      </div>
      
      {/* Section d'information */}
      <div style={{ 
        marginBottom: "2rem", 
        padding: "1rem", 
        backgroundColor: "#e3f2fd", 
        border: "1px solid #2196f3", 
        borderRadius: "8px" 
      }}>
        <h3 style={{ margin: "0 0 0.5rem 0", color: "#1976d2" }}>ℹ️ Information</h3>
        <p style={{ margin: 0, color: "#1565c0" }}>
          Cette page vous permet de configurer un flux RSS personnalisé qui remplacera le flux par défaut 
          dans l'application principale. Le flux configuré sera utilisé dans le bandeau "Actualités nationales".
        </p>
      </div>
    </div>
  );
};

export default AdminNews;
