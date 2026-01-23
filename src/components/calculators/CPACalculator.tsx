import { useState, useMemo, useCallback } from 'react';
import { Copy, RotateCcw, Check } from 'lucide-react';

type CalcMode = 'cpa' | 'cost' | 'conversions';

export function CPACalculator() {
  const [mode, setMode] = useState<CalcMode>('cpa');
  const [cost, setCost] = useState('1000');
  const [conversions, setConversions] = useState('50');
  const [cpa, setCpa] = useState('20');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const costVal = parseFloat(cost);
    const convVal = parseFloat(conversions);
    const cpaVal = parseFloat(cpa);

    if (mode === 'cpa') {
      if (isNaN(costVal) || isNaN(convVal) || costVal < 0 || convVal <= 0) return null;
      return { 
        value: costVal / convVal, 
        label: 'Cost Per Acquisition',
        unit: '$'
      };
    } else if (mode === 'cost') {
      if (isNaN(cpaVal) || isNaN(convVal) || cpaVal < 0 || convVal < 0) return null;
      return { 
        value: cpaVal * convVal, 
        label: 'Total Cost',
        unit: '$'
      };
    } else {
      if (isNaN(costVal) || isNaN(cpaVal) || costVal < 0 || cpaVal <= 0) return null;
      return { 
        value: costVal / cpaVal, 
        label: 'Number of Conversions',
        unit: ''
      };
    }
  }, [mode, cost, conversions, cpa]);

  const reset = useCallback(() => {
    setCost('1000');
    setConversions('50');
    setCpa('20');
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
        CPA = Total Cost / Number of Conversions
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2 p-1 bg-secondary/50 rounded-xl">
        <button
          onClick={() => setMode('cpa')}
          className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
            mode === 'cpa' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
          }`}
        >
          Find CPA
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
          onClick={() => setMode('conversions')}
          className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
            mode === 'conversions' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
          }`}
        >
          Find Conv.
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

        {mode !== 'conversions' && (
          <label className="space-y-2">
            <span className="text-sm font-medium">Number of Conversions</span>
            <input
              type="number"
              value={conversions}
              onChange={(e) => setConversions(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              placeholder="Total conversions"
              min="0"
            />
          </label>
        )}

        {mode !== 'cpa' && (
          <label className="space-y-2">
            <span className="text-sm font-medium">Target CPA ($)</span>
            <input
              type="number"
              value={cpa}
              onChange={(e) => setCpa(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              placeholder="Cost per acquisition"
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
