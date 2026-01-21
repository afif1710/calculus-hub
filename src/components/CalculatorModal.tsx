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
import { BasicArithmeticCalculator } from './calculators/BasicArithmeticCalculator';
import { ScientificCalculator } from './calculators/ScientificCalculator';
import { CurrencyConverter } from './calculators/CurrencyConverter';
import { CalorieCounter } from './calculators/CalorieCounter';
import { WaterIntakeCalculator } from './calculators/WaterIntakeCalculator';
import { BodyFatCalculator } from './calculators/BodyFatCalculator';
import { UnixTimestampCalculator } from './calculators/UnixTimestampCalculator';
import { HashGenerator } from './calculators/HashGenerator';
import { ProbabilityCalculator } from './calculators/ProbabilityCalculator';
import { MeanMedianCalculator } from './calculators/MeanMedianCalculator';
import { StdDeviationCalculator } from './calculators/StdDeviationCalculator';
import { TimezoneConverter } from './calculators/TimezoneConverter';
import { LEDResistorCalculator } from './calculators/LEDResistorCalculator';
import { CookingConverter } from './calculators/CookingConverter';
import { ExposureCalculator } from './calculators/ExposureCalculator';
import { PrintSizeCalculator } from './calculators/PrintSizeCalculator';
// New niche calculators
import { EngagementRateCalculator } from './calculators/EngagementRateCalculator';
import { RentalYieldCalculator } from './calculators/RentalYieldCalculator';
import { CapRateCalculator } from './calculators/CapRateCalculator';
import { BreakEvenCalculator } from './calculators/BreakEvenCalculator';
import { ProfitMarginCalculator } from './calculators/ProfitMarginCalculator';
import { CO2FlightCalculator } from './calculators/CO2FlightCalculator';
import { FinalGradeCalculator } from './calculators/FinalGradeCalculator';
// Business & E-commerce calculators
import { CACCalculator } from './calculators/CACCalculator';
import { ROASCalculator } from './calculators/ROASCalculator';
import { AOVCalculator } from './calculators/AOVCalculator';
import { InventoryTurnoverCalculator } from './calculators/InventoryTurnoverCalculator';
import { ConversionRateCalculator } from './calculators/ConversionRateCalculator';

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
  basic_arithmetic: BasicArithmeticCalculator,
  scientific: ScientificCalculator,
  currency: CurrencyConverter,
  calories: CalorieCounter,
  water_intake: WaterIntakeCalculator,
  body_fat: BodyFatCalculator,
  unix_timestamp: UnixTimestampCalculator,
  hash_generator: HashGenerator,
  probability: ProbabilityCalculator,
  mean_median: MeanMedianCalculator,
  std_deviation: StdDeviationCalculator,
  timezone: TimezoneConverter,
  led_resistor: LEDResistorCalculator,
  cooking: CookingConverter,
  exposure: ExposureCalculator,
  print_size: PrintSizeCalculator,
  // New niche calculators
  engagement_rate: EngagementRateCalculator,
  rental_yield: RentalYieldCalculator,
  cap_rate: CapRateCalculator,
  break_even: BreakEvenCalculator,
  profit_margin: ProfitMarginCalculator,
  co2_flight: CO2FlightCalculator,
  final_grade: FinalGradeCalculator,
  // Business & E-commerce calculators
  cac: CACCalculator,
  roas: ROASCalculator,
  aov: AOVCalculator,
  inventory_turnover: InventoryTurnoverCalculator,
  conversion_rate: ConversionRateCalculator,
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
