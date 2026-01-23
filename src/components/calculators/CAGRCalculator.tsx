import { useState, useMemo, useCallback } from 'react';
import { Copy, RotateCcw, Check } from 'lucide-react';

export function CAGRCalculator() {
  const [startValue, setStartValue] = useState('10000');
  const [endValue, setEndValue] = useState('25000');
  const [years, setYears] = useState('5');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const start = parseFloat(startValue);
    const end = parseFloat(endValue);
    const n = parseFloat(years);

    if (isNaN(start) || isNaN(end) || isNaN(n) || start <= 0 || end <= 0 || n <= 0) {
      return null;
    }

    // CAGR = (End/Start)^(1/n) - 1
    const cagr = (Math.pow(end / start, 1 / n) - 1) * 100;
    const totalReturn = ((end - start) / start) * 100;
    const absoluteGain = end - start;

    return { cagr, totalReturn, absoluteGain };
  }, [startValue, endValue, years]);

  const reset = useCallback(() => {
    setStartValue('10000');
    setEndValue('25000');
    setYears('5');
  }, []);

  const copyResult = useCallback(() => {
    if (result) {
      const text = `Start Value: $${parseFloat(startValue).toLocaleString()}\nEnd Value: $${parseFloat(endValue).toLocaleString()}\nPeriod: ${years} years\nCAGR: ${result.cagr.toFixed(2)}%\nTotal Return: ${result.totalReturn.toFixed(2)}%`;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result, startValue, endValue, years]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <label className="space-y-2">
          <span className="text-sm font-medium">Starting Value ($)</span>
          <input
            type="number"
            value={startValue}
            onChange={(e) => setStartValue(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="Initial investment"
            min="0"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Ending Value ($)</span>
          <input
            type="number"
            value={endValue}
            onChange={(e) => setEndValue(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="Final value"
            min="0"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Number of Years</span>
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="Investment period"
            min="0"
            step="0.5"
          />
        </label>
      </div>

      {/* Results */}
      <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-3">
        <div className="text-sm text-muted-foreground">
          Formula: CAGR = (End/Start)^(1/n) - 1
        </div>
        {result ? (
          <>
            <div className="flex justify-between items-center border-t border-border pt-3">
              <span className="text-muted-foreground">CAGR</span>
              <span className={`text-2xl font-bold ${result.cagr >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {result.cagr >= 0 ? '+' : ''}{result.cagr.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Return</span>
              <span className={`text-lg font-medium ${result.totalReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {result.totalReturn >= 0 ? '+' : ''}{result.totalReturn.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between items-center border-t border-border pt-3">
              <span className="text-muted-foreground">Absolute Gain</span>
              <span className="text-lg font-bold gradient-text">
                ${result.absoluteGain.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
            </div>
          </>
        ) : (
          <div className="text-center text-muted-foreground py-2">
            Enter valid positive numbers
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
