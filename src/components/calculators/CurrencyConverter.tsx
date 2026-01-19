import { useState, useCallback, useMemo } from 'react';
import { Copy, RotateCcw, Check, ArrowRightLeft } from 'lucide-react';

// Static exchange rates (relative to USD)
const EXCHANGE_RATES: Record<string, { rate: number; symbol: string; name: string }> = {
  USD: { rate: 1, symbol: '$', name: 'US Dollar' },
  EUR: { rate: 0.92, symbol: '€', name: 'Euro' },
  GBP: { rate: 0.79, symbol: '£', name: 'British Pound' },
  JPY: { rate: 149.50, symbol: '¥', name: 'Japanese Yen' },
  CNY: { rate: 7.24, symbol: '¥', name: 'Chinese Yuan' },
  INR: { rate: 83.12, symbol: '₹', name: 'Indian Rupee' },
  AUD: { rate: 1.53, symbol: 'A$', name: 'Australian Dollar' },
  CAD: { rate: 1.36, symbol: 'C$', name: 'Canadian Dollar' },
  CHF: { rate: 0.88, symbol: 'Fr', name: 'Swiss Franc' },
  KRW: { rate: 1320.50, symbol: '₩', name: 'South Korean Won' },
  SGD: { rate: 1.34, symbol: 'S$', name: 'Singapore Dollar' },
  HKD: { rate: 7.82, symbol: 'HK$', name: 'Hong Kong Dollar' },
  MXN: { rate: 17.15, symbol: '$', name: 'Mexican Peso' },
  BRL: { rate: 4.97, symbol: 'R$', name: 'Brazilian Real' },
  AED: { rate: 3.67, symbol: 'د.إ', name: 'UAE Dirham' },
};

export function CurrencyConverter() {
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < 0) return null;
    
    const fromRate = EXCHANGE_RATES[fromCurrency].rate;
    const toRate = EXCHANGE_RATES[toCurrency].rate;
    
    // Convert to USD first, then to target currency
    const usdAmount = numAmount / fromRate;
    const convertedAmount = usdAmount * toRate;
    
    return {
      converted: convertedAmount,
      rate: toRate / fromRate,
    };
  }, [amount, fromCurrency, toCurrency]);

  const swap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const reset = useCallback(() => {
    setAmount('1');
    setFromCurrency('USD');
    setToCurrency('EUR');
  }, []);

  const copyResult = useCallback(() => {
    if (result) {
      navigator.clipboard.writeText(result.converted.toFixed(2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result]);

  const currencies = Object.keys(EXCHANGE_RATES);

  return (
    <div className="space-y-6">
      {/* Amount Input */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          Amount
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0"
          step="0.01"
          className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
          placeholder="Enter amount"
        />
      </div>

      {/* Currency Selectors */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            From
          </label>
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none transition-all"
          >
            {currencies.map((code) => (
              <option key={code} value={code}>
                {code} - {EXCHANGE_RATES[code].name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={swap}
          className="mt-6 p-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
          aria-label="Swap currencies"
        >
          <ArrowRightLeft className="w-5 h-5" />
        </button>

        <div className="flex-1">
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            To
          </label>
          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none transition-all"
          >
            {currencies.map((code) => (
              <option key={code} value={code}>
                {code} - {EXCHANGE_RATES[code].name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="p-6 rounded-xl bg-primary/10 border border-primary/20">
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-1">
              {parseFloat(amount).toLocaleString()} {fromCurrency} =
            </div>
            <div className="text-3xl font-bold gradient-text">
              {EXCHANGE_RATES[toCurrency].symbol}{result.converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {toCurrency}
            </div>
            <div className="text-sm text-muted-foreground mt-3">
              1 {fromCurrency} = {result.rate.toFixed(4)} {toCurrency}
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-xs text-muted-foreground text-center">
        Note: Exchange rates are approximate and for reference only. Actual rates may vary.
      </p>

      {/* Action Buttons */}
      <div className="flex gap-2">
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
