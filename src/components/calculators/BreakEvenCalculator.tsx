import { useState, useMemo, useCallback } from 'react';
import { Copy, RotateCcw, Check, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function BreakEvenCalculator() {
  const [fixedCosts, setFixedCosts] = useState('');
  const [salesPrice, setSalesPrice] = useState('');
  const [variableCost, setVariableCost] = useState('');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const fixed = parseFloat(fixedCosts);
    const price = parseFloat(salesPrice);
    const variable = parseFloat(variableCost);

    if (isNaN(fixed) || isNaN(price) || isNaN(variable) || fixed < 0 || price <= 0 || variable < 0) {
      return null;
    }

    const contributionMargin = price - variable;
    
    if (contributionMargin <= 0) {
      return { error: 'Sales price must be greater than variable cost' };
    }

    const breakEvenUnits = fixed / contributionMargin;
    const breakEvenRevenue = breakEvenUnits * price;

    return {
      breakEvenUnits,
      breakEvenRevenue,
      contributionMargin,
    };
  }, [fixedCosts, salesPrice, variableCost]);

  const reset = useCallback(() => {
    setFixedCosts('');
    setSalesPrice('');
    setVariableCost('');
  }, []);

  const copyResult = useCallback(() => {
    if (result && !('error' in result)) {
      navigator.clipboard.writeText(
        `Break-Even Point: ${Math.ceil(result.breakEvenUnits).toLocaleString()} units\nBreak-Even Revenue: $${result.breakEvenRevenue.toLocaleString(undefined, { maximumFractionDigits: 2 })}\nContribution Margin: $${result.contributionMargin.toFixed(2)}/unit\nFixed Costs: $${parseFloat(fixedCosts).toLocaleString()}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result, fixedCosts]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="fixedCosts">Fixed Costs ($)</Label>
          <Input
            id="fixedCosts"
            type="number"
            value={fixedCosts}
            onChange={(e) => setFixedCosts(e.target.value)}
            placeholder="Total fixed costs (rent, salaries, etc.)"
            min="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="salesPrice">Sales Price per Unit ($)</Label>
          <Input
            id="salesPrice"
            type="number"
            value={salesPrice}
            onChange={(e) => setSalesPrice(e.target.value)}
            placeholder="Selling price per unit"
            min="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="variableCost">Variable Cost per Unit ($)</Label>
          <Input
            id="variableCost"
            type="number"
            value={variableCost}
            onChange={(e) => setVariableCost(e.target.value)}
            placeholder="Cost to produce/acquire each unit"
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
                <span className="text-muted-foreground">Contribution Margin</span>
                <span className="text-lg font-semibold">
                  ${result.contributionMargin.toFixed(2)}/unit
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Break-Even Point
                </span>
                <span className="text-2xl font-bold text-primary">
                  {Math.ceil(result.breakEvenUnits).toLocaleString()} units
                </span>
              </div>

              <div className="flex justify-between items-center border-t border-border pt-3">
                <span className="text-muted-foreground">Break-Even Revenue</span>
                <span className="text-xl font-bold">
                  ${result.breakEvenRevenue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
              </div>
            </>
          )
        ) : (
          <div className="text-center text-muted-foreground py-2">
            Enter values to calculate break-even point
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
