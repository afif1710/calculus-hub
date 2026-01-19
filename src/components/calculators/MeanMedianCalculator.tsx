import { useState, useCallback, useMemo } from 'react';
import { Copy, RotateCcw, Check } from 'lucide-react';

export function MeanMedianCalculator() {
  const [input, setInput] = useState('1, 2, 3, 4, 5');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    // Parse input - accept comma, space, or newline separated values
    const numbers = input
      .split(/[,\s\n]+/)
      .map((s) => s.trim())
      .filter((s) => s !== '')
      .map((s) => parseFloat(s))
      .filter((n) => !isNaN(n));

    if (numbers.length === 0) return null;

    const sorted = [...numbers].sort((a, b) => a - b);
    const n = numbers.length;

    // Mean
    const sum = numbers.reduce((acc, val) => acc + val, 0);
    const mean = sum / n;

    // Median
    let median: number;
    if (n % 2 === 0) {
      median = (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
    } else {
      median = sorted[Math.floor(n / 2)];
    }

    // Mode - find most frequent value(s)
    const frequency: Record<number, number> = {};
    numbers.forEach((num) => {
      frequency[num] = (frequency[num] || 0) + 1;
    });
    const maxFreq = Math.max(...Object.values(frequency));
    const modes = Object.entries(frequency)
      .filter(([, freq]) => freq === maxFreq)
      .map(([num]) => parseFloat(num));

    // Range
    const min = sorted[0];
    const max = sorted[n - 1];
    const range = max - min;

    // Variance and Standard Deviation
    const squaredDiffs = numbers.map((num) => Math.pow(num - mean, 2));
    const variance = squaredDiffs.reduce((acc, val) => acc + val, 0) / n;
    const stdDev = Math.sqrt(variance);

    // Sum
    const total = sum;

    return {
      count: n,
      mean: mean.toFixed(4),
      median: median.toFixed(4),
      mode: modes.length === n ? 'No mode' : modes.join(', '),
      modeFrequency: maxFreq,
      min: min.toFixed(4),
      max: max.toFixed(4),
      range: range.toFixed(4),
      sum: total.toFixed(4),
      variance: variance.toFixed(4),
      stdDev: stdDev.toFixed(4),
      sorted: sorted.map((n) => n.toString()).join(', '),
    };
  }, [input]);

  const reset = useCallback(() => {
    setInput('1, 2, 3, 4, 5');
  }, []);

  const copyResult = useCallback(() => {
    if (result) {
      const text = `Mean: ${result.mean}\nMedian: ${result.median}\nMode: ${result.mode}\nStd Dev: ${result.stdDev}`;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result]);

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          Enter Numbers (comma, space, or newline separated)
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. 1, 2, 3, 4, 5"
          rows={3}
          className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none transition-all resize-none font-mono"
        />
      </div>

      {/* Quick Examples */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setInput('1, 2, 3, 4, 5, 6, 7, 8, 9, 10')}
          className="px-3 py-1.5 text-xs rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
        >
          1-10
        </button>
        <button
          onClick={() => setInput('85, 90, 78, 92, 88, 76, 95, 82')}
          className="px-3 py-1.5 text-xs rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
        >
          Test Scores
        </button>
        <button
          onClick={() => setInput('2, 4, 4, 4, 5, 5, 7, 9')}
          className="px-3 py-1.5 text-xs rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
        >
          With Mode
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Main Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-primary/10 text-center">
              <div className="text-xl font-bold gradient-text">{result.mean}</div>
              <div className="text-xs text-muted-foreground">Mean (Average)</div>
            </div>
            <div className="p-4 rounded-xl bg-primary/10 text-center">
              <div className="text-xl font-bold gradient-text">{result.median}</div>
              <div className="text-xs text-muted-foreground">Median</div>
            </div>
            <div className="p-4 rounded-xl bg-primary/10 text-center">
              <div className="text-xl font-bold gradient-text truncate" title={result.mode}>
                {result.mode}
              </div>
              <div className="text-xs text-muted-foreground">Mode</div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="p-4 rounded-xl bg-secondary/50">
            <h3 className="text-sm font-medium mb-3">Additional Statistics</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Count:</span>
                <span className="font-medium">{result.count}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sum:</span>
                <span className="font-medium">{result.sum}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Min:</span>
                <span className="font-medium">{result.min}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Max:</span>
                <span className="font-medium">{result.max}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Range:</span>
                <span className="font-medium">{result.range}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Variance:</span>
                <span className="font-medium">{result.variance}</span>
              </div>
              <div className="flex justify-between col-span-2">
                <span className="text-muted-foreground">Standard Deviation:</span>
                <span className="font-medium">{result.stdDev}</span>
              </div>
            </div>
          </div>

          {/* Sorted Data */}
          <div className="p-4 rounded-xl bg-secondary/30">
            <h3 className="text-sm font-medium mb-2">Sorted Data</h3>
            <div className="text-sm text-muted-foreground font-mono break-all">
              {result.sorted}
            </div>
          </div>
        </div>
      )}

      {!result && input && (
        <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-center">
          No valid numbers found. Please enter numeric values.
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
