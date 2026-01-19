import { useState, useMemo } from 'react';
import { BarChart3 } from 'lucide-react';

const confidenceLevels = [
  { value: 1.645, label: '90%', desc: 'Low confidence' },
  { value: 1.96, label: '95%', desc: 'Standard' },
  { value: 2.576, label: '99%', desc: 'High confidence' },
];

export function SampleSizeCalculator() {
  const [population, setPopulation] = useState<number | ''>(10000);
  const [proportion, setProportion] = useState(0.5);
  const [margin, setMargin] = useState(0.05);
  const [confidence, setConfidence] = useState(1.96);

  const result = useMemo(() => {
    const p = Number(proportion);
    const e = Number(margin);
    const z = Number(confidence);
    const N = population === '' ? Infinity : Number(population);

    if (p < 0 || p > 1) return { error: 'Proportion must be between 0 and 1' };
    if (e <= 0 || e > 0.5) return { error: 'Margin of error must be between 0 and 0.5' };

    const q = 1 - p;
    
    // Sample size for infinite population
    const n0 = (z * z * p * q) / (e * e);
    
    // Finite population correction
    const n = N === Infinity ? n0 : (n0 * N) / (n0 + N - 1);

    return {
      sampleSize: Math.ceil(n),
      infiniteSampleSize: Math.ceil(n0),
      isFinite: N !== Infinity
    };
  }, [population, proportion, margin, confidence]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-muted-foreground">Population Size (leave empty for infinite)</span>
          <input
            value={population}
            onChange={e => setPopulation(e.target.value === '' ? '' : Number(e.target.value))}
            className="input-calc"
            type="number"
            min="1"
            placeholder="Leave empty for infinite"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-muted-foreground">Expected Proportion (p)</span>
          <input
            value={proportion}
            onChange={e => setProportion(Number(e.target.value))}
            className="input-calc"
            type="number"
            step="0.05"
            min="0"
            max="1"
          />
          <span className="text-xs text-muted-foreground">Use 0.5 for maximum variability</span>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-muted-foreground">Margin of Error</span>
          <input
            value={margin}
            onChange={e => setMargin(Number(e.target.value))}
            className="input-calc"
            type="number"
            step="0.01"
            min="0.01"
            max="0.5"
          />
          <span className="text-xs text-muted-foreground">E.g., 0.05 = ±5%</span>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-muted-foreground">Confidence Level</span>
          <div className="flex gap-2">
            {confidenceLevels.map(level => (
              <button
                key={level.value}
                onClick={() => setConfidence(level.value)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  confidence === level.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                }`}
              >
                {level.label}
              </button>
            ))}
          </div>
        </label>
      </div>

      {'error' in result ? (
        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {result.error}
        </div>
      ) : (
        <div className="p-5 rounded-xl bg-secondary/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Recommended Sample Size</div>
              <div className="text-4xl font-bold gradient-text">
                {result.sampleSize.toLocaleString()}
              </div>
            </div>
          </div>

          {result.isFinite && (
            <div className="text-sm text-muted-foreground pt-3 border-t border-border">
              Without finite population correction: {result.infiniteSampleSize.toLocaleString()}
            </div>
          )}

          <div className="mt-4 p-3 rounded-lg bg-card text-sm text-muted-foreground">
            <strong>Interpretation:</strong> Survey at least {result.sampleSize.toLocaleString()} people 
            to achieve a ±{(margin * 100).toFixed(0)}% margin of error with{' '}
            {confidenceLevels.find(l => l.value === confidence)?.label} confidence.
          </div>
        </div>
      )}
    </div>
  );
}
