import { useState, useMemo, useCallback } from 'react';
import { Copy, RotateCcw, Check } from 'lucide-react';

type SolveFor = 'voltage' | 'current' | 'resistance';

export function OhmsLawCalculator() {
  const [voltage, setVoltage] = useState('12');
  const [current, setCurrent] = useState('2');
  const [resistance, setResistance] = useState('');
  const [solveFor, setSolveFor] = useState<SolveFor>('resistance');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const v = parseFloat(voltage);
    const i = parseFloat(current);
    const r = parseFloat(resistance);

    if (solveFor === 'voltage') {
      if (isNaN(i) || isNaN(r) || i < 0 || r < 0) return null;
      return { value: i * r, unit: 'V', label: 'Voltage' };
    } else if (solveFor === 'current') {
      if (isNaN(v) || isNaN(r) || v < 0 || r <= 0) return null;
      return { value: v / r, unit: 'A', label: 'Current' };
    } else {
      if (isNaN(v) || isNaN(i) || v < 0 || i <= 0) return null;
      return { value: v / i, unit: 'Ω', label: 'Resistance' };
    }
  }, [voltage, current, resistance, solveFor]);

  const power = useMemo(() => {
    const v = parseFloat(voltage);
    const i = parseFloat(current);
    const r = parseFloat(resistance);

    if (result) {
      if (solveFor === 'voltage') {
        return result.value * i;
      } else if (solveFor === 'current') {
        return v * result.value;
      } else {
        return v * i;
      }
    }
    return null;
  }, [result, voltage, current, resistance, solveFor]);

  const reset = useCallback(() => {
    setVoltage('12');
    setCurrent('2');
    setResistance('');
    setSolveFor('resistance');
  }, []);

  const copyResult = useCallback(() => {
    if (result) {
      navigator.clipboard.writeText(
        `${result.label}: ${result.value.toFixed(4)} ${result.unit}\nPower: ${power?.toFixed(4)} W`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result, power]);

  return (
    <div className="space-y-6">
      {/* Solve For */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Solve for</label>
        <div className="flex gap-2 p-1 bg-secondary/50 rounded-xl">
          {(['voltage', 'current', 'resistance'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setSolveFor(type)}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                solveFor === type
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-secondary'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Inputs */}
      <div className="grid gap-4">
        {solveFor !== 'voltage' && (
          <label className="space-y-2">
            <span className="text-sm font-medium">Voltage (V)</span>
            <input
              type="number"
              value={voltage}
              onChange={(e) => setVoltage(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              placeholder="Enter voltage"
              min="0"
              step="0.1"
            />
          </label>
        )}

        {solveFor !== 'current' && (
          <label className="space-y-2">
            <span className="text-sm font-medium">Current (A)</span>
            <input
              type="number"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              placeholder="Enter current"
              min="0"
              step="0.01"
            />
          </label>
        )}

        {solveFor !== 'resistance' && (
          <label className="space-y-2">
            <span className="text-sm font-medium">Resistance (Ω)</span>
            <input
              type="number"
              value={resistance}
              onChange={(e) => setResistance(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              placeholder="Enter resistance"
              min="0"
              step="0.1"
            />
          </label>
        )}
      </div>

      {/* Formula Reference */}
      <div className="p-3 rounded-lg bg-secondary/30 border border-border text-sm text-muted-foreground text-center">
        V = I × R | I = V / R | R = V / I | P = V × I
      </div>

      {/* Results */}
      <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-3">
        {result ? (
          <>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">{result.label}</span>
              <span className="text-2xl font-bold gradient-text">
                {result.value.toFixed(4)} {result.unit}
              </span>
            </div>
            {power !== null && (
              <div className="flex justify-between items-center border-t border-border pt-3">
                <span className="text-muted-foreground">Power</span>
                <span className="text-xl font-semibold text-primary">
                  {power.toFixed(4)} W
                </span>
              </div>
            )}
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
