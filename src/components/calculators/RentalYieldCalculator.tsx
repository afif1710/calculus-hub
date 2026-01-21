import { useState, useMemo, useCallback } from 'react';
import { Copy, RotateCcw, Check, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function RentalYieldCalculator() {
  const [purchasePrice, setPurchasePrice] = useState('');
  const [monthlyRent, setMonthlyRent] = useState('');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const price = parseFloat(purchasePrice);
    const rent = parseFloat(monthlyRent);

    if (isNaN(price) || isNaN(rent) || price <= 0 || rent < 0) {
      return null;
    }

    const annualRent = rent * 12;
    const rentalYield = (annualRent / price) * 100;

    return {
      annualRent,
      rentalYield,
      isGood: rentalYield >= 5,
    };
  }, [purchasePrice, monthlyRent]);

  const reset = useCallback(() => {
    setPurchasePrice('');
    setMonthlyRent('');
  }, []);

  const copyResult = useCallback(() => {
    if (result) {
      navigator.clipboard.writeText(
        `Rental Yield: ${result.rentalYield.toFixed(2)}%\nAnnual Rent: $${result.annualRent.toLocaleString()}\nPurchase Price: $${parseFloat(purchasePrice).toLocaleString()}\nMonthly Rent: $${parseFloat(monthlyRent).toLocaleString()}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result, purchasePrice, monthlyRent]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="purchasePrice">Purchase Price ($)</Label>
          <Input
            id="purchasePrice"
            type="number"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(e.target.value)}
            placeholder="Enter property purchase price"
            min="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="monthlyRent">Monthly Rent ($)</Label>
          <Input
            id="monthlyRent"
            type="number"
            value={monthlyRent}
            onChange={(e) => setMonthlyRent(e.target.value)}
            placeholder="Enter monthly rental income"
            min="0"
          />
        </div>
      </div>

      {/* Results */}
      <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-4">
        {result ? (
          <>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Annual Rental Income</span>
              <span className="text-xl font-bold">
                ${result.annualRent.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-medium flex items-center gap-2">
                <Home className="w-4 h-4" />
                Rental Yield
              </span>
              <span className={`text-2xl font-bold ${result.isGood ? 'text-green-500' : 'text-yellow-500'}`}>
                {result.rentalYield.toFixed(2)}%
              </span>
            </div>

            <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
              {result.isGood ? '✓ Good yield (≥5%)' : 'Below typical target yield (<5%)'}
            </div>
          </>
        ) : (
          <div className="text-center text-muted-foreground py-2">
            Enter values to calculate rental yield
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="secondary" onClick={reset} className="flex-1">
          <RotateCcw className="w-4 h-4 mr-2" />
          Clear
        </Button>
        <Button onClick={copyResult} disabled={!result} className="flex-1">
          {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
          {copied ? 'Copied!' : 'Copy Result'}
        </Button>
      </div>
    </div>
  );
}
