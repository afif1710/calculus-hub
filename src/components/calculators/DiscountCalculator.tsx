import { useState, useMemo, useCallback } from 'react';
import { Copy, RotateCcw, Check } from 'lucide-react';

export function DiscountCalculator() {
  const [originalPrice, setOriginalPrice] = useState('100');
  const [discountPercent, setDiscountPercent] = useState('20');
  const [taxPercent, setTaxPercent] = useState('');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const price = parseFloat(originalPrice);
    const discount = parseFloat(discountPercent);
    const tax = parseFloat(taxPercent) || 0;

    if (isNaN(price) || isNaN(discount) || price < 0 || discount < 0 || discount > 100 || tax < 0) {
      return null;
    }

    const discountAmount = (price * discount) / 100;
    const priceAfterDiscount = price - discountAmount;
    const taxAmount = (priceAfterDiscount * tax) / 100;
    const finalPrice = priceAfterDiscount + taxAmount;

    return {
      discountAmount,
      priceAfterDiscount,
      taxAmount,
      finalPrice,
      savings: discountAmount,
    };
  }, [originalPrice, discountPercent, taxPercent]);

  const reset = useCallback(() => {
    setOriginalPrice('100');
    setDiscountPercent('20');
    setTaxPercent('');
  }, []);

  const copyResult = useCallback(() => {
    if (result) {
      navigator.clipboard.writeText(
        `Original: $${parseFloat(originalPrice).toFixed(2)}\nDiscount: ${discountPercent}% (-$${result.discountAmount.toFixed(2)})\n${taxPercent ? `Tax: ${taxPercent}% (+$${result.taxAmount.toFixed(2)})\n` : ''}Final Price: $${result.finalPrice.toFixed(2)}\nYou Save: $${result.savings.toFixed(2)}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result, originalPrice, discountPercent, taxPercent]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <label className="space-y-2">
          <span className="text-sm font-medium">Original Price ($)</span>
          <input
            type="number"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="Enter price"
            min="0"
            step="0.01"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Discount (%)</span>
          <input
            type="number"
            value={discountPercent}
            onChange={(e) => setDiscountPercent(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="Enter discount"
            min="0"
            max="100"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Tax % (optional)</span>
          <input
            type="number"
            value={taxPercent}
            onChange={(e) => setTaxPercent(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="Enter tax rate (optional)"
            min="0"
          />
        </label>
      </div>

      {/* Results */}
      <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-3">
        {result ? (
          <>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Original Price</span>
              <span className="line-through">${parseFloat(originalPrice).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-green-500">
              <span>Discount ({discountPercent}%)</span>
              <span>-${result.discountAmount.toFixed(2)}</span>
            </div>
            {parseFloat(taxPercent) > 0 && (
              <div className="flex justify-between items-center text-sm text-orange-500">
                <span>Tax ({taxPercent}%)</span>
                <span>+${result.taxAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between items-center border-t border-border pt-3">
              <span className="font-medium">Final Price</span>
              <span className="text-2xl font-bold gradient-text">
                ${result.finalPrice.toFixed(2)}
              </span>
            </div>
            <div className="text-center text-sm text-green-500 font-medium">
              You save ${result.savings.toFixed(2)}!
            </div>
          </>
        ) : (
          <div className="text-center text-muted-foreground py-2">
            Enter valid values (discount must be 0-100%)
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
        <button
          onClick={copyResult}
          disabled={!result}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy Result'}
        </button>
      </div>
    </div>
  );
}
