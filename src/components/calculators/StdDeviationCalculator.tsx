import { useState, useCallback, useMemo } from 'react';
import { Copy, RotateCcw, Check, Info } from 'lucide-react';

export function StdDeviationCalculator() {
  const [input, setInput] = useState('10, 12, 23, 23, 16, 23, 21, 16');
  const [type, setType] = useState<'population' | 'sample'>('sample');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const numbers = input
      .split(/[,\s\n]+/)
      .map((s) => s.trim())
      .filter((s) => s !== '')
      .map((s) => parseFloat(s))
      .filter((n) => !isNaN(n));

    if (numbers.length < 2) return null;

    const n = numbers.length;
    const mean = numbers.reduce((acc, val) => acc + val, 0) / n;

    // Calculate squared differences
    const squaredDiffs = numbers.map((num) => {
      const diff = num - mean;
      return {
        value: num,
        diff: diff.toFixed(4),
        squared: Math.pow(diff, 2).toFixed(4),
      };
    });

    const sumSquaredDiffs = squaredDiffs.reduce(
      (acc, item) => acc + parseFloat(item.squared),
      0
    );

    // Variance: divide by n for population, n-1 for sample
    const divisor = type === 'population' ? n : n - 1;
    const variance = sumSquaredDiffs / divisor;
    const stdDev = Math.sqrt(variance);

    // Coefficient of variation (relative std dev)
    const cv = (stdDev / Math.abs(mean)) * 100;

    return {
      n,
      mean: mean.toFixed(4),
      sumSquaredDiffs: sumSquaredDiffs.toFixed(4),
      variance: variance.toFixed(4),
      stdDev: stdDev.toFixed(4),
      cv: cv.toFixed(2),
      steps: squaredDiffs,
    };
  }, [input, type]);

  const reset = useCallback(() => {
    setInput('10, 12, 23, 23, 16, 23, 21, 16');
  }, []);

  const copyResult = useCallback(() => {
    if (result) {
      const text = `${type === 'population' ? 'Population' : 'Sample'} Standard Deviation: ${result.stdDev}\nVariance: ${result.variance}\nMean: ${result.mean}\nN: ${result.n}`;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result, type]);

  return (
    <div className="space-y-6">
      {/* Type Selection */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          Calculation Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setType('sample')}
            className={`py-3 rounded-xl text-sm font-medium transition-colors ${
              type === 'sample' ? 'bg-primary text-primary-foreground' : 'bg-secondary/50 hover:bg-secondary'
            }`}
          >
            Sample (n-1)
          </button>
          <button
            onClick={() => setType('population')}
            className={`py-3 rounded-xl text-sm font-medium transition-colors ${
              type === 'population' ? 'bg-primary text-primary-foreground' : 'bg-secondary/50 hover:bg-secondary'
            }`}
          >
            Population (n)
          </button>
        </div>
      </div>

      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          Enter Data (comma, space, or newline separated)
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. 10, 12, 23, 23, 16"
          rows={3}
          className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none transition-all resize-none font-mono"
        />
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Main Result */}
          <div className="p-6 rounded-xl bg-primary/10 border border-primary/20">
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">
                {type === 'sample' ? 'Sample' : 'Population'} Standard Deviation (σ)
              </div>
              <div className="text-4xl font-bold gradient-text">{result.stdDev}</div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-secondary/50 text-center">
              <div className="text-lg font-bold">{result.mean}</div>
              <div className="text-xs text-muted-foreground">Mean (x̄)</div>
            </div>
            <div className="p-4 rounded-xl bg-secondary/50 text-center">
              <div className="text-lg font-bold">{result.variance}</div>
              <div className="text-xs text-muted-foreground">Variance (σ²)</div>
            </div>
            <div className="p-4 rounded-xl bg-secondary/50 text-center">
              <div className="text-lg font-bold">{result.n}</div>
              <div className="text-xs text-muted-foreground">Sample Size (n)</div>
            </div>
            <div className="p-4 rounded-xl bg-secondary/50 text-center">
              <div className="text-lg font-bold">{result.cv}%</div>
              <div className="text-xs text-muted-foreground">CV (Relative SD)</div>
            </div>
          </div>

          {/* Step-by-step */}
          <details className="group">
            <summary className="cursor-pointer text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Info className="w-4 h-4" />
              Show calculation steps
            </summary>
            <div className="mt-3 p-4 rounded-xl bg-secondary/30">
              <div className="text-xs font-mono space-y-2">
                <p>1. Mean = Σx / n = {result.mean}</p>
                <p>2. For each value, calculate (x - mean)²:</p>
                <div className="max-h-32 overflow-y-auto">
                  <table className="w-full text-left mt-2">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="py-1">x</th>
                        <th className="py-1">x - mean</th>
                        <th className="py-1">(x - mean)²</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.steps.map((step, i) => (
                        <tr key={i} className="border-b border-border/50">
                          <td className="py-1">{step.value}</td>
                          <td className="py-1">{step.diff}</td>
                          <td className="py-1">{step.squared}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-2">3. Sum of squared differences = {result.sumSquaredDiffs}</p>
                <p>4. Variance = {result.sumSquaredDiffs} / {type === 'sample' ? `(${result.n}-1)` : result.n} = {result.variance}</p>
                <p>5. Standard Deviation = √{result.variance} = {result.stdDev}</p>
              </div>
            </div>
          </details>
        </div>
      )}

      {!result && input && (
        <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-center">
          Need at least 2 numbers to calculate standard deviation.
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
