import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, X } from 'lucide-react';
import { useSearch } from '@/hooks/useSearch';

interface SearchBarProps {
  onSelectCalculator: (categoryId: string, calcId: string) => void;
  initialQuery?: string;
}

export function SearchBar({ onSelectCalculator, initialQuery = '' }: SearchBarProps) {
  const { query, setQuery, results, isOpen, setIsOpen, close } = useSearch();
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle initial query from URL
  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      setIsOpen(true);
    }
  }, [initialQuery, setQuery, setIsOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (categoryId: string, calcId: string) => {
    onSelectCalculator(categoryId, calcId);
    close();
  };

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-3 w-full max-w-xl mx-auto px-4 py-3 rounded-xl glass border border-border/50 text-muted-foreground hover:border-primary/30 hover:text-foreground transition-all group"
      >
        <Search className="w-5 h-5" />
        <span className="flex-1 text-left">Search calculators...</span>
        <kbd className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded bg-secondary text-xs font-medium">
          <Command className="w-3 h-3" />K
        </kbd>
      </button>

      {/* Search Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
              onClick={close}
            />
            {/* Wrapper with flex centering - no translate hacks */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={close}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="w-full max-w-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="glass-strong rounded-2xl shadow-2xl overflow-hidden">
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                    <Search className="w-5 h-5 text-muted-foreground" />
                    <input
                      ref={inputRef}
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search calculators, e.g. EMI, BMI, subnet..."
                      className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
                    />
                    <button onClick={close} className="p-1 rounded hover:bg-secondary">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {results.length > 0 ? (
                      <ul className="p-2">
                        {results.map((calc, i) => (
                          <motion.li
                            key={calc.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.03 }}
                          >
                            <button
                              onClick={() => handleSelect(calc.categoryId, calc.id)}
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary text-left transition-colors"
                            >
                              <div className="flex-1">
                                <div className="font-medium text-foreground">{calc.title}</div>
                                <div className="text-sm text-muted-foreground">{calc.categoryTitle}</div>
                              </div>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                calc.complexity === 'advanced' 
                                  ? 'bg-primary/20 text-primary' 
                                  : 'bg-secondary text-muted-foreground'
                              }`}>
                                {calc.complexity}
                              </span>
                            </button>
                          </motion.li>
                        ))}
                      </ul>
                    ) : query ? (
                      <div className="p-8 text-center text-muted-foreground">
                        No calculators found for "{query}"
                      </div>
                    ) : (
                      <div className="p-8 text-center text-muted-foreground">
                        Start typing to search...
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
