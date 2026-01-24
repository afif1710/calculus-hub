import { useState } from 'react';
import { RefreshCw, RotateCcw, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function MortgageRefinanceCalculator() {
  const [currentBalance, setCurrentBalance] = useState('');
  const [currentRate, setCurrentRate] = useState('');
  const [remainingTerm, setRemainingTerm] = useState('');
  const [newRate, setNewRate] = useState('');
  const [newTerm, setNewTerm] = useState('');
  const [refinanceCosts, setRefinanceCosts] = useState('');
  const [result, setResult] = useState<{
    oldPayment: number;
    newPayment: number;
    monthlySavings: number;
    breakEvenMonths: number;
    oldTotalInterest: number;
    newTotalInterest: number;
    lifetimeSavings: number;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const calculatePayment = (principal: number, annualRate: number, months: number): number => {
    if (annualRate === 0) return principal / months;
    const monthlyRate = annualRate / 100 / 12;
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
           (Math.pow(1 + monthlyRate, months) - 1);
  };

  const handleCalculate = () => {
    const balance = parseFloat(currentBalance);
    const oldRate = parseFloat(currentRate);
    const oldTermMonths = parseFloat(remainingTerm);
    const newRateVal = parseFloat(newRate);
    const newTermMonths = parseFloat(newTerm);
    const costs = parseFloat(refinanceCosts) || 0;

    if (isNaN(balance) || isNaN(oldRate) || isNaN(oldTermMonths) || 
        isNaN(newRateVal) || isNaN(newTermMonths) || 
        balance <= 0 || oldTermMonths <= 0 || newTermMonths <= 0) {
      toast.error('Please enter valid values');
      return;
    }

    const oldPayment = calculatePayment(balance, oldRate, oldTermMonths);
    const newPayment = calculatePayment(balance, newRateVal, newTermMonths);
    const monthlySavings = oldPayment - newPayment;

    const oldTotalPayment = oldPayment * oldTermMonths;
    const oldTotalInterest = oldTotalPayment - balance;

    const newTotalPayment = newPayment * newTermMonths;
    const newTotalInterest = newTotalPayment - balance;

    const lifetimeSavings = oldTotalInterest - newTotalInterest - costs;
    const breakEvenMonths = monthlySavings > 0 ? Math.ceil(costs / monthlySavings) : Infinity;

    setResult({
      oldPayment,
      newPayment,
      monthlySavings,
      breakEvenMonths,
      oldTotalInterest,
      newTotalInterest,
      lifetimeSavings,
    });
  };

  const handleReset = () => {
    setCurrentBalance('');
    setCurrentRate('');
    setRemainingTerm('');
    setNewRate('');
    setNewTerm('');
    setRefinanceCosts('');
    setResult(null);
  };

  const handleCopy = () => {
    if (!result) return;
    const text = `Old Payment: $${result.oldPayment.toFixed(2)}/mo
New Payment: $${result.newPayment.toFixed(2)}/mo
Monthly Savings: $${result.monthlySavings.toFixed(2)}
Break-Even: ${result.breakEvenMonths === Infinity ? 'N/A' : result.breakEvenMonths + ' months'}
Lifetime Interest Saved: $${result.lifetimeSavings.toFixed(2)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Result copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      <div className="p-4 rounded-xl bg-secondary/30 space-y-3">
        <span className="text-sm font-semibold text-foreground">Current Loan</span>
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-muted-foreground">Balance ($)</label>
            <input
              type="number"
              value={currentBalance}
              onChange={e => setCurrentBalance(e.target.value)}
              className="input-calc"
              placeholder="250000"
              min="0"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-muted-foreground">Rate (%)</label>
            <input
              type="number"
              value={currentRate}
              onChange={e => setCurrentRate(e.target.value)}
              className="input-calc"
              placeholder="6.5"
              min="0"
              step="0.1"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-muted-foreground">Remaining (months)</label>
            <input
              type="number"
              value={remainingTerm}
              onChange={e => setRemainingTerm(e.target.value)}
              className="input-calc"
              placeholder="300"
              min="1"
            />
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-secondary/30 space-y-3">
        <span className="text-sm font-semibold text-foreground">New Loan</span>
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-muted-foreground">New Rate (%)</label>
            <input
              type="number"
              value={newRate}
              onChange={e => setNewRate(e.target.value)}
              className="input-calc"
              placeholder="5.5"
              min="0"
              step="0.1"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-muted-foreground">New Term (months)</label>
            <input
              type="number"
              value={newTerm}
              onChange={e => setNewTerm(e.target.value)}
              className="input-calc"
              placeholder="360"
              min="1"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-muted-foreground">Closing Costs ($)</label>
            <input
              type="number"
              value={refinanceCosts}
              onChange={e => setRefinanceCosts(e.target.value)}
              className="input-calc"
              placeholder="5000"
              min="0"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={handleCalculate} className="flex-1">
          Analyze Refinance
        </Button>
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-secondary/50 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-lg bg-secondary/50">
                <span className="text-xs text-muted-foreground block mb-1">Old Payment</span>
                <span className="text-xl font-bold text-foreground">${result.oldPayment.toFixed(2)}</span>
                <span className="text-xs text-muted-foreground block">/month</span>
              </div>
              <div className="text-center p-3 rounded-lg bg-secondary/50">
                <span className="text-xs text-muted-foreground block mb-1">New Payment</span>
                <span className="text-xl font-bold text-foreground">${result.newPayment.toFixed(2)}</span>
                <span className="text-xs text-muted-foreground block">/month</span>
              </div>
            </div>

            <div className="pt-3 border-t border-border/50 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Monthly Savings</span>
                <span className={`font-semibold ${result.monthlySavings > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {result.monthlySavings > 0 ? '+' : ''}${result.monthlySavings.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Break-Even</span>
                <span className="font-semibold text-foreground">
                  {result.breakEvenMonths === Infinity ? 'N/A' : `${result.breakEvenMonths} months`}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Lifetime Interest Saved</span>
                <span className={`font-bold text-lg ${result.lifetimeSavings > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {result.lifetimeSavings > 0 ? '+' : ''}${result.lifetimeSavings.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <Button variant="secondary" onClick={handleCopy} className="w-full">
            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            {copied ? 'Copied!' : 'Copy Result'}
          </Button>
        </div>
      )}

      <div className="p-4 rounded-xl bg-secondary/30 flex items-center gap-3">
        <RefreshCw className="w-5 h-5 text-primary" />
        <span className="text-sm text-muted-foreground">
          Compare your current mortgage with a refinance option to see potential savings.
        </span>
      </div>
    </div>
  );
}
