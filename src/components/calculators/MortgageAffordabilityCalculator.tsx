import { useState, useMemo, useCallback } from 'react';
import { Copy, RotateCcw, Check } from 'lucide-react';

export function MortgageAffordabilityCalculator() {
  const [annualIncome, setAnnualIncome] = useState('80000');
  const [monthlyDebts, setMonthlyDebts] = useState('500');
  const [interestRate, setInterestRate] = useState('7');
  const [loanTerm, setLoanTerm] = useState('30');
  const [dtiTarget, setDtiTarget] = useState('36');
  const [downPaymentPercent, setDownPaymentPercent] = useState('20');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const income = parseFloat(annualIncome);
    const debts = parseFloat(monthlyDebts);
    const rate = parseFloat(interestRate) / 100 / 12;
    const term = parseFloat(loanTerm) * 12;
    const dti = parseFloat(dtiTarget) / 100;
    const downPct = parseFloat(downPaymentPercent) / 100;

    if ([income, debts, rate, term, dti, downPct].some(v => isNaN(v)) || 
        income <= 0 || dti <= 0 || dti > 1 || downPct >= 1) {
      return null;
    }

    const monthlyIncome = income / 12;
    
    // Max total debt payment = income × DTI target
    const maxTotalDebtPayment = monthlyIncome * dti;
    
    // Available for mortgage = max total - existing debts
    const availableForMortgage = Math.max(0, maxTotalDebtPayment - debts);
    
    if (availableForMortgage <= 0) {
      return { error: 'Existing debts exceed DTI limit' };
    }

    // Calculate max loan from payment
    // Payment = Loan × [r(1+r)^n] / [(1+r)^n - 1]
    // Loan = Payment × [(1+r)^n - 1] / [r(1+r)^n]
    const factor = (Math.pow(1 + rate, term) - 1) / (rate * Math.pow(1 + rate, term));
    const maxLoan = availableForMortgage * factor;
    
    // Max home price = loan / (1 - down payment %)
    const maxHomePrice = maxLoan / (1 - downPct);
    const downPaymentAmount = maxHomePrice * downPct;
    
    // Current DTI calculation
    const currentDTI = (debts / monthlyIncome) * 100;

    return {
      maxHomePrice,
      maxLoan,
      downPaymentAmount,
      monthlyPayment: availableForMortgage,
      monthlyIncome,
      currentDTI,
      targetDTI: dti * 100
    };
  }, [annualIncome, monthlyDebts, interestRate, loanTerm, dtiTarget, downPaymentPercent]);

  const reset = useCallback(() => {
    setAnnualIncome('80000');
    setMonthlyDebts('500');
    setInterestRate('7');
    setLoanTerm('30');
    setDtiTarget('36');
    setDownPaymentPercent('20');
  }, []);

  const copyResult = useCallback(() => {
    if (result && !('error' in result)) {
      const text = `Mortgage Affordability\nAnnual Income: $${parseFloat(annualIncome).toLocaleString()}\nMax Home Price: $${result.maxHomePrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}\nMax Loan: $${result.maxLoan.toLocaleString(undefined, { maximumFractionDigits: 0 })}\nDown Payment: $${result.downPaymentAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}\nMonthly Payment: $${result.monthlyPayment.toFixed(0)}`;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result, annualIncome]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        <label className="space-y-1">
          <span className="text-xs font-medium">Annual Income ($)</span>
          <input type="number" value={annualIncome} onChange={(e) => setAnnualIncome(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border focus:border-primary outline-none text-sm" min="0" />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-medium">Monthly Debts ($)</span>
          <input type="number" value={monthlyDebts} onChange={(e) => setMonthlyDebts(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border focus:border-primary outline-none text-sm" min="0" />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-medium">Interest Rate (%)</span>
          <input type="number" value={interestRate} onChange={(e) => setInterestRate(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border focus:border-primary outline-none text-sm" min="0" step="0.125" />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-medium">Loan Term (years)</span>
          <input type="number" value={loanTerm} onChange={(e) => setLoanTerm(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border focus:border-primary outline-none text-sm" min="1" max="30" />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-medium">Target DTI (%)</span>
          <input type="number" value={dtiTarget} onChange={(e) => setDtiTarget(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border focus:border-primary outline-none text-sm" min="1" max="50" />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-medium">Down Payment (%)</span>
          <input type="number" value={downPaymentPercent} onChange={(e) => setDownPaymentPercent(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border focus:border-primary outline-none text-sm" min="0" max="99" />
        </label>
      </div>

      {/* Results */}
      <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-3">
        {result ? (
          'error' in result ? (
            <div className="text-center text-amber-500 py-2">{result.error}</div>
          ) : (
            <>
              <div className="text-center">
                <span className="text-sm text-muted-foreground block">Maximum Home Price</span>
                <span className="text-3xl font-bold gradient-text">
                  ${result.maxHomePrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-border pt-3">
                <div className="text-center">
                  <span className="text-xs text-muted-foreground block">Max Loan Amount</span>
                  <span className="text-lg font-bold text-primary">
                    ${result.maxLoan.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-xs text-muted-foreground block">Down Payment</span>
                  <span className="text-lg font-bold">
                    ${result.downPaymentAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>

              <div className="border-t border-border pt-3 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monthly Payment</span>
                  <span className="font-medium">${result.monthlyPayment.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current DTI</span>
                  <span className={result.currentDTI > result.targetDTI ? 'text-red-500' : 'text-green-500'}>
                    {result.currentDTI.toFixed(1)}%
                  </span>
                </div>
              </div>
            </>
          )
        ) : (
          <div className="text-center text-muted-foreground py-2">
            Enter valid values
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button onClick={reset} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors">
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
        <button onClick={copyResult} disabled={!result || (result && 'error' in result)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50">
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy Result'}
        </button>
      </div>
    </div>
  );
}
