import { useState, useMemo, useCallback } from 'react';
import { Copy, RotateCcw, Check } from 'lucide-react';

export function DurationCalculator() {
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    const future = new Date();
    future.setMonth(future.getMonth() + 3);
    return future.toISOString().split('T')[0];
  });
  const [includeEndDay, setIncludeEndDay] = useState(true);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return null;
    }

    const diffTime = end.getTime() - start.getTime();
    let totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (includeEndDay) totalDays += 1;

    const isNegative = totalDays < 0;
    const absDays = Math.abs(totalDays);

    const years = Math.floor(absDays / 365);
    const months = Math.floor((absDays % 365) / 30);
    const days = absDays % 30;
    const weeks = Math.floor(absDays / 7);

    return {
      totalDays: absDays,
      years,
      months,
      days,
      weeks,
      isNegative,
      hours: absDays * 24,
      minutes: absDays * 24 * 60,
    };
  }, [startDate, endDate, includeEndDay]);

  const setPreset = useCallback((preset: string) => {
    const today = new Date();
    const start = today.toISOString().split('T')[0];
    setStartDate(start);

    const future = new Date(today);
    switch (preset) {
      case 'week':
        future.setDate(future.getDate() + 7);
        break;
      case 'month':
        future.setMonth(future.getMonth() + 1);
        break;
      case '3months':
        future.setMonth(future.getMonth() + 3);
        break;
      case 'year':
        future.setFullYear(future.getFullYear() + 1);
        break;
    }
    setEndDate(future.toISOString().split('T')[0]);
  }, []);

  const reset = useCallback(() => {
    const today = new Date();
    setStartDate(today.toISOString().split('T')[0]);
    const future = new Date();
    future.setMonth(future.getMonth() + 3);
    setEndDate(future.toISOString().split('T')[0]);
    setIncludeEndDay(true);
  }, []);

  const copyResult = useCallback(() => {
    if (result) {
      navigator.clipboard.writeText(
        `From: ${startDate}\nTo: ${endDate}\nTotal Days: ${result.totalDays}\nBreakdown: ${result.years}y ${result.months}m ${result.days}d\nWeeks: ${result.weeks}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result, startDate, endDate]);

  return (
    <div className="space-y-6">
      {/* Quick Presets */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: '1 Week', value: 'week' },
          { label: '1 Month', value: 'month' },
          { label: '3 Months', value: '3months' },
          { label: '1 Year', value: 'year' },
        ].map((preset) => (
          <button
            key={preset.value}
            onClick={() => setPreset(preset.value)}
            className="px-3 py-1.5 text-sm rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium">Start Date</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">End Date</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
          />
        </label>
      </div>

      {/* Include end day toggle */}
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={includeEndDay}
          onChange={(e) => setIncludeEndDay(e.target.checked)}
          className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
        />
        <span className="text-sm">Include end day in count</span>
      </label>

      {/* Results */}
      <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-4">
        {result ? (
          <>
            {result.isNegative && (
              <div className="text-center text-orange-500 text-sm">
                End date is before start date
              </div>
            )}

            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">Total Days</div>
              <div className="text-4xl font-bold gradient-text">
                {result.totalDays.toLocaleString()}
              </div>
            </div>

            <div className="text-center text-lg font-medium">
              {result.years > 0 && <span>{result.years} year{result.years !== 1 ? 's' : ''} </span>}
              {result.months > 0 && <span>{result.months} month{result.months !== 1 ? 's' : ''} </span>}
              {result.days > 0 && <span>{result.days} day{result.days !== 1 ? 's' : ''}</span>}
            </div>

            <div className="grid grid-cols-3 gap-3 text-center text-sm border-t border-border pt-4">
              <div>
                <div className="text-muted-foreground">Weeks</div>
                <div className="font-semibold">{result.weeks}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Hours</div>
                <div className="font-semibold">{result.hours.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Minutes</div>
                <div className="font-semibold">{result.minutes.toLocaleString()}</div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center text-muted-foreground py-2">
            Select valid dates
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
