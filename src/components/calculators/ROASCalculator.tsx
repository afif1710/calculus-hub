import { useState, useMemo, useCallback } from 'react';
import { Copy, RotateCcw, Check, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function ROASCalculator() {
  const [revenueFromAds, setRevenueFromAds] = useState('');
  const [adSpend, setAdSpend] = useState('');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const revenue = parseFloat(revenueFromAds);
    const spend = parseFloat(adSpend);

    if (isNaN(revenue) || isNaN(spend) || revenue < 0 || spend <= 0) {
      return null;
    }

    const roas = revenue / spend;
    const profit = revenue - spend;
    const roiPercent = ((revenue - spend) / spend) * 100;

    return { roas, profit, roiPercent };
  }, [revenueFromAds, adSpend]);

  const reset = useCallback(() => {
    setRevenueFromAds('');
    setAdSpend('');
  }, []);

  const copyResult = useCallback(() => {
    if (result) {
      navigator.clipboard.writeText(
        `ROAS: ${result.roas.toFixed(2)}x\nROI: ${result.roiPercent.toFixed(1)}%\nProfit: $${result.profit.toFixed(2)}\nRevenue: $${parseFloat(revenueFromAds).toLocaleString()}\nAd Spend: $${parseFloat(adSpend).toLocaleString()}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result, revenueFromAds, adSpend]);

  const getRoasColor = (roas: number) => {
    if (roas >= 4) return 'text-green-500';
    if (roas >= 2) return 'text-yellow-500';
    if (roas >= 1) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="revenueFromAds">Revenue from Ads ($)</Label>
          <Input
            id="revenueFromAds"
            type="number"
            value={revenueFromAds}
            onChange={(e) => setRevenueFromAds(e.target.value)}
            placeholder="Total revenue generated from ads"
            min="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="adSpend">Total Ad Spend ($)</Label>
          <Input
            id="adSpend"
            type="number"
            value={adSpend}
            onChange={(e) => setAdSpend(e.target.value)}
            placeholder="Total amount spent on ads"
            min="0"
          />
        </div>
      </div>

      {/* Results */}
      <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-4">
        {result ? (
          <>
            <div className="flex justify-between items-center">
              <span className="font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Return on Ad Spend
              </span>
              <span className={`text-2xl font-bold ${getRoasColor(result.roas)}`}>
                {result.roas.toFixed(2)}x
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">ROI</span>
              <span className="text-lg font-semibold">
                {result.roiPercent.toFixed(1)}%
              </span>
            </div>

            <div className="flex justify-between items-center border-t border-border pt-3">
              <span className="text-muted-foreground">Net Profit</span>
              <span className={`text-xl font-bold ${result.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                ${result.profit.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
            </div>

            <div className="text-sm text-muted-foreground text-center">
              For every $1 spent, you earn ${result.roas.toFixed(2)} back
            </div>
          </>
        ) : (
          <div className="text-center text-muted-foreground py-2">
            Enter values to calculate ROAS
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
