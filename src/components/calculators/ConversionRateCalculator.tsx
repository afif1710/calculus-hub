import { useState, useMemo, useCallback } from 'react';
import { Copy, RotateCcw, Check, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function ConversionRateCalculator() {
  const [totalVisitors, setTotalVisitors] = useState('');
  const [totalConversions, setTotalConversions] = useState('');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const visitors = parseFloat(totalVisitors);
    const conversions = parseFloat(totalConversions);

    if (isNaN(visitors) || isNaN(conversions) || visitors <= 0 || conversions < 0) {
      return null;
    }

    if (conversions > visitors) {
      return { error: 'Conversions cannot exceed total visitors' };
    }

    const conversionRate = (conversions / visitors) * 100;
    const nonConverted = visitors - conversions;

    return { conversionRate, nonConverted };
  }, [totalVisitors, totalConversions]);

  const reset = useCallback(() => {
    setTotalVisitors('');
    setTotalConversions('');
  }, []);

  const copyResult = useCallback(() => {
    if (result && !('error' in result)) {
      navigator.clipboard.writeText(
        `Conversion Rate: ${result.conversionRate.toFixed(2)}%\nTotal Visitors: ${parseFloat(totalVisitors).toLocaleString()}\nTotal Conversions: ${parseFloat(totalConversions).toLocaleString()}\nNon-Converted: ${result.nonConverted.toLocaleString()}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result, totalVisitors, totalConversions]);

  const getRateColor = (rate: number) => {
    if (rate >= 5) return 'text-green-500';
    if (rate >= 2) return 'text-yellow-500';
    if (rate >= 1) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="totalVisitors">Total Visitors</Label>
          <Input
            id="totalVisitors"
            type="number"
            value={totalVisitors}
            onChange={(e) => setTotalVisitors(e.target.value)}
            placeholder="Total number of visitors"
            min="1"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="totalConversions">Total Conversions/Sales</Label>
          <Input
            id="totalConversions"
            type="number"
            value={totalConversions}
            onChange={(e) => setTotalConversions(e.target.value)}
            placeholder="Number of conversions or sales"
            min="0"
          />
        </div>
      </div>

      {/* Results */}
      <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-4">
        {result ? (
          'error' in result ? (
            <div className="text-center text-red-500 py-2">
              {result.error}
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <span className="font-medium flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Conversion Rate
                </span>
                <span className={`text-2xl font-bold ${getRateColor(result.conversionRate)}`}>
                  {result.conversionRate.toFixed(2)}%
                </span>
              </div>

              <div className="flex justify-between items-center border-t border-border pt-3">
                <span className="text-muted-foreground">Non-Converted Visitors</span>
                <span className="text-lg font-semibold">
                  {result.nonConverted.toLocaleString()}
                </span>
              </div>

              <div className="text-sm text-muted-foreground text-center">
                {result.conversionRate >= 2 
                  ? '✓ Above average conversion rate!' 
                  : 'Tip: Average e-commerce conversion is 2-3%'}
              </div>
            </>
          )
        ) : (
          <div className="text-center text-muted-foreground py-2">
            Enter values to calculate conversion rate
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="secondary" onClick={reset} className="flex-1">
          <RotateCcw className="w-4 h-4 mr-2" />
          Clear
        </Button>
        <Button onClick={copyResult} disabled={!result || (result && 'error' in result)} className="flex-1">
          {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
          {copied ? 'Copied!' : 'Copy Result'}
        </Button>
      </div>
    </div>
  );
}
