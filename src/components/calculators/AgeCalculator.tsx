import { useState, useMemo } from 'react';
import { Calendar } from 'lucide-react';

export function AgeCalculator() {
  const today = new Date();
  const [birthDate, setBirthDate] = useState(
    new Date(today.getFullYear() - 25, today.getMonth(), today.getDate())
      .toISOString().split('T')[0]
  );
  const [targetDate, setTargetDate] = useState(today.toISOString().split('T')[0]);

  const result = useMemo(() => {
    const birth = new Date(birthDate);
    const target = new Date(targetDate);

    if (isNaN(birth.getTime()) || isNaN(target.getTime())) {
      return { error: 'Invalid date' };
    }

    if (birth > target) {
      return { error: 'Birth date must be before target date' };
    }

    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const totalDays = Math.floor((target.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;

    // Next birthday
    let nextBirthday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday <= target) {
      nextBirthday = new Date(target.getFullYear() + 1, birth.getMonth(), birth.getDate());
    }
    const daysToNextBirthday = Math.ceil((nextBirthday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));

    return { years, months, days, totalDays, totalWeeks, totalMonths, daysToNextBirthday };
  }, [birthDate, targetDate]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-muted-foreground">Birth Date</span>
          <input
            type="date"
            value={birthDate}
            onChange={e => setBirthDate(e.target.value)}
            className="input-calc"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-muted-foreground">Calculate Age As Of</span>
          <input
            type="date"
            value={targetDate}
            onChange={e => setTargetDate(e.target.value)}
            className="input-calc"
          />
        </label>
      </div>

      {'error' in result ? (
        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {result.error}
        </div>
      ) : (
        <div className="p-5 rounded-xl bg-secondary/30 space-y-4">
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-2">Your Age</div>
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <div className="text-4xl font-bold gradient-text">{result.years}</div>
                <div className="text-xs text-muted-foreground">years</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold">{result.months}</div>
                <div className="text-xs text-muted-foreground">months</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold">{result.days}</div>
                <div className="text-xs text-muted-foreground">days</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border">
            <div className="p-3 rounded-lg bg-card text-center">
              <div className="text-lg font-bold">{result.totalDays.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Total Days</div>
            </div>
            <div className="p-3 rounded-lg bg-card text-center">
              <div className="text-lg font-bold">{result.totalWeeks.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Total Weeks</div>
            </div>
            <div className="p-3 rounded-lg bg-card text-center">
              <div className="text-lg font-bold">{result.totalMonths}</div>
              <div className="text-xs text-muted-foreground">Total Months</div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <Calendar className="w-5 h-5 text-primary" />
            <div className="text-sm">
              <span className="font-medium">{result.daysToNextBirthday}</span> days until your next birthday 🎂
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
