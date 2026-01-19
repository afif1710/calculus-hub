import { useState, useMemo, useCallback } from 'react';
import { Copy, RotateCcw, Check } from 'lucide-react';

type Unit = 'mpg' | 'kmpl' | 'l100km';

export function FuelCostCalculator() {
  const [distance, setDistance] = useState('500');
  const [efficiency, setEfficiency] = useState('30');
  const [fuelPrice, setFuelPrice] = useState('3.50');
  const [unit, setUnit] = useState<Unit>('mpg');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const dist = parseFloat(distance);
    const eff = parseFloat(efficiency);
    const price = parseFloat(fuelPrice);

    if (isNaN(dist) || isNaN(eff) || isNaN(price) || dist < 0 || eff <= 0 || price < 0) {
      return null;
    }

    let fuelNeeded: number;
    let fuelUnit: string;
    let distUnit: string;

    switch (unit) {
      case 'mpg':
        fuelNeeded = dist / eff; // gallons
        fuelUnit = 'gallons';
        distUnit = 'miles';
        break;
      case 'kmpl':
        fuelNeeded = dist / eff; // liters
        fuelUnit = 'liters';
        distUnit = 'km';
        break;
      case 'l100km':
        fuelNeeded = (dist / 100) * eff; // liters
        fuelUnit = 'liters';
        distUnit = 'km';
        break;
      default:
        return null;
    }

    const totalCost = fuelNeeded * price;
    const costPerUnit = totalCost / dist;

    return {
      fuelNeeded,
      fuelUnit,
      distUnit,
      totalCost,
      costPerUnit,
    };
  }, [distance, efficiency, fuelPrice, unit]);

  const reset = useCallback(() => {
    setDistance('500');
    setEfficiency('30');
    setFuelPrice('3.50');
    setUnit('mpg');
  }, []);

  const copyResult = useCallback(() => {
    if (result) {
      navigator.clipboard.writeText(
        `Distance: ${distance} ${result.distUnit}\nFuel Needed: ${result.fuelNeeded.toFixed(2)} ${result.fuelUnit}\nTotal Cost: $${result.totalCost.toFixed(2)}\nCost per ${result.distUnit}: $${result.costPerUnit.toFixed(4)}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result, distance]);

  return (
    <div className="space-y-6">
      {/* Unit Toggle */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Efficiency Unit</label>
        <div className="flex gap-2 p-1 bg-secondary/50 rounded-xl">
          <button
            onClick={() => setUnit('mpg')}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              unit === 'mpg' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
            }`}
          >
            MPG
          </button>
          <button
            onClick={() => setUnit('kmpl')}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              unit === 'kmpl' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
            }`}
          >
            km/L
          </button>
          <button
            onClick={() => setUnit('l100km')}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              unit === 'l100km' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
            }`}
          >
            L/100km
          </button>
        </div>
      </div>

      {/* Inputs */}
      <div className="grid gap-4">
        <label className="space-y-2">
          <span className="text-sm font-medium">
            Distance ({unit === 'mpg' ? 'miles' : 'km'})
          </span>
          <input
            type="number"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="Enter distance"
            min="0"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">
            Fuel Efficiency ({unit === 'mpg' ? 'miles/gallon' : unit === 'kmpl' ? 'km/liter' : 'L/100km'})
          </span>
          <input
            type="number"
            value={efficiency}
            onChange={(e) => setEfficiency(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="Enter efficiency"
            min="0"
            step="0.1"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">
            Fuel Price ($ per {unit === 'mpg' ? 'gallon' : 'liter'})
          </span>
          <input
            type="number"
            value={fuelPrice}
            onChange={(e) => setFuelPrice(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="Enter fuel price"
            min="0"
            step="0.01"
          />
        </label>
      </div>

      {/* Results */}
      <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-3">
        {result ? (
          <>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Fuel Needed</span>
              <span className="text-lg font-semibold">
                {result.fuelNeeded.toFixed(2)} {result.fuelUnit}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Cost per {result.distUnit}</span>
              <span className="text-lg font-semibold">
                ${result.costPerUnit.toFixed(4)}
              </span>
            </div>
            <div className="flex justify-between items-center border-t border-border pt-3">
              <span className="font-medium">Total Cost</span>
              <span className="text-2xl font-bold gradient-text">
                ${result.totalCost.toFixed(2)}
              </span>
            </div>
          </>
        ) : (
          <div className="text-center text-muted-foreground py-2">
            Enter valid positive values
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
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
