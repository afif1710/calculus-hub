import { useState, useMemo, useCallback } from 'react';
import { Copy, RotateCcw, Check } from 'lucide-react';

export function CalorieDeficitCalculator() {
  const [tdee, setTdee] = useState('2000');
  const [intake, setIntake] = useState('1500');
  const [targetChange, setTargetChange] = useState('10');
  const [unit, setUnit] = useState<'kg' | 'lbs'>('kg');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const tdeeVal = parseFloat(tdee);
    const intakeVal = parseFloat(intake);
    const target = parseFloat(targetChange);

    if (isNaN(tdeeVal) || isNaN(intakeVal) || isNaN(target) || tdeeVal <= 0 || intakeVal <= 0 || target <= 0) {
      return null;
    }

    const dailyDeficit = tdeeVal - intakeVal;
    const weeklyDeficit = dailyDeficit * 7;
    
    // 1 kg of fat ≈ 7700 calories, 1 lb ≈ 3500 calories
    const caloriesPerUnit = unit === 'kg' ? 7700 : 3500;
    
    const weeklyLoss = weeklyDeficit / caloriesPerUnit;
    const daysToGoal = (target * caloriesPerUnit) / dailyDeficit;
    const weeksToGoal = daysToGoal / 7;

    // Check if it's sustainable (recommended: 0.5-1kg or 1-2lbs per week)
    const maxSafeWeekly = unit === 'kg' ? 1 : 2;
    const minSafeWeekly = unit === 'kg' ? 0.25 : 0.5;
    
    let sustainability = 'safe';
    if (Math.abs(weeklyLoss) > maxSafeWeekly) sustainability = 'aggressive';
    if (Math.abs(weeklyLoss) < minSafeWeekly) sustainability = 'slow';
    if (dailyDeficit < 0) sustainability = 'surplus';

    return {
      dailyDeficit,
      weeklyDeficit,
      weeklyLoss,
      daysToGoal,
      weeksToGoal,
      sustainability,
      isGain: dailyDeficit < 0
    };
  }, [tdee, intake, targetChange, unit]);

  const reset = useCallback(() => {
    setTdee('2000');
    setIntake('1500');
    setTargetChange('10');
  }, []);

  const copyResult = useCallback(() => {
    if (result) {
      const text = `TDEE: ${tdee} cal\nIntake: ${intake} cal\nDaily ${result.isGain ? 'Surplus' : 'Deficit'}: ${Math.abs(result.dailyDeficit)} cal\nWeekly Change: ${Math.abs(result.weeklyLoss).toFixed(2)} ${unit}\nTime to ${targetChange}${unit}: ${Math.ceil(result.weeksToGoal)} weeks`;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result, tdee, intake, targetChange, unit]);

  const getSustainabilityColor = (s: string) => {
    switch (s) {
      case 'safe': return 'text-green-500 bg-green-500/20';
      case 'slow': return 'text-blue-500 bg-blue-500/20';
      case 'aggressive': return 'text-red-500 bg-red-500/20';
      case 'surplus': return 'text-amber-500 bg-amber-500/20';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Unit Toggle */}
      <div className="flex gap-2 p-1 bg-secondary/50 rounded-xl">
        <button
          onClick={() => setUnit('kg')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            unit === 'kg' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
          }`}
        >
          Kilograms
        </button>
        <button
          onClick={() => setUnit('lbs')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            unit === 'lbs' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
          }`}
        >
          Pounds
        </button>
      </div>

      <div className="grid gap-4">
        <label className="space-y-2">
          <span className="text-sm font-medium">TDEE (calories/day)</span>
          <input
            type="number"
            value={tdee}
            onChange={(e) => setTdee(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="Total daily energy expenditure"
            min="0"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Daily Calorie Intake</span>
          <input
            type="number"
            value={intake}
            onChange={(e) => setIntake(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="Calories you eat"
            min="0"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Target Weight Change ({unit})</span>
          <input
            type="number"
            value={targetChange}
            onChange={(e) => setTargetChange(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            placeholder="Weight to lose/gain"
            min="0"
          />
        </label>
      </div>

      {/* Results */}
      <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-3">
        {result ? (
          <>
            <div className="text-center">
              <span className="text-sm text-muted-foreground block">
                Daily {result.isGain ? 'Surplus' : 'Deficit'}
              </span>
              <span className={`text-3xl font-bold ${result.isGain ? 'text-amber-500' : 'text-green-500'}`}>
                {Math.abs(result.dailyDeficit).toLocaleString()} cal
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-border pt-3">
              <div className="text-center">
                <span className="text-xs text-muted-foreground block">Weekly Change</span>
                <span className="text-lg font-bold">
                  {result.isGain ? '+' : '-'}{Math.abs(result.weeklyLoss).toFixed(2)} {unit}
                </span>
              </div>
              <div className="text-center">
                <span className="text-xs text-muted-foreground block">Time to Goal</span>
                <span className="text-lg font-bold gradient-text">
                  {result.weeksToGoal > 0 ? `${Math.ceil(result.weeksToGoal)} weeks` : '—'}
                </span>
              </div>
            </div>

            <div className="text-center border-t border-border pt-3">
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${getSustainabilityColor(result.sustainability)}`}>
                {result.sustainability === 'safe' && '✓ Sustainable rate'}
                {result.sustainability === 'slow' && '🐢 Very slow progress'}
                {result.sustainability === 'aggressive' && '⚠️ Too aggressive'}
                {result.sustainability === 'surplus' && '📈 Calorie surplus (gaining)'}
              </span>
            </div>
          </>
        ) : (
          <div className="text-center text-muted-foreground py-2">
            Enter valid calorie values
          </div>
        )}
      </div>

      {/* Info */}
      <div className="text-xs text-muted-foreground p-3 bg-secondary/20 rounded-lg">
        Safe rate: {unit === 'kg' ? '0.25-1 kg' : '0.5-2 lbs'} per week. 
        1 {unit} of fat ≈ {unit === 'kg' ? '7,700' : '3,500'} calories.
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
