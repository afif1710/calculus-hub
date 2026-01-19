import { useState, useMemo, useCallback } from 'react';
import { Copy, RotateCcw, Check, Lock, Unlock } from 'lucide-react';

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export function AspectRatioCalculator() {
  const [width1, setWidth1] = useState('1920');
  const [height1, setHeight1] = useState('1080');
  const [width2, setWidth2] = useState('');
  const [height2, setHeight2] = useState('');
  const [locked, setLocked] = useState<'width' | 'height' | null>(null);
  const [copied, setCopied] = useState(false);

  const ratio = useMemo(() => {
    const w = parseInt(width1);
    const h = parseInt(height1);
    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) return null;

    const divisor = gcd(w, h);
    return {
      width: w / divisor,
      height: h / divisor,
      decimal: w / h,
    };
  }, [width1, height1]);

  // Calculate the other dimension when one is entered
  const handleWidth2Change = useCallback(
    (value: string) => {
      setWidth2(value);
      if (ratio && value) {
        const w = parseFloat(value);
        if (!isNaN(w) && w > 0) {
          setHeight2(Math.round(w / ratio.decimal).toString());
        }
      }
    },
    [ratio]
  );

  const handleHeight2Change = useCallback(
    (value: string) => {
      setHeight2(value);
      if (ratio && value) {
        const h = parseFloat(value);
        if (!isNaN(h) && h > 0) {
          setWidth2(Math.round(h * ratio.decimal).toString());
        }
      }
    },
    [ratio]
  );

  const reset = useCallback(() => {
    setWidth1('1920');
    setHeight1('1080');
    setWidth2('');
    setHeight2('');
    setLocked(null);
  }, []);

  const copyResult = useCallback(() => {
    if (ratio) {
      const text = `Aspect Ratio: ${ratio.width}:${ratio.height}\nDecimal: ${ratio.decimal.toFixed(4)}${width2 && height2 ? `\nScaled: ${width2} × ${height2}` : ''}`;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [ratio, width2, height2]);

  const presets = [
    { label: '16:9', w: 1920, h: 1080 },
    { label: '4:3', w: 1600, h: 1200 },
    { label: '21:9', w: 2560, h: 1080 },
    { label: '1:1', w: 1080, h: 1080 },
    { label: '9:16', w: 1080, h: 1920 },
  ];

  return (
    <div className="space-y-6">
      {/* Presets */}
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button
            key={preset.label}
            onClick={() => {
              setWidth1(preset.w.toString());
              setHeight1(preset.h.toString());
            }}
            className="px-3 py-1.5 text-sm rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Original Dimensions */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Original Dimensions</label>
        <div className="flex gap-3 items-center">
          <input
            type="number"
            value={width1}
            onChange={(e) => setWidth1(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="Width"
            min="1"
          />
          <span className="text-muted-foreground">×</span>
          <input
            type="number"
            value={height1}
            onChange={(e) => setHeight1(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="Height"
            min="1"
          />
        </div>
      </div>

      {/* Ratio Result */}
      {ratio && (
        <div className="p-4 rounded-xl bg-secondary/30 border border-border text-center">
          <div className="text-sm text-muted-foreground mb-1">Aspect Ratio</div>
          <div className="text-3xl font-bold gradient-text">
            {ratio.width}:{ratio.height}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            ≈ {ratio.decimal.toFixed(4)}
          </div>
        </div>
      )}

      {/* Scale Calculator */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Scale to New Size</label>
        <div className="flex gap-3 items-center">
          <div className="flex-1 relative">
            <input
              type="number"
              value={width2}
              onChange={(e) => handleWidth2Change(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              placeholder="New width"
              min="1"
            />
          </div>
          <button
            onClick={() => setLocked(locked === 'width' ? null : 'width')}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
            title="Lock aspect ratio"
          >
            {locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          </button>
          <div className="flex-1">
            <input
              type="number"
              value={height2}
              onChange={(e) => handleHeight2Change(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              placeholder="New height"
              min="1"
            />
          </div>
        </div>
        {width2 && height2 && (
          <div className="text-sm text-muted-foreground text-center">
            Scaled size: {width2} × {height2} pixels
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
          disabled={!ratio}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy Result'}
        </button>
      </div>
    </div>
  );
}
