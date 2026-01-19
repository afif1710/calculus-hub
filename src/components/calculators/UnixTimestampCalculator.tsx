import { useState, useCallback, useEffect } from 'react';
import { Copy, RotateCcw, Check, ArrowRightLeft, Clock } from 'lucide-react';

export function UnixTimestampCalculator() {
  const [timestamp, setTimestamp] = useState('');
  const [dateString, setDateString] = useState('');
  const [mode, setMode] = useState<'toDate' | 'toTimestamp'>('toDate');
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const convertedDate = useCallback(() => {
    if (!timestamp) return null;
    const ts = parseInt(timestamp);
    if (isNaN(ts)) {
      setError('Invalid timestamp');
      return null;
    }
    setError('');
    
    // Handle both seconds and milliseconds
    const date = ts > 9999999999 ? new Date(ts) : new Date(ts * 1000);
    if (isNaN(date.getTime())) {
      setError('Invalid timestamp');
      return null;
    }
    
    return {
      iso: date.toISOString(),
      local: date.toLocaleString(),
      utc: date.toUTCString(),
      relative: getRelativeTime(date),
    };
  }, [timestamp]);

  const convertedTimestamp = useCallback(() => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      setError('Invalid date format');
      return null;
    }
    setError('');
    
    return {
      seconds: Math.floor(date.getTime() / 1000),
      milliseconds: date.getTime(),
    };
  }, [dateString]);

  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.abs(diffMs / 1000);
    const isPast = diffMs > 0;

    if (diffSec < 60) return isPast ? 'just now' : 'in a moment';
    if (diffSec < 3600) {
      const mins = Math.floor(diffSec / 60);
      return isPast ? `${mins} minute${mins > 1 ? 's' : ''} ago` : `in ${mins} minute${mins > 1 ? 's' : ''}`;
    }
    if (diffSec < 86400) {
      const hours = Math.floor(diffSec / 3600);
      return isPast ? `${hours} hour${hours > 1 ? 's' : ''} ago` : `in ${hours} hour${hours > 1 ? 's' : ''}`;
    }
    const days = Math.floor(diffSec / 86400);
    return isPast ? `${days} day${days > 1 ? 's' : ''} ago` : `in ${days} day${days > 1 ? 's' : ''}`;
  };

  const setNow = () => {
    if (mode === 'toDate') {
      setTimestamp(Math.floor(Date.now() / 1000).toString());
    } else {
      setDateString(new Date().toISOString().slice(0, 16));
    }
  };

  const swap = () => {
    setMode(mode === 'toDate' ? 'toTimestamp' : 'toDate');
    setError('');
  };

  const reset = useCallback(() => {
    setTimestamp('');
    setDateString('');
    setError('');
  }, []);

  const copyResult = useCallback(() => {
    let textToCopy = '';
    if (mode === 'toDate') {
      const result = convertedDate();
      if (result) textToCopy = result.iso;
    } else {
      const result = convertedTimestamp();
      if (result) textToCopy = result.seconds.toString();
    }
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [mode, convertedDate, convertedTimestamp]);

  const result = mode === 'toDate' ? convertedDate() : convertedTimestamp();

  return (
    <div className="space-y-6">
      {/* Current Time Display */}
      <div className="p-4 rounded-xl bg-secondary/50 text-center">
        <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
          <Clock className="w-4 h-4" />
          <span className="text-sm">Current Unix Timestamp</span>
        </div>
        <div className="text-2xl font-mono font-bold">{Math.floor(currentTime / 1000)}</div>
        <div className="text-sm text-muted-foreground">{new Date(currentTime).toLocaleString()}</div>
      </div>

      {/* Mode Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMode('toDate')}
          className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${
            mode === 'toDate' ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'
          }`}
        >
          Timestamp → Date
        </button>
        <button
          onClick={swap}
          className="p-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
        >
          <ArrowRightLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setMode('toTimestamp')}
          className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${
            mode === 'toTimestamp' ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'
          }`}
        >
          Date → Timestamp
        </button>
      </div>

      {/* Input */}
      {mode === 'toDate' ? (
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Unix Timestamp (seconds or milliseconds)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              placeholder="e.g. 1704067200"
              className="flex-1 px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none transition-all font-mono"
            />
            <button
              onClick={setNow}
              className="px-4 py-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors text-sm"
            >
              Now
            </button>
          </div>
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Date & Time
          </label>
          <div className="flex gap-2">
            <input
              type="datetime-local"
              value={dateString}
              onChange={(e) => setDateString(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none transition-all"
            />
            <button
              onClick={setNow}
              className="px-4 py-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors text-sm"
            >
              Now
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {/* Result */}
      {result && !error && (
        <div className="p-6 rounded-xl bg-primary/10 border border-primary/20">
          {mode === 'toDate' && 'iso' in result ? (
            <div className="space-y-3">
              <div>
                <div className="text-sm text-muted-foreground">ISO 8601</div>
                <div className="font-mono text-sm break-all">{result.iso}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Local Time</div>
                <div className="font-medium">{result.local}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">UTC</div>
                <div className="font-medium">{result.utc}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Relative</div>
                <div className="font-medium">{result.relative}</div>
              </div>
            </div>
          ) : 'seconds' in result ? (
            <div className="space-y-3">
              <div>
                <div className="text-sm text-muted-foreground">Seconds</div>
                <div className="text-2xl font-mono font-bold">{result.seconds}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Milliseconds</div>
                <div className="font-mono">{result.milliseconds}</div>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={reset}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
        <button
          onClick={copyResult}
          disabled={!result || !!error}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy Result'}
        </button>
      </div>
    </div>
  );
}
