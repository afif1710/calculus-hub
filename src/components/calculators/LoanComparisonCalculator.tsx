import { useState } from 'react';
import { Scale, RotateCcw, Copy, Check, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Loan {
  id: number;
  principal: string;
  rate: string;
  termMonths: string;
  fees: string;
}

interface LoanResult {
  emi: number;
  totalInterest: number;
  totalCost: number;
}

export function LoanComparisonCalculator() {
  const [loans, setLoans] = useState<Loan[]>([
    { id: 1, principal: '', rate: '', termMonths: '', fees: '' },
    { id: 2, principal: '', rate: '', termMonths: '', fees: '' },
  ]);
  const [results, setResults] = useState<(LoanResult | null)[]>([]);
  const [copied, setCopied] = useState(false);

  const calculateEMI = (principal: number, annualRate: number, months: number): number => {
    if (annualRate === 0) return principal / months;
    const monthlyRate = annualRate / 100 / 12;
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
           (Math.pow(1 + monthlyRate, months) - 1);
  };

  const handleCalculate = () => {
    const newResults = loans.map(loan => {
      const principal = parseFloat(loan.principal);
      const rate = parseFloat(loan.rate);
      const months = parseFloat(loan.termMonths);
      const fees = parseFloat(loan.fees) || 0;

      if (isNaN(principal) || isNaN(rate) || isNaN(months) || principal <= 0 || months <= 0) {
        return null;
      }

      const emi = calculateEMI(principal, rate, months);
      const totalPayment = emi * months;
      const totalInterest = totalPayment - principal;
      const totalCost = totalPayment + fees;

      return { emi, totalInterest, totalCost };
    });

    setResults(newResults);
  };

  const handleReset = () => {
    setLoans([
      { id: 1, principal: '', rate: '', termMonths: '', fees: '' },
      { id: 2, principal: '', rate: '', termMonths: '', fees: '' },
    ]);
    setResults([]);
  };

  const addLoan = () => {
    if (loans.length < 4) {
      setLoans([...loans, { id: Date.now(), principal: '', rate: '', termMonths: '', fees: '' }]);
    }
  };

  const removeLoan = (id: number) => {
    if (loans.length > 2) {
      setLoans(loans.filter(l => l.id !== id));
      setResults([]);
    }
  };

  const updateLoan = (id: number, field: keyof Loan, value: string) => {
    setLoans(loans.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const getCheapestIndex = (): number => {
    let minCost = Infinity;
    let minIndex = -1;
    results.forEach((r, i) => {
      if (r && r.totalCost < minCost) {
        minCost = r.totalCost;
        minIndex = i;
      }
    });
    return minIndex;
  };

  const handleCopy = () => {
    const cheapestIdx = getCheapestIndex();
    const text = results.map((r, i) => 
      r ? `Loan ${i + 1}: EMI $${r.emi.toFixed(2)}, Total Interest $${r.totalInterest.toFixed(2)}, Total Cost $${r.totalCost.toFixed(2)}${i === cheapestIdx ? ' (CHEAPEST)' : ''}` : ''
    ).filter(Boolean).join('\n');
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Results copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const cheapestIdx = getCheapestIndex();
  const hasValidResults = results.some(r => r !== null);

  return (
    <div className="space-y-5">
      <div className="space-y-4">
        {loans.map((loan, index) => (
          <div key={loan.id} className="p-4 rounded-xl bg-secondary/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">Loan {index + 1}</span>
              {loans.length > 2 && (
                <Button variant="ghost" size="sm" onClick={() => removeLoan(loan.id)}>
                  <Trash2 className="w-4 h-4 text-muted-foreground" />
                </Button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-muted-foreground">Principal ($)</label>
                <input
                  type="number"
                  value={loan.principal}
                  onChange={e => updateLoan(loan.id, 'principal', e.target.value)}
                  className="input-calc"
                  placeholder="100000"
                  min="0"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-muted-foreground">Interest Rate (%)</label>
                <input
                  type="number"
                  value={loan.rate}
                  onChange={e => updateLoan(loan.id, 'rate', e.target.value)}
                  className="input-calc"
                  placeholder="6.5"
                  min="0"
                  step="0.1"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-muted-foreground">Term (months)</label>
                <input
                  type="number"
                  value={loan.termMonths}
                  onChange={e => updateLoan(loan.id, 'termMonths', e.target.value)}
                  className="input-calc"
                  placeholder="360"
                  min="1"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-muted-foreground">Fees ($)</label>
                <input
                  type="number"
                  value={loan.fees}
                  onChange={e => updateLoan(loan.id, 'fees', e.target.value)}
                  className="input-calc"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {loans.length < 4 && (
        <Button variant="outline" onClick={addLoan} className="w-full">
          <Plus className="w-4 h-4 mr-2" /> Add Loan
        </Button>
      )}

      <div className="flex gap-3">
        <Button onClick={handleCalculate} className="flex-1">
          Compare Loans
        </Button>
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {hasValidResults && (
        <div className="space-y-3">
          {results.map((result, index) => result && (
            <div 
              key={index} 
              className={`p-4 rounded-xl ${index === cheapestIdx ? 'bg-green-500/20 border border-green-500/50' : 'bg-secondary/50'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-foreground">Loan {index + 1}</span>
                {index === cheapestIdx && (
                  <span className="text-xs px-2 py-1 bg-green-500/30 text-green-400 rounded-full font-medium">
                    CHEAPEST
                  </span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground block">Monthly EMI</span>
                  <span className="text-foreground font-medium">${result.emi.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Total Interest</span>
                  <span className="text-foreground font-medium">${result.totalInterest.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Total Cost</span>
                  <span className="text-foreground font-medium">${result.totalCost.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}

          <Button variant="secondary" onClick={handleCopy} className="w-full">
            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            {copied ? 'Copied!' : 'Copy Results'}
          </Button>
        </div>
      )}

      <div className="p-4 rounded-xl bg-secondary/30 flex items-center gap-3">
        <Scale className="w-5 h-5 text-primary" />
        <span className="text-sm text-muted-foreground">
          Compare up to 4 loans to find the cheapest option based on total cost including fees.
        </span>
      </div>
    </div>
  );
}
