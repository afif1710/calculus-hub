import { useState, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';
import { getAllCalculators } from '@/data/calculators';

export function useSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const allCalculators = useMemo(() => getAllCalculators(), []);
  
  const fuse = useMemo(() => new Fuse(allCalculators, {
    keys: ['title', 'description', 'keywords', 'categoryTitle'],
    threshold: 0.4,
    includeScore: true,
  }), [allCalculators]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return fuse.search(query).slice(0, 8).map(r => r.item);
  }, [query, fuse]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    query,
    setQuery,
    results,
    isOpen,
    setIsOpen,
    close: () => {
      setIsOpen(false);
      setQuery('');
    }
  };
}
