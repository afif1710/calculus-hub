import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Calculator } from 'lucide-react';
import { categories } from '@/data/calculators';
import { SearchBar } from '@/components/SearchBar';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { CategoryCard } from '@/components/CategoryCard';
import { CalculatorModal } from '@/components/CalculatorModal';

const Index = () => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [selectedCalc, setSelectedCalc] = useState<{ id: string; title: string; categoryId: string } | null>(null);

  const handleSelectCalculator = useCallback((categoryId: string, calcId: string) => {
    const category = categories.find(c => c.id === categoryId);
    const calc = category?.calculators.find(c => c.id === calcId);
    if (calc) {
      setSelectedCalc({ id: calcId, title: calc.title, categoryId });
      setExpandedCategory(categoryId);
    }
  }, []);

  const handleCategoryCalcSelect = useCallback((categoryId: string, calcId: string) => {
    const category = categories.find(c => c.id === categoryId);
    const calc = category?.calculators.find(c => c.id === calcId);
    if (calc) {
      setSelectedCalc({ id: calcId, title: calc.title, categoryId });
    }
  }, []);

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl mx-auto mb-8"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Every calculator you need,{' '}
            <span className="gradient-text">in one place</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Finance, math, health, developer tools & more. Fast, beautiful, and works offline.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <SearchBar onSelectCalculator={handleSelectCalculator} />
        </motion.div>
      </section>

      {/* Categories Grid */}
      <section className="container pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category, i) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              <CategoryCard
                category={category}
                isExpanded={expandedCategory === category.id}
                onToggle={() => setExpandedCategory(
                  expandedCategory === category.id ? null : category.id
                )}
                onSelectCalculator={(calcId) => handleCategoryCalcSelect(category.id, calcId)}
                selectedCalcId={selectedCalc?.categoryId === category.id ? selectedCalc.id : null}
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
      <CalculatorModal
        isOpen={!!selectedCalc}
        onClose={() => setSelectedCalc(null)}
        calculatorId={selectedCalc?.id ?? null}
        calculatorTitle={selectedCalc?.title ?? ''}
      />
    </div>
  );
};

export default Index;
