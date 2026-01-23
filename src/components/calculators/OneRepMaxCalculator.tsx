import { useState, useMemo, useCallback } from 'react';
import { Copy, RotateCcw, Check } from 'lucide-react';

const FORMULAS = {
  brzycki: { name: 'Brzycki', calc: (w: number, r: number) => w * (36 / (37 - r)) },
  epley: { name: 'Epley', calc: (w: number, r: number) => w * (1 + r / 30) },
  lander: { name: 'Lander', calc: (w: number, r: number) => (100 * w) / (101.3 - 2.67123 * r) },
  lombardi: { name: 'Lombardi', calc: (w: number, r: number) => w * Math.pow(r, 0.1) },
  oconner: { name: "O'Conner", calc: (w: number, r: number) => w * (1 + r / 40) },
};

export function OneRepMaxCalculator() {
  const [weight, setWeight] = useState('100');
  const [reps, setReps] = useState('8');
  const [unit, setUnit] = useState<'kg' | 'lbs'>('kg');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const w = parseFloat(weight);
    const r = parseInt(reps);

    if (isNaN(w) || isNaN(r) || w <= 0 || r < 1 || r > 15) {
      return null;
    }

    const results = Object.entries(FORMULAS).map(([key, formula]) => ({
      name: formula.name,
      oneRM: formula.calc(w, r)
    }));

    const average = results.reduce((sum, r) => sum + r.oneRM, 0) / results.length;

    // Calculate percentages for different rep ranges
    const percentages = [
      { reps: 1, percent: 100 },
      { reps: 2, percent: 95 },
      { reps: 3, percent: 93 },
      { reps: 4, percent: 90 },
      { reps: 5, percent: 87 },
      { reps: 6, percent: 85 },
      { reps: 8, percent: 80 },
      { reps: 10, percent: 75 },
      { reps: 12, percent: 70 },
    ].map(p => ({ ...p, weight: average * (p.percent / 100) }));

    return { formulas: results, average, percentages };
  }, [weight, reps]);

  const reset = useCallback(() => {
    setWeight('100');
    setReps('8');
  }, []);

  const copyResult = useCallback(() => {
    if (result) {
      const text = `Weight: ${weight}${unit} × ${reps} reps\nEstimated 1RM: ${result.average.toFixed(1)}${unit}\n\n${result.formulas.map(f => `${f.name}: ${f.oneRM.toFixed(1)}${unit}`).join('\n')}`;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result, weight, reps, unit]);

  return (
    <div className="space-y-6">
      {/* Unit Toggle */}
      <div className="flex gap-2 p-1 bg-secondary/50 rounded-xl">
        <button
          onClick={() => setUnit('kg')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            unit === 'kg' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
          }`}
        >
          Kilograms
        </button>
        <button
          onClick={() => setUnit('lbs')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            unit === 'lbs' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
          }`}
        >
          Pounds
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="space-y-2">
          <span className="text-sm font-medium">Weight Lifted ({unit})</span>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="Weight"
            min="0"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Reps (1-15)</span>
          <input
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="Reps"
            min="1"
            max="15"
          />
        </label>
      </div>

      {/* Results */}
      <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-3">
        {result ? (
          <>
            <div className="text-center">
              <span className="text-sm text-muted-foreground block">Estimated 1 Rep Max</span>
              <span className="text-3xl font-bold gradient-text">
                {result.average.toFixed(1)} {unit}
              </span>
            </div>

            <div className="border-t border-border pt-3">
              <span className="text-xs text-muted-foreground block mb-2">By Formula</span>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {result.formulas.map(f => (
                  <div key={f.name} className="flex justify-between">
                    <span className="text-muted-foreground">{f.name}</span>
                    <span className="font-medium">{f.oneRM.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center text-muted-foreground py-2">
            Enter weight and reps (1-15)
          </div>
        )}
      </div>

      {/* Percentage Chart */}
      {result && (
        <details className="text-sm">
          <summary className="text-muted-foreground cursor-pointer hover:text-foreground">
            Training Percentages
          </summary>
          <div className="mt-2 p-3 rounded-lg bg-secondary/30 grid grid-cols-3 gap-2 text-xs">
            {result.percentages.map(p => (
              <div key={p.reps} className="text-center p-2 bg-secondary/50 rounded">
                <div className="font-bold">{p.weight.toFixed(1)}</div>
                <div className="text-muted-foreground">{p.reps}RM ({p.percent}%)</div>
              </div>
            ))}
          </div>
        </details>
      )}

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
