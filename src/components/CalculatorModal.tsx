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
import { OhmsLawCalculator } from './calculators/OhmsLawCalculator';
import { FuelCostCalculator } from './calculators/FuelCostCalculator';
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
import { EngagementRateCalculator } from './calculators/EngagementRateCalculator';
import { RentalYieldCalculator } from './calculators/RentalYieldCalculator';
import { CapRateCalculator } from './calculators/CapRateCalculator';
import { BreakEvenCalculator } from './calculators/BreakEvenCalculator';
import { ProfitMarginCalculator } from './calculators/ProfitMarginCalculator';
import { CO2FlightCalculator } from './calculators/CO2FlightCalculator';
import { FinalGradeCalculator } from './calculators/FinalGradeCalculator';
import { CACCalculator } from './calculators/CACCalculator';
import { ROASCalculator } from './calculators/ROASCalculator';
import { AOVCalculator } from './calculators/AOVCalculator';
import { InventoryTurnoverCalculator } from './calculators/InventoryTurnoverCalculator';
import { ConversionRateCalculator } from './calculators/ConversionRateCalculator';
// Existing calculators
import { QuadraticCalculator } from './calculators/QuadraticCalculator';
import { GPACalculator } from './calculators/GPACalculator';
import { PercentChangeCalculator } from './calculators/PercentChangeCalculator';
import { GCDLCMCalculator } from './calculators/GCDLCMCalculator';
import { CAGRCalculator } from './calculators/CAGRCalculator';
import { SIPCalculator } from './calculators/SIPCalculator';
import { InflationCalculator } from './calculators/InflationCalculator';
import { CreditCardPayoffCalculator } from './calculators/CreditCardPayoffCalculator';
import { CPMCalculator } from './calculators/CPMCalculator';
import { CPCCalculator } from './calculators/CPCCalculator';
import { CTRCalculator } from './calculators/CTRCalculator';
import { CPACalculator } from './calculators/CPACalculator';
import { BreakevenCPACalculator } from './calculators/BreakevenCPACalculator';
import { RentVsBuyCalculator } from './calculators/RentVsBuyCalculator';
import { MortgageAffordabilityCalculator } from './calculators/MortgageAffordabilityCalculator';
import { OneRepMaxCalculator } from './calculators/OneRepMaxCalculator';
import { CalorieDeficitCalculator } from './calculators/CalorieDeficitCalculator';
import { URLEncoderCalculator } from './calculators/URLEncoderCalculator';
import { JWTDecoderCalculator } from './calculators/JWTDecoderCalculator';
import { UUIDGenerator } from './calculators/UUIDGenerator';
import { PaintCalculator } from './calculators/PaintCalculator';
import { FlooringCalculator } from './calculators/FlooringCalculator';
import { ConcreteCalculator } from './calculators/ConcreteCalculator';
import { SalaryCalculator } from './calculators/SalaryCalculator';
import { TakeHomePayCalculator } from './calculators/TakeHomePayCalculator';
import { FuelEfficiencyCalculator } from './calculators/FuelEfficiencyCalculator';
// New calculators
import { LoanComparisonCalculator } from './calculators/LoanComparisonCalculator';
import { SalaryRaiseCalculator } from './calculators/SalaryRaiseCalculator';
import { MortgageRefinanceCalculator } from './calculators/MortgageRefinanceCalculator';
import { PricingCalculator } from './calculators/PricingCalculator';
import { ReorderPointCalculator } from './calculators/ReorderPointCalculator';
import { CronExpressionCalculator } from './calculators/CronExpressionCalculator';

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
  // All-in-one Unit Converter
  unit_converter: UnitConverter,
  simple_interest: SimpleInterestCalculator,
  discount: DiscountCalculator,
  base64: Base64Calculator,
  ohms_law: OhmsLawCalculator,
  fuel: FuelCostCalculator,
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
  engagement_rate: EngagementRateCalculator,
  rental_yield: RentalYieldCalculator,
  cap_rate: CapRateCalculator,
  break_even: BreakEvenCalculator,
  profit_margin: ProfitMarginCalculator,
  co2_flight: CO2FlightCalculator,
  final_grade: FinalGradeCalculator,
  cac: CACCalculator,
  roas: ROASCalculator,
  aov: AOVCalculator,
  inventory_turnover: InventoryTurnoverCalculator,
  conversion_rate: ConversionRateCalculator,
  // Existing calculators
  quadratic: QuadraticCalculator,
  gpa: GPACalculator,
  percent_change: PercentChangeCalculator,
  gcd_lcm: GCDLCMCalculator,
  cagr: CAGRCalculator,
  sip: SIPCalculator,
  inflation: InflationCalculator,
  credit_card: CreditCardPayoffCalculator,
  cpm: CPMCalculator,
  cpc: CPCCalculator,
  ctr: CTRCalculator,
  cpa: CPACalculator,
  breakeven_cpa: BreakevenCPACalculator,
  rent_vs_buy: RentVsBuyCalculator,
  mortgage_afford: MortgageAffordabilityCalculator,
  one_rep_max: OneRepMaxCalculator,
  calorie_deficit: CalorieDeficitCalculator,
  url_encoder: URLEncoderCalculator,
  jwt_decoder: JWTDecoderCalculator,
  uuid: UUIDGenerator,
  paint: PaintCalculator,
  flooring: FlooringCalculator,
  concrete: ConcreteCalculator,
  salary: SalaryCalculator,
  take_home: TakeHomePayCalculator,
  fuel_efficiency: FuelEfficiencyCalculator,
  // New calculators
  loan_comparison: LoanComparisonCalculator,
  salary_raise: SalaryRaiseCalculator,
  mortgage_refinance: MortgageRefinanceCalculator,
  pricing: PricingCalculator,
  reorder_point: ReorderPointCalculator,
  cron: CronExpressionCalculator,
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
