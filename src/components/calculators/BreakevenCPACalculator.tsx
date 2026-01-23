import { useState, useMemo, useCallback } from 'react';
import { Copy, RotateCcw, Check } from 'lucide-react';

export function BreakevenCPACalculator() {
  const [aov, setAov] = useState('100');
  const [margin, setMargin] = useState('30');
  const [conversionRate, setConversionRate] = useState('');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const aovVal = parseFloat(aov);
    const marginVal = parseFloat(margin);
    const crVal = conversionRate ? parseFloat(conversionRate) : null;

    if (isNaN(aovVal) || isNaN(marginVal) || aovVal <= 0 || marginVal <= 0 || marginVal > 100) {
      return null;
    }

    // Break-even CPA = AOV × Gross Margin %
    const breakevenCPA = aovVal * (marginVal / 100);
    
    // If conversion rate provided, calculate max CPC
    let maxCPC = null;
    if (crVal && crVal > 0 && crVal <= 100) {
      // Max CPC = Break-even CPA × (Conversion Rate / 100)
      maxCPC = breakevenCPA * (crVal / 100);
    }

    // Calculate profit at different CPA levels
    const profitAtHalfCPA = breakevenCPA / 2;
    const profitPerSale = aovVal * (marginVal / 100);

    return { breakevenCPA, maxCPC, profitAtHalfCPA, profitPerSale, grossProfit: profitPerSale };
  }, [aov, margin, conversionRate]);

  const reset = useCallback(() => {
    setAov('100');
    setMargin('30');
    setConversionRate('');
  }, []);

  const copyResult = useCallback(() => {
    if (result) {
      let text = `AOV: $${aov}\nGross Margin: ${margin}%\nBreak-even CPA: $${result.breakevenCPA.toFixed(2)}`;
      if (result.maxCPC) {
        text += `\nMax CPC (at ${conversionRate}% CR): $${result.maxCPC.toFixed(2)}`;
      }
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result, aov, margin, conversionRate]);

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground p-3 bg-secondary/20 rounded-lg">
        Break-even CPA = AOV × Gross Margin %
      </div>

      <div className="grid gap-4">
        <label className="space-y-2">
          <span className="text-sm font-medium">Average Order Value ($)</span>
          <input
            type="number"
            value={aov}
            onChange={(e) => setAov(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="AOV"
            min="0"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Gross Margin (%)</span>
          <input
            type="number"
            value={margin}
            onChange={(e) => setMargin(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="Profit margin"
            min="0"
            max="100"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Conversion Rate (%) <span className="text-muted-foreground">— optional</span></span>
          <input
            type="number"
            value={conversionRate}
            onChange={(e) => setConversionRate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="To calculate max CPC"
            min="0"
            max="100"
            step="0.1"
          />
        </label>
      </div>

      {/* Results */}
      <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-3">
        {result ? (
          <>
            <div className="text-center">
              <span className="text-sm text-muted-foreground block">Break-even CPA</span>
              <span className="text-3xl font-bold gradient-text">
                ${result.breakevenCPA.toFixed(2)}
              </span>
              <span className="text-xs text-muted-foreground block mt-1">
                Maximum you can spend per acquisition
              </span>
            </div>

            {result.maxCPC && (
              <div className="text-center border-t border-border pt-3">
                <span className="text-sm text-muted-foreground block">Max CPC at {conversionRate}% CR</span>
                <span className="text-xl font-bold text-primary">
                  ${result.maxCPC.toFixed(2)}
                </span>
              </div>
            )}

            <div className="border-t border-border pt-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Gross Profit per Sale</span>
                <span className="font-medium text-green-500">${result.grossProfit.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-muted-foreground">Target CPA (50% margin)</span>
                <span className="font-medium">${result.profitAtHalfCPA.toFixed(2)}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center text-muted-foreground py-2">
            Enter valid AOV and margin
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
