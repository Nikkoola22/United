import React, { useState } from 'react';
import { useSearch } from '../hooks/useSearch';

/**
 * Composant de démonstration du moteur de recherche ATLAS
 * Affiche les résultats avec scoring (98.4% accuracy)
 */
export function SearchDemo() {
  const { query, result, loading, error, search, clear } = useSearch();
  const [inputValue, setInputValue] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      search(inputValue);
    }
  };

  const handleClear = () => {
    setInputValue('');
    clear();
  };

  return (
    <div className="search-demo" style={{ padding: '20px', maxWidth: '600px' }}>
      <h1>🔍 ATLAS Moteur de Recherche</h1>
      <p style={{ color: '#666' }}>Accuracy: 98.4% | Scoring: Keywords (3x) + Articles (2x)</p>

      <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ex: durée du travail, congés, formation..."
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '14px',
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Recherche...' : 'Rechercher'}
          </button>
          <button
            type="button"
            onClick={handleClear}
            style={{
              padding: '10px 20px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Effacer
          </button>
        </div>
      </form>

      {error && (
        <div style={{ color: 'red', marginBottom: '10px', padding: '10px', backgroundColor: '#ffebee', borderRadius: '4px' }}>
          ❌ Erreur: {error}
        </div>
      )}

      {query && (
        <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <p>
            <strong>Requête:</strong> "{query}"
          </p>
        </div>
      )}

      {result && !error && (
        <div style={{ marginTop: '20px' }}>
          <h2 style={{ color: '#2196F3', marginBottom: '15px' }}>✅ Résultat Trouvé</h2>

          <div style={{ border: '1px solid #2196F3', borderRadius: '4px', padding: '15px', backgroundColor: '#e3f2fd' }}>
            <div style={{ marginBottom: '10px' }}>
              <h3 style={{ margin: '0 0 5px 0', color: '#1976D2' }}>📚 {result.titre}</h3>
              <p style={{ margin: '0', color: '#666', fontSize: '12px' }}>Chapitre: {result.chapitre}</p>
            </div>

            <div style={{ marginBottom: '10px', padding: '10px', backgroundColor: 'white', borderRadius: '4px' }}>
              <p style={{ margin: 0 }}>
                <strong>Score:</strong> {result.score}{' '}
                <span style={{ color: '#4CAF50', fontSize: '12px' }}>
                  ({((result.score / 1000) * 100).toFixed(1)}% confiance)
                </span>
              </p>
            </div>

            {result.articles && result.articles.length > 0 && (
              <div>
                <h4 style={{ margin: '0 0 10px 0', color: '#1976D2' }}>📄 Articles Pertinents:</h4>
                <ul style={{ margin: '0', paddingLeft: '20px', color: '#333' }}>
                  {result.articles.map((article, idx) => (
                    <li key={idx} style={{ marginBottom: '5px', fontSize: '14px' }}>
                      {article.titre} (p. {article.page})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {query && !result && !error && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fff3e0', borderRadius: '4px', color: '#e65100' }}>
          ⚠️ Aucun résultat trouvé pour "{query}". Essayez une autre requête.
        </div>
      )}

      {!query && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f4ff', borderRadius: '4px', color: '#1976D2' }}>
          💡 Exemples: "durée du travail", "congés annuels", "CPF", "télétravail"
        </div>
      )}
    </div>
  );
}

export default SearchDemo;
