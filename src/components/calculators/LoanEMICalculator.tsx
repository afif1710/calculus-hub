import { useState, useMemo, useCallback } from 'react';
import { Copy, RotateCcw, Check } from 'lucide-react';

export function LoanEMICalculator() {
  const [principal, setPrincipal] = useState('100000');
  const [rate, setRate] = useState('8.5');
  const [months, setMonths] = useState('60');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const p = parseFloat(principal);
    const annualRate = parseFloat(rate);
    const n = parseInt(months);

    if (isNaN(p) || isNaN(annualRate) || isNaN(n) || p <= 0 || annualRate < 0 || n <= 0) {
      return null;
    }

    const r = annualRate / 100 / 12; // Monthly interest rate

    let emi: number;
    if (r === 0) {
      emi = p / n;
    } else {
      emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }

    const totalPayment = emi * n;
    const totalInterest = totalPayment - p;

    return {
      emi,
      totalPayment,
      totalInterest,
      principalPercentage: (p / totalPayment) * 100,
      interestPercentage: (totalInterest / totalPayment) * 100,
    };
  }, [principal, rate, months]);

  const reset = useCallback(() => {
    setPrincipal('100000');
    setRate('8.5');
    setMonths('60');
  }, []);

  const copyResult = useCallback(() => {
    if (result) {
      navigator.clipboard.writeText(
        `Loan Amount: $${parseFloat(principal).toLocaleString()}\nInterest Rate: ${rate}% p.a.\nTenure: ${months} months\nMonthly EMI: $${result.emi.toFixed(2)}\nTotal Interest: $${result.totalInterest.toFixed(2)}\nTotal Payment: $${result.totalPayment.toFixed(2)}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result, principal, rate, months]);

  const quickTerms = [12, 24, 36, 48, 60, 84, 120];

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid gap-4">
        <label className="space-y-2">
          <span className="text-sm font-medium">Loan Amount ($)</span>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="Enter loan amount"
            min="0"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Interest Rate (% per annum)</span>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="Enter interest rate"
            min="0"
            step="0.1"
          />
        </label>

        <div className="space-y-2">
          <span className="text-sm font-medium">Loan Tenure (months)</span>
          <input
            type="number"
            value={months}
            onChange={(e) => setMonths(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="Enter months"
            min="1"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {quickTerms.map((term) => (
              <button
                key={term}
                onClick={() => setMonths(term.toString())}
                className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                  months === term.toString()
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary/50 hover:bg-secondary'
                }`}
              >
                {term}mo
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-4">
        {result ? (
          <>
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">Monthly EMI</div>
              <div className="text-3xl font-bold gradient-text">
                ${result.emi.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            {/* Visual breakdown */}
            <div className="h-3 rounded-full overflow-hidden bg-secondary flex">
              <div
                className="bg-primary transition-all"
                style={{ width: `${result.principalPercentage}%` }}
              />
              <div
                className="bg-orange-500 transition-all"
                style={{ width: `${result.interestPercentage}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-muted-foreground">Principal</span>
                <span className="ml-auto font-medium">${parseFloat(principal).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <span className="text-muted-foreground">Interest</span>
                <span className="ml-auto font-medium">${result.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-border pt-3">
              <span className="font-medium">Total Payment</span>
              <span className="text-xl font-bold">
                ${result.totalPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
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
