import { useState, useMemo, useCallback } from 'react';
import { Copy, RotateCcw, Check } from 'lucide-react';

export function RentVsBuyCalculator() {
  const [monthlyRent, setMonthlyRent] = useState('2000');
  const [rentGrowth, setRentGrowth] = useState('3');
  const [homePrice, setHomePrice] = useState('400000');
  const [downPayment, setDownPayment] = useState('20');
  const [mortgageRate, setMortgageRate] = useState('7');
  const [years, setYears] = useState('10');
  const [maintenance, setMaintenance] = useState('1');
  const [propertyTax, setPropertyTax] = useState('1.2');
  const [appreciation, setAppreciation] = useState('3');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const rent = parseFloat(monthlyRent);
    const rentGr = parseFloat(rentGrowth) / 100;
    const price = parseFloat(homePrice);
    const downPct = parseFloat(downPayment) / 100;
    const rate = parseFloat(mortgageRate) / 100 / 12;
    const n = parseFloat(years);
    const maintPct = parseFloat(maintenance) / 100;
    const taxPct = parseFloat(propertyTax) / 100;
    const appreciationRate = parseFloat(appreciation) / 100;

    if ([rent, rentGr, price, downPct, rate, n, maintPct, taxPct, appreciationRate].some(v => isNaN(v)) || 
        rent <= 0 || price <= 0 || n <= 0) {
      return null;
    }

    const downPaymentAmount = price * downPct;
    const loanAmount = price - downPaymentAmount;
    const totalPayments = n * 12;
    
    // Monthly mortgage payment
    const monthlyMortgage = loanAmount * (rate * Math.pow(1 + rate, totalPayments)) / (Math.pow(1 + rate, totalPayments) - 1);
    
    // Calculate totals over the period
    let totalRent = 0;
    let currentRent = rent;
    for (let year = 0; year < n; year++) {
      totalRent += currentRent * 12;
      currentRent *= (1 + rentGr);
    }

    const totalMortgagePayments = monthlyMortgage * totalPayments;
    const totalMaintenance = price * maintPct * n;
    const totalPropertyTax = price * taxPct * n;
    const totalBuyingCost = downPaymentAmount + totalMortgagePayments + totalMaintenance + totalPropertyTax;
    
    // Home value after appreciation
    const futureHomeValue = price * Math.pow(1 + appreciationRate, n);
    const equity = futureHomeValue;
    
    // Net cost of buying (cost - equity gained)
    const netBuyingCost = totalBuyingCost - (futureHomeValue - price);

    const monthlyCostRent = totalRent / (n * 12);
    const monthlyCostBuy = totalBuyingCost / (n * 12);

    const recommendation = netBuyingCost < totalRent ? 'buy' : 'rent';
    const savings = Math.abs(netBuyingCost - totalRent);

    return {
      totalRent,
      totalBuyingCost,
      netBuyingCost,
      futureHomeValue,
      downPaymentAmount,
      monthlyMortgage,
      monthlyCostRent,
      monthlyCostBuy,
      recommendation,
      savings,
      equity: futureHomeValue - loanAmount
    };
  }, [monthlyRent, rentGrowth, homePrice, downPayment, mortgageRate, years, maintenance, propertyTax, appreciation]);

  const reset = useCallback(() => {
    setMonthlyRent('2000');
    setRentGrowth('3');
    setHomePrice('400000');
    setDownPayment('20');
    setMortgageRate('7');
    setYears('10');
    setMaintenance('1');
    setPropertyTax('1.2');
    setAppreciation('3');
  }, []);

  const copyResult = useCallback(() => {
    if (result) {
      const text = `Rent vs Buy Analysis (${years} years)\nTotal Rent Cost: $${result.totalRent.toLocaleString(undefined, { maximumFractionDigits: 0 })}\nNet Buying Cost: $${result.netBuyingCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}\nRecommendation: ${result.recommendation.toUpperCase()}\nPotential Savings: $${result.savings.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result, years]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        <label className="space-y-1">
          <span className="text-xs font-medium">Monthly Rent ($)</span>
          <input type="number" value={monthlyRent} onChange={(e) => setMonthlyRent(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border focus:border-primary outline-none text-sm" min="0" />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-medium">Rent Growth (%/yr)</span>
          <input type="number" value={rentGrowth} onChange={(e) => setRentGrowth(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border focus:border-primary outline-none text-sm" min="0" step="0.5" />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-medium">Home Price ($)</span>
          <input type="number" value={homePrice} onChange={(e) => setHomePrice(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border focus:border-primary outline-none text-sm" min="0" />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-medium">Down Payment (%)</span>
          <input type="number" value={downPayment} onChange={(e) => setDownPayment(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border focus:border-primary outline-none text-sm" min="0" max="100" />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-medium">Mortgage Rate (%)</span>
          <input type="number" value={mortgageRate} onChange={(e) => setMortgageRate(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border focus:border-primary outline-none text-sm" min="0" step="0.125" />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-medium">Years to Compare</span>
          <input type="number" value={years} onChange={(e) => setYears(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border focus:border-primary outline-none text-sm" min="1" max="30" />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-medium">Maintenance (%/yr)</span>
          <input type="number" value={maintenance} onChange={(e) => setMaintenance(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border focus:border-primary outline-none text-sm" min="0" step="0.1" />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-medium">Property Tax (%/yr)</span>
          <input type="number" value={propertyTax} onChange={(e) => setPropertyTax(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border focus:border-primary outline-none text-sm" min="0" step="0.1" />
        </label>
        <label className="col-span-2 space-y-1">
          <span className="text-xs font-medium">Home Appreciation (%/yr)</span>
          <input type="number" value={appreciation} onChange={(e) => setAppreciation(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border focus:border-primary outline-none text-sm" min="0" step="0.5" />
        </label>
      </div>

      {/* Results */}
      <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-3">
        {result ? (
          <>
            <div className={`text-center p-3 rounded-lg ${result.recommendation === 'buy' ? 'bg-green-500/20' : 'bg-blue-500/20'}`}>
              <span className="text-sm text-muted-foreground block">Recommendation</span>
              <span className={`text-2xl font-bold ${result.recommendation === 'buy' ? 'text-green-500' : 'text-blue-500'}`}>
                {result.recommendation === 'buy' ? '🏠 BUY' : '🏢 RENT'}
              </span>
              <span className="text-sm text-muted-foreground block">
                Save ~${result.savings.toLocaleString(undefined, { maximumFractionDigits: 0 })} over {years} years
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-border pt-3">
              <div className="text-center">
                <span className="text-xs text-muted-foreground block">Total Rent Cost</span>
                <span className="text-lg font-bold text-blue-500">
                  ${result.totalRent.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="text-center">
                <span className="text-xs text-muted-foreground block">Net Buying Cost</span>
                <span className="text-lg font-bold text-green-500">
                  ${result.netBuyingCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>

            <div className="text-xs text-muted-foreground border-t border-border pt-2 space-y-1">
              <div className="flex justify-between">
                <span>Monthly Mortgage</span>
                <span>${result.monthlyMortgage.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Home Value in {years}yr</span>
                <span>${result.futureHomeValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
            </div>
          </>
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
        <button onClick={copyResult} disabled={!result}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50">
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy Result'}
        </button>
      </div>
    </div>
  );
}
