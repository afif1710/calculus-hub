import { useState, useMemo, useCallback } from 'react';
import { Copy, RotateCcw, Check } from 'lucide-react';

export function TakeHomePayCalculator() {
  const [grossSalary, setGrossSalary] = useState('60000');
  const [taxRate, setTaxRate] = useState('22');
  const [deductions, setDeductions] = useState('500');
  const [frequency, setFrequency] = useState<'annual' | 'monthly'>('annual');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const gross = parseFloat(grossSalary), tax = parseFloat(taxRate) / 100, ded = parseFloat(deductions) || 0;
    if (isNaN(gross) || isNaN(tax) || gross <= 0 || tax < 0 || tax > 1) return null;
    const annualGross = frequency === 'annual' ? gross : gross * 12;
    const annualDeductions = frequency === 'annual' ? ded : ded * 12;
    const taxableIncome = Math.max(0, annualGross - annualDeductions);
    const taxAmount = taxableIncome * tax;
    const netAnnual = annualGross - taxAmount - annualDeductions;
    return { grossAnnual: annualGross, taxAmount, deductionsAnnual: annualDeductions, netAnnual, netMonthly: netAnnual / 12, netBiweekly: netAnnual / 26, effectiveRate: (taxAmount / annualGross) * 100 };
  }, [grossSalary, taxRate, deductions, frequency]);

  const reset = useCallback(() => { setGrossSalary('60000'); setTaxRate('22'); setDeductions('500'); }, []);
  const copyResult = useCallback(() => { if (result) { navigator.clipboard.writeText(`Gross: $${result.grossAnnual.toLocaleString()}\nTax: $${result.taxAmount.toFixed(2)}\nNet Annual: $${result.netAnnual.toFixed(2)}\nNet Monthly: $${result.netMonthly.toFixed(2)}`); setCopied(true); setTimeout(() => setCopied(false), 2000); } }, [result]);

  return (
    <div className="space-y-6">
      <div className="flex gap-2 p-1 bg-secondary/50 rounded-xl">
        <button onClick={() => setFrequency('annual')} className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${frequency === 'annual' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}`}>Annual</button>
        <button onClick={() => setFrequency('monthly')} className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${frequency === 'monthly' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}`}>Monthly</button>
      </div>
      <div className="grid gap-3">
        <label className="space-y-1"><span className="text-xs font-medium">Gross Salary ($/{frequency})</span><input type="number" value={grossSalary} onChange={(e) => setGrossSalary(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border focus:border-primary outline-none text-sm" min="0" /></label>
        <div className="grid grid-cols-2 gap-3">
          <label className="space-y-1"><span className="text-xs font-medium">Tax Rate (%)</span><input type="number" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border focus:border-primary outline-none text-sm" min="0" max="100" /></label>
          <label className="space-y-1"><span className="text-xs font-medium">Deductions ($/{frequency})</span><input type="number" value={deductions} onChange={(e) => setDeductions(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border focus:border-primary outline-none text-sm" min="0" /></label>
        </div>
      </div>
      <div className="p-4 rounded-xl bg-secondary/30 border border-border">
        {result ? (<><div className="text-center mb-3"><span className="text-sm text-muted-foreground">Take-Home Pay (Annual)</span><div className="text-3xl font-bold gradient-text">${result.netAnnual.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div></div><div className="grid grid-cols-2 gap-2 text-sm"><div className="p-2 bg-secondary/50 rounded text-center"><span className="text-muted-foreground text-xs">Monthly</span><div className="font-bold">${result.netMonthly.toFixed(0)}</div></div><div className="p-2 bg-secondary/50 rounded text-center"><span className="text-muted-foreground text-xs">Bi-weekly</span><div className="font-bold">${result.netBiweekly.toFixed(0)}</div></div><div className="p-2 bg-secondary/50 rounded text-center"><span className="text-muted-foreground text-xs">Tax Paid</span><div className="font-bold text-red-500">${result.taxAmount.toFixed(0)}</div></div><div className="p-2 bg-secondary/50 rounded text-center"><span className="text-muted-foreground text-xs">Eff. Rate</span><div className="font-bold">{result.effectiveRate.toFixed(1)}%</div></div></div></>) : <span className="text-center block text-muted-foreground">Enter salary details</span>}
      </div>
      <div className="flex gap-3">
        <button onClick={reset} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"><RotateCcw className="w-4 h-4" />Reset</button>
        <button onClick={copyResult} disabled={!result} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50">{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}{copied ? 'Copied!' : 'Copy'}</button>
      </div>
    </div>
  );
}
