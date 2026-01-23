import { useState, useMemo, useCallback } from 'react';
import { Copy, RotateCcw, Check } from 'lucide-react';

export function FuelEfficiencyCalculator() {
  const [value, setValue] = useState('30');
  const [from, setFrom] = useState<'mpg' | 'kmpl' | 'l100km'>('mpg');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const v = parseFloat(value);
    if (isNaN(v) || v <= 0) return null;
    let mpg: number, kmpl: number, l100km: number;
    if (from === 'mpg') { mpg = v; kmpl = v * 0.425144; l100km = 235.215 / v; }
    else if (from === 'kmpl') { kmpl = v; mpg = v / 0.425144; l100km = 100 / v; }
    else { l100km = v; mpg = 235.215 / v; kmpl = 100 / v; }
    return { mpg, kmpl, l100km };
  }, [value, from]);

  const reset = useCallback(() => { setValue('30'); setFrom('mpg'); }, []);
  const copyResult = useCallback(() => { if (result) { navigator.clipboard.writeText(`MPG: ${result.mpg.toFixed(2)}\nkm/L: ${result.kmpl.toFixed(2)}\nL/100km: ${result.l100km.toFixed(2)}`); setCopied(true); setTimeout(() => setCopied(false), 2000); } }, [result]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        <label className="space-y-1"><span className="text-xs font-medium">Value</span><input type="number" value={value} onChange={(e) => setValue(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border focus:border-primary outline-none text-sm" min="0" step="0.1" /></label>
        <label className="space-y-1"><span className="text-xs font-medium">Unit</span><select value={from} onChange={(e) => setFrom(e.target.value as typeof from)} className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border focus:border-primary outline-none text-sm"><option value="mpg">MPG (US)</option><option value="kmpl">km/L</option><option value="l100km">L/100km</option></select></label>
      </div>
      <div className="p-4 rounded-xl bg-secondary/30 border border-border">
        {result ? (<div className="grid grid-cols-3 gap-3 text-center"><div className={`p-3 rounded-lg ${from === 'mpg' ? 'bg-primary/20 border border-primary' : 'bg-secondary/50'}`}><span className="text-xs text-muted-foreground">MPG</span><div className="text-lg font-bold">{result.mpg.toFixed(1)}</div></div><div className={`p-3 rounded-lg ${from === 'kmpl' ? 'bg-primary/20 border border-primary' : 'bg-secondary/50'}`}><span className="text-xs text-muted-foreground">km/L</span><div className="text-lg font-bold">{result.kmpl.toFixed(1)}</div></div><div className={`p-3 rounded-lg ${from === 'l100km' ? 'bg-primary/20 border border-primary' : 'bg-secondary/50'}`}><span className="text-xs text-muted-foreground">L/100km</span><div className="text-lg font-bold">{result.l100km.toFixed(1)}</div></div></div>) : <span className="text-center block text-muted-foreground">Enter a value</span>}
      </div>
      <div className="flex gap-3">
        <button onClick={reset} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"><RotateCcw className="w-4 h-4" />Reset</button>
        <button onClick={copyResult} disabled={!result} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50">{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}{copied ? 'Copied!' : 'Copy'}</button>
      </div>
    </div>
  );
}
