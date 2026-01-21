import { useState, useMemo, useCallback } from 'react';
import { Copy, RotateCcw, Check, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function CapRateCalculator() {
  const [noi, setNoi] = useState('');
  const [marketValue, setMarketValue] = useState('');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const noiNum = parseFloat(noi);
    const valueNum = parseFloat(marketValue);

    if (isNaN(noiNum) || isNaN(valueNum) || valueNum <= 0) {
      return null;
    }

    const capRate = (noiNum / valueNum) * 100;

    return {
      capRate,
      isGood: capRate >= 4 && capRate <= 10,
    };
  }, [noi, marketValue]);

  const reset = useCallback(() => {
    setNoi('');
    setMarketValue('');
  }, []);

  const copyResult = useCallback(() => {
    if (result) {
      navigator.clipboard.writeText(
        `Cap Rate: ${result.capRate.toFixed(2)}%\nNet Operating Income: $${parseFloat(noi).toLocaleString()}\nMarket Value: $${parseFloat(marketValue).toLocaleString()}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result, noi, marketValue]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="noi">Net Operating Income (NOI) ($)</Label>
          <Input
            id="noi"
            type="number"
            value={noi}
            onChange={(e) => setNoi(e.target.value)}
            placeholder="Annual NOI (income - expenses)"
            min="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="marketValue">Current Market Value ($)</Label>
          <Input
            id="marketValue"
            type="number"
            value={marketValue}
            onChange={(e) => setMarketValue(e.target.value)}
            placeholder="Enter property market value"
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
                <Building2 className="w-4 h-4" />
                Capitalization Rate
              </span>
              <span className={`text-2xl font-bold ${result.isGood ? 'text-green-500' : 'text-yellow-500'}`}>
                {result.capRate.toFixed(2)}%
              </span>
            </div>

            <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
              {result.capRate < 4 && 'Low cap rate - typically lower risk, lower return'}
              {result.isGood && '✓ Typical cap rate range (4-10%)'}
              {result.capRate > 10 && 'High cap rate - potentially higher risk, higher return'}
            </div>
          </>
        ) : (
          <div className="text-center text-muted-foreground py-2">
            Enter values to calculate cap rate
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
