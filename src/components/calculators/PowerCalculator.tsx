import { useState, useMemo, useCallback } from 'react';
import { Copy, RotateCcw, Check } from 'lucide-react';

export function PowerCalculator() {
  const [watts, setWatts] = useState('100');
  const [hours, setHours] = useState('5');
  const [rate, setRate] = useState('0.12');
  const [days, setDays] = useState('30');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const w = parseFloat(watts);
    const h = parseFloat(hours);
    const r = parseFloat(rate);
    const d = parseInt(days);

    if (isNaN(w) || isNaN(h) || isNaN(r) || isNaN(d) || w < 0 || h < 0 || r < 0 || d < 0) {
      return null;
    }

    const dailyKwh = (w * h) / 1000;
    const monthlyKwh = dailyKwh * d;
    const dailyCost = dailyKwh * r;
    const monthlyCost = monthlyKwh * r;
    const yearlyCost = monthlyCost * 12;

    return {
      dailyKwh,
      monthlyKwh,
      dailyCost,
      monthlyCost,
      yearlyCost,
    };
  }, [watts, hours, rate, days]);

  const reset = useCallback(() => {
    setWatts('100');
    setHours('5');
    setRate('0.12');
    setDays('30');
  }, []);

  const copyResult = useCallback(() => {
    if (result) {
      navigator.clipboard.writeText(
        `Power: ${watts}W\nUsage: ${hours}h/day for ${days} days\nDaily: ${result.dailyKwh.toFixed(2)} kWh ($${result.dailyCost.toFixed(2)})\nMonthly: ${result.monthlyKwh.toFixed(2)} kWh ($${result.monthlyCost.toFixed(2)})\nYearly: $${result.yearlyCost.toFixed(2)}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result, watts, hours, days]);

  const presets = [
    { label: 'LED Bulb', watts: 10 },
    { label: 'Fan', watts: 75 },
    { label: 'TV', watts: 120 },
    { label: 'AC', watts: 1500 },
    { label: 'Heater', watts: 2000 },
  ];

  return (
    <div className="space-y-6">
      {/* Presets */}
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button
            key={preset.label}
            onClick={() => setWatts(preset.watts.toString())}
            className="px-3 py-1.5 text-sm rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
          >
            {preset.label} ({preset.watts}W)
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium">Power (Watts)</span>
          <input
            type="number"
            value={watts}
            onChange={(e) => setWatts(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="Enter watts"
            min="0"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Hours per Day</span>
          <input
            type="number"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="Enter hours"
            min="0"
            max="24"
            step="0.5"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Electricity Rate ($/kWh)</span>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="Enter rate"
            min="0"
            step="0.01"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Days per Month</span>
          <input
            type="number"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="Enter days"
            min="1"
            max="31"
          />
        </label>
      </div>

      {/* Results */}
      <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-4">
        {result ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-lg bg-secondary/50">
                <div className="text-sm text-muted-foreground">Daily Usage</div>
                <div className="text-lg font-bold">{result.dailyKwh.toFixed(2)} kWh</div>
                <div className="text-sm text-primary">${result.dailyCost.toFixed(2)}</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-secondary/50">
                <div className="text-sm text-muted-foreground">Monthly Usage</div>
                <div className="text-lg font-bold">{result.monthlyKwh.toFixed(2)} kWh</div>
                <div className="text-sm text-primary">${result.monthlyCost.toFixed(2)}</div>
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-border pt-3">
              <span className="font-medium">Yearly Cost</span>
              <span className="text-2xl font-bold gradient-text">
                ${result.yearlyCost.toFixed(2)}
              </span>
            </div>
          </>
        ) : (
          <div className="text-center text-muted-foreground py-2">
            Enter valid positive values
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
