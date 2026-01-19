import { useState, useMemo, useCallback } from 'react';
import { Copy, RotateCcw, Check } from 'lucide-react';

export function ROICalculator() {
  const [initialInvestment, setInitialInvestment] = useState('10000');
  const [finalValue, setFinalValue] = useState('15000');
  const [years, setYears] = useState('3');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const initial = parseFloat(initialInvestment);
    const final = parseFloat(finalValue);
    const time = parseFloat(years);

    if (isNaN(initial) || isNaN(final) || isNaN(time) || initial <= 0 || final < 0 || time <= 0) {
      return null;
    }

    const gain = final - initial;
    const roi = (gain / initial) * 100;
    const annualizedROI = (Math.pow(final / initial, 1 / time) - 1) * 100;

    return {
      gain,
      roi,
      annualizedROI,
      isProfit: gain >= 0,
    };
  }, [initialInvestment, finalValue, years]);

  const reset = useCallback(() => {
    setInitialInvestment('10000');
    setFinalValue('15000');
    setYears('3');
  }, []);

  const copyResult = useCallback(() => {
    if (result) {
      navigator.clipboard.writeText(
        `Initial: $${parseFloat(initialInvestment).toLocaleString()}\nFinal: $${parseFloat(finalValue).toLocaleString()}\nPeriod: ${years} years\n${result.isProfit ? 'Gain' : 'Loss'}: $${Math.abs(result.gain).toLocaleString()}\nROI: ${result.roi.toFixed(2)}%\nAnnualized ROI: ${result.annualizedROI.toFixed(2)}%`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result, initialInvestment, finalValue, years]);

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid gap-4">
        <label className="space-y-2">
          <span className="text-sm font-medium">Initial Investment ($)</span>
          <input
            type="number"
            value={initialInvestment}
            onChange={(e) => setInitialInvestment(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="Enter initial investment"
            min="0"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Final Value ($)</span>
          <input
            type="number"
            value={finalValue}
            onChange={(e) => setFinalValue(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="Enter final value"
            min="0"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Investment Period (years)</span>
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="Enter years"
            min="0"
            step="0.5"
          />
        </label>
      </div>

      {/* Results */}
      <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-4">
        {result ? (
          <>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">
                {result.isProfit ? 'Total Gain' : 'Total Loss'}
              </span>
              <span className={`text-xl font-bold ${result.isProfit ? 'text-green-500' : 'text-red-500'}`}>
                {result.isProfit ? '+' : '-'}${Math.abs(result.gain).toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total ROI</span>
              <span className={`text-2xl font-bold ${result.isProfit ? 'text-green-500' : 'text-red-500'}`}>
                {result.roi >= 0 ? '+' : ''}{result.roi.toFixed(2)}%
              </span>
            </div>

            <div className="flex justify-between items-center border-t border-border pt-3">
              <span className="font-medium">Annualized ROI</span>
              <span className="text-xl font-bold gradient-text">
                {result.annualizedROI >= 0 ? '+' : ''}{result.annualizedROI.toFixed(2)}%
              </span>
            </div>

            <div className="text-xs text-muted-foreground text-center">
              CAGR (Compound Annual Growth Rate)
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
