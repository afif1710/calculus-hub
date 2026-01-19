import { useState, useCallback, useMemo } from 'react';
import { Copy, RotateCcw, Check, ArrowRightLeft } from 'lucide-react';

const COOKING_UNITS = {
  volume: {
    teaspoon: { ml: 4.92892, abbr: 'tsp' },
    tablespoon: { ml: 14.7868, abbr: 'tbsp' },
    'fluid ounce': { ml: 29.5735, abbr: 'fl oz' },
    cup: { ml: 236.588, abbr: 'cup' },
    pint: { ml: 473.176, abbr: 'pt' },
    quart: { ml: 946.353, abbr: 'qt' },
    gallon: { ml: 3785.41, abbr: 'gal' },
    milliliter: { ml: 1, abbr: 'ml' },
    liter: { ml: 1000, abbr: 'L' },
  },
  weight: {
    ounce: { g: 28.3495, abbr: 'oz' },
    pound: { g: 453.592, abbr: 'lb' },
    gram: { g: 1, abbr: 'g' },
    kilogram: { g: 1000, abbr: 'kg' },
  },
  temperature: {
    fahrenheit: { abbr: '°F' },
    celsius: { abbr: '°C' },
    gas_mark: { abbr: 'Gas Mark' },
  },
};

// Common ingredient densities (g/ml) for cup to gram conversions
const INGREDIENTS: Record<string, number> = {
  'All-purpose flour': 0.53,
  'Bread flour': 0.55,
  'Cake flour': 0.48,
  'Sugar (granulated)': 0.85,
  'Sugar (brown, packed)': 0.93,
  'Sugar (powdered)': 0.56,
  Butter: 0.91,
  'Honey/Maple Syrup': 1.42,
  Milk: 1.03,
  Water: 1.0,
  'Vegetable Oil': 0.92,
  'Cocoa powder': 0.42,
  Salt: 1.2,
  'Baking powder': 0.9,
  'Rolled oats': 0.36,
  Rice: 0.75,
};

export function CookingConverter() {
  const [mode, setMode] = useState<'volume' | 'weight' | 'temperature' | 'ingredient'>('volume');
  const [value, setValue] = useState('1');
  const [fromUnit, setFromUnit] = useState('cup');
  const [toUnit, setToUnit] = useState('milliliter');
  const [ingredient, setIngredient] = useState('All-purpose flour');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return null;

    if (mode === 'temperature') {
      let celsius: number;
      
      // Convert to Celsius first
      if (fromUnit === 'fahrenheit') {
        celsius = (numValue - 32) * 5 / 9;
      } else if (fromUnit === 'gas_mark') {
        celsius = (numValue * 14) + 121; // Approximate
      } else {
        celsius = numValue;
      }

      // Convert from Celsius to target
      let result: number;
      if (toUnit === 'fahrenheit') {
        result = (celsius * 9 / 5) + 32;
      } else if (toUnit === 'gas_mark') {
        result = (celsius - 121) / 14;
      } else {
        result = celsius;
      }

      return {
        value: result.toFixed(1),
        unit: COOKING_UNITS.temperature[toUnit as keyof typeof COOKING_UNITS.temperature].abbr,
      };
    }

    if (mode === 'ingredient') {
      // Convert cups to grams using ingredient density
      const density = INGREDIENTS[ingredient];
      const cupInMl = COOKING_UNITS.volume.cup.ml;
      const grams = numValue * cupInMl * density;
      
      return {
        value: Math.round(grams).toString(),
        unit: 'g',
        detail: `1 cup ${ingredient} ≈ ${Math.round(cupInMl * density)}g`,
      };
    }

    if (mode === 'volume') {
      const fromMl = COOKING_UNITS.volume[fromUnit as keyof typeof COOKING_UNITS.volume].ml;
      const toMl = COOKING_UNITS.volume[toUnit as keyof typeof COOKING_UNITS.volume].ml;
      const converted = (numValue * fromMl) / toMl;
      
      return {
        value: converted < 0.01 ? converted.toExponential(2) : 
               converted < 1 ? converted.toFixed(3) : 
               converted.toFixed(2),
        unit: COOKING_UNITS.volume[toUnit as keyof typeof COOKING_UNITS.volume].abbr,
      };
    }

    if (mode === 'weight') {
      const fromG = COOKING_UNITS.weight[fromUnit as keyof typeof COOKING_UNITS.weight].g;
      const toG = COOKING_UNITS.weight[toUnit as keyof typeof COOKING_UNITS.weight].g;
      const converted = (numValue * fromG) / toG;
      
      return {
        value: converted < 0.01 ? converted.toExponential(2) : 
               converted < 1 ? converted.toFixed(3) : 
               converted.toFixed(2),
        unit: COOKING_UNITS.weight[toUnit as keyof typeof COOKING_UNITS.weight].abbr,
      };
    }

    return null;
  }, [mode, value, fromUnit, toUnit, ingredient]);

  const swap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const reset = useCallback(() => {
    setValue('1');
    if (mode === 'volume') {
      setFromUnit('cup');
      setToUnit('milliliter');
    } else if (mode === 'weight') {
      setFromUnit('ounce');
      setToUnit('gram');
    } else if (mode === 'temperature') {
      setFromUnit('fahrenheit');
      setToUnit('celsius');
    }
  }, [mode]);

  const copyResult = useCallback(() => {
    if (result) {
      navigator.clipboard.writeText(`${result.value} ${result.unit}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result]);

  const getUnits = () => {
    if (mode === 'volume') return Object.keys(COOKING_UNITS.volume);
    if (mode === 'weight') return Object.keys(COOKING_UNITS.weight);
    if (mode === 'temperature') return Object.keys(COOKING_UNITS.temperature);
    return [];
  };

  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      <div className="grid grid-cols-4 gap-2">
        {['volume', 'weight', 'temperature', 'ingredient'].map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m as typeof mode);
              if (m === 'volume') {
                setFromUnit('cup');
                setToUnit('milliliter');
              } else if (m === 'weight') {
                setFromUnit('ounce');
                setToUnit('gram');
              } else if (m === 'temperature') {
                setFromUnit('fahrenheit');
                setToUnit('celsius');
              }
            }}
            className={`py-2 px-2 rounded-xl text-xs sm:text-sm font-medium transition-colors capitalize ${
              mode === m ? 'bg-primary text-primary-foreground' : 'bg-secondary/50 hover:bg-secondary'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {mode === 'ingredient' ? (
        <>
          {/* Ingredient Selector */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Ingredient
            </label>
            <select
              value={ingredient}
              onChange={(e) => setIngredient(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none transition-all"
            >
              {Object.keys(INGREDIENTS).map((ing) => (
                <option key={ing} value={ing}>{ing}</option>
              ))}
            </select>
          </div>

          {/* Cups Input */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Cups
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              step="0.25"
              min="0"
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none transition-all"
            />
          </div>
        </>
      ) : (
        <>
          {/* Value Input */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Value
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              step="any"
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none transition-all"
            />
          </div>

          {/* Unit Selectors */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                From
              </label>
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none transition-all capitalize"
              >
                {getUnits().map((unit) => (
                  <option key={unit} value={unit} className="capitalize">
                    {unit.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={swap}
              className="mt-6 p-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <ArrowRightLeft className="w-5 h-5" />
            </button>

            <div className="flex-1">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                To
              </label>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none transition-all capitalize"
              >
                {getUnits().map((unit) => (
                  <option key={unit} value={unit} className="capitalize">
                    {unit.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </>
      )}

      {/* Result */}
      {result && (
        <div className="p-6 rounded-xl bg-primary/10 border border-primary/20 text-center">
          <div className="text-3xl font-bold gradient-text">
            {result.value} {result.unit}
          </div>
          {'detail' in result && (
            <div className="text-sm text-muted-foreground mt-2">{result.detail}</div>
          )}
        </div>
      )}

      {/* Quick Reference */}
      {mode === 'volume' && (
        <div className="p-4 rounded-xl bg-secondary/30">
          <h3 className="text-sm font-medium mb-2">Quick Reference</h3>
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div>3 tsp = 1 tbsp</div>
            <div>16 tbsp = 1 cup</div>
            <div>2 cups = 1 pint</div>
            <div>4 cups = 1 quart</div>
          </div>
        </div>
      )}

      {mode === 'temperature' && (
        <div className="p-4 rounded-xl bg-secondary/30">
          <h3 className="text-sm font-medium mb-2">Common Oven Temperatures</h3>
          <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground text-center">
            <div>Low: 150°C / 300°F</div>
            <div>Mod: 180°C / 350°F</div>
            <div>High: 220°C / 425°F</div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={reset}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
        <button
          onClick={copyResult}
          disabled={!result}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy Result'}
        </button>
      </div>
    </div>
  );
}
