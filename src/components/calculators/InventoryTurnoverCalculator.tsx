import { useState, useMemo, useCallback } from 'react';
import { Copy, RotateCcw, Check, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function InventoryTurnoverCalculator() {
  const [cogs, setCogs] = useState('');
  const [beginningInventory, setBeginningInventory] = useState('');
  const [endingInventory, setEndingInventory] = useState('');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const cogsVal = parseFloat(cogs);
    const beginning = parseFloat(beginningInventory);
    const ending = parseFloat(endingInventory);

    if (isNaN(cogsVal) || isNaN(beginning) || isNaN(ending) || cogsVal < 0 || beginning < 0 || ending < 0) {
      return null;
    }

    const averageInventory = (beginning + ending) / 2;

    if (averageInventory <= 0) {
      return { error: 'Average inventory must be greater than zero' };
    }

    const turnoverRatio = cogsVal / averageInventory;
    const daysToSell = 365 / turnoverRatio;

    return { turnoverRatio, averageInventory, daysToSell };
  }, [cogs, beginningInventory, endingInventory]);

  const reset = useCallback(() => {
    setCogs('');
    setBeginningInventory('');
    setEndingInventory('');
  }, []);

  const copyResult = useCallback(() => {
    if (result && !('error' in result)) {
      navigator.clipboard.writeText(
        `Inventory Turnover: ${result.turnoverRatio.toFixed(2)} turns per period\nAverage Inventory: $${result.averageInventory.toLocaleString()}\nDays to Sell Inventory: ${result.daysToSell.toFixed(1)} days\nCOGS: $${parseFloat(cogs).toLocaleString()}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result, cogs]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="cogs">Cost of Goods Sold (COGS) ($)</Label>
          <Input
            id="cogs"
            type="number"
            value={cogs}
            onChange={(e) => setCogs(e.target.value)}
            placeholder="Total cost of goods sold for the period"
            min="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="beginningInventory">Beginning Inventory ($)</Label>
          <Input
            id="beginningInventory"
            type="number"
            value={beginningInventory}
            onChange={(e) => setBeginningInventory(e.target.value)}
            placeholder="Inventory value at start of period"
            min="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endingInventory">Ending Inventory ($)</Label>
          <Input
            id="endingInventory"
            type="number"
            value={endingInventory}
            onChange={(e) => setEndingInventory(e.target.value)}
            placeholder="Inventory value at end of period"
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
                <span className="text-muted-foreground">Average Inventory</span>
                <span className="text-lg font-semibold">
                  ${result.averageInventory.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Inventory Turnover
                </span>
                <span className="text-2xl font-bold text-primary">
                  {result.turnoverRatio.toFixed(2)} turns
                </span>
              </div>

              <div className="flex justify-between items-center border-t border-border pt-3">
                <span className="text-muted-foreground">Days to Sell Inventory</span>
                <span className="text-xl font-bold">
                  {result.daysToSell.toFixed(1)} days
                </span>
              </div>
            </>
          )
        ) : (
          <div className="text-center text-muted-foreground py-2">
            Enter values to calculate inventory turnover
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
