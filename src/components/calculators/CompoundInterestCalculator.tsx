import { useState, useMemo } from 'react';
import { TrendingUp } from 'lucide-react';

export function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(7);
  const [time, setTime] = useState(10);
  const [frequency, setFrequency] = useState(12);
  const [contribution, setContribution] = useState(100);

  const result = useMemo(() => {
    const P = Number(principal);
    const r = Number(rate) / 100;
    const t = Number(time);
    const n = Number(frequency);
    const PMT = Number(contribution);

    // Future value with compound interest and periodic contributions
    const compoundFactor = Math.pow(1 + r / n, n * t);
    const futureValue = P * compoundFactor + PMT * ((compoundFactor - 1) / (r / n));
    
    const totalContributions = P + PMT * n * t;
    const totalInterest = futureValue - totalContributions;

    // Build yearly breakdown
    const yearly: { year: number; balance: number; interest: number }[] = [];
    let balance = P;
    
    for (let y = 1; y <= t; y++) {
      const yearStart = balance;
      balance = balance * Math.pow(1 + r / n, n) + PMT * ((Math.pow(1 + r / n, n) - 1) / (r / n));
      yearly.push({
        year: y,
        balance: Number(balance.toFixed(2)),
        interest: Number((balance - yearStart - PMT * n).toFixed(2))
      });
    }

    return {
      futureValue: Number(futureValue.toFixed(2)),
      totalContributions: Number(totalContributions.toFixed(2)),
      totalInterest: Number(totalInterest.toFixed(2)),
      yearly
    };
  }, [principal, rate, time, frequency, contribution]);

  const formatCurrency = (n: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-muted-foreground">Initial Investment</span>
          <input
            value={principal}
            onChange={e => setPrincipal(Number(e.target.value))}
            className="input-calc"
            type="number"
            min="0"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-muted-foreground">Annual Interest Rate (%)</span>
          <input
            value={rate}
            onChange={e => setRate(Number(e.target.value))}
            className="input-calc"
            type="number"
            step="0.1"
            min="0"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-muted-foreground">Time Period (years)</span>
          <input
            value={time}
            onChange={e => setTime(Number(e.target.value))}
            className="input-calc"
            type="number"
            min="1"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-muted-foreground">Compound Frequency</span>
          <select
            value={frequency}
            onChange={e => setFrequency(Number(e.target.value))}
            className="input-calc"
          >
            <option value={1}>Annually</option>
            <option value={4}>Quarterly</option>
            <option value={12}>Monthly</option>
            <option value={365}>Daily</option>
          </select>
        </label>
        <label className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-2">
          <span className="text-sm font-medium text-muted-foreground">Monthly Contribution</span>
          <input
            value={contribution}
            onChange={e => setContribution(Number(e.target.value))}
            className="input-calc"
            type="number"
            min="0"
          />
        </label>
      </div>

      <div className="p-5 rounded-xl bg-secondary/30 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Future Value</div>
            <div className="text-3xl font-bold gradient-text">{formatCurrency(result.futureValue)}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <div>
            <div className="text-sm text-muted-foreground">Total Contributions</div>
            <div className="text-lg font-semibold">{formatCurrency(result.totalContributions)}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Total Interest Earned</div>
            <div className="text-lg font-semibold text-green-500">{formatCurrency(result.totalInterest)}</div>
          </div>
        </div>

        {/* Simple bar chart visualization */}
        <div className="pt-4 border-t border-border">
          <div className="h-4 rounded-full bg-card overflow-hidden flex">
            <div
              className="bg-muted-foreground h-full"
              style={{ width: `${(result.totalContributions / result.futureValue) * 100}%` }}
              title="Contributions"
            />
            <div
              className="bg-primary h-full"
              style={{ width: `${(result.totalInterest / result.futureValue) * 100}%` }}
              title="Interest"
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Contributions ({((result.totalContributions / result.futureValue) * 100).toFixed(0)}%)</span>
            <span>Interest ({((result.totalInterest / result.futureValue) * 100).toFixed(0)}%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
