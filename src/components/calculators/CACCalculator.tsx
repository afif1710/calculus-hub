import { useState, useMemo, useCallback } from 'react';
import { Copy, RotateCcw, Check, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function CACCalculator() {
  const [marketingSpend, setMarketingSpend] = useState('');
  const [customersAcquired, setCustomersAcquired] = useState('');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const spend = parseFloat(marketingSpend);
    const customers = parseFloat(customersAcquired);

    if (isNaN(spend) || isNaN(customers) || spend < 0 || customers <= 0) {
      return null;
    }

    const cac = spend / customers;

    return { cac };
  }, [marketingSpend, customersAcquired]);

  const reset = useCallback(() => {
    setMarketingSpend('');
    setCustomersAcquired('');
  }, []);

  const copyResult = useCallback(() => {
    if (result) {
      navigator.clipboard.writeText(
        `Customer Acquisition Cost: $${result.cac.toFixed(2)}\nTotal Marketing Spend: $${parseFloat(marketingSpend).toLocaleString()}\nNew Customers: ${parseFloat(customersAcquired).toLocaleString()}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result, marketingSpend, customersAcquired]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="marketingSpend">Total Marketing Spend ($)</Label>
          <Input
            id="marketingSpend"
            type="number"
            value={marketingSpend}
            onChange={(e) => setMarketingSpend(e.target.value)}
            placeholder="Total amount spent on marketing"
            min="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="customersAcquired">New Customers Acquired</Label>
          <Input
            id="customersAcquired"
            type="number"
            value={customersAcquired}
            onChange={(e) => setCustomersAcquired(e.target.value)}
            placeholder="Number of new customers gained"
            min="1"
          />
        </div>
      </div>

      {/* Results */}
      <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-4">
        {result ? (
          <>
            <div className="flex justify-between items-center">
              <span className="font-medium flex items-center gap-2">
                <Users className="w-4 h-4" />
                Cost per Customer
              </span>
              <span className="text-2xl font-bold text-primary">
                ${result.cac.toFixed(2)}
              </span>
            </div>

            <div className="text-sm text-muted-foreground text-center border-t border-border pt-3">
              You spend ${result.cac.toFixed(2)} to acquire each new customer
            </div>
          </>
        ) : (
          <div className="text-center text-muted-foreground py-2">
            Enter values to calculate customer acquisition cost
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
