import { useState, useMemo, useCallback } from 'react';
import { Copy, RotateCcw, Check } from 'lucide-react';

export function CreditCardPayoffCalculator() {
  const [balance, setBalance] = useState('5000');
  const [apr, setApr] = useState('19.99');
  const [payment, setPayment] = useState('200');
  const [useMinimum, setUseMinimum] = useState(false);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const bal = parseFloat(balance);
    const annualRate = parseFloat(apr) / 100;
    let monthlyPayment = parseFloat(payment);

    if (isNaN(bal) || isNaN(annualRate) || bal <= 0 || annualRate < 0) {
      return null;
    }

    const monthlyRate = annualRate / 12;

    // Calculate minimum payment (typically 1-3% of balance or $25, whichever is higher)
    const minimumPayment = Math.max(25, bal * 0.02);
    
    if (useMinimum) {
      monthlyPayment = minimumPayment;
    }

    if (isNaN(monthlyPayment) || monthlyPayment <= 0) {
      return null;
    }

    // Check if payment covers at least the interest
    const monthlyInterest = bal * monthlyRate;
    if (monthlyPayment <= monthlyInterest) {
      return { 
        error: true, 
        message: `Payment must be > $${monthlyInterest.toFixed(2)}/mo to cover interest`,
        minimumPayment
      };
    }

    // Calculate payoff time
    let remainingBalance = bal;
    let months = 0;
    let totalInterest = 0;
    const maxMonths = 600; // 50 years max

    while (remainingBalance > 0.01 && months < maxMonths) {
      const interest = remainingBalance * monthlyRate;
      totalInterest += interest;
      remainingBalance = remainingBalance + interest - monthlyPayment;
      months++;
      
      if (remainingBalance < 0) remainingBalance = 0;
    }

    if (months >= maxMonths) {
      return { 
        error: true, 
        message: 'Would take over 50 years to pay off',
        minimumPayment
      };
    }

    const totalPaid = bal + totalInterest;
    const yearsToPayoff = Math.floor(months / 12);
    const remainingMonths = months % 12;

    return { 
      months, 
      totalInterest, 
      totalPaid, 
      yearsToPayoff, 
      remainingMonths,
      monthlyPayment,
      minimumPayment,
      error: false
    };
  }, [balance, apr, payment, useMinimum]);

  const reset = useCallback(() => {
    setBalance('5000');
    setApr('19.99');
    setPayment('200');
    setUseMinimum(false);
  }, []);

  const copyResult = useCallback(() => {
    if (result && !result.error) {
      const text = `Balance: $${parseFloat(balance).toLocaleString()}\nAPR: ${apr}%\nMonthly Payment: $${result.monthlyPayment.toFixed(2)}\nPayoff Time: ${result.yearsToPayoff}y ${result.remainingMonths}m\nTotal Interest: $${result.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 2 })}\nTotal Paid: $${result.totalPaid.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result, balance, apr]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <label className="space-y-2">
          <span className="text-sm font-medium">Credit Card Balance ($)</span>
          <input
            type="number"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="Current balance"
            min="0"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">APR (%)</span>
          <input
            type="number"
            value={apr}
            onChange={(e) => setApr(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="Annual percentage rate"
            min="0"
            step="0.01"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Monthly Payment ($)</span>
          <input
            type="number"
            value={payment}
            onChange={(e) => { setPayment(e.target.value); setUseMinimum(false); }}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="Monthly payment"
            min="0"
            disabled={useMinimum}
          />
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={useMinimum}
            onChange={(e) => setUseMinimum(e.target.checked)}
            className="w-4 h-4 rounded border-border"
          />
          <span className="text-sm">
            Use minimum payment (~2% or $25)
            {result && !result.error && (
              <span className="text-muted-foreground"> ≈ ${result.minimumPayment.toFixed(2)}</span>
            )}
          </span>
        </label>
      </div>

      {/* Results */}
      <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-3">
        {result ? (
          result.error ? (
            <div className="text-center text-amber-500 py-2">
              {result.message}
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Payoff Time</span>
                <span className="text-2xl font-bold gradient-text">
                  {result.yearsToPayoff > 0 && `${result.yearsToPayoff}y `}{result.remainingMonths}m
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Monthly Payment</span>
                <span className="text-lg font-medium text-primary">
                  ${result.monthlyPayment.toFixed(2)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-border pt-3">
                <div className="text-center">
                  <span className="text-xs text-muted-foreground block">Total Interest</span>
                  <span className="text-lg font-medium text-red-500">
                    ${result.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-xs text-muted-foreground block">Total Paid</span>
                  <span className="text-lg font-medium">
                    ${result.totalPaid.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>
            </>
          )
        ) : (
          <div className="text-center text-muted-foreground py-2">
            Enter valid payment details
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
          disabled={!result || result.error}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy Result'}
        </button>
      </div>
    </div>
  );
}
