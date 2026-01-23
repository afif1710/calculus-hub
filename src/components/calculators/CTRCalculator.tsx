import { useState, useMemo, useCallback } from 'react';
import { Copy, RotateCcw, Check } from 'lucide-react';

export function CTRCalculator() {
  const [clicks, setClicks] = useState('150');
  const [impressions, setImpressions] = useState('10000');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const clicksVal = parseFloat(clicks);
    const impVal = parseFloat(impressions);

    if (isNaN(clicksVal) || isNaN(impVal) || clicksVal < 0 || impVal <= 0) {
      return null;
    }

    const ctr = (clicksVal / impVal) * 100;
    
    // CTR benchmarks
    let benchmark = '';
    if (ctr < 0.5) benchmark = 'Below average';
    else if (ctr < 1) benchmark = 'Average';
    else if (ctr < 2) benchmark = 'Good';
    else if (ctr < 5) benchmark = 'Very good';
    else benchmark = 'Excellent';

    return { ctr, benchmark };
  }, [clicks, impressions]);

  const reset = useCallback(() => {
    setClicks('150');
    setImpressions('10000');
  }, []);

  const copyResult = useCallback(() => {
    if (result) {
      navigator.clipboard.writeText(`CTR: ${result.ctr.toFixed(2)}%\nClicks: ${clicks}\nImpressions: ${impressions}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result, clicks, impressions]);

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground p-3 bg-secondary/20 rounded-lg">
        CTR = (Clicks / Impressions) × 100
      </div>

      <div className="grid gap-4">
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
      </div>

      {/* Result */}
      <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-3">
        {result ? (
          <>
            <div className="text-center">
              <span className="text-sm text-muted-foreground block">Click-Through Rate</span>
              <span className="text-3xl font-bold gradient-text">
                {result.ctr.toFixed(2)}%
              </span>
            </div>
            <div className="text-center border-t border-border pt-3">
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                result.ctr >= 2 ? 'bg-green-500/20 text-green-500' :
                result.ctr >= 1 ? 'bg-blue-500/20 text-blue-500' :
                result.ctr >= 0.5 ? 'bg-amber-500/20 text-amber-500' :
                'bg-red-500/20 text-red-500'
              }`}>
                {result.benchmark}
              </span>
            </div>
          </>
        ) : (
          <div className="text-center text-muted-foreground py-2">
            Enter valid values
          </div>
        )}
      </div>

      {/* Benchmark Reference */}
      <details className="text-sm">
        <summary className="text-muted-foreground cursor-pointer hover:text-foreground">
          CTR Benchmarks
        </summary>
        <div className="mt-2 p-3 rounded-lg bg-secondary/30 space-y-1 text-xs">
          <div className="flex justify-between"><span>&lt; 0.5%</span><span className="text-red-500">Below average</span></div>
          <div className="flex justify-between"><span>0.5% - 1%</span><span className="text-amber-500">Average</span></div>
          <div className="flex justify-between"><span>1% - 2%</span><span className="text-blue-500">Good</span></div>
          <div className="flex justify-between"><span>2% - 5%</span><span className="text-green-500">Very good</span></div>
          <div className="flex justify-between"><span>&gt; 5%</span><span className="text-green-500">Excellent</span></div>
        </div>
      </details>

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
