import { useState, useMemo, useCallback } from 'react';
import { Copy, RotateCcw, Check } from 'lucide-react';

export function FlooringCalculator() {
  const [length, setLength] = useState('12');
  const [width, setWidth] = useState('10');
  const [tileSize, setTileSize] = useState('12');
  const [waste, setWaste] = useState('10');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const l = parseFloat(length), w = parseFloat(width), t = parseFloat(tileSize), wasteP = parseFloat(waste) / 100;
    if ([l, w, t].some(v => isNaN(v) || v <= 0)) return null;
    const areaFt = l * w;
    const tileAreaFt = (t * t) / 144;
    const tilesNeeded = Math.ceil(areaFt / tileAreaFt);
    const withWaste = Math.ceil(tilesNeeded * (1 + wasteP));
    const boxesOf10 = Math.ceil(withWaste / 10);
    return { areaFt, tilesNeeded, withWaste, boxesOf10 };
  }, [length, width, tileSize, waste]);

  const reset = useCallback(() => { setLength('12'); setWidth('10'); setTileSize('12'); setWaste('10'); }, []);
  const copyResult = useCallback(() => { if (result) { navigator.clipboard.writeText(`Tiles needed: ${result.withWaste}\nArea: ${result.areaFt} sq ft`); setCopied(true); setTimeout(() => setCopied(false), 2000); } }, [result]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        <label className="space-y-1"><span className="text-xs font-medium">Room Length (ft)</span><input type="number" value={length} onChange={(e) => setLength(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border focus:border-primary outline-none text-sm" min="0" /></label>
        <label className="space-y-1"><span className="text-xs font-medium">Room Width (ft)</span><input type="number" value={width} onChange={(e) => setWidth(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border focus:border-primary outline-none text-sm" min="0" /></label>
        <label className="space-y-1"><span className="text-xs font-medium">Tile Size (inches)</span><input type="number" value={tileSize} onChange={(e) => setTileSize(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border focus:border-primary outline-none text-sm" min="1" /></label>
        <label className="space-y-1"><span className="text-xs font-medium">Waste % (cuts)</span><input type="number" value={waste} onChange={(e) => setWaste(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border focus:border-primary outline-none text-sm" min="0" max="50" /></label>
      </div>
      <div className="p-4 rounded-xl bg-secondary/30 border border-border text-center">
        {result ? (<><span className="text-sm text-muted-foreground block">Tiles Needed (with {waste}% waste)</span><span className="text-3xl font-bold gradient-text">{result.withWaste} tiles</span><span className="text-sm text-muted-foreground block mt-2">{result.areaFt} sq ft • ~{result.boxesOf10} boxes of 10</span></>) : <span className="text-muted-foreground">Enter dimensions</span>}
      </div>
      <div className="flex gap-3">
        <button onClick={reset} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"><RotateCcw className="w-4 h-4" />Reset</button>
        <button onClick={copyResult} disabled={!result} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50">{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}{copied ? 'Copied!' : 'Copy'}</button>
      </div>
    </div>
  );
}
