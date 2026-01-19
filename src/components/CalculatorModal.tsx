import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { MortgageCalculator } from './calculators/MortgageCalculator';
import { FractionCalculator } from './calculators/FractionCalculator';
import { MatrixCalculator } from './calculators/MatrixCalculator';
import { BMICalculator } from './calculators/BMICalculator';
import { JsonCsvConverter } from './calculators/JsonCsvConverter';
import { SubnetCalculator } from './calculators/SubnetCalculator';
import { DOFCalculator } from './calculators/DOFCalculator';
import { SampleSizeCalculator } from './calculators/SampleSizeCalculator';
import { CompoundInterestCalculator } from './calculators/CompoundInterestCalculator';
import { PercentageCalculator } from './calculators/PercentageCalculator';
import { TipCalculator } from './calculators/TipCalculator';
import { AgeCalculator } from './calculators/AgeCalculator';
import { UnitConverter } from './calculators/UnitConverter';

const calculatorComponents: Record<string, React.FC> = {
  mortgage: MortgageCalculator,
  fraction: FractionCalculator,
  matrix: MatrixCalculator,
  bmi_tdee: BMICalculator,
  json_csv: JsonCsvConverter,
  subnet: SubnetCalculator,
  dof: DOFCalculator,
  sample_size: SampleSizeCalculator,
  compound_interest: CompoundInterestCalculator,
  percentage: PercentageCalculator,
  tip: TipCalculator,
  age: AgeCalculator,
  length: UnitConverter,
  weight: UnitConverter,
  temperature: UnitConverter,
  volume: UnitConverter,
};

interface CalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  calculatorId: string | null;
  calculatorTitle: string;
}

export function CalculatorModal({ isOpen, onClose, calculatorId, calculatorTitle }: CalculatorModalProps) {
  const CalculatorComponent = calculatorId ? calculatorComponents[calculatorId] : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed inset-4 sm:inset-auto sm:top-[5%] sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-2xl sm:max-h-[90vh] z-50 flex flex-col"
          >
            <div className="glass-strong rounded-2xl shadow-2xl flex flex-col max-h-full overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-xl font-semibold gradient-text">{calculatorTitle}</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {CalculatorComponent ? (
                  <CalculatorComponent />
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <div className="text-4xl mb-4">🚧</div>
                    <p className="font-medium">Calculator Coming Soon</p>
                    <p className="text-sm">This calculator is currently under development.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
