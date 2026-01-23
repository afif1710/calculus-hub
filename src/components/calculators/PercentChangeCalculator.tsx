import { useState, useMemo, useCallback } from 'react';
import { Copy, RotateCcw, Check } from 'lucide-react';

type Mode = 'increase' | 'decrease' | 'difference';

export function PercentChangeCalculator() {
  const [mode, setMode] = useState<Mode>('increase');
  const [oldValue, setOldValue] = useState('100');
  const [newValue, setNewValue] = useState('125');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const oldVal = parseFloat(oldValue);
    const newVal = parseFloat(newValue);

    if (isNaN(oldVal) || isNaN(newVal)) return null;

    if (mode === 'difference') {
      // Percent difference: |v1 - v2| / ((v1 + v2) / 2) * 100
      const avg = (Math.abs(oldVal) + Math.abs(newVal)) / 2;
      if (avg === 0) return null;
      const diff = Math.abs(oldVal - newVal);
      const percentDiff = (diff / avg) * 100;
      return { 
        change: percentDiff, 
        absoluteChange: diff,
        label: 'Percent Difference'
      };
    } else {
      // Percent increase/decrease
      if (oldVal === 0) return null;
      const change = ((newVal - oldVal) / Math.abs(oldVal)) * 100;
      return { 
        change, 
        absoluteChange: newVal - oldVal,
        label: change >= 0 ? 'Percent Increase' : 'Percent Decrease'
      };
    }
  }, [oldValue, newValue, mode]);

  const reset = useCallback(() => {
    setOldValue('100');
    setNewValue('125');
  }, []);

  const copyResult = useCallback(() => {
    if (result) {
      const text = `${mode === 'difference' ? 'Value 1' : 'Old Value'}: ${oldValue}\n${mode === 'difference' ? 'Value 2' : 'New Value'}: ${newValue}\n${result.label}: ${Math.abs(result.change).toFixed(2)}%\nAbsolute Change: ${result.absoluteChange.toFixed(2)}`;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result, oldValue, newValue, mode]);

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <div className="flex gap-2 p-1 bg-secondary/50 rounded-xl">
        <button
          onClick={() => setMode('increase')}
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'increase' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
          }`}
        >
          Increase
        </button>
        <button
          onClick={() => setMode('decrease')}
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'decrease' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
          }`}
        >
          Decrease
        </button>
        <button
          onClick={() => setMode('difference')}
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'difference' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
          }`}
        >
          Difference
        </button>
      </div>

      <div className="grid gap-4">
        <label className="space-y-2">
          <span className="text-sm font-medium">
            {mode === 'difference' ? 'Value 1' : 'Old Value'}
          </span>
          <input
            type="number"
            value={oldValue}
            onChange={(e) => setOldValue(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="Enter value"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">
            {mode === 'difference' ? 'Value 2' : 'New Value'}
          </span>
          <input
            type="number"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="Enter value"
          />
        </label>
      </div>

      {/* Results */}
      <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-3">
        {result ? (
          <>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">{result.label}</span>
              <span className={`text-2xl font-bold ${
                mode === 'difference' 
                  ? 'text-primary' 
                  : result.change >= 0 
                    ? 'text-green-500' 
                    : 'text-red-500'
              }`}>
                {mode !== 'difference' && (result.change >= 0 ? '+' : '')}
                {result.change.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between items-center border-t border-border pt-3">
              <span className="text-muted-foreground">Absolute Change</span>
              <span className="text-lg font-medium">
                {mode !== 'difference' && result.absoluteChange >= 0 ? '+' : ''}
                {result.absoluteChange.toFixed(2)}
              </span>
            </div>
          </>
        ) : (
          <div className="text-center text-muted-foreground py-2">
            Enter valid numbers
          </div>
        )}
      </div>

      {/* Formulas */}
      <div className="text-xs text-muted-foreground p-3 bg-secondary/20 rounded-lg">
        {mode === 'difference' ? (
          <span>Formula: |V₁ - V₂| / ((V₁ + V₂) / 2) × 100</span>
        ) : (
          <span>Formula: ((New - Old) / |Old|) × 100</span>
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
