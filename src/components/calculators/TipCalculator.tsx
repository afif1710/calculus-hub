import { useState, useMemo } from 'react';
import { Receipt, Users } from 'lucide-react';

export function TipCalculator() {
  const [bill, setBill] = useState(85.50);
  const [tipPercent, setTipPercent] = useState(18);
  const [people, setPeople] = useState(2);

  const result = useMemo(() => {
    const b = Number(bill);
    const t = Number(tipPercent);
    const p = Math.max(1, Number(people));

    const tip = b * (t / 100);
    const total = b + tip;
    const perPerson = total / p;
    const tipPerPerson = tip / p;

    return { tip, total, perPerson, tipPerPerson };
  }, [bill, tipPercent, people]);

  const presets = [15, 18, 20, 25];

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-muted-foreground">Bill Amount</span>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
          <input
            value={bill}
            onChange={e => setBill(Number(e.target.value))}
            className="input-calc pl-8"
            type="number"
            min="0"
            step="0.01"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-muted-foreground">Tip Percentage</span>
        <div className="flex gap-2">
          {presets.map(p => (
            <button
              key={p}
              onClick={() => setTipPercent(p)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                tipPercent === p
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
              }`}
            >
              {p}%
            </button>
          ))}
          <input
            value={tipPercent}
            onChange={e => setTipPercent(Number(e.target.value))}
            className="input-calc w-20 text-center"
            type="number"
            min="0"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-muted-foreground">Split Between</span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPeople(p => Math.max(1, p - 1))}
            className="w-10 h-10 rounded-lg bg-secondary text-foreground font-bold hover:bg-secondary/80"
          >
            −
          </button>
          <div className="flex-1 flex items-center justify-center gap-2">
            <Users className="w-5 h-5 text-muted-foreground" />
            <span className="text-2xl font-bold">{people}</span>
            <span className="text-muted-foreground">people</span>
          </div>
          <button
            onClick={() => setPeople(p => p + 1)}
            className="w-10 h-10 rounded-lg bg-secondary text-foreground font-bold hover:bg-secondary/80"
          >
            +
          </button>
        </div>
      </div>

      <div className="p-5 rounded-xl bg-secondary/30 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Tip Amount</div>
            <div className="text-2xl font-bold">${result.tip.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Total</div>
            <div className="text-2xl font-bold">${result.total.toFixed(2)}</div>
          </div>
        </div>

        {people > 1 && (
          <div className="pt-4 border-t border-border">
            <div className="flex items-center gap-3">
              <Receipt className="w-5 h-5 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Per Person</div>
                <div className="text-3xl font-bold gradient-text">${result.perPerson.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">
                  (${result.tipPerPerson.toFixed(2)} tip each)
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
