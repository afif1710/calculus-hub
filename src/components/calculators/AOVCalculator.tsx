import { useState, useMemo, useCallback } from 'react';
import { Copy, RotateCcw, Check, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function AOVCalculator() {
  const [totalRevenue, setTotalRevenue] = useState('');
  const [totalOrders, setTotalOrders] = useState('');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const revenue = parseFloat(totalRevenue);
    const orders = parseFloat(totalOrders);

    if (isNaN(revenue) || isNaN(orders) || revenue < 0 || orders <= 0) {
      return null;
    }

    const aov = revenue / orders;

    return { aov };
  }, [totalRevenue, totalOrders]);

  const reset = useCallback(() => {
    setTotalRevenue('');
    setTotalOrders('');
  }, []);

  const copyResult = useCallback(() => {
    if (result) {
      navigator.clipboard.writeText(
        `Average Order Value: $${result.aov.toFixed(2)}\nTotal Revenue: $${parseFloat(totalRevenue).toLocaleString()}\nTotal Orders: ${parseFloat(totalOrders).toLocaleString()}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result, totalRevenue, totalOrders]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="totalRevenue">Total Revenue ($)</Label>
          <Input
            id="totalRevenue"
            type="number"
            value={totalRevenue}
            onChange={(e) => setTotalRevenue(e.target.value)}
            placeholder="Total revenue from all orders"
            min="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="totalOrders">Total Orders</Label>
          <Input
            id="totalOrders"
            type="number"
            value={totalOrders}
            onChange={(e) => setTotalOrders(e.target.value)}
            placeholder="Total number of orders"
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
                <ShoppingBag className="w-4 h-4" />
                Average Order Value
              </span>
              <span className="text-2xl font-bold text-primary">
                ${result.aov.toFixed(2)}
              </span>
            </div>

            <div className="text-sm text-muted-foreground text-center border-t border-border pt-3">
              On average, each customer spends ${result.aov.toFixed(2)} per order
            </div>
          </>
        ) : (
          <div className="text-center text-muted-foreground py-2">
            Enter values to calculate average order value
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
