import { useState, useMemo, useCallback } from 'react';
import { Copy, RotateCcw, Check } from 'lucide-react';

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

function gcdArray(arr: number[]): number {
  return arr.reduce((acc, val) => gcd(acc, val));
}

function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

function lcmArray(arr: number[]): number {
  return arr.reduce((acc, val) => lcm(acc, val));
}

export function GCDLCMCalculator() {
  const [input, setInput] = useState('12, 18, 24');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const numbers = input
      .split(/[,\s]+/)
      .map(s => parseInt(s.trim()))
      .filter(n => !isNaN(n) && n !== 0);

    if (numbers.length < 2) return null;

    const gcdResult = gcdArray(numbers);
    const lcmResult = lcmArray(numbers);

    // Find prime factorization of each number
    const factorizations = numbers.map(n => {
      const factors: Record<number, number> = {};
      let num = Math.abs(n);
      for (let i = 2; i * i <= num; i++) {
        while (num % i === 0) {
          factors[i] = (factors[i] || 0) + 1;
          num /= i;
        }
      }
      if (num > 1) factors[num] = 1;
      return { number: n, factors };
    });

    return { gcd: gcdResult, lcm: lcmResult, numbers, factorizations };
  }, [input]);

  const reset = useCallback(() => {
    setInput('12, 18, 24');
  }, []);

  const copyResult = useCallback(() => {
    if (result) {
      const text = `Numbers: ${result.numbers.join(', ')}\nGCD: ${result.gcd}\nLCM: ${result.lcm}`;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result]);

  const formatFactors = (factors: Record<number, number>) => {
    return Object.entries(factors)
      .map(([prime, exp]) => exp === 1 ? prime : `${prime}^${exp}`)
      .join(' × ') || '1';
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Enter numbers (comma or space separated)</label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-mono"
          placeholder="12, 18, 24"
        />
        {result && (
          <p className="text-xs text-muted-foreground">
            {result.numbers.length} numbers detected
          </p>
        )}
      </div>

      {/* Results */}
      <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-3">
        {result ? (
          <>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">GCD (Greatest Common Divisor)</span>
              <span className="text-2xl font-bold text-primary">
                {result.gcd.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center border-t border-border pt-3">
              <span className="text-muted-foreground">LCM (Least Common Multiple)</span>
              <span className="text-2xl font-bold gradient-text">
                {result.lcm.toLocaleString()}
              </span>
            </div>
          </>
        ) : (
          <div className="text-center text-muted-foreground py-2">
            Enter at least 2 non-zero integers
          </div>
        )}
      </div>

      {/* Prime Factorization */}
      {result && (
        <details className="text-sm">
          <summary className="text-muted-foreground cursor-pointer hover:text-foreground">
            View Prime Factorizations
          </summary>
          <div className="mt-2 p-3 rounded-lg bg-secondary/30 space-y-2">
            {result.factorizations.map(({ number, factors }) => (
              <div key={number} className="flex justify-between items-center text-xs font-mono">
                <span className="text-muted-foreground">{number} =</span>
                <span>{formatFactors(factors)}</span>
              </div>
            ))}
          </div>
        </details>
      )}

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
