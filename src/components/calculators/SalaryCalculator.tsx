import { useState, useMemo, useCallback } from 'react';
import { Copy, RotateCcw, Check } from 'lucide-react';

export function SalaryCalculator() {
  const [amount, setAmount] = useState('25');
  const [mode, setMode] = useState<'hourly' | 'annual'>('hourly');
  const [hoursPerWeek, setHoursPerWeek] = useState('40');
  const [weeksPerYear, setWeeksPerYear] = useState('52');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const amt = parseFloat(amount), hrs = parseFloat(hoursPerWeek), wks = parseFloat(weeksPerYear);
    if ([amt, hrs, wks].some(v => isNaN(v) || v <= 0)) return null;
    const hourlyRate = mode === 'hourly' ? amt : amt / (hrs * wks);
    const annualSalary = mode === 'annual' ? amt : amt * hrs * wks;
    const monthlySalary = annualSalary / 12;
    const biweekly = annualSalary / 26;
    const weekly = annualSalary / 52;
    const daily = annualSalary / (wks * 5);
    return { hourlyRate, annualSalary, monthlySalary, biweekly, weekly, daily };
  }, [amount, mode, hoursPerWeek, weeksPerYear]);

  const reset = useCallback(() => { setAmount('25'); setMode('hourly'); setHoursPerWeek('40'); setWeeksPerYear('52'); }, []);
  const copyResult = useCallback(() => { if (result) { navigator.clipboard.writeText(`Hourly: $${result.hourlyRate.toFixed(2)}\nAnnual: $${result.annualSalary.toLocaleString()}\nMonthly: $${result.monthlySalary.toFixed(2)}`); setCopied(true); setTimeout(() => setCopied(false), 2000); } }, [result]);

  return (
    <div className="space-y-6">
      <div className="flex gap-2 p-1 bg-secondary/50 rounded-xl">
        <button onClick={() => setMode('hourly')} className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'hourly' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}`}>Hourly → Annual</button>
        <button onClick={() => setMode('annual')} className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'annual' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}`}>Annual → Hourly</button>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <label className="space-y-1"><span className="text-xs font-medium">{mode === 'hourly' ? 'Hourly Rate ($)' : 'Annual Salary ($)'}</span><input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border focus:border-primary outline-none text-sm" min="0" /></label>
        <label className="space-y-1"><span className="text-xs font-medium">Hours/Week</span><input type="number" value={hoursPerWeek} onChange={(e) => setHoursPerWeek(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border focus:border-primary outline-none text-sm" min="1" /></label>
        <label className="space-y-1"><span className="text-xs font-medium">Weeks/Year</span><input type="number" value={weeksPerYear} onChange={(e) => setWeeksPerYear(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border focus:border-primary outline-none text-sm" min="1" max="52" /></label>
      </div>
      <div className="p-4 rounded-xl bg-secondary/30 border border-border">
        {result ? (<div className="grid grid-cols-2 gap-3 text-sm"><div className="text-center p-2 bg-secondary/50 rounded"><span className="text-muted-foreground block text-xs">Hourly</span><span className="font-bold text-primary">${result.hourlyRate.toFixed(2)}</span></div><div className="text-center p-2 bg-secondary/50 rounded"><span className="text-muted-foreground block text-xs">Daily</span><span className="font-bold">${result.daily.toFixed(2)}</span></div><div className="text-center p-2 bg-secondary/50 rounded"><span className="text-muted-foreground block text-xs">Weekly</span><span className="font-bold">${result.weekly.toFixed(2)}</span></div><div className="text-center p-2 bg-secondary/50 rounded"><span className="text-muted-foreground block text-xs">Bi-weekly</span><span className="font-bold">${result.biweekly.toFixed(2)}</span></div><div className="text-center p-2 bg-secondary/50 rounded"><span className="text-muted-foreground block text-xs">Monthly</span><span className="font-bold">${result.monthlySalary.toFixed(2)}</span></div><div className="text-center p-2 bg-secondary/50 rounded"><span className="text-muted-foreground block text-xs">Annual</span><span className="font-bold gradient-text">${result.annualSalary.toLocaleString()}</span></div></div>) : <span className="text-center block text-muted-foreground">Enter values</span>}
      </div>
      <div className="flex gap-3">
        <button onClick={reset} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"><RotateCcw className="w-4 h-4" />Reset</button>
        <button onClick={copyResult} disabled={!result} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50">{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}{copied ? 'Copied!' : 'Copy'}</button>
      </div>
    </div>
  );
}
