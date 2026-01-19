import { Modal } from './ui/modal';
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
import { SimpleInterestCalculator } from './calculators/SimpleInterestCalculator';
import { DiscountCalculator } from './calculators/DiscountCalculator';
import { Base64Calculator } from './calculators/Base64Calculator';
import { AspectRatioCalculator } from './calculators/AspectRatioCalculator';
import { OhmsLawCalculator } from './calculators/OhmsLawCalculator';
import { FuelCostCalculator } from './calculators/FuelCostCalculator';
import { LoanEMICalculator } from './calculators/LoanEMICalculator';
import { ROICalculator } from './calculators/ROICalculator';
import { DurationCalculator } from './calculators/DurationCalculator';
import { PowerCalculator } from './calculators/PowerCalculator';

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
  simple_interest: SimpleInterestCalculator,
  discount: DiscountCalculator,
  base_converter: Base64Calculator,
  aspect_ratio: AspectRatioCalculator,
  ohms_law: OhmsLawCalculator,
  fuel: FuelCostCalculator,
  loan_emi: LoanEMICalculator,
  roi: ROICalculator,
  duration: DurationCalculator,
  power: PowerCalculator,
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
    <Modal isOpen={isOpen} onClose={onClose} title={calculatorTitle}>
      {CalculatorComponent ? (
        <CalculatorComponent />
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <div className="text-4xl mb-4">🚧</div>
          <p className="font-medium">Calculator Coming Soon</p>
          <p className="text-sm">This calculator is currently under development.</p>
        </div>
      )}
    </Modal>
  );
}
