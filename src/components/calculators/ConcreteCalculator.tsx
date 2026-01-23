import { useState, useMemo, useCallback } from 'react';
import { Copy, RotateCcw, Check } from 'lucide-react';

export function ConcreteCalculator() {
  const [length, setLength] = useState('10');
  const [width, setWidth] = useState('10');
  const [depth, setDepth] = useState('4');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const l = parseFloat(length), w = parseFloat(width), d = parseFloat(depth);
    if ([l, w, d].some(v => isNaN(v) || v <= 0)) return null;
    const cubicFeet = l * w * (d / 12);
    const cubicYards = cubicFeet / 27;
    const bags60lb = Math.ceil(cubicFeet * 2.2);
    const bags80lb = Math.ceil(cubicFeet * 1.65);
    return { cubicFeet, cubicYards, bags60lb, bags80lb };
  }, [length, width, depth]);

  const reset = useCallback(() => { setLength('10'); setWidth('10'); setDepth('4'); }, []);
  const copyResult = useCallback(() => { if (result) { navigator.clipboard.writeText(`Concrete: ${result.cubicYards.toFixed(2)} cubic yards\n60lb bags: ${result.bags60lb}\n80lb bags: ${result.bags80lb}`); setCopied(true); setTimeout(() => setCopied(false), 2000); } }, [result]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        <label className="space-y-1"><span className="text-xs font-medium">Length (ft)</span><input type="number" value={length} onChange={(e) => setLength(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border focus:border-primary outline-none text-sm" min="0" /></label>
        <label className="space-y-1"><span className="text-xs font-medium">Width (ft)</span><input type="number" value={width} onChange={(e) => setWidth(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border focus:border-primary outline-none text-sm" min="0" /></label>
        <label className="space-y-1"><span className="text-xs font-medium">Depth (in)</span><input type="number" value={depth} onChange={(e) => setDepth(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border focus:border-primary outline-none text-sm" min="0" /></label>
      </div>
      <div className="p-4 rounded-xl bg-secondary/30 border border-border text-center">
        {result ? (<><span className="text-sm text-muted-foreground block">Concrete Volume</span><span className="text-3xl font-bold gradient-text">{result.cubicYards.toFixed(2)} yd³</span><div className="grid grid-cols-2 gap-2 mt-3 text-sm"><div className="p-2 bg-secondary/50 rounded"><span className="text-muted-foreground">60lb bags:</span> {result.bags60lb}</div><div className="p-2 bg-secondary/50 rounded"><span className="text-muted-foreground">80lb bags:</span> {result.bags80lb}</div></div></>) : <span className="text-muted-foreground">Enter dimensions</span>}
      </div>
      <div className="flex gap-3">
        <button onClick={reset} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"><RotateCcw className="w-4 h-4" />Reset</button>
        <button onClick={copyResult} disabled={!result} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50">{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}{copied ? 'Copied!' : 'Copy'}</button>
      </div>
    </div>
  );
}
