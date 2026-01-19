import { useState, useMemo } from 'react';
import { Ruler } from 'lucide-react';

type UnitType = 'length' | 'weight' | 'temperature' | 'volume';

const units: Record<UnitType, { name: string; units: { id: string; name: string; toBase: (v: number) => number; fromBase: (v: number) => number }[] }> = {
  length: {
    name: 'Length',
    units: [
      { id: 'mm', name: 'Millimeter', toBase: v => v / 1000, fromBase: v => v * 1000 },
      { id: 'cm', name: 'Centimeter', toBase: v => v / 100, fromBase: v => v * 100 },
      { id: 'm', name: 'Meter', toBase: v => v, fromBase: v => v },
      { id: 'km', name: 'Kilometer', toBase: v => v * 1000, fromBase: v => v / 1000 },
      { id: 'in', name: 'Inch', toBase: v => v * 0.0254, fromBase: v => v / 0.0254 },
      { id: 'ft', name: 'Foot', toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
      { id: 'yd', name: 'Yard', toBase: v => v * 0.9144, fromBase: v => v / 0.9144 },
      { id: 'mi', name: 'Mile', toBase: v => v * 1609.344, fromBase: v => v / 1609.344 },
    ]
  },
  weight: {
    name: 'Weight',
    units: [
      { id: 'mg', name: 'Milligram', toBase: v => v / 1000000, fromBase: v => v * 1000000 },
      { id: 'g', name: 'Gram', toBase: v => v / 1000, fromBase: v => v * 1000 },
      { id: 'kg', name: 'Kilogram', toBase: v => v, fromBase: v => v },
      { id: 'oz', name: 'Ounce', toBase: v => v * 0.0283495, fromBase: v => v / 0.0283495 },
      { id: 'lb', name: 'Pound', toBase: v => v * 0.453592, fromBase: v => v / 0.453592 },
      { id: 'st', name: 'Stone', toBase: v => v * 6.35029, fromBase: v => v / 6.35029 },
    ]
  },
  temperature: {
    name: 'Temperature',
    units: [
      { id: 'c', name: 'Celsius', toBase: v => v, fromBase: v => v },
      { id: 'f', name: 'Fahrenheit', toBase: v => (v - 32) * 5/9, fromBase: v => v * 9/5 + 32 },
      { id: 'k', name: 'Kelvin', toBase: v => v - 273.15, fromBase: v => v + 273.15 },
    ]
  },
  volume: {
    name: 'Volume',
    units: [
      { id: 'ml', name: 'Milliliter', toBase: v => v / 1000, fromBase: v => v * 1000 },
      { id: 'l', name: 'Liter', toBase: v => v, fromBase: v => v },
      { id: 'gal', name: 'Gallon (US)', toBase: v => v * 3.78541, fromBase: v => v / 3.78541 },
      { id: 'qt', name: 'Quart', toBase: v => v * 0.946353, fromBase: v => v / 0.946353 },
      { id: 'pt', name: 'Pint', toBase: v => v * 0.473176, fromBase: v => v / 0.473176 },
      { id: 'cup', name: 'Cup', toBase: v => v * 0.236588, fromBase: v => v / 0.236588 },
      { id: 'floz', name: 'Fluid Ounce', toBase: v => v * 0.0295735, fromBase: v => v / 0.0295735 },
    ]
  }
};

export function UnitConverter() {
  const [unitType, setUnitType] = useState<UnitType>('length');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('ft');
  const [value, setValue] = useState(1);

  const currentUnits = units[unitType].units;

  const result = useMemo(() => {
    const from = currentUnits.find(u => u.id === fromUnit);
    const to = currentUnits.find(u => u.id === toUnit);
    if (!from || !to) return 0;
    
    const baseValue = from.toBase(Number(value));
    return to.fromBase(baseValue);
  }, [unitType, fromUnit, toUnit, value, currentUnits]);

  const handleTypeChange = (type: UnitType) => {
    setUnitType(type);
    setFromUnit(units[type].units[0].id);
    setToUnit(units[type].units[1].id);
  };

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  return (
    <div className="space-y-5">
      <div className="flex gap-2 flex-wrap">
        {(Object.keys(units) as UnitType[]).map(type => (
          <button
            key={type}
            onClick={() => handleTypeChange(type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              unitType === type
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
            }`}
          >
            {units[type].name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-end">
        <div className="sm:col-span-2 flex flex-col gap-1.5">
          <span className="text-sm font-medium text-muted-foreground">From</span>
          <input
            value={value}
            onChange={e => setValue(Number(e.target.value))}
            className="input-calc"
            type="number"
          />
          <select
            value={fromUnit}
            onChange={e => setFromUnit(e.target.value)}
            className="input-calc"
          >
            {currentUnits.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-center">
          <button
            onClick={swapUnits}
            className="w-10 h-10 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-all"
          >
            ⇄
          </button>
        </div>

        <div className="sm:col-span-2 flex flex-col gap-1.5">
          <span className="text-sm font-medium text-muted-foreground">To</span>
          <div className="p-3 rounded-lg bg-secondary/50 text-2xl font-bold gradient-text">
            {result.toLocaleString(undefined, { maximumFractionDigits: 6 })}
          </div>
          <select
            value={toUnit}
            onChange={e => setToUnit(e.target.value)}
            className="input-calc"
          >
            {currentUnits.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-secondary/30 flex items-center gap-3">
        <Ruler className="w-5 h-5 text-primary" />
        <span className="text-sm">
          <strong>{value} {currentUnits.find(u => u.id === fromUnit)?.name}</strong>
          {' = '}
          <strong>{result.toLocaleString(undefined, { maximumFractionDigits: 6 })} {currentUnits.find(u => u.id === toUnit)?.name}</strong>
        </span>
      </div>
    </div>
  );
}
