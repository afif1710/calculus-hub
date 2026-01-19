import { useState, useCallback, useMemo } from 'react';
import { Copy, RotateCcw, Check, Clock, ArrowRightLeft } from 'lucide-react';

const TIMEZONES = [
  { id: 'UTC', label: 'UTC', offset: 0 },
  { id: 'America/New_York', label: 'New York (EST/EDT)', offset: -5 },
  { id: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)', offset: -8 },
  { id: 'America/Chicago', label: 'Chicago (CST/CDT)', offset: -6 },
  { id: 'America/Denver', label: 'Denver (MST/MDT)', offset: -7 },
  { id: 'Europe/London', label: 'London (GMT/BST)', offset: 0 },
  { id: 'Europe/Paris', label: 'Paris (CET/CEST)', offset: 1 },
  { id: 'Europe/Berlin', label: 'Berlin (CET/CEST)', offset: 1 },
  { id: 'Asia/Tokyo', label: 'Tokyo (JST)', offset: 9 },
  { id: 'Asia/Shanghai', label: 'Shanghai (CST)', offset: 8 },
  { id: 'Asia/Hong_Kong', label: 'Hong Kong (HKT)', offset: 8 },
  { id: 'Asia/Singapore', label: 'Singapore (SGT)', offset: 8 },
  { id: 'Asia/Dubai', label: 'Dubai (GST)', offset: 4 },
  { id: 'Asia/Kolkata', label: 'Mumbai (IST)', offset: 5.5 },
  { id: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)', offset: 11 },
  { id: 'Pacific/Auckland', label: 'Auckland (NZST/NZDT)', offset: 13 },
];

export function TimezoneConverter() {
  const [dateTime, setDateTime] = useState(() => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  });
  const [fromZone, setFromZone] = useState('UTC');
  const [toZone, setToZone] = useState('America/New_York');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!dateTime) return null;

    try {
      // Create a date object from the input
      const inputDate = new Date(dateTime);
      if (isNaN(inputDate.getTime())) return null;

      // Format for different timezones
      const formatOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZoneName: 'short',
      };

      const fromFormatted = inputDate.toLocaleString('en-US', {
        ...formatOptions,
        timeZone: fromZone,
      });

      const toFormatted = inputDate.toLocaleString('en-US', {
        ...formatOptions,
        timeZone: toZone,
      });

      // Calculate time difference
      const fromOffset = new Date(inputDate.toLocaleString('en-US', { timeZone: fromZone })).getTime();
      const toOffset = new Date(inputDate.toLocaleString('en-US', { timeZone: toZone })).getTime();
      const diffMs = toOffset - fromOffset;
      const diffHours = diffMs / (1000 * 60 * 60);

      return {
        from: fromFormatted,
        to: toFormatted,
        diffHours: diffHours >= 0 ? `+${diffHours}` : `${diffHours}`,
        iso: inputDate.toISOString(),
      };
    } catch {
      return null;
    }
  }, [dateTime, fromZone, toZone]);

  const swap = () => {
    setFromZone(toZone);
    setToZone(fromZone);
  };

  const setNow = () => {
    const now = new Date();
    setDateTime(now.toISOString().slice(0, 16));
  };

  const reset = useCallback(() => {
    const now = new Date();
    setDateTime(now.toISOString().slice(0, 16));
    setFromZone('UTC');
    setToZone('America/New_York');
  }, []);

  const copyResult = useCallback(() => {
    if (result) {
      navigator.clipboard.writeText(result.to);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result]);

  return (
    <div className="space-y-6">
      {/* Current Time Display */}
      <div className="p-4 rounded-xl bg-secondary/50 text-center">
        <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
          <Clock className="w-4 h-4" />
          <span className="text-sm">Your Local Time</span>
        </div>
        <div className="text-lg font-medium">
          {new Date().toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'medium',
          })}
        </div>
      </div>

      {/* Date Time Input */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          Date & Time to Convert
        </label>
        <div className="flex gap-2">
          <input
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
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

      {/* Timezone Selectors */}
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            From Timezone
          </label>
          <select
            value={fromZone}
            onChange={(e) => setFromZone(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none transition-all"
          >
            {TIMEZONES.map((tz) => (
              <option key={tz.id} value={tz.id}>
                {tz.label}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={swap}
          className="p-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors mb-0"
          aria-label="Swap timezones"
        >
          <ArrowRightLeft className="w-5 h-5" />
        </button>

        <div className="flex-1">
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            To Timezone
          </label>
          <select
            value={toZone}
            onChange={(e) => setToZone(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none transition-all"
          >
            {TIMEZONES.map((tz) => (
              <option key={tz.id} value={tz.id}>
                {tz.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="p-6 rounded-xl bg-primary/10 border border-primary/20">
          <div className="space-y-4">
            <div className="text-center p-3 rounded-xl bg-secondary/30">
              <div className="text-xs text-muted-foreground mb-1">From ({fromZone})</div>
              <div className="font-medium">{result.from}</div>
            </div>
            <div className="text-center text-muted-foreground text-sm">
              ↓ {result.diffHours} hours
            </div>
            <div className="text-center p-3 rounded-xl bg-primary/20">
              <div className="text-xs text-muted-foreground mb-1">To ({toZone})</div>
              <div className="text-xl font-bold gradient-text">{result.to}</div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Timezone Grid */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          World Clocks
        </label>
        <div className="grid grid-cols-2 gap-2">
          {['America/New_York', 'Europe/London', 'Asia/Tokyo', 'Australia/Sydney'].map((tz) => {
            const label = TIMEZONES.find((t) => t.id === tz)?.label || tz;
            const time = new Date().toLocaleString('en-US', {
              timeZone: tz,
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            });
            return (
              <div key={tz} className="p-3 rounded-xl bg-secondary/30 text-center">
                <div className="text-sm font-medium">{time}</div>
                <div className="text-xs text-muted-foreground">{label.split(' ')[0]}</div>
              </div>
            );
          })}
        </div>
      </div>

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
