import { useState, useCallback, useMemo } from 'react';
import { Copy, RotateCcw, Check } from 'lucide-react';

export function ProbabilityCalculator() {
  const [mode, setMode] = useState<'single' | 'multiple' | 'conditional'>('single');
  
  // Single event
  const [favorable, setFavorable] = useState('1');
  const [total, setTotal] = useState('6');
  
  // Multiple events
  const [probA, setProbA] = useState('0.5');
  const [probB, setProbB] = useState('0.5');
  const [operation, setOperation] = useState<'and' | 'or'>('and');
  const [independent, setIndependent] = useState(true);
  
  // Conditional
  const [probAB, setProbAB] = useState('0.2');
  const [probBGiven, setProbBGiven] = useState('0.4');
  
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (mode === 'single') {
      const fav = parseFloat(favorable);
      const tot = parseFloat(total);
      if (isNaN(fav) || isNaN(tot) || tot <= 0 || fav < 0 || fav > tot) return null;
      
      const probability = fav / tot;
      return {
        probability,
        percentage: (probability * 100).toFixed(2),
        odds: `${fav} : ${tot - fav}`,
        fraction: `${fav}/${tot}`,
      };
    }
    
    if (mode === 'multiple') {
      const pA = parseFloat(probA);
      const pB = parseFloat(probB);
      if (isNaN(pA) || isNaN(pB) || pA < 0 || pA > 1 || pB < 0 || pB > 1) return null;
      
      let probability: number;
      let formula: string;
      
      if (operation === 'and') {
        if (independent) {
          probability = pA * pB;
          formula = 'P(A ∩ B) = P(A) × P(B)';
        } else {
          probability = pA * pB; // Simplified for independent
          formula = 'P(A ∩ B) = P(A) × P(B|A)';
        }
      } else {
        if (independent) {
          probability = pA + pB - (pA * pB);
          formula = 'P(A ∪ B) = P(A) + P(B) - P(A ∩ B)';
        } else {
          probability = pA + pB;
          formula = 'P(A ∪ B) = P(A) + P(B) (mutually exclusive)';
        }
      }
      
      probability = Math.min(1, Math.max(0, probability));
      
      return {
        probability,
        percentage: (probability * 100).toFixed(2),
        formula,
      };
    }
    
    if (mode === 'conditional') {
      const pAAndB = parseFloat(probAB);
      const pB = parseFloat(probBGiven);
      if (isNaN(pAAndB) || isNaN(pB) || pB <= 0 || pAAndB < 0 || pAAndB > 1 || pB > 1) return null;
      
      const probability = pAAndB / pB;
      if (probability > 1) return { error: 'P(A∩B) cannot be greater than P(B)' };
      
      return {
        probability,
        percentage: (probability * 100).toFixed(2),
        formula: 'P(A|B) = P(A ∩ B) / P(B)',
      };
    }
    
    return null;
  }, [mode, favorable, total, probA, probB, operation, independent, probAB, probBGiven]);

  const reset = useCallback(() => {
    setFavorable('1');
    setTotal('6');
    setProbA('0.5');
    setProbB('0.5');
    setProbAB('0.2');
    setProbBGiven('0.4');
  }, []);

  const copyResult = useCallback(() => {
    if (result && !('error' in result)) {
      navigator.clipboard.writeText(`${result.percentage}%`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result]);

  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { id: 'single', label: 'Single Event' },
          { id: 'multiple', label: 'Multiple Events' },
          { id: 'conditional', label: 'Conditional' },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id as typeof mode)}
            className={`py-2 px-3 rounded-xl text-sm font-medium transition-colors ${
              mode === m.id ? 'bg-primary text-primary-foreground' : 'bg-secondary/50 hover:bg-secondary'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Single Event Mode */}
      {mode === 'single' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Favorable Outcomes
              </label>
              <input
                type="number"
                value={favorable}
                onChange={(e) => setFavorable(e.target.value)}
                min="0"
                className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Total Outcomes
              </label>
              <input
                type="number"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                min="1"
                className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none transition-all"
              />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Example: Rolling a 6 on a die = 1 favorable out of 6 total outcomes
          </p>
        </div>
      )}

      {/* Multiple Events Mode */}
      {mode === 'multiple' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                P(A) - Probability of A
              </label>
              <input
                type="number"
                value={probA}
                onChange={(e) => setProbA(e.target.value)}
                min="0"
                max="1"
                step="0.01"
                className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                P(B) - Probability of B
              </label>
              <input
                type="number"
                value={probB}
                onChange={(e) => setProbB(e.target.value)}
                min="0"
                max="1"
                step="0.01"
                className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none transition-all"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setOperation('and')}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                operation === 'and' ? 'bg-primary text-primary-foreground' : 'bg-secondary/50 hover:bg-secondary'
              }`}
            >
              A AND B (∩)
            </button>
            <button
              onClick={() => setOperation('or')}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                operation === 'or' ? 'bg-primary text-primary-foreground' : 'bg-secondary/50 hover:bg-secondary'
              }`}
            >
              A OR B (∪)
            </button>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={independent}
              onChange={(e) => setIndependent(e.target.checked)}
              className="rounded"
            />
            Events are independent
          </label>
        </div>
      )}

      {/* Conditional Mode */}
      {mode === 'conditional' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              P(A ∩ B) - Both events occur
            </label>
            <input
              type="number"
              value={probAB}
              onChange={(e) => setProbAB(e.target.value)}
              min="0"
              max="1"
              step="0.01"
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              P(B) - Probability of condition B
            </label>
            <input
              type="number"
              value={probBGiven}
              onChange={(e) => setProbBGiven(e.target.value)}
              min="0"
              max="1"
              step="0.01"
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none transition-all"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Calculates P(A|B) - Probability of A given that B has occurred
          </p>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="p-6 rounded-xl bg-primary/10 border border-primary/20">
          {'error' in result ? (
            <div className="text-center text-destructive">{result.error}</div>
          ) : (
            <>
              <div className="text-center mb-4">
                <div className="text-4xl font-bold gradient-text">{result.percentage}%</div>
                <div className="text-lg text-muted-foreground">= {result.probability.toFixed(4)}</div>
              </div>
              {'formula' in result && (
                <div className="text-center text-sm text-muted-foreground font-mono">
                  {result.formula}
                </div>
              )}
              {'odds' in result && (
                <div className="grid grid-cols-2 gap-4 mt-4 text-center text-sm">
                  <div className="p-2 rounded-lg bg-secondary/50">
                    <div className="font-medium">{result.fraction}</div>
                    <div className="text-muted-foreground">Fraction</div>
                  </div>
                  <div className="p-2 rounded-lg bg-secondary/50">
                    <div className="font-medium">{result.odds}</div>
                    <div className="text-muted-foreground">Odds</div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

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
          disabled={!result || 'error' in result}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy Result'}
        </button>
      </div>
    </div>
  );
}
