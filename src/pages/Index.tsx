import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calculator, Star, Clock } from 'lucide-react';
import { categories, getAllCalculators } from '@/data/calculators';
import { SearchBar } from '@/components/SearchBar';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { CategoryCard } from '@/components/CategoryCard';
import { CalculatorModal } from '@/components/CalculatorModal';
import { useFavoritesRecent } from '@/hooks/useFavoritesRecent';

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [selectedCalc, setSelectedCalc] = useState<{ id: string; title: string; categoryId: string } | null>(null);
  const { favorites, recent, toggleFavorite, isFavorite, addToRecent } = useFavoritesRecent();

  const allCalculators = useMemo(() => getAllCalculators(), []);

  // Handle deep links on mount
  useEffect(() => {
    const calcParam = searchParams.get('calc');
    if (calcParam) {
      const calc = allCalculators.find(c => c.id === calcParam);
      if (calc) {
        setSelectedCalc({ id: calc.id, title: calc.title, categoryId: calc.categoryId });
        addToRecent(calc.id);
      }
    }
  }, []);

  const handleSelectCalculator = useCallback((categoryId: string, calcId: string) => {
    const category = categories.find(c => c.id === categoryId);
    const calc = category?.calculators.find(c => c.id === calcId);
    if (calc) {
      setSelectedCalc({ id: calcId, title: calc.title, categoryId });
      setExpandedCategory(categoryId);
      addToRecent(calcId);
      setSearchParams({ calc: calcId });
    }
  }, [addToRecent, setSearchParams]);

  const handleCloseModal = useCallback(() => {
    setSelectedCalc(null);
    setSearchParams({});
  }, [setSearchParams]);

  const favoriteCalcs = useMemo(() => 
    favorites.map(id => allCalculators.find(c => c.id === id)).filter(Boolean),
    [favorites, allCalculators]
  );

  const recentCalcs = useMemo(() => 
    recent.map(id => allCalculators.find(c => c.id === id)).filter(Boolean),
    [recent, allCalculators]
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border/50">
        <div className="container py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                <Calculator className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">CalcHub</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">40+ calculators at your fingertips</p>
              </div>
            </div>
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Every calculator you need,{' '}<span className="gradient-text">in one place</span>
          </h2>
          <p className="text-lg text-muted-foreground">Finance, math, health, developer tools & more.</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <SearchBar onSelectCalculator={handleSelectCalculator} initialQuery={searchParams.get('search') || ''} />
        </motion.div>
      </section>

      {/* Favorites */}
      {favoriteCalcs.length > 0 && (
        <section className="container pb-8">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <h3 className="font-semibold">Favorites</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {favoriteCalcs.map(calc => calc && (
              <button key={calc.id} onClick={() => handleSelectCalculator(calc.categoryId, calc.id)}
                className="px-4 py-2 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors text-sm flex items-center gap-2">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                {calc.title}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Recent */}
      {recentCalcs.length > 0 && (
        <section className="container pb-8">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <h3 className="font-semibold">Recent</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentCalcs.slice(0, 6).map(calc => calc && (
              <button key={calc.id} onClick={() => handleSelectCalculator(calc.categoryId, calc.id)}
                className="px-4 py-2 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors text-sm">
                {calc.title}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Categories Grid */}
      <section className="container pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category, i) => (
            <motion.div key={category.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
              <CategoryCard
                category={category}
                isExpanded={expandedCategory === category.id}
                onToggle={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                onSelectCalculator={(calcId) => handleSelectCalculator(category.id, calcId)}
                selectedCalcId={selectedCalc?.categoryId === category.id ? selectedCalc.id : null}
                onToggleFavorite={toggleFavorite}
                isFavorite={isFavorite}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="container text-center text-sm text-muted-foreground">
          <p>Press <kbd className="px-1.5 py-0.5 rounded bg-secondary text-xs">⌘K</kbd> to search • <kbd className="px-1.5 py-0.5 rounded bg-secondary text-xs">T</kbd> to change theme</p>
        </div>
      </footer>

      {/* Calculator Modal */}
      <CalculatorModal isOpen={!!selectedCalc} onClose={handleCloseModal} calculatorId={selectedCalc?.id ?? null} calculatorTitle={selectedCalc?.title ?? ''} />
    </div>
  );
};

export default Index;
