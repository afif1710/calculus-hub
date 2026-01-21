import { useState, useMemo, useCallback } from 'react';
import { Copy, RotateCcw, Check, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function ProfitMarginCalculator() {
  const [cost, setCost] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const costNum = parseFloat(cost);
    const priceNum = parseFloat(sellingPrice);

    if (isNaN(costNum) || isNaN(priceNum) || priceNum <= 0 || costNum < 0) {
      return null;
    }

    const profit = priceNum - costNum;
    const profitMargin = (profit / priceNum) * 100;
    const markup = costNum > 0 ? (profit / costNum) * 100 : 0;

    return {
      profit,
      profitMargin,
      markup,
      isProfitable: profit > 0,
    };
  }, [cost, sellingPrice]);

  const reset = useCallback(() => {
    setCost('');
    setSellingPrice('');
  }, []);

  const copyResult = useCallback(() => {
    if (result) {
      navigator.clipboard.writeText(
        `Profit Margin: ${result.profitMargin.toFixed(2)}%\nProfit: $${result.profit.toFixed(2)}\nMarkup: ${result.markup.toFixed(2)}%\nCost: $${parseFloat(cost).toLocaleString()}\nSelling Price: $${parseFloat(sellingPrice).toLocaleString()}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result, cost, sellingPrice]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="cost">Cost ($)</Label>
          <Input
            id="cost"
            type="number"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            placeholder="Cost to produce or acquire"
            min="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sellingPrice">Selling Price ($)</Label>
          <Input
            id="sellingPrice"
            type="number"
            value={sellingPrice}
            onChange={(e) => setSellingPrice(e.target.value)}
            placeholder="Price sold to customer"
            min="0"
          />
        </div>
      </div>

      {/* Results */}
      <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-4">
        {result ? (
          <>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Profit per Unit</span>
              <span className={`text-xl font-bold ${result.isProfitable ? 'text-green-500' : 'text-red-500'}`}>
                {result.isProfitable ? '+' : ''}${result.profit.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Profit Margin
              </span>
              <span className={`text-2xl font-bold ${result.isProfitable ? 'text-green-500' : 'text-red-500'}`}>
                {result.profitMargin.toFixed(2)}%
              </span>
            </div>

            <div className="flex justify-between items-center border-t border-border pt-3">
              <span className="text-muted-foreground">Markup</span>
              <span className="text-lg font-semibold">
                {result.markup.toFixed(2)}%
              </span>
            </div>
          </>
        ) : (
          <div className="text-center text-muted-foreground py-2">
            Enter values to calculate profit margin
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
