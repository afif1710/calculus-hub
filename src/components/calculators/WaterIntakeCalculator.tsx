import { useState, useCallback, useMemo } from 'react';
import { Copy, RotateCcw, Check, Droplets, Plus, Minus } from 'lucide-react';

export function WaterIntakeCalculator() {
  const [weight, setWeight] = useState('70');
  const [unit, setUnit] = useState<'kg' | 'lbs'>('kg');
  const [activityLevel, setActivityLevel] = useState<'sedentary' | 'moderate' | 'active' | 'very_active'>('moderate');
  const [climate, setClimate] = useState<'temperate' | 'hot' | 'humid'>('temperate');
  const [consumed, setConsumed] = useState(0);
  const [copied, setCopied] = useState(false);

  const recommendation = useMemo(() => {
    let weightKg = parseFloat(weight);
    if (isNaN(weightKg) || weightKg <= 0) return null;
    
    if (unit === 'lbs') {
      weightKg = weightKg * 0.453592;
    }

    // Base calculation: 30-35ml per kg of body weight
    let baseMl = weightKg * 33;

    // Activity level multiplier
    const activityMultipliers = {
      sedentary: 1,
      moderate: 1.2,
      active: 1.4,
      very_active: 1.6,
    };
    baseMl *= activityMultipliers[activityLevel];

    // Climate adjustment
    const climateMultipliers = {
      temperate: 1,
      hot: 1.15,
      humid: 1.2,
    };
    baseMl *= climateMultipliers[climate];

    const liters = baseMl / 1000;
    const glasses = Math.ceil(baseMl / 250); // 250ml per glass
    const ounces = baseMl * 0.033814;

    return {
      ml: Math.round(baseMl),
      liters: liters.toFixed(1),
      glasses,
      ounces: Math.round(ounces),
    };
  }, [weight, unit, activityLevel, climate]);

  const progress = recommendation ? Math.min((consumed / recommendation.glasses) * 100, 100) : 0;

  const addGlass = () => {
    if (recommendation) {
      setConsumed(Math.min(consumed + 1, recommendation.glasses));
    }
  };

  const removeGlass = () => {
    setConsumed(Math.max(consumed - 1, 0));
  };

  const reset = useCallback(() => {
    setWeight('70');
    setUnit('kg');
    setActivityLevel('moderate');
    setClimate('temperate');
    setConsumed(0);
  }, []);

  const copyResult = useCallback(() => {
    if (recommendation) {
      const text = `Daily Water Intake: ${recommendation.liters}L (${recommendation.glasses} glasses)\nProgress: ${consumed}/${recommendation.glasses} glasses`;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [recommendation, consumed]);

  return (
    <div className="space-y-6">
      {/* Weight Input */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Weight
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            min="20"
            max="300"
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Unit
          </label>
          <div className="flex rounded-xl overflow-hidden border border-border">
            <button
              onClick={() => setUnit('kg')}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                unit === 'kg' ? 'bg-primary text-primary-foreground' : 'bg-secondary/50 hover:bg-secondary'
              }`}
            >
              kg
            </button>
            <button
              onClick={() => setUnit('lbs')}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                unit === 'lbs' ? 'bg-primary text-primary-foreground' : 'bg-secondary/50 hover:bg-secondary'
              }`}
            >
              lbs
            </button>
          </div>
        </div>
      </div>

      {/* Activity Level */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          Activity Level
        </label>
        <select
          value={activityLevel}
          onChange={(e) => setActivityLevel(e.target.value as typeof activityLevel)}
          className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none transition-all"
        >
          <option value="sedentary">Sedentary (little to no exercise)</option>
          <option value="moderate">Moderate (exercise 3-4x/week)</option>
          <option value="active">Active (exercise 5-6x/week)</option>
          <option value="very_active">Very Active (intense daily exercise)</option>
        </select>
      </div>

      {/* Climate */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          Climate
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['temperate', 'hot', 'humid'] as const).map((c) => (
            <button
              key={c}
              onClick={() => setClimate(c)}
              className={`py-2 px-3 rounded-xl text-sm font-medium transition-colors ${
                climate === c ? 'bg-primary text-primary-foreground' : 'bg-secondary/50 hover:bg-secondary'
              }`}
            >
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Recommendation */}
      {recommendation && (
        <div className="p-6 rounded-xl bg-primary/10 border border-primary/20">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Droplets className="w-8 h-8 text-primary" />
            <div className="text-3xl font-bold gradient-text">{recommendation.liters}L</div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div className="font-medium">{recommendation.ml} ml</div>
              <div className="text-muted-foreground">Milliliters</div>
            </div>
            <div>
              <div className="font-medium">{recommendation.glasses} glasses</div>
              <div className="text-muted-foreground">250ml each</div>
            </div>
            <div>
              <div className="font-medium">{recommendation.ounces} oz</div>
              <div className="text-muted-foreground">Ounces</div>
            </div>
          </div>
        </div>
      )}

      {/* Water Tracker */}
      {recommendation && (
        <div className="p-4 rounded-xl bg-secondary/50">
          <label className="block text-sm font-medium text-muted-foreground mb-3 text-center">
            Track Your Intake Today
          </label>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={removeGlass}
              disabled={consumed === 0}
              className="p-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors disabled:opacity-50"
            >
              <Minus className="w-5 h-5" />
            </button>
            <div className="text-center">
              <div className="text-3xl font-bold">{consumed}</div>
              <div className="text-sm text-muted-foreground">of {recommendation.glasses} glasses</div>
            </div>
            <button
              onClick={addGlass}
              disabled={consumed >= recommendation.glasses}
              className="p-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-4 h-3 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
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
          disabled={!recommendation}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy Result'}
        </button>
      </div>
    </div>
  );
}
