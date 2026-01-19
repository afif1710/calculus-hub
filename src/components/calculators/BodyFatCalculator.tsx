import { useState, useCallback, useMemo } from 'react';
import { Copy, RotateCcw, Check } from 'lucide-react';

export function BodyFatCalculator() {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [method, setMethod] = useState<'navy' | 'bmi'>('navy');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  
  // Navy method measurements
  const [height, setHeight] = useState('175');
  const [weight, setWeight] = useState('75');
  const [waist, setWaist] = useState('85');
  const [neck, setNeck] = useState('38');
  const [hip, setHip] = useState('95'); // For females only
  
  const [age, setAge] = useState('30');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    const waistCm = parseFloat(waist);
    const neckCm = parseFloat(neck);
    const hipCm = parseFloat(hip);
    const ageNum = parseFloat(age);

    if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) return null;

    let heightCm = h;
    let weightKg = w;
    let waistMeasure = waistCm;
    let neckMeasure = neckCm;
    let hipMeasure = hipCm;

    if (unit === 'imperial') {
      heightCm = h * 2.54;
      weightKg = w * 0.453592;
      waistMeasure = waistCm * 2.54;
      neckMeasure = neckCm * 2.54;
      hipMeasure = hipCm * 2.54;
    }

    let bodyFat: number;

    if (method === 'navy') {
      if (isNaN(waistMeasure) || isNaN(neckMeasure) || waistMeasure <= 0 || neckMeasure <= 0) return null;
      
      if (gender === 'male') {
        // US Navy formula for men
        bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waistMeasure - neckMeasure) + 0.15456 * Math.log10(heightCm)) - 450;
      } else {
        if (isNaN(hipMeasure) || hipMeasure <= 0) return null;
        // US Navy formula for women
        bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waistMeasure + hipMeasure - neckMeasure) + 0.22100 * Math.log10(heightCm)) - 450;
      }
    } else {
      // BMI-based estimation (less accurate but simpler)
      if (isNaN(ageNum) || ageNum <= 0) return null;
      const bmi = weightKg / Math.pow(heightCm / 100, 2);
      if (gender === 'male') {
        bodyFat = (1.20 * bmi) + (0.23 * ageNum) - 16.2;
      } else {
        bodyFat = (1.20 * bmi) + (0.23 * ageNum) - 5.4;
      }
    }

    // Clamp to reasonable range
    bodyFat = Math.max(3, Math.min(60, bodyFat));

    // Determine category
    let category: string;
    if (gender === 'male') {
      if (bodyFat < 6) category = 'Essential';
      else if (bodyFat < 14) category = 'Athletic';
      else if (bodyFat < 18) category = 'Fitness';
      else if (bodyFat < 25) category = 'Average';
      else category = 'Above Average';
    } else {
      if (bodyFat < 14) category = 'Essential';
      else if (bodyFat < 21) category = 'Athletic';
      else if (bodyFat < 25) category = 'Fitness';
      else if (bodyFat < 32) category = 'Average';
      else category = 'Above Average';
    }

    // Calculate lean mass and fat mass
    const fatMass = (bodyFat / 100) * weightKg;
    const leanMass = weightKg - fatMass;

    return {
      bodyFat: bodyFat.toFixed(1),
      category,
      fatMass: fatMass.toFixed(1),
      leanMass: leanMass.toFixed(1),
    };
  }, [gender, method, unit, height, weight, waist, neck, hip, age]);

  const reset = useCallback(() => {
    setHeight('175');
    setWeight('75');
    setWaist('85');
    setNeck('38');
    setHip('95');
    setAge('30');
  }, []);

  const copyResult = useCallback(() => {
    if (result) {
      const text = `Body Fat: ${result.bodyFat}%\nCategory: ${result.category}\nFat Mass: ${result.fatMass}kg\nLean Mass: ${result.leanMass}kg`;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Essential': return 'text-blue-500';
      case 'Athletic': return 'text-green-500';
      case 'Fitness': return 'text-emerald-500';
      case 'Average': return 'text-amber-500';
      default: return 'text-orange-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Gender & Method Toggle */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Gender</label>
          <div className="flex rounded-xl overflow-hidden border border-border">
            <button
              onClick={() => setGender('male')}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                gender === 'male' ? 'bg-primary text-primary-foreground' : 'bg-secondary/50 hover:bg-secondary'
              }`}
            >
              Male
            </button>
            <button
              onClick={() => setGender('female')}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                gender === 'female' ? 'bg-primary text-primary-foreground' : 'bg-secondary/50 hover:bg-secondary'
              }`}
            >
              Female
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Unit</label>
          <div className="flex rounded-xl overflow-hidden border border-border">
            <button
              onClick={() => setUnit('metric')}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                unit === 'metric' ? 'bg-primary text-primary-foreground' : 'bg-secondary/50 hover:bg-secondary'
              }`}
            >
              Metric
            </button>
            <button
              onClick={() => setUnit('imperial')}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                unit === 'imperial' ? 'bg-primary text-primary-foreground' : 'bg-secondary/50 hover:bg-secondary'
              }`}
            >
              Imperial
            </button>
          </div>
        </div>
      </div>

      {/* Method Selection */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">Method</label>
        <div className="flex rounded-xl overflow-hidden border border-border">
          <button
            onClick={() => setMethod('navy')}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              method === 'navy' ? 'bg-primary text-primary-foreground' : 'bg-secondary/50 hover:bg-secondary'
            }`}
          >
            US Navy (more accurate)
          </button>
          <button
            onClick={() => setMethod('bmi')}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              method === 'bmi' ? 'bg-primary text-primary-foreground' : 'bg-secondary/50 hover:bg-secondary'
            }`}
          >
            BMI-based (simpler)
          </button>
        </div>
      </div>

      {/* Measurements */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Height ({unit === 'metric' ? 'cm' : 'in'})
          </label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Weight ({unit === 'metric' ? 'kg' : 'lbs'})
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none transition-all"
          />
        </div>
      </div>

      {method === 'navy' ? (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Waist ({unit === 'metric' ? 'cm' : 'in'})
            </label>
            <input
              type="number"
              value={waist}
              onChange={(e) => setWaist(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Neck ({unit === 'metric' ? 'cm' : 'in'})
            </label>
            <input
              type="number"
              value={neck}
              onChange={(e) => setNeck(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none transition-all"
            />
          </div>
          {gender === 'female' && (
            <div className="col-span-2">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Hip ({unit === 'metric' ? 'cm' : 'in'})
              </label>
              <input
                type="number"
                value={hip}
                onChange={(e) => setHip(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none transition-all"
              />
            </div>
          )}
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Age</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none transition-all"
          />
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="p-6 rounded-xl bg-primary/10 border border-primary/20">
          <div className="text-center mb-4">
            <div className="text-4xl font-bold gradient-text">{result.bodyFat}%</div>
            <div className={`text-lg font-medium ${getCategoryColor(result.category)}`}>{result.category}</div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center text-sm">
            <div className="p-3 rounded-xl bg-secondary/50">
              <div className="font-medium">{result.fatMass} {unit === 'metric' ? 'kg' : 'lbs'}</div>
              <div className="text-muted-foreground">Fat Mass</div>
            </div>
            <div className="p-3 rounded-xl bg-secondary/50">
              <div className="font-medium">{result.leanMass} {unit === 'metric' ? 'kg' : 'lbs'}</div>
              <div className="text-muted-foreground">Lean Mass</div>
            </div>
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
