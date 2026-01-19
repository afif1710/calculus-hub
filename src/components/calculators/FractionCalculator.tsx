import { useState, useMemo } from 'react';

function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

export function FractionCalculator() {
  const [aNum, setANum] = useState(1);
  const [aDen, setADen] = useState(2);
  const [bNum, setBNum] = useState(1);
  const [bDen, setBDen] = useState(3);
  const [op, setOp] = useState<'+' | '-' | '*' | '/'>('/');

  const result = useMemo(() => {
    const A = { n: Number(aNum), d: Number(aDen) };
    const B = { n: Number(bNum), d: Number(bDen) };
    
    if (A.d === 0 || B.d === 0) return { error: 'Denominator cannot be zero' };
    if (op === '/' && B.n === 0) return { error: 'Cannot divide by zero' };

    let n: number, d: number;
    
    switch (op) {
      case '+': n = A.n * B.d + B.n * A.d; d = A.d * B.d; break;
      case '-': n = A.n * B.d - B.n * A.d; d = A.d * B.d; break;
      case '*': n = A.n * B.n; d = A.d * B.d; break;
      case '/': n = A.n * B.d; d = A.d * B.n; break;
    }

    const g = gcd(n, d);
    const simplifiedN = n / g;
    const simplifiedD = d / g;
    
    // Handle negative denominators
    const finalN = simplifiedD < 0 ? -simplifiedN : simplifiedN;
    const finalD = Math.abs(simplifiedD);

    return {
      raw: `${n}/${d}`,
      simplified: `${finalN}/${finalD}`,
      decimal: (n / d).toFixed(6).replace(/\.?0+$/, ''),
      isWhole: finalD === 1
    };
  }, [aNum, aDen, bNum, bDen, op]);

  const operations = ['+', '-', '*', '/'] as const;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-center gap-3">
        {/* First Fraction */}
        <div className="flex flex-col items-center gap-1 p-3 rounded-xl bg-secondary/30">
          <input
            value={aNum}
            onChange={e => setANum(Number(e.target.value))}
            className="input-calc w-20 text-center text-lg font-medium"
            type="number"
          />
          <div className="w-16 h-0.5 bg-foreground" />
          <input
            value={aDen}
            onChange={e => setADen(Number(e.target.value))}
            className="input-calc w-20 text-center text-lg font-medium"
            type="number"
          />
        </div>

        {/* Operator */}
        <div className="flex gap-1">
          {operations.map(o => (
            <button
              key={o}
              onClick={() => setOp(o)}
              className={`w-10 h-10 rounded-lg text-lg font-bold transition-all ${
                op === o
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
              }`}
            >
              {o === '*' ? '×' : o === '/' ? '÷' : o}
            </button>
          ))}
        </div>

        {/* Second Fraction */}
        <div className="flex flex-col items-center gap-1 p-3 rounded-xl bg-secondary/30">
          <input
            value={bNum}
            onChange={e => setBNum(Number(e.target.value))}
            className="input-calc w-20 text-center text-lg font-medium"
            type="number"
          />
          <div className="w-16 h-0.5 bg-foreground" />
          <input
            value={bDen}
            onChange={e => setBDen(Number(e.target.value))}
            className="input-calc w-20 text-center text-lg font-medium"
            type="number"
          />
        </div>
      </div>

      <div className="p-5 rounded-xl bg-secondary/30 text-center">
        {'error' in result ? (
          <div className="text-destructive font-medium">{result.error}</div>
        ) : (
          <>
            <div className="text-sm text-muted-foreground mb-2">Result</div>
            <div className="text-4xl font-bold gradient-text mb-2">
              {result.isWhole ? result.simplified.split('/')[0] : result.simplified}
            </div>
            <div className="text-muted-foreground">
              = {result.decimal}
            </div>
            {!result.isWhole && result.raw !== result.simplified && (
              <div className="text-xs text-muted-foreground mt-2">
                Unsimplified: {result.raw}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
