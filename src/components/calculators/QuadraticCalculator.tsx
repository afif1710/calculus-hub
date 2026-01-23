import { useState, useMemo, useCallback } from 'react';
import { Copy, RotateCcw, Check } from 'lucide-react';

export function QuadraticCalculator() {
  const [a, setA] = useState('1');
  const [b, setB] = useState('-5');
  const [c, setC] = useState('6');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const aVal = parseFloat(a);
    const bVal = parseFloat(b);
    const cVal = parseFloat(c);

    if (isNaN(aVal) || isNaN(bVal) || isNaN(cVal) || aVal === 0) {
      return null;
    }

    const discriminant = bVal * bVal - 4 * aVal * cVal;
    
    if (discriminant > 0) {
      const root1 = (-bVal + Math.sqrt(discriminant)) / (2 * aVal);
      const root2 = (-bVal - Math.sqrt(discriminant)) / (2 * aVal);
      return { discriminant, rootType: 'real', roots: [root1, root2] };
    } else if (discriminant === 0) {
      const root = -bVal / (2 * aVal);
      return { discriminant, rootType: 'repeated', roots: [root] };
    } else {
      const realPart = -bVal / (2 * aVal);
      const imagPart = Math.sqrt(-discriminant) / (2 * aVal);
      return { 
        discriminant, 
        rootType: 'complex', 
        roots: [`${realPart.toFixed(4)} + ${imagPart.toFixed(4)}i`, `${realPart.toFixed(4)} - ${imagPart.toFixed(4)}i`] 
      };
    }
  }, [a, b, c]);

  const reset = useCallback(() => {
    setA('1');
    setB('-5');
    setC('6');
  }, []);

  const copyResult = useCallback(() => {
    if (result) {
      const text = `Equation: ${a}x² + ${b}x + ${c} = 0\nDiscriminant: ${result.discriminant}\nRoots: ${result.roots.join(', ')}`;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result, a, b, c]);

  return (
    <div className="space-y-6">
      <div className="p-3 rounded-xl bg-secondary/30 border border-border">
        <p className="text-sm text-muted-foreground text-center">
          <span className="font-mono">{a || 'a'}x² + {b || 'b'}x + {c || 'c'} = 0</span>
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <label className="space-y-2">
          <span className="text-sm font-medium">a (x² coef)</span>
          <input
            type="number"
            value={a}
            onChange={(e) => setA(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="a"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">b (x coef)</span>
          <input
            type="number"
            value={b}
            onChange={(e) => setB(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="b"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">c (const)</span>
          <input
            type="number"
            value={c}
            onChange={(e) => setC(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="c"
          />
        </label>
      </div>

      {/* Results */}
      <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-3">
        {result ? (
          <>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Discriminant (b²-4ac)</span>
              <span className={`text-lg font-bold ${result.discriminant >= 0 ? 'text-green-500' : 'text-amber-500'}`}>
                {result.discriminant.toFixed(4)}
              </span>
            </div>
            <div className="border-t border-border pt-3">
              <span className="text-sm text-muted-foreground block mb-2">
                {result.rootType === 'real' ? '2 Real Roots' : result.rootType === 'repeated' ? '1 Repeated Root' : '2 Complex Roots'}
              </span>
              <div className="space-y-1">
                {result.roots.map((root, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-muted-foreground">x{i + 1}</span>
                    <span className="text-xl font-bold gradient-text font-mono">
                      {typeof root === 'number' ? root.toFixed(4) : root}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center text-muted-foreground py-2">
            Enter valid coefficients (a ≠ 0)
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
