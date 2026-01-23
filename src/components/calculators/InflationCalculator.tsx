import { useState, useMemo, useCallback } from 'react';
import { Copy, RotateCcw, Check } from 'lucide-react';

type Mode = 'future' | 'present';

export function InflationCalculator() {
  const [mode, setMode] = useState<Mode>('future');
  const [amount, setAmount] = useState('1000');
  const [inflationRate, setInflationRate] = useState('3');
  const [years, setYears] = useState('10');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const amt = parseFloat(amount);
    const rate = parseFloat(inflationRate) / 100;
    const n = parseFloat(years);

    if (isNaN(amt) || isNaN(rate) || isNaN(n) || amt < 0 || n < 0) {
      return null;
    }

    let futureValue: number;
    let presentValue: number;
    let purchasingPowerLoss: number;

    if (mode === 'future') {
      // What will $X be worth in the future (less purchasing power)
      presentValue = amt;
      futureValue = amt * Math.pow(1 + rate, n); // Nominal value needed
      purchasingPowerLoss = ((futureValue - presentValue) / futureValue) * 100;
    } else {
      // What is $X in the future worth today
      futureValue = amt;
      presentValue = amt / Math.pow(1 + rate, n);
      purchasingPowerLoss = ((futureValue - presentValue) / futureValue) * 100;
    }

    const totalInflation = (Math.pow(1 + rate, n) - 1) * 100;

    return { futureValue, presentValue, purchasingPowerLoss, totalInflation };
  }, [amount, inflationRate, years, mode]);

  const reset = useCallback(() => {
    setAmount('1000');
    setInflationRate('3');
    setYears('10');
  }, []);

  const copyResult = useCallback(() => {
    if (result) {
      const text = mode === 'future'
        ? `Present Value: $${parseFloat(amount).toLocaleString()}\nInflation Rate: ${inflationRate}%\nPeriod: ${years} years\nFuture Equivalent Needed: $${result.futureValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}\nPurchasing Power Loss: ${result.purchasingPowerLoss.toFixed(1)}%`
        : `Future Amount: $${parseFloat(amount).toLocaleString()}\nInflation Rate: ${inflationRate}%\nPeriod: ${years} years\nPresent Value: $${result.presentValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result, amount, inflationRate, years, mode]);

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <div className="flex gap-2 p-1 bg-secondary/50 rounded-xl">
        <button
          onClick={() => setMode('future')}
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'future' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
          }`}
        >
          Future Value
        </button>
        <button
          onClick={() => setMode('present')}
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'present' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
          }`}
        >
          Present Value
        </button>
      </div>

      <div className="grid gap-4">
        <label className="space-y-2">
          <span className="text-sm font-medium">
            {mode === 'future' ? 'Current Amount ($)' : 'Future Amount ($)'}
          </span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="Amount"
            min="0"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Annual Inflation Rate (%)</span>
          <input
            type="number"
            value={inflationRate}
            onChange={(e) => setInflationRate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="Inflation rate"
            min="0"
            step="0.1"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Time Period (Years)</span>
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="Years"
            min="0"
          />
        </label>
      </div>

      {/* Results */}
      <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-3">
        {result ? (
          <>
            {mode === 'future' ? (
              <>
                <div className="text-center space-y-1">
                  <span className="text-sm text-muted-foreground block">
                    To have the same purchasing power as ${parseFloat(amount).toLocaleString()} today, you'll need:
                  </span>
                  <span className="text-3xl font-bold gradient-text">
                    ${result.futureValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </span>
                  <span className="text-sm text-muted-foreground block">
                    in {years} years
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="text-center space-y-1">
                  <span className="text-sm text-muted-foreground block">
                    ${parseFloat(amount).toLocaleString()} in {years} years is worth:
                  </span>
                  <span className="text-3xl font-bold gradient-text">
                    ${result.presentValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </span>
                  <span className="text-sm text-muted-foreground block">
                    in today's dollars
                  </span>
                </div>
              </>
            )}

            <div className="grid grid-cols-2 gap-4 border-t border-border pt-3 text-center">
              <div>
                <span className="text-xs text-muted-foreground block">Total Inflation</span>
                <span className="text-lg font-medium text-amber-500">
                  +{result.totalInflation.toFixed(1)}%
                </span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Purchasing Power Loss</span>
                <span className="text-lg font-medium text-red-500">
                  -{result.purchasingPowerLoss.toFixed(1)}%
                </span>
              </div>
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
