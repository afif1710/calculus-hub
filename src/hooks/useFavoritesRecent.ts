import { useState, useEffect, useCallback } from 'react';

const FAVORITES_KEY = 'calchub_favorites';
const RECENT_KEY = 'calchub_recent';
const MAX_RECENT = 8;

export function useFavoritesRecent() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem(FAVORITES_KEY);
      const storedRecent = localStorage.getItem(RECENT_KEY);
      if (storedFavorites) setFavorites(JSON.parse(storedFavorites));
      if (storedRecent) setRecent(JSON.parse(storedRecent));
    } catch (e) {
      console.error('Error loading favorites/recent:', e);
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error('Error saving favorites:', e);
    }
  }, [favorites]);

  // Save recent to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(recent));
    } catch (e) {
      console.error('Error saving recent:', e);
    }
  }, [recent]);

  const toggleFavorite = useCallback((calcId: string) => {
    setFavorites((prev) => {
      if (prev.includes(calcId)) {
        return prev.filter((id) => id !== calcId);
      }
      return [...prev, calcId];
    });
  }, []);

  const isFavorite = useCallback(
    (calcId: string) => favorites.includes(calcId),
    [favorites]
  );

  const addToRecent = useCallback((calcId: string) => {
    setRecent((prev) => {
      const filtered = prev.filter((id) => id !== calcId);
      return [calcId, ...filtered].slice(0, MAX_RECENT);
    });
  }, []);

  return {
    favorites,
    recent,
    toggleFavorite,
    isFavorite,
    addToRecent,
  };
}
