import { useState, useCallback, useMemo } from 'react';
import { Copy, RotateCcw, Check, Plus, Trash2 } from 'lucide-react';

interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const COMMON_FOODS: Omit<FoodEntry, 'id'>[] = [
  { name: 'Apple (medium)', calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
  { name: 'Banana (medium)', calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
  { name: 'Chicken Breast (100g)', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: 'Rice (1 cup cooked)', calories: 206, protein: 4.3, carbs: 45, fat: 0.4 },
  { name: 'Egg (large)', calories: 72, protein: 6, carbs: 0.4, fat: 5 },
  { name: 'Bread (1 slice)', calories: 79, protein: 2.7, carbs: 15, fat: 1 },
  { name: 'Milk (1 cup)', calories: 149, protein: 8, carbs: 12, fat: 8 },
  { name: 'Pasta (1 cup cooked)', calories: 221, protein: 8, carbs: 43, fat: 1.3 },
  { name: 'Salmon (100g)', calories: 208, protein: 20, carbs: 0, fat: 13 },
  { name: 'Broccoli (1 cup)', calories: 55, protein: 3.7, carbs: 11, fat: 0.6 },
];

export function CalorieCounter() {
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [customName, setCustomName] = useState('');
  const [customCalories, setCustomCalories] = useState('');
  const [dailyGoal, setDailyGoal] = useState('2000');
  const [copied, setCopied] = useState(false);

  const totals = useMemo(() => {
    return entries.reduce(
      (acc, entry) => ({
        calories: acc.calories + entry.calories,
        protein: acc.protein + entry.protein,
        carbs: acc.carbs + entry.carbs,
        fat: acc.fat + entry.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [entries]);

  const goalNum = parseFloat(dailyGoal) || 2000;
  const progress = Math.min((totals.calories / goalNum) * 100, 100);

  const addQuickFood = (food: Omit<FoodEntry, 'id'>) => {
    setEntries([...entries, { ...food, id: Date.now().toString() }]);
  };

  const addCustomFood = () => {
    const calories = parseFloat(customCalories);
    if (customName && !isNaN(calories) && calories > 0) {
      setEntries([
        ...entries,
        {
          id: Date.now().toString(),
          name: customName,
          calories,
          protein: 0,
          carbs: 0,
          fat: 0,
        },
      ]);
      setCustomName('');
      setCustomCalories('');
    }
  };

  const removeEntry = (id: string) => {
    setEntries(entries.filter((e) => e.id !== id));
  };

  const reset = useCallback(() => {
    setEntries([]);
    setCustomName('');
    setCustomCalories('');
  }, []);

  const copyResult = useCallback(() => {
    const summary = `Daily Calories: ${totals.calories}\nProtein: ${totals.protein.toFixed(1)}g\nCarbs: ${totals.carbs.toFixed(1)}g\nFat: ${totals.fat.toFixed(1)}g`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [totals]);

  return (
    <div className="space-y-6">
      {/* Daily Goal */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          Daily Calorie Goal
        </label>
        <input
          type="number"
          value={dailyGoal}
          onChange={(e) => setDailyGoal(e.target.value)}
          min="500"
          max="10000"
          className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none transition-all"
        />
      </div>

      {/* Progress Bar */}
      <div className="p-4 rounded-xl bg-secondary/50">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium">{totals.calories} / {goalNum} kcal</span>
          <span className={totals.calories > goalNum ? 'text-destructive' : 'text-muted-foreground'}>
            {totals.calories > goalNum ? `+${totals.calories - goalNum} over` : `${goalNum - totals.calories} remaining`}
          </span>
        </div>
        <div className="h-3 bg-secondary rounded-full overflow-hidden">
          <div
            className={`h-full transition-all rounded-full ${
              progress >= 100 ? 'bg-destructive' : 'bg-primary'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Macros Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-xl bg-blue-500/10 text-center">
          <div className="text-lg font-bold text-blue-500">{totals.protein.toFixed(1)}g</div>
          <div className="text-xs text-muted-foreground">Protein</div>
        </div>
        <div className="p-3 rounded-xl bg-amber-500/10 text-center">
          <div className="text-lg font-bold text-amber-500">{totals.carbs.toFixed(1)}g</div>
          <div className="text-xs text-muted-foreground">Carbs</div>
        </div>
        <div className="p-3 rounded-xl bg-rose-500/10 text-center">
          <div className="text-lg font-bold text-rose-500">{totals.fat.toFixed(1)}g</div>
          <div className="text-xs text-muted-foreground">Fat</div>
        </div>
      </div>

      {/* Quick Add Common Foods */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          Quick Add
        </label>
        <div className="flex flex-wrap gap-2">
          {COMMON_FOODS.slice(0, 5).map((food, i) => (
            <button
              key={i}
              onClick={() => addQuickFood(food)}
              className="px-3 py-1.5 text-sm rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
            >
              {food.name}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Food Entry */}
      <div className="flex gap-2">
        <input
          type="text"
          value={customName}
          onChange={(e) => setCustomName(e.target.value)}
          placeholder="Food name"
          className="flex-1 px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none transition-all"
        />
        <input
          type="number"
          value={customCalories}
          onChange={(e) => setCustomCalories(e.target.value)}
          placeholder="kcal"
          min="0"
          className="w-24 px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none transition-all"
        />
        <button
          onClick={addCustomFood}
          disabled={!customName || !customCalories}
          className="p-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Food Log */}
      {entries.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Today's Log
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-3 rounded-xl bg-secondary/50"
              >
                <div>
                  <div className="font-medium text-sm">{entry.name}</div>
                  <div className="text-xs text-muted-foreground">{entry.calories} kcal</div>
                </div>
                <button
                  onClick={() => removeEntry(entry.id)}
                  className="p-2 rounded-lg hover:bg-destructive/20 text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
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
          disabled={entries.length === 0}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy Summary'}
        </button>
      </div>
    </div>
  );
}
