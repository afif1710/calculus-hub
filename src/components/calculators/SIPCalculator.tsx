import { useState, useMemo, useCallback } from 'react';
import { Copy, RotateCcw, Check } from 'lucide-react';

export function SIPCalculator() {
  const [monthlyAmount, setMonthlyAmount] = useState('500');
  const [annualReturn, setAnnualReturn] = useState('12');
  const [years, setYears] = useState('10');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const P = parseFloat(monthlyAmount);
    const r = parseFloat(annualReturn) / 100 / 12; // Monthly rate
    const n = parseFloat(years) * 12; // Total months

    if (isNaN(P) || isNaN(r) || isNaN(n) || P <= 0 || n <= 0 || parseFloat(annualReturn) < 0) {
      return null;
    }

    // FV = P * [((1+r)^n - 1) / r] * (1+r)
    const totalInvested = P * n;
    let futureValue: number;

    if (r === 0) {
      futureValue = totalInvested;
    } else {
      futureValue = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    }

    const estimatedGains = futureValue - totalInvested;
    const effectiveReturn = ((futureValue / totalInvested) - 1) * 100;

    return { 
      totalInvested, 
      futureValue, 
      estimatedGains, 
      effectiveReturn,
      months: n
    };
  }, [monthlyAmount, annualReturn, years]);

  const reset = useCallback(() => {
    setMonthlyAmount('500');
    setAnnualReturn('12');
    setYears('10');
  }, []);

  const copyResult = useCallback(() => {
    if (result) {
      const text = `Monthly Investment: $${parseFloat(monthlyAmount).toLocaleString()}\nAnnual Return: ${annualReturn}%\nPeriod: ${years} years\nTotal Invested: $${result.totalInvested.toLocaleString()}\nEstimated Value: $${result.futureValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}\nEstimated Gains: $${result.estimatedGains.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result, monthlyAmount, annualReturn, years]);

  // Calculate percentage for visualization
  const investedPercent = result ? (result.totalInvested / result.futureValue) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <label className="space-y-2">
          <span className="text-sm font-medium">Monthly Investment ($)</span>
          <input
            type="number"
            value={monthlyAmount}
            onChange={(e) => setMonthlyAmount(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="Monthly amount"
            min="0"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Expected Annual Return (%)</span>
          <input
            type="number"
            value={annualReturn}
            onChange={(e) => setAnnualReturn(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="Annual return"
            min="0"
            step="0.5"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Investment Period (Years)</span>
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="Years"
            min="1"
            max="50"
          />
        </label>
      </div>

      {/* Results */}
      <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-4">
        {result ? (
          <>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Estimated Value</span>
              <span className="text-2xl font-bold gradient-text">
                ${result.futureValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </div>

            {/* Visual breakdown */}
            <div className="space-y-2">
              <div className="h-4 rounded-full bg-secondary overflow-hidden flex">
                <div 
                  className="h-full bg-blue-500" 
                  style={{ width: `${investedPercent}%` }}
                />
                <div 
                  className="h-full bg-green-500" 
                  style={{ width: `${100 - investedPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-xs">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded bg-blue-500" />
                  Invested ({investedPercent.toFixed(0)}%)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded bg-green-500" />
                  Gains ({(100 - investedPercent).toFixed(0)}%)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-border pt-3">
              <div>
                <span className="text-xs text-muted-foreground block">Total Invested</span>
                <span className="text-lg font-medium text-blue-500">
                  ${result.totalInvested.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Estimated Gains</span>
                <span className="text-lg font-medium text-green-500">
                  ${result.estimatedGains.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>

            <div className="text-xs text-muted-foreground text-center border-t border-border pt-2">
              {result.months} monthly contributions • {result.effectiveReturn.toFixed(1)}% total return
            </div>
          </>
        ) : (
          <div className="text-center text-muted-foreground py-2">
            Enter valid investment details
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
