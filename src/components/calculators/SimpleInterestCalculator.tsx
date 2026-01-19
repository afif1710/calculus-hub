import { useState, useMemo, useCallback } from 'react';
import { Copy, RotateCcw, Check } from 'lucide-react';

export function SimpleInterestCalculator() {
  const [principal, setPrincipal] = useState('10000');
  const [rate, setRate] = useState('5');
  const [time, setTime] = useState('3');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const t = parseFloat(time);

    if (isNaN(p) || isNaN(r) || isNaN(t) || p < 0 || r < 0 || t < 0) {
      return null;
    }

    const interest = (p * r * t) / 100;
    const total = p + interest;

    return { interest, total };
  }, [principal, rate, time]);

  const reset = useCallback(() => {
    setPrincipal('10000');
    setRate('5');
    setTime('3');
  }, []);

  const copyResult = useCallback(() => {
    if (result) {
      navigator.clipboard.writeText(
        `Principal: $${parseFloat(principal).toLocaleString()}\nRate: ${rate}%\nTime: ${time} years\nInterest: $${result.interest.toLocaleString(undefined, { maximumFractionDigits: 2 })}\nTotal: $${result.total.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result, principal, rate, time]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <label className="space-y-2">
          <span className="text-sm font-medium">Principal Amount ($)</span>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="Enter principal"
            min="0"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Interest Rate (% per year)</span>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="Enter rate"
            min="0"
            step="0.1"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Time Period (years)</span>
          <input
            type="number"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="Enter time"
            min="0"
            step="0.5"
          />
        </label>
      </div>

      {/* Results */}
      <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-3">
        <div className="text-sm text-muted-foreground">Formula: SI = P × R × T / 100</div>
        {result ? (
          <>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Simple Interest</span>
              <span className="text-xl font-bold text-primary">
                ${result.interest.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between items-center border-t border-border pt-3">
              <span className="text-muted-foreground">Total Amount</span>
              <span className="text-2xl font-bold gradient-text">
                ${result.total.toLocaleString(undefined, { maximumFractionDigits: 2 })}
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
