import { useState, useMemo } from 'react';
import { Download } from 'lucide-react';

function formatNum(n: number) {
  return Number(n).toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export function MortgageCalculator() {
  const [principal, setPrincipal] = useState(300000);
  const [annualRate, setAnnualRate] = useState(7.5);
  const [years, setYears] = useState(20);
  const [extraMonthly, setExtraMonthly] = useState(0);

  const result = useMemo(() => {
    const P = Number(principal);
    const r = Number(annualRate) / 100 / 12;
    const n = Number(years) * 12;
    
    if (r === 0) {
      const emi = P / n;
      return { emi, totalInterest: 0, totalPayment: P, schedule: [] };
    }
    
    const emi = (P * r) / (1 - Math.pow(1 + r, -n));
    const schedule: { month: number; interest: number; principalPaid: number; balance: number }[] = [];
    let balance = P;
    let totalInterest = 0;
    
    for (let i = 1; i <= n; i++) {
      const interest = balance * r;
      totalInterest += interest;
      const principalPaid = Math.min(balance, emi - interest + Number(extraMonthly));
      balance = Math.max(0, balance - principalPaid);
      schedule.push({
        month: i,
        interest: Number(interest.toFixed(2)),
        principalPaid: Number(principalPaid.toFixed(2)),
        balance: Number(balance.toFixed(2))
      });
      if (balance <= 0) break;
    }
    
    return {
      emi: Number(emi.toFixed(2)),
      totalInterest: Number(totalInterest.toFixed(2)),
      totalPayment: Number((P + totalInterest).toFixed(2)),
      schedule
    };
  }, [principal, annualRate, years, extraMonthly]);

  function downloadCSV() {
    const rows = [
      ['Month', 'Interest', 'Principal Paid', 'Balance'],
      ...result.schedule.map(s => [s.month, s.interest, s.principalPaid, s.balance])
    ];
    const csvContent = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mortgage_amortization.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-muted-foreground">Loan Amount ($)</span>
          <input
            value={principal}
            onChange={e => setPrincipal(Number(e.target.value))}
            className="input-calc"
            type="number"
            min="0"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-muted-foreground">Annual Rate (%)</span>
          <input
            value={annualRate}
            onChange={e => setAnnualRate(Number(e.target.value))}
            className="input-calc"
            type="number"
            step="0.01"
            min="0"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-muted-foreground">Term (years)</span>
          <input
            value={years}
            onChange={e => setYears(Number(e.target.value))}
            className="input-calc"
            type="number"
            min="1"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-muted-foreground">Extra Monthly Payment</span>
          <input
            value={extraMonthly}
            onChange={e => setExtraMonthly(Number(e.target.value))}
            className="input-calc"
            type="number"
            min="0"
          />
        </label>
      </div>

      <div className="p-5 rounded-xl bg-secondary/30 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Monthly EMI</div>
            <div className="text-3xl font-bold gradient-text">${formatNum(result.emi)}</div>
          </div>
          <button onClick={downloadCSV} className="btn-calc flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download Schedule
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <div>
            <div className="text-sm text-muted-foreground">Total Interest</div>
            <div className="text-lg font-semibold">${formatNum(result.totalInterest)}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Total Payment</div>
            <div className="text-lg font-semibold">${formatNum(result.totalPayment)}</div>
          </div>
        </div>

        {result.schedule.length > 0 && (
          <details className="pt-4 border-t border-border">
            <summary className="cursor-pointer text-sm font-medium text-primary hover:underline">
              View first 12 months
            </summary>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
              {result.schedule.slice(0, 12).map(row => (
                <div key={row.month} className="p-3 rounded-lg bg-card text-sm">
                  <div className="font-medium">Month {row.month}</div>
                  <div className="text-muted-foreground">
                    Balance: ${formatNum(row.balance)} • Principal: ${formatNum(row.principalPaid)}
                  </div>
                </div>
              ))}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}
