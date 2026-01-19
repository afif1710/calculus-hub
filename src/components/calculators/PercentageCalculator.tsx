import { useState, useMemo } from 'react';
import { Percent } from 'lucide-react';

export function PercentageCalculator() {
  const [mode, setMode] = useState<'whatIs' | 'whatPercent' | 'change'>('whatIs');
  const [value1, setValue1] = useState(25);
  const [value2, setValue2] = useState(200);

  const result = useMemo(() => {
    const v1 = Number(value1);
    const v2 = Number(value2);

    switch (mode) {
      case 'whatIs':
        // What is X% of Y?
        return { 
          answer: (v1 / 100) * v2,
          label: `${v1}% of ${v2}`
        };
      case 'whatPercent':
        // X is what % of Y?
        return { 
          answer: (v1 / v2) * 100,
          label: `${v1} is what % of ${v2}`,
          isPercent: true
        };
      case 'change':
        // % change from X to Y
        const change = ((v2 - v1) / Math.abs(v1)) * 100;
        return { 
          answer: change,
          label: `Change from ${v1} to ${v2}`,
          isPercent: true,
          isPositive: change >= 0
        };
    }
  }, [mode, value1, value2]);

  const modes = [
    { id: 'whatIs', label: 'X% of Y' },
    { id: 'whatPercent', label: 'X is ?% of Y' },
    { id: 'change', label: '% Change' },
  ] as const;

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        {modes.map(m => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              mode === m.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-muted-foreground">
            {mode === 'whatIs' ? 'Percentage' : mode === 'whatPercent' ? 'Part' : 'Original Value'}
          </span>
          <input
            value={value1}
            onChange={e => setValue1(Number(e.target.value))}
            className="input-calc"
            type="number"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-muted-foreground">
            {mode === 'whatIs' ? 'Total' : mode === 'whatPercent' ? 'Whole' : 'New Value'}
          </span>
          <input
            value={value2}
            onChange={e => setValue2(Number(e.target.value))}
            className="input-calc"
            type="number"
          />
        </label>
      </div>

      <div className="p-5 rounded-xl bg-secondary/30 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Percent className="w-5 h-5 text-primary" />
          <span className="text-sm text-muted-foreground">{result.label}</span>
        </div>
        <div className={`text-4xl font-bold ${
          'isPositive' in result 
            ? result.isPositive ? 'text-green-500' : 'text-red-500'
            : 'gradient-text'
        }`}>
          {'isPositive' in result && result.answer > 0 ? '+' : ''}
          {result.answer.toFixed(2)}
          {'isPercent' in result && '%'}
        </div>
      </div>
    </div>
  );
}
