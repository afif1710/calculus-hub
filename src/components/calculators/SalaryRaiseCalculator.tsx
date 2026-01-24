import { useState } from 'react';
import { TrendingUp, RotateCcw, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function SalaryRaiseCalculator() {
  const [currentSalary, setCurrentSalary] = useState('');
  const [raisePercent, setRaisePercent] = useState('');
  const [bonus, setBonus] = useState('');
  const [taxPercent, setTaxPercent] = useState('');
  const [result, setResult] = useState<{
    newSalary: number;
    monthlyDiff: number;
    yearlyDiff: number;
    afterTaxNew?: number;
    afterTaxDiff?: number;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCalculate = () => {
    const current = parseFloat(currentSalary);
    const raise = parseFloat(raisePercent);
    const bonusAmount = parseFloat(bonus) || 0;
    const tax = parseFloat(taxPercent);

    if (isNaN(current) || isNaN(raise) || current <= 0) {
      toast.error('Please enter valid salary and raise percentage');
      return;
    }

    const raiseAmount = current * (raise / 100);
    const newSalary = current + raiseAmount + bonusAmount;
    const yearlyDiff = newSalary - current;
    const monthlyDiff = yearlyDiff / 12;

    const resultData: typeof result = {
      newSalary,
      monthlyDiff,
      yearlyDiff,
    };

    if (!isNaN(tax) && tax >= 0) {
      const oldAfterTax = current * (1 - tax / 100);
      const newAfterTax = newSalary * (1 - tax / 100);
      resultData.afterTaxNew = newAfterTax;
      resultData.afterTaxDiff = newAfterTax - oldAfterTax;
    }

    setResult(resultData);
  };

  const handleReset = () => {
    setCurrentSalary('');
    setRaisePercent('');
    setBonus('');
    setTaxPercent('');
    setResult(null);
  };

  const handleCopy = () => {
    if (!result) return;
    let text = `New Salary: $${result.newSalary.toLocaleString(undefined, { maximumFractionDigits: 2 })}\nYearly Difference: $${result.yearlyDiff.toLocaleString(undefined, { maximumFractionDigits: 2 })}\nMonthly Difference: $${result.monthlyDiff.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
    if (result.afterTaxNew !== undefined) {
      text += `\nAfter-Tax Salary: $${result.afterTaxNew.toLocaleString(undefined, { maximumFractionDigits: 2 })}\nAfter-Tax Difference: $${result.afterTaxDiff?.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
    }
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Result copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-muted-foreground">Current Annual Salary ($)</label>
          <input
            type="number"
            value={currentSalary}
            onChange={e => setCurrentSalary(e.target.value)}
            className="input-calc"
            placeholder="75000"
            min="0"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-muted-foreground">Raise (%)</label>
          <input
            type="number"
            value={raisePercent}
            onChange={e => setRaisePercent(e.target.value)}
            className="input-calc"
            placeholder="5"
            min="0"
            step="0.1"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-muted-foreground">Bonus ($) <span className="text-xs">(optional)</span></label>
          <input
            type="number"
            value={bonus}
            onChange={e => setBonus(e.target.value)}
            className="input-calc"
            placeholder="0"
            min="0"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-muted-foreground">Tax Rate (%) <span className="text-xs">(optional)</span></label>
          <input
            type="number"
            value={taxPercent}
            onChange={e => setTaxPercent(e.target.value)}
            className="input-calc"
            placeholder="25"
            min="0"
            max="100"
            step="0.1"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={handleCalculate} className="flex-1">
          Calculate Impact
        </Button>
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-secondary/50 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">New Annual Salary</span>
              <span className="text-2xl font-bold gradient-text">
                ${result.newSalary.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/50">
              <div>
                <span className="text-sm text-muted-foreground block">Yearly Increase</span>
                <span className="text-lg font-semibold text-green-400">
                  +${result.yearlyDiff.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
              </div>
              <div>
                <span className="text-sm text-muted-foreground block">Monthly Increase</span>
                <span className="text-lg font-semibold text-green-400">
                  +${result.monthlyDiff.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {result.afterTaxNew !== undefined && (
              <div className="pt-3 border-t border-border/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground">After-Tax Annual</span>
                  <span className="text-lg font-semibold text-foreground">
                    ${result.afterTaxNew.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">After-Tax Difference</span>
                  <span className="font-medium text-green-400">
                    +${result.afterTaxDiff?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            )}
          </div>

          <Button variant="secondary" onClick={handleCopy} className="w-full">
            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            {copied ? 'Copied!' : 'Copy Result'}
          </Button>
        </div>
      )}

      <div className="p-4 rounded-xl bg-secondary/30 flex items-center gap-3">
        <TrendingUp className="w-5 h-5 text-primary" />
        <span className="text-sm text-muted-foreground">
          Calculate the impact of a salary raise including optional bonus and tax considerations.
        </span>
      </div>
    </div>
  );
}
