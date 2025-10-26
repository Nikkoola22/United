import { useState, useCallback } from 'react';
import { searchContext, searchContextAdvanced } from '../services/searchService';

interface SearchResult {
  chapitre: number;
  titre: string;
  score: number;
  articles: Array<{ titre: string; page: number }>;
}

interface UseSearchResult {
  query: string;
  result: SearchResult | null;
  results: SearchResult[];
  loading: boolean;
  error: string | null;
  search: (q: string) => void;
  searchAdvanced: (q: string, options?: any) => void;
  clear: () => void;
}

/**
 * Hook React pour la recherche ATLAS
 * Fournit une interface simple pour le moteur de recherche
 *
 * Usage:
 * const { query, result, search, clear } = useSearch();
 * search("durée du travail");
 */
export function useSearch(): UseSearchResult {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<SearchResult | null>(null);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback((q: string) => {
    try {
      setLoading(true);
      setError(null);
      setQuery(q);

      if (!q || q.trim().length === 0) {
        setResult(null);
        setResults([]);
        return;
      }

      const searchResult = searchContext(q);
      setResult(searchResult);
      setResults(searchResult ? [searchResult] : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de recherche');
      setResult(null);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchAdvanced = useCallback((q: string, options?: any) => {
    try {
      setLoading(true);
      setError(null);
      setQuery(q);

      if (!q || q.trim().length === 0) {
        setResults([]);
        setResult(null);
        return;
      }

      const searchResults = searchContextAdvanced(q, options);
      setResults(searchResults);
      setResult(searchResults[0] || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de recherche');
      setResults([]);
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setQuery('');
    setResult(null);
    setResults([]);
    setError(null);
  }, []);

  return {
    query,
    result,
    results,
    loading,
    error,
    search,
    searchAdvanced,
    clear,
  };
}

export default useSearch;
