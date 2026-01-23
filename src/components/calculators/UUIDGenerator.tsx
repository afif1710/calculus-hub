import { useState, useCallback } from 'react';
import { Copy, RotateCcw, Check, RefreshCw } from 'lucide-react';

function generateUUIDv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function UUIDGenerator() {
  const [uuids, setUuids] = useState<string[]>(() => [generateUUIDv4()]);
  const [count, setCount] = useState('1');
  const [format, setFormat] = useState<'standard' | 'uppercase' | 'no-dashes'>('standard');
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    const n = Math.min(Math.max(1, parseInt(count) || 1), 100);
    const newUuids = Array.from({ length: n }, () => generateUUIDv4());
    setUuids(newUuids);
  }, [count]);

  const formatUUID = (uuid: string) => {
    switch (format) {
      case 'uppercase': return uuid.toUpperCase();
      case 'no-dashes': return uuid.replace(/-/g, '');
      default: return uuid;
    }
  };

  const reset = useCallback(() => {
    setUuids([generateUUIDv4()]);
    setCount('1');
    setFormat('standard');
  }, []);

  const copyAll = useCallback(() => {
    const text = uuids.map(formatUUID).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [uuids, format]);

  const copySingle = useCallback((uuid: string) => {
    navigator.clipboard.writeText(formatUUID(uuid));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [format]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <label className="space-y-2">
          <span className="text-sm font-medium">Count (1-100)</span>
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            min="1"
            max="100"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Format</span>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as typeof format)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none transition-all"
          >
            <option value="standard">Standard</option>
            <option value="uppercase">UPPERCASE</option>
            <option value="no-dashes">No Dashes</option>
          </select>
        </label>
      </div>

      <button
        onClick={generate}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        <RefreshCw className="w-4 h-4" />
        Generate UUID{parseInt(count) > 1 ? 's' : ''}
      </button>

      {/* Results */}
      <div className="p-4 rounded-xl bg-secondary/30 border border-border">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium">Generated UUIDs (v4)</span>
          <span className="text-xs text-muted-foreground">{uuids.length} UUID{uuids.length > 1 ? 's' : ''}</span>
        </div>
        
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {uuids.map((uuid, i) => (
            <div 
              key={i}
              className="flex items-center justify-between gap-2 p-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group"
            >
              <code className="text-sm font-mono text-primary flex-1 break-all">
                {formatUUID(uuid)}
              </code>
              <button
                onClick={() => copySingle(uuid)}
                className="p-1.5 rounded hover:bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="text-xs text-muted-foreground p-3 bg-secondary/20 rounded-lg">
        UUID v4 uses random numbers. Probability of collision is astronomically low (~10⁻³⁷).
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
          onClick={copyAll}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy All'}
        </button>
      </div>
    </div>
  );
}
