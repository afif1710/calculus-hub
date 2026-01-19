import { 
  Calculator, DollarSign, Activity, Code, Camera, 
  BarChart3, Ruler, Clock, Zap, Percent
} from 'lucide-react';

export interface CalculatorMeta {
  id: string;
  title: string;
  description: string;
  keywords: string[];
  complexity: 'simple' | 'advanced';
}

export interface CategoryMeta {
  id: string;
  title: string;
  icon: typeof Calculator;
  description: string;
  color: string;
  calculators: CalculatorMeta[];
}

export const categories: CategoryMeta[] = [
  {
    id: 'math',
    title: 'Math & Academic',
    icon: Calculator,
    description: 'Algebra, matrices, fractions & more',
    color: 'from-blue-500 to-cyan-500',
    calculators: [
      { id: 'basic_arithmetic', title: 'Basic Arithmetic', description: 'Add, subtract, multiply, divide', keywords: ['add', 'subtract', 'multiply', 'divide', 'basic'], complexity: 'simple' },
      { id: 'fraction', title: 'Fraction Calculator', description: 'Operations on fractions with simplification', keywords: ['fraction', 'numerator', 'denominator', 'simplify'], complexity: 'simple' },
      { id: 'matrix', title: 'Matrix Multiplier', description: 'Multiply 2x2 and 3x3 matrices', keywords: ['matrix', 'linear algebra', 'multiply'], complexity: 'advanced' },
      { id: 'percentage', title: 'Percentage Calculator', description: 'Calculate percentages and changes', keywords: ['percent', 'percentage', 'increase', 'decrease'], complexity: 'simple' },
      { id: 'scientific', title: 'Scientific Calculator', description: 'Trigonometry, logarithms, powers', keywords: ['sin', 'cos', 'tan', 'log', 'power', 'sqrt'], complexity: 'advanced' },
    ]
  },
  {
    id: 'finance',
    title: 'Finance',
    icon: DollarSign,
    description: 'Loans, investments, taxes',
    color: 'from-green-500 to-emerald-500',
    calculators: [
      { id: 'compound_interest', title: 'Compound Interest', description: 'Calculate compound interest growth', keywords: ['compound', 'interest', 'investment', 'savings'], complexity: 'simple' },
      { id: 'mortgage', title: 'Mortgage / EMI', description: 'Loan payments with amortization schedule', keywords: ['mortgage', 'emi', 'loan', 'home', 'payment'], complexity: 'advanced' },
      { id: 'tip', title: 'Tip Calculator', description: 'Split bills and calculate tips', keywords: ['tip', 'bill', 'split', 'restaurant'], complexity: 'simple' },
      { id: 'currency', title: 'Currency Converter', description: 'Convert between currencies', keywords: ['currency', 'exchange', 'forex', 'convert'], complexity: 'simple' },
      { id: 'roi', title: 'ROI Calculator', description: 'Return on investment analysis', keywords: ['roi', 'return', 'investment', 'profit'], complexity: 'simple' },
    ]
  },
  {
    id: 'health',
    title: 'Health & Fitness',
    icon: Activity,
    description: 'BMI, TDEE, nutrition tracking',
    color: 'from-rose-500 to-pink-500',
    calculators: [
      { id: 'bmi_tdee', title: 'BMI & TDEE', description: 'Body metrics and calorie needs', keywords: ['bmi', 'tdee', 'bmr', 'calories', 'weight', 'health'], complexity: 'simple' },
      { id: 'calories', title: 'Calorie Counter', description: 'Track daily calorie intake', keywords: ['calorie', 'food', 'nutrition', 'diet'], complexity: 'simple' },
      { id: 'water_intake', title: 'Water Intake', description: 'Daily water requirement calculator', keywords: ['water', 'hydration', 'drink'], complexity: 'simple' },
      { id: 'body_fat', title: 'Body Fat %', description: 'Estimate body fat percentage', keywords: ['body fat', 'fitness', 'composition'], complexity: 'advanced' },
    ]
  },
  {
    id: 'developer',
    title: 'Developer Tools',
    icon: Code,
    description: 'JSON, CSV, networking, encoding',
    color: 'from-purple-500 to-violet-500',
    calculators: [
      { id: 'json_csv', title: 'JSON ↔ CSV', description: 'Convert between JSON and CSV formats', keywords: ['json', 'csv', 'convert', 'data', 'format'], complexity: 'advanced' },
      { id: 'subnet', title: 'Subnet Calculator', description: 'CIDR to netmask conversion', keywords: ['subnet', 'cidr', 'ip', 'network', 'netmask'], complexity: 'advanced' },
      { id: 'base_converter', title: 'Base Converter', description: 'Convert between number bases', keywords: ['binary', 'hex', 'decimal', 'octal', 'base'], complexity: 'simple' },
      { id: 'unix_timestamp', title: 'Unix Timestamp', description: 'Convert Unix timestamps', keywords: ['unix', 'timestamp', 'epoch', 'date', 'time'], complexity: 'simple' },
      { id: 'hash_generator', title: 'Hash Generator', description: 'Generate MD5, SHA hashes', keywords: ['hash', 'md5', 'sha', 'checksum'], complexity: 'advanced' },
    ]
  },
  {
    id: 'photography',
    title: 'Photography',
    icon: Camera,
    description: 'Depth of field, exposure, print sizes',
    color: 'from-orange-500 to-amber-500',
    calculators: [
      { id: 'dof', title: 'Depth of Field', description: 'Calculate DOF and hyperfocal distance', keywords: ['dof', 'depth', 'field', 'aperture', 'focus', 'photography'], complexity: 'advanced' },
      { id: 'exposure', title: 'Exposure Triangle', description: 'Balance ISO, aperture, shutter', keywords: ['exposure', 'iso', 'aperture', 'shutter'], complexity: 'advanced' },
      { id: 'print_size', title: 'Print Size', description: 'Calculate print dimensions and DPI', keywords: ['print', 'dpi', 'resolution', 'size'], complexity: 'simple' },
    ]
  },
  {
    id: 'statistics',
    title: 'Statistics',
    icon: BarChart3,
    description: 'Sample size, probability, analysis',
    color: 'from-indigo-500 to-blue-500',
    calculators: [
      { id: 'sample_size', title: 'Sample Size', description: 'Calculate required sample size', keywords: ['sample', 'size', 'margin', 'error', 'confidence'], complexity: 'advanced' },
      { id: 'probability', title: 'Probability', description: 'Basic probability calculations', keywords: ['probability', 'odds', 'chance', 'likelihood'], complexity: 'simple' },
      { id: 'mean_median', title: 'Mean & Median', description: 'Central tendency measures', keywords: ['mean', 'median', 'mode', 'average'], complexity: 'simple' },
      { id: 'std_deviation', title: 'Standard Deviation', description: 'Measure data spread', keywords: ['standard', 'deviation', 'variance', 'spread'], complexity: 'advanced' },
    ]
  },
  {
    id: 'units',
    title: 'Unit Converters',
    icon: Ruler,
    description: 'Length, weight, temperature, volume',
    color: 'from-teal-500 to-cyan-500',
    calculators: [
      { id: 'length', title: 'Length Converter', description: 'Convert between length units', keywords: ['length', 'meter', 'feet', 'inch', 'mile', 'km'], complexity: 'simple' },
      { id: 'weight', title: 'Weight Converter', description: 'Convert between weight units', keywords: ['weight', 'kg', 'pound', 'ounce', 'gram'], complexity: 'simple' },
      { id: 'temperature', title: 'Temperature Converter', description: 'Celsius, Fahrenheit, Kelvin', keywords: ['temperature', 'celsius', 'fahrenheit', 'kelvin'], complexity: 'simple' },
      { id: 'volume', title: 'Volume Converter', description: 'Liters, gallons, cups, ml', keywords: ['volume', 'liter', 'gallon', 'cup', 'ml'], complexity: 'simple' },
    ]
  },
  {
    id: 'time',
    title: 'Date & Time',
    icon: Clock,
    description: 'Age, duration, timezone, countdown',
    color: 'from-sky-500 to-blue-500',
    calculators: [
      { id: 'age', title: 'Age Calculator', description: 'Calculate exact age from birthdate', keywords: ['age', 'birthday', 'years', 'old'], complexity: 'simple' },
      { id: 'duration', title: 'Duration Calculator', description: 'Time between two dates', keywords: ['duration', 'days', 'between', 'dates'], complexity: 'simple' },
      { id: 'timezone', title: 'Timezone Converter', description: 'Convert times between zones', keywords: ['timezone', 'time', 'zone', 'convert'], complexity: 'simple' },
    ]
  },
  {
    id: 'electrical',
    title: 'Electrical',
    icon: Zap,
    description: "Ohm's law, power, resistance",
    color: 'from-yellow-500 to-orange-500',
    calculators: [
      { id: 'ohms_law', title: "Ohm's Law", description: 'Voltage, current, resistance', keywords: ['ohm', 'voltage', 'current', 'resistance', 'electrical'], complexity: 'simple' },
      { id: 'power', title: 'Power Calculator', description: 'Calculate electrical power', keywords: ['power', 'watt', 'electricity', 'energy'], complexity: 'simple' },
      { id: 'led_resistor', title: 'LED Resistor', description: 'Calculate LED resistor value', keywords: ['led', 'resistor', 'circuit', 'electronics'], complexity: 'simple' },
    ]
  },
  {
    id: 'everyday',
    title: 'Everyday',
    icon: Percent,
    description: 'Discount, fuel, cooking conversions',
    color: 'from-lime-500 to-green-500',
    calculators: [
      { id: 'discount', title: 'Discount Calculator', description: 'Calculate sale prices and savings', keywords: ['discount', 'sale', 'price', 'savings', 'percent off'], complexity: 'simple' },
      { id: 'fuel', title: 'Fuel Cost', description: 'Calculate trip fuel costs', keywords: ['fuel', 'gas', 'petrol', 'mileage', 'mpg'], complexity: 'simple' },
      { id: 'cooking', title: 'Cooking Converter', description: 'Recipe unit conversions', keywords: ['cooking', 'recipe', 'cups', 'tablespoon', 'teaspoon'], complexity: 'simple' },
    ]
  },
];

export function getAllCalculators(): (CalculatorMeta & { categoryId: string; categoryTitle: string })[] {
  return categories.flatMap(cat => 
    cat.calculators.map(calc => ({
      ...calc,
      categoryId: cat.id,
      categoryTitle: cat.title
    }))
  );
}
