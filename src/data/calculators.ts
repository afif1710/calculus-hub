import { 
  Calculator, DollarSign, Activity, Code, Camera, 
  BarChart3, Ruler, Clock, Zap, Percent, TrendingUp,
  Building2, ShoppingCart, Leaf, GraduationCap, Home, Car, Briefcase
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
      { id: 'percent_change', title: 'Percent Change', description: 'Increase, decrease & difference', keywords: ['percent', 'change', 'increase', 'decrease', 'difference'], complexity: 'simple' },
      { id: 'scientific', title: 'Scientific Calculator', description: 'Trigonometry, logarithms, powers', keywords: ['sin', 'cos', 'tan', 'log', 'power', 'sqrt'], complexity: 'advanced' },
      { id: 'quadratic', title: 'Quadratic Solver', description: 'Find roots and discriminant', keywords: ['quadratic', 'equation', 'roots', 'discriminant', 'polynomial'], complexity: 'simple' },
      { id: 'gcd_lcm', title: 'GCD / LCM', description: 'Greatest common divisor & least common multiple', keywords: ['gcd', 'lcm', 'divisor', 'multiple', 'factor'], complexity: 'simple' },
      { id: 'gpa', title: 'GPA Calculator', description: 'Calculate GPA with credits', keywords: ['gpa', 'cgpa', 'grade', 'college', 'academic', 'credits'], complexity: 'simple' },
      { id: 'final_grade', title: 'Final Grade Needed', description: 'Calculate grade needed on final exam', keywords: ['grade', 'final', 'exam', 'academic', 'school'], complexity: 'simple' },
    ]
  },
  {
    id: 'finance',
    title: 'Finance',
    icon: DollarSign,
    description: 'Loans, investments, taxes',
    color: 'from-green-500 to-emerald-500',
    calculators: [
      { id: 'simple_interest', title: 'Simple Interest', description: 'Calculate simple interest', keywords: ['simple', 'interest', 'principal', 'rate', 'time'], complexity: 'simple' },
      { id: 'compound_interest', title: 'Compound Interest', description: 'Calculate compound interest growth', keywords: ['compound', 'interest', 'investment', 'savings'], complexity: 'simple' },
      { id: 'cagr', title: 'CAGR Calculator', description: 'Compound annual growth rate', keywords: ['cagr', 'growth', 'annual', 'return', 'investment'], complexity: 'simple' },
      { id: 'sip', title: 'SIP Calculator', description: 'Monthly investment returns', keywords: ['sip', 'mutual', 'fund', 'monthly', 'investment'], complexity: 'simple' },
      { id: 'inflation', title: 'Inflation Calculator', description: 'Future & present value', keywords: ['inflation', 'purchasing', 'power', 'future', 'value'], complexity: 'simple' },
      { id: 'credit_card', title: 'Credit Card Payoff', description: 'Payoff time and interest', keywords: ['credit', 'card', 'payoff', 'debt', 'interest', 'apr'], complexity: 'advanced' },
      { id: 'mortgage', title: 'Mortgage / EMI', description: 'Loan payments with amortization schedule', keywords: ['mortgage', 'emi', 'loan', 'home', 'payment'], complexity: 'advanced' },
      { id: 'loan_comparison', title: 'Loan Comparison', description: 'Compare 2-4 loans side by side', keywords: ['compare', 'loans', 'emi', 'comparison', 'best', 'loan', 'total', 'interest'], complexity: 'advanced' },
      { id: 'salary_raise', title: 'Salary Raise Impact', description: 'Calculate raise and tax impact', keywords: ['salary', 'raise', 'increment', 'pay', 'increase', 'after', 'tax'], complexity: 'simple' },
      { id: 'tip', title: 'Tip Calculator', description: 'Split bills and calculate tips', keywords: ['tip', 'bill', 'split', 'restaurant'], complexity: 'simple' },
      { id: 'currency', title: 'Currency Converter', description: 'Convert between currencies', keywords: ['currency', 'exchange', 'forex', 'convert'], complexity: 'simple' },
      { id: 'roi', title: 'ROI Calculator', description: 'Return on investment analysis', keywords: ['roi', 'return', 'investment', 'profit'], complexity: 'simple' },
    ]
  },
  {
    id: 'digital_marketing',
    title: 'Digital Marketing',
    icon: TrendingUp,
    description: 'ROI, engagement, analytics',
    color: 'from-pink-500 to-rose-500',
    calculators: [
      { id: 'engagement_rate', title: 'Engagement Rate', description: 'Calculate social media engagement', keywords: ['engagement', 'social', 'likes', 'comments', 'followers', 'instagram', 'tiktok'], complexity: 'simple' },
      { id: 'cpm', title: 'CPM Calculator', description: 'Cost per thousand impressions', keywords: ['cpm', 'cost', 'impressions', 'advertising', 'mille'], complexity: 'simple' },
      { id: 'cpc', title: 'CPC Calculator', description: 'Cost per click', keywords: ['cpc', 'cost', 'click', 'advertising', 'ppc'], complexity: 'simple' },
      { id: 'ctr', title: 'CTR Calculator', description: 'Click-through rate', keywords: ['ctr', 'click', 'through', 'rate', 'impressions'], complexity: 'simple' },
      { id: 'cpa', title: 'CPA Calculator', description: 'Cost per acquisition', keywords: ['cpa', 'cost', 'acquisition', 'conversion'], complexity: 'simple' },
      { id: 'breakeven_cpa', title: 'Break-even CPA', description: 'Max CPA from AOV & margin', keywords: ['breakeven', 'cpa', 'aov', 'margin', 'profit'], complexity: 'simple' },
    ]
  },
  {
    id: 'real_estate',
    title: 'Real Estate',
    icon: Building2,
    description: 'Property investment analysis',
    color: 'from-amber-500 to-orange-500',
    calculators: [
      { id: 'rental_yield', title: 'Rental Yield', description: 'Annual return on rental property', keywords: ['rental', 'yield', 'property', 'landlord', 'investment'], complexity: 'simple' },
      { id: 'cap_rate', title: 'Cap Rate', description: 'Capitalization rate for properties', keywords: ['cap', 'rate', 'capitalization', 'noi', 'property'], complexity: 'simple' },
      { id: 'rent_vs_buy', title: 'Rent vs Buy', description: 'Compare renting vs buying', keywords: ['rent', 'buy', 'compare', 'home', 'mortgage'], complexity: 'advanced' },
      { id: 'mortgage_afford', title: 'Mortgage Affordability', description: 'How much home can you afford', keywords: ['mortgage', 'affordability', 'income', 'dti', 'loan'], complexity: 'advanced' },
      { id: 'mortgage_refinance', title: 'Mortgage Refinance', description: 'Analyze refinance savings', keywords: ['refinance', 'mortgage', 'break', 'even', 'interest', 'saved'], complexity: 'advanced' },
    ]
  },
  {
    id: 'business',
    title: 'Business & E-commerce',
    icon: ShoppingCart,
    description: 'Break-even, margins, pricing, analytics',
    color: 'from-violet-500 to-purple-500',
    calculators: [
      { id: 'break_even', title: 'Break-Even Point', description: 'Units needed to cover costs', keywords: ['break', 'even', 'profit', 'loss', 'units', 'business'], complexity: 'simple' },
      { id: 'profit_margin', title: 'Profit Margin', description: 'Calculate profit and markup', keywords: ['profit', 'margin', 'markup', 'cost', 'pricing'], complexity: 'simple' },
      { id: 'pricing', title: 'Pricing Calculator', description: 'Markup vs margin pricing', keywords: ['pricing', 'markup', 'margin', 'selling', 'price', 'profit'], complexity: 'simple' },
      { id: 'reorder_point', title: 'Inventory Reorder Point', description: 'When to reorder stock', keywords: ['reorder', 'point', 'inventory', 'planning', 'safety', 'stock', 'lead', 'time'], complexity: 'simple' },
      { id: 'cac', title: 'Customer Acquisition Cost', description: 'Cost to acquire each customer', keywords: ['cac', 'customer', 'acquisition', 'marketing', 'cost'], complexity: 'simple' },
      { id: 'roas', title: 'ROAS Calculator', description: 'Return on ad spend ratio', keywords: ['roas', 'return', 'ad', 'spend', 'advertising', 'marketing'], complexity: 'simple' },
      { id: 'aov', title: 'Average Order Value', description: 'Average revenue per order', keywords: ['aov', 'average', 'order', 'value', 'revenue'], complexity: 'simple' },
      { id: 'inventory_turnover', title: 'Inventory Turnover', description: 'How fast inventory sells', keywords: ['inventory', 'turnover', 'cogs', 'stock', 'warehouse'], complexity: 'simple' },
      { id: 'conversion_rate', title: 'Conversion Rate', description: 'Visitor to customer conversion', keywords: ['conversion', 'rate', 'visitors', 'sales', 'ecommerce'], complexity: 'simple' },
    ]
  },
  {
    id: 'sustainability',
    title: 'Sustainability',
    icon: Leaf,
    description: 'Carbon footprint & eco impact',
    color: 'from-green-500 to-teal-500',
    calculators: [
      { id: 'co2_flight', title: 'CO2 Flight Impact', description: 'Calculate flight carbon emissions', keywords: ['co2', 'carbon', 'flight', 'emissions', 'climate', 'environment', 'plane'], complexity: 'simple' },
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
      { id: 'one_rep_max', title: 'One Rep Max', description: 'Estimate 1RM from reps', keywords: ['1rm', 'one', 'rep', 'max', 'strength', 'lifting'], complexity: 'simple' },
      { id: 'calorie_deficit', title: 'Calorie Deficit', description: 'Weight loss timeline', keywords: ['calorie', 'deficit', 'weight', 'loss', 'diet', 'tdee'], complexity: 'simple' },
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
      { id: 'base64', title: 'Base64 Encode/Decode', description: 'Encode and decode Base64', keywords: ['base64', 'encode', 'decode', 'string'], complexity: 'simple' },
      { id: 'url_encoder', title: 'URL Encode/Decode', description: 'Encode and decode URLs', keywords: ['url', 'encode', 'decode', 'uri', 'percent'], complexity: 'simple' },
      { id: 'jwt_decoder', title: 'JWT Decoder', description: 'Decode JWT tokens', keywords: ['jwt', 'token', 'decode', 'json', 'auth'], complexity: 'simple' },
      { id: 'uuid', title: 'UUID Generator', description: 'Generate UUID v4', keywords: ['uuid', 'guid', 'unique', 'id', 'generate'], complexity: 'simple' },
      { id: 'unix_timestamp', title: 'Unix Timestamp', description: 'Convert Unix timestamps', keywords: ['unix', 'timestamp', 'epoch', 'date', 'time'], complexity: 'simple' },
      { id: 'hash_generator', title: 'Hash Generator', description: 'Generate MD5, SHA hashes', keywords: ['hash', 'md5', 'sha', 'checksum'], complexity: 'advanced' },
      { id: 'cron', title: 'Cron Expression Helper', description: 'Generate cron schedules', keywords: ['cron', 'scheduler', 'cron', 'generator', 'linux', 'crontab'], complexity: 'simple' },
    ]
  },
  {
    id: 'home_diy',
    title: 'Home & DIY',
    icon: Home,
    description: 'Paint, flooring, concrete, projects',
    color: 'from-orange-500 to-red-500',
    calculators: [
      { id: 'paint', title: 'Paint Calculator', description: 'Gallons needed for room', keywords: ['paint', 'wall', 'room', 'gallon', 'coverage'], complexity: 'simple' },
      { id: 'flooring', title: 'Flooring/Tiles', description: 'Tiles needed with waste', keywords: ['flooring', 'tile', 'floor', 'square', 'feet'], complexity: 'simple' },
      { id: 'concrete', title: 'Concrete Volume', description: 'Cubic yards and bags needed', keywords: ['concrete', 'cement', 'slab', 'cubic', 'yard'], complexity: 'simple' },
    ]
  },
  {
    id: 'automotive',
    title: 'Automotive',
    icon: Car,
    description: 'Fuel, mileage, car loans',
    color: 'from-slate-500 to-zinc-500',
    calculators: [
      { id: 'fuel_efficiency', title: 'Fuel Efficiency', description: 'Convert MPG, km/L, L/100km', keywords: ['fuel', 'efficiency', 'mpg', 'mileage', 'consumption'], complexity: 'simple' },
      { id: 'fuel', title: 'Trip Fuel Cost', description: 'Calculate trip fuel costs', keywords: ['fuel', 'gas', 'petrol', 'trip', 'cost'], complexity: 'simple' },
    ]
  },
  {
    id: 'hr_salary',
    title: 'HR & Salary',
    icon: Briefcase,
    description: 'Pay, overtime, take-home',
    color: 'from-indigo-500 to-purple-500',
    calculators: [
      { id: 'salary', title: 'Salary Converter', description: 'Hourly ↔ annual salary', keywords: ['salary', 'hourly', 'annual', 'pay', 'wage'], complexity: 'simple' },
      { id: 'take_home', title: 'Take-Home Pay', description: 'Net pay after tax', keywords: ['take', 'home', 'net', 'tax', 'gross', 'salary'], complexity: 'simple' },
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
      { id: 'unit_converter', title: 'Unit Converter (All-in-One)', description: 'Length, weight, temperature, volume', keywords: ['length', 'meter', 'feet', 'inch', 'mile', 'km', 'weight', 'kg', 'pound', 'ounce', 'gram', 'lbs', 'temperature', 'celsius', 'fahrenheit', 'kelvin', 'volume', 'liter', 'gallon', 'cup', 'ml', 'liters', 'gallons', 'converter'], complexity: 'simple' },
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
