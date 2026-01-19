import { useState, useMemo } from 'react';

interface BMIResult {
  bmi: number;
  classification: string;
  color: string;
  bmr: number;
  tdee: number;
  protein: number;
  fat: number;
  carbs: number;
}

const activityLevels = [
  { value: 1.2, label: 'Sedentary (little/no exercise)' },
  { value: 1.375, label: 'Lightly active (1-3 days/week)' },
  { value: 1.55, label: 'Moderately active (3-5 days/week)' },
  { value: 1.725, label: 'Very active (6-7 days/week)' },
  { value: 1.9, label: 'Extra active (athlete/physical job)' },
];

function getBMIClassification(bmi: number): { classification: string; color: string } {
  if (bmi < 18.5) return { classification: 'Underweight', color: 'text-blue-500' };
  if (bmi < 25) return { classification: 'Normal', color: 'text-green-500' };
  if (bmi < 30) return { classification: 'Overweight', color: 'text-yellow-500' };
  return { classification: 'Obese', color: 'text-red-500' };
}

export function BMICalculator() {
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(175);
  const [age, setAge] = useState(30);
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const [activity, setActivity] = useState(1.55);

  const result: BMIResult = useMemo(() => {
    const w = Number(weight);
    const h = Number(height);
    const a = Number(age);
    const act = Number(activity);

    const bmi = w / Math.pow(h / 100, 2);
    const { classification, color } = getBMIClassification(bmi);

    // Mifflin-St Jeor BMR formula
    const bmr = sex === 'male'
      ? 10 * w + 6.25 * h - 5 * a + 5
      : 10 * w + 6.25 * h - 5 * a - 161;

    const tdee = bmr * act;

    // Macro calculations (maintenance)
    const protein = Math.round(1.6 * w); // 1.6g per kg
    const fat = Math.round((tdee * 0.25) / 9); // 25% calories from fat
    const carbs = Math.round((tdee - protein * 4 - fat * 9) / 4);

    return { bmi, classification, color, bmr, tdee, protein, fat, carbs };
  }, [weight, height, age, sex, activity]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-muted-foreground">Weight (kg)</span>
          <input
            value={weight}
            onChange={e => setWeight(Number(e.target.value))}
            className="input-calc"
            type="number"
            min="1"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-muted-foreground">Height (cm)</span>
          <input
            value={height}
            onChange={e => setHeight(Number(e.target.value))}
            className="input-calc"
            type="number"
            min="1"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-muted-foreground">Age</span>
          <input
            value={age}
            onChange={e => setAge(Number(e.target.value))}
            className="input-calc"
            type="number"
            min="1"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-muted-foreground">Sex</span>
          <select
            value={sex}
            onChange={e => setSex(e.target.value as 'male' | 'female')}
            className="input-calc"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-muted-foreground">Activity Level</span>
          <select
            value={activity}
            onChange={e => setActivity(Number(e.target.value))}
            className="input-calc"
          >
            {activityLevels.map(level => (
              <option key={level.value} value={level.value}>{level.label}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="p-5 rounded-xl bg-secondary/30 space-y-4">
        <div className="text-center">
          <div className="text-sm text-muted-foreground">BMI</div>
          <div className="text-4xl font-bold gradient-text">{result.bmi.toFixed(1)}</div>
          <div className={`text-lg font-medium ${result.color}`}>{result.classification}</div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <div className="text-center">
            <div className="text-sm text-muted-foreground">BMR</div>
            <div className="text-xl font-semibold">{Math.round(result.bmr)} kcal</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground">TDEE</div>
            <div className="text-xl font-semibold">{Math.round(result.tdee)} kcal</div>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <div className="text-sm font-medium text-muted-foreground mb-3">Daily Macro Targets (Maintenance)</div>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-card text-center">
              <div className="text-2xl font-bold text-blue-500">{result.protein}g</div>
              <div className="text-xs text-muted-foreground">Protein</div>
            </div>
            <div className="p-3 rounded-lg bg-card text-center">
              <div className="text-2xl font-bold text-yellow-500">{result.fat}g</div>
              <div className="text-xs text-muted-foreground">Fat</div>
            </div>
            <div className="p-3 rounded-lg bg-card text-center">
              <div className="text-2xl font-bold text-green-500">{result.carbs}g</div>
              <div className="text-xs text-muted-foreground">Carbs</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
