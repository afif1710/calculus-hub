import { useState, useMemo, useCallback } from 'react';
import { Copy, RotateCcw, Check } from 'lucide-react';

type CalcMode = 'cpm' | 'cost' | 'impressions';

export function CPMCalculator() {
  const [mode, setMode] = useState<CalcMode>('cpm');
  const [cost, setCost] = useState('500');
  const [impressions, setImpressions] = useState('100000');
  const [cpm, setCpm] = useState('5');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const costVal = parseFloat(cost);
    const impVal = parseFloat(impressions);
    const cpmVal = parseFloat(cpm);

    if (mode === 'cpm') {
      if (isNaN(costVal) || isNaN(impVal) || costVal < 0 || impVal <= 0) return null;
      return { 
        value: (costVal / impVal) * 1000, 
        label: 'CPM',
        unit: '$'
      };
    } else if (mode === 'cost') {
      if (isNaN(cpmVal) || isNaN(impVal) || cpmVal < 0 || impVal < 0) return null;
      return { 
        value: (cpmVal * impVal) / 1000, 
        label: 'Total Cost',
        unit: '$'
      };
    } else {
      if (isNaN(costVal) || isNaN(cpmVal) || costVal < 0 || cpmVal <= 0) return null;
      return { 
        value: (costVal / cpmVal) * 1000, 
        label: 'Impressions',
        unit: ''
      };
    }
  }, [mode, cost, impressions, cpm]);

  const reset = useCallback(() => {
    setCost('500');
    setImpressions('100000');
    setCpm('5');
  }, []);

  const copyResult = useCallback(() => {
    if (result) {
      navigator.clipboard.writeText(`${result.label}: ${result.unit}${result.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result]);

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground p-3 bg-secondary/20 rounded-lg">
        CPM = (Cost / Impressions) × 1,000
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2 p-1 bg-secondary/50 rounded-xl">
        <button
          onClick={() => setMode('cpm')}
          className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
            mode === 'cpm' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
          }`}
        >
          Find CPM
        </button>
        <button
          onClick={() => setMode('cost')}
          className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
            mode === 'cost' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
          }`}
        >
          Find Cost
        </button>
        <button
          onClick={() => setMode('impressions')}
          className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
            mode === 'impressions' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
          }`}
        >
          Find Impressions
        </button>
      </div>

      <div className="grid gap-4">
        {mode !== 'cost' && (
          <label className="space-y-2">
            <span className="text-sm font-medium">Total Cost ($)</span>
            <input
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              placeholder="Ad spend"
              min="0"
            />
          </label>
        )}

        {mode !== 'impressions' && (
          <label className="space-y-2">
            <span className="text-sm font-medium">Impressions</span>
            <input
              type="number"
              value={impressions}
              onChange={(e) => setImpressions(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              placeholder="Total impressions"
              min="0"
            />
          </label>
        )}

        {mode !== 'cpm' && (
          <label className="space-y-2">
            <span className="text-sm font-medium">CPM ($)</span>
            <input
              type="number"
              value={cpm}
              onChange={(e) => setCpm(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              placeholder="Cost per mille"
              min="0"
              step="0.01"
            />
          </label>
        )}
      </div>

      {/* Result */}
      <div className="p-4 rounded-xl bg-secondary/30 border border-border">
        {result ? (
          <div className="text-center">
            <span className="text-sm text-muted-foreground block">{result.label}</span>
            <span className="text-3xl font-bold gradient-text">
              {result.unit}{result.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </span>
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-2">
            Enter valid values
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
