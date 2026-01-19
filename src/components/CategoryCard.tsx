import { motion } from 'framer-motion';
import { ChevronDown, Star } from 'lucide-react';
import type { CategoryMeta } from '@/data/calculators';

interface CategoryCardProps {
  category: CategoryMeta;
  isExpanded: boolean;
  onToggle: () => void;
  onSelectCalculator: (calcId: string) => void;
  selectedCalcId: string | null;
  onToggleFavorite?: (calcId: string) => void;
  isFavorite?: (calcId: string) => boolean;
}

export function CategoryCard({ 
  category, 
  isExpanded, 
  onToggle, 
  onSelectCalculator,
  selectedCalcId,
  onToggleFavorite,
  isFavorite
}: CategoryCardProps) {
  const Icon = category.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl glass overflow-hidden"
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      <button
        onClick={onToggle}
        className="w-full p-5 flex items-center gap-4 text-left hover:bg-secondary/30 transition-colors"
      >
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground">{category.title}</h3>
          <p className="text-sm text-muted-foreground truncate">{category.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-1 rounded-full bg-secondary text-muted-foreground">
            {category.calculators.length}
          </span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          </motion.div>
        </div>
      </button>

      <motion.div
        initial={false}
        animate={{
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <div className="px-5 pb-5 grid gap-2">
          {category.calculators.map((calc, i) => (
            <motion.div
              key={calc.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-2"
            >
              <button
                onClick={() => onSelectCalculator(calc.id)}
                className={`flex-1 p-3 rounded-xl text-left transition-all ${
                  selectedCalcId === calc.id
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'bg-secondary/50 hover:bg-secondary text-foreground'
                }`}
              >
                <div className="font-medium">{calc.title}</div>
                <div className={`text-sm ${
                  selectedCalcId === calc.id ? 'text-primary-foreground/80' : 'text-muted-foreground'
                }`}>
                  {calc.description}
                </div>
              </button>
              {onToggleFavorite && isFavorite && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(calc.id);
                  }}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors shrink-0"
                  aria-label={isFavorite(calc.id) ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Star
                    className={`w-4 h-4 transition-colors ${
                      isFavorite(calc.id) ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'
                    }`}
                  />
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
