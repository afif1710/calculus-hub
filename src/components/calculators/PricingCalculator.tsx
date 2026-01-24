import { useState } from 'react';
import { Tag, RotateCcw, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type Mode = 'markup' | 'margin';

export function PricingCalculator() {
  const [costPrice, setCostPrice] = useState('');
  const [mode, setMode] = useState<Mode>('markup');
  const [percentage, setPercentage] = useState('');
  const [taxPercent, setTaxPercent] = useState('');
  const [platformFee, setPlatformFee] = useState('');
  const [result, setResult] = useState<{
    sellingPrice: number;
    sellingPriceWithTax: number;
    grossProfit: number;
    netProfit: number;
    marginPercent: number;
    markupPercent: number;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCalculate = () => {
    const cost = parseFloat(costPrice);
    const pct = parseFloat(percentage);
    const tax = parseFloat(taxPercent) || 0;
    const fee = parseFloat(platformFee) || 0;

    if (isNaN(cost) || isNaN(pct) || cost <= 0 || pct < 0) {
      toast.error('Please enter valid cost and percentage');
      return;
    }

    let sellingPrice: number;
    let markupPercent: number;
    let marginPercent: number;

    if (mode === 'markup') {
      // Markup: Selling = Cost * (1 + Markup%)
      markupPercent = pct;
      sellingPrice = cost * (1 + pct / 100);
      marginPercent = ((sellingPrice - cost) / sellingPrice) * 100;
    } else {
      // Margin: Margin% = (Selling - Cost) / Selling
      // So: Selling = Cost / (1 - Margin%)
      marginPercent = pct;
      if (pct >= 100) {
        toast.error('Margin must be less than 100%');
        return;
      }
      sellingPrice = cost / (1 - pct / 100);
      markupPercent = ((sellingPrice - cost) / cost) * 100;
    }

    const grossProfit = sellingPrice - cost;
    const feeAmount = sellingPrice * (fee / 100);
    const netProfit = grossProfit - feeAmount;
    const sellingPriceWithTax = sellingPrice * (1 + tax / 100);

    setResult({
      sellingPrice,
      sellingPriceWithTax,
      grossProfit,
      netProfit,
      marginPercent,
      markupPercent,
    });
  };

  const handleReset = () => {
    setCostPrice('');
    setPercentage('');
    setTaxPercent('');
    setPlatformFee('');
    setResult(null);
  };

  const handleCopy = () => {
    if (!result) return;
    const text = `Selling Price: $${result.sellingPrice.toFixed(2)}
${result.sellingPriceWithTax !== result.sellingPrice ? `Price with Tax: $${result.sellingPriceWithTax.toFixed(2)}` : ''}
Gross Profit: $${result.grossProfit.toFixed(2)}
Net Profit: $${result.netProfit.toFixed(2)}
Margin: ${result.marginPercent.toFixed(2)}%
Markup: ${result.markupPercent.toFixed(2)}%`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Result copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        <button
          onClick={() => setMode('markup')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'markup'
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
          }`}
        >
          Set by Markup %
        </button>
        <button
          onClick={() => setMode('margin')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'margin'
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
          }`}
        >
          Set by Margin %
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-muted-foreground">Cost Price ($)</label>
          <input
            type="number"
            value={costPrice}
            onChange={e => setCostPrice(e.target.value)}
            className="input-calc"
            placeholder="50.00"
            min="0"
            step="0.01"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-muted-foreground">
            {mode === 'markup' ? 'Markup' : 'Margin'} (%)
          </label>
          <input
            type="number"
            value={percentage}
            onChange={e => setPercentage(e.target.value)}
            className="input-calc"
            placeholder={mode === 'markup' ? '50' : '33.33'}
            min="0"
            max={mode === 'margin' ? '99.99' : undefined}
            step="0.1"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-muted-foreground">Tax (%) <span className="text-xs">(optional)</span></label>
          <input
            type="number"
            value={taxPercent}
            onChange={e => setTaxPercent(e.target.value)}
            className="input-calc"
            placeholder="0"
            min="0"
            step="0.1"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-muted-foreground">Platform Fee (%) <span className="text-xs">(optional)</span></label>
          <input
            type="number"
            value={platformFee}
            onChange={e => setPlatformFee(e.target.value)}
            className="input-calc"
            placeholder="0"
            min="0"
            step="0.1"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={handleCalculate} className="flex-1">
          Calculate Price
        </Button>
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-secondary/50 space-y-3">
            <div className="text-center pb-3 border-b border-border/50">
              <span className="text-sm text-muted-foreground block">Selling Price</span>
              <span className="text-3xl font-bold gradient-text">
                ${result.sellingPrice.toFixed(2)}
              </span>
              {result.sellingPriceWithTax !== result.sellingPrice && (
                <span className="text-sm text-muted-foreground block mt-1">
                  With tax: ${result.sellingPriceWithTax.toFixed(2)}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-xs text-muted-foreground block">Gross Profit</span>
                <span className="text-lg font-semibold text-green-400">
                  ${result.grossProfit.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Net Profit</span>
                <span className="text-lg font-semibold text-foreground">
                  ${result.netProfit.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Margin</span>
                <span className="text-lg font-semibold text-foreground">
                  {result.marginPercent.toFixed(2)}%
                </span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Markup</span>
                <span className="text-lg font-semibold text-foreground">
                  {result.markupPercent.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          <Button variant="secondary" onClick={handleCopy} className="w-full">
            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            {copied ? 'Copied!' : 'Copy Result'}
          </Button>
        </div>
      )}

      <div className="p-4 rounded-xl bg-secondary/30 flex items-center gap-3">
        <Tag className="w-5 h-5 text-primary" />
        <span className="text-sm text-muted-foreground">
          Calculate selling price from cost using either markup or margin percentage.
        </span>
      </div>
    </div>
  );
}
