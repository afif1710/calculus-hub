import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import type { CategoryMeta } from '@/data/calculators';

interface CategoryCardProps {
  category: CategoryMeta;
  isExpanded: boolean;
  onToggle: () => void;
  onSelectCalculator: (calcId: string) => void;
  selectedCalcId: string | null;
}

export function CategoryCard({ 
  category, 
  isExpanded, 
  onToggle, 
  onSelectCalculator,
  selectedCalcId 
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
            <motion.button
              key={calc.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onSelectCalculator(calc.id)}
              className={`w-full p-3 rounded-xl text-left transition-all ${
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
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
