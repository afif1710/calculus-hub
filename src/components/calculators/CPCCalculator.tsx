import { useState, useMemo, useCallback } from 'react';
import { Copy, RotateCcw, Check } from 'lucide-react';

type CalcMode = 'cpc' | 'cost' | 'clicks';

export function CPCCalculator() {
  const [mode, setMode] = useState<CalcMode>('cpc');
  const [cost, setCost] = useState('500');
  const [clicks, setClicks] = useState('250');
  const [cpc, setCpc] = useState('2');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const costVal = parseFloat(cost);
    const clicksVal = parseFloat(clicks);
    const cpcVal = parseFloat(cpc);

    if (mode === 'cpc') {
      if (isNaN(costVal) || isNaN(clicksVal) || costVal < 0 || clicksVal <= 0) return null;
      return { 
        value: costVal / clicksVal, 
        label: 'Cost Per Click',
        unit: '$'
      };
    } else if (mode === 'cost') {
      if (isNaN(cpcVal) || isNaN(clicksVal) || cpcVal < 0 || clicksVal < 0) return null;
      return { 
        value: cpcVal * clicksVal, 
        label: 'Total Cost',
        unit: '$'
      };
    } else {
      if (isNaN(costVal) || isNaN(cpcVal) || costVal < 0 || cpcVal <= 0) return null;
      return { 
        value: costVal / cpcVal, 
        label: 'Number of Clicks',
        unit: ''
      };
    }
  }, [mode, cost, clicks, cpc]);

  const reset = useCallback(() => {
    setCost('500');
    setClicks('250');
    setCpc('2');
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
        CPC = Total Cost / Number of Clicks
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2 p-1 bg-secondary/50 rounded-xl">
        <button
          onClick={() => setMode('cpc')}
          className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
            mode === 'cpc' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
          }`}
        >
          Find CPC
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
          onClick={() => setMode('clicks')}
          className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
            mode === 'clicks' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
          }`}
        >
          Find Clicks
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

        {mode !== 'clicks' && (
          <label className="space-y-2">
            <span className="text-sm font-medium">Number of Clicks</span>
            <input
              type="number"
              value={clicks}
              onChange={(e) => setClicks(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              placeholder="Total clicks"
              min="0"
            />
          </label>
        )}

        {mode !== 'cpc' && (
          <label className="space-y-2">
            <span className="text-sm font-medium">CPC ($)</span>
            <input
              type="number"
              value={cpc}
              onChange={(e) => setCpc(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              placeholder="Cost per click"
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
