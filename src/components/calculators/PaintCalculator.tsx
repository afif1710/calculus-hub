import { useState, useMemo, useCallback } from 'react';
import { Copy, RotateCcw, Check } from 'lucide-react';

export function PaintCalculator() {
  const [length, setLength] = useState('12');
  const [width, setWidth] = useState('10');
  const [height, setHeight] = useState('8');
  const [doors, setDoors] = useState('1');
  const [windows, setWindows] = useState('2');
  const [coats, setCoats] = useState('2');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const l = parseFloat(length), w = parseFloat(width), h = parseFloat(height);
    const d = parseInt(doors) || 0, win = parseInt(windows) || 0, c = parseInt(coats) || 1;
    if ([l, w, h].some(v => isNaN(v) || v <= 0)) return null;
    const wallArea = 2 * (l + w) * h;
    const doorArea = d * 21; // ~21 sq ft per door
    const windowArea = win * 15; // ~15 sq ft per window
    const paintableArea = Math.max(0, wallArea - doorArea - windowArea);
    const totalArea = paintableArea * c;
    const gallons = totalArea / 350; // 350 sq ft per gallon
    return { paintableArea, totalArea, gallons: Math.ceil(gallons), exactGallons: gallons };
  }, [length, width, height, doors, windows, coats]);

  const reset = useCallback(() => { setLength('12'); setWidth('10'); setHeight('8'); setDoors('1'); setWindows('2'); setCoats('2'); }, []);
  const copyResult = useCallback(() => { if (result) { navigator.clipboard.writeText(`Paint needed: ${result.gallons} gallons\nArea: ${result.paintableArea.toFixed(0)} sq ft`); setCopied(true); setTimeout(() => setCopied(false), 2000); } }, [result]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        <label className="space-y-1"><span className="text-xs font-medium">Length (ft)</span><input type="number" value={length} onChange={(e) => setLength(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border focus:border-primary outline-none text-sm" min="0" /></label>
        <label className="space-y-1"><span className="text-xs font-medium">Width (ft)</span><input type="number" value={width} onChange={(e) => setWidth(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border focus:border-primary outline-none text-sm" min="0" /></label>
        <label className="space-y-1"><span className="text-xs font-medium">Height (ft)</span><input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border focus:border-primary outline-none text-sm" min="0" /></label>
        <label className="space-y-1"><span className="text-xs font-medium">Doors</span><input type="number" value={doors} onChange={(e) => setDoors(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border focus:border-primary outline-none text-sm" min="0" /></label>
        <label className="space-y-1"><span className="text-xs font-medium">Windows</span><input type="number" value={windows} onChange={(e) => setWindows(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border focus:border-primary outline-none text-sm" min="0" /></label>
        <label className="space-y-1"><span className="text-xs font-medium">Coats</span><input type="number" value={coats} onChange={(e) => setCoats(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border focus:border-primary outline-none text-sm" min="1" /></label>
      </div>
      <div className="p-4 rounded-xl bg-secondary/30 border border-border text-center">
        {result ? (<><span className="text-sm text-muted-foreground block">Paint Needed</span><span className="text-3xl font-bold gradient-text">{result.gallons} gallons</span><span className="text-sm text-muted-foreground block mt-2">{result.paintableArea.toFixed(0)} sq ft × {coats} coats</span></>) : <span className="text-muted-foreground">Enter room dimensions</span>}
      </div>
      <div className="flex gap-3">
        <button onClick={reset} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"><RotateCcw className="w-4 h-4" />Reset</button>
        <button onClick={copyResult} disabled={!result} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50">{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}{copied ? 'Copied!' : 'Copy'}</button>
      </div>
    </div>
  );
}
