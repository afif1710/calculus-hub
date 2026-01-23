import { useState, useMemo, useCallback } from 'react';
import { Copy, RotateCcw, Check, Plus, X } from 'lucide-react';

interface Subject {
  id: string;
  name: string;
  grade: string;
  credits: string;
}

const GRADE_SCALE: Record<string, { points: number; percent: number }> = {
  'A+': { points: 4.0, percent: 97 },
  'A': { points: 4.0, percent: 93 },
  'A-': { points: 3.7, percent: 90 },
  'B+': { points: 3.3, percent: 87 },
  'B': { points: 3.0, percent: 83 },
  'B-': { points: 2.7, percent: 80 },
  'C+': { points: 2.3, percent: 77 },
  'C': { points: 2.0, percent: 73 },
  'C-': { points: 1.7, percent: 70 },
  'D+': { points: 1.3, percent: 67 },
  'D': { points: 1.0, percent: 63 },
  'D-': { points: 0.7, percent: 60 },
  'F': { points: 0.0, percent: 50 },
};

export function GPACalculator() {
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: '1', name: 'Math', grade: 'A', credits: '3' },
    { id: '2', name: 'Science', grade: 'B+', credits: '4' },
    { id: '3', name: 'English', grade: 'A-', credits: '3' },
  ]);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const validSubjects = subjects.filter(s => 
      s.grade in GRADE_SCALE && !isNaN(parseFloat(s.credits)) && parseFloat(s.credits) > 0
    );

    if (validSubjects.length === 0) return null;

    let totalPoints = 0;
    let totalCredits = 0;
    let totalPercent = 0;

    validSubjects.forEach(s => {
      const credits = parseFloat(s.credits);
      const gradeData = GRADE_SCALE[s.grade];
      totalPoints += gradeData.points * credits;
      totalPercent += gradeData.percent * credits;
      totalCredits += credits;
    });

    const gpa = totalPoints / totalCredits;
    const percentage = totalPercent / totalCredits;

    return { gpa, percentage, totalCredits, subjectCount: validSubjects.length };
  }, [subjects]);

  const addSubject = useCallback(() => {
    setSubjects(prev => [...prev, { 
      id: Date.now().toString(), 
      name: '', 
      grade: 'A', 
      credits: '3' 
    }]);
  }, []);

  const removeSubject = useCallback((id: string) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
  }, []);

  const updateSubject = useCallback((id: string, field: keyof Subject, value: string) => {
    setSubjects(prev => prev.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ));
  }, []);

  const reset = useCallback(() => {
    setSubjects([
      { id: '1', name: 'Math', grade: 'A', credits: '3' },
      { id: '2', name: 'Science', grade: 'B+', credits: '4' },
      { id: '3', name: 'English', grade: 'A-', credits: '3' },
    ]);
  }, []);

  const copyResult = useCallback(() => {
    if (result) {
      const text = `GPA: ${result.gpa.toFixed(2)}\nPercentage: ${result.percentage.toFixed(1)}%\nTotal Credits: ${result.totalCredits}\nSubjects: ${result.subjectCount}`;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result]);

  return (
    <div className="space-y-6">
      {/* Subjects List */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {subjects.map((subject, index) => (
          <div key={subject.id} className="flex gap-2 items-center">
            <input
              type="text"
              value={subject.name}
              onChange={(e) => updateSubject(subject.id, 'name', e.target.value)}
              placeholder={`Subject ${index + 1}`}
              className="flex-1 px-3 py-2 rounded-lg bg-secondary/50 border border-border focus:border-primary outline-none text-sm"
            />
            <select
              value={subject.grade}
              onChange={(e) => updateSubject(subject.id, 'grade', e.target.value)}
              className="px-3 py-2 rounded-lg bg-secondary/50 border border-border focus:border-primary outline-none text-sm"
            >
              {Object.keys(GRADE_SCALE).map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
            <input
              type="number"
              value={subject.credits}
              onChange={(e) => updateSubject(subject.id, 'credits', e.target.value)}
              placeholder="Credits"
              className="w-16 px-3 py-2 rounded-lg bg-secondary/50 border border-border focus:border-primary outline-none text-sm text-center"
              min="1"
              max="10"
            />
            <button
              onClick={() => removeSubject(subject.id)}
              className="p-2 rounded-lg hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
              disabled={subjects.length <= 1}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addSubject}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl border-2 border-dashed border-border hover:border-primary/50 text-muted-foreground hover:text-foreground transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Subject
      </button>

      {/* Results */}
      <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-3">
        {result ? (
          <>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">GPA</span>
              <span className="text-3xl font-bold gradient-text">
                {result.gpa.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center border-t border-border pt-3">
              <span className="text-muted-foreground">Percentage</span>
              <span className="text-xl font-bold text-primary">
                {result.percentage.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground border-t border-border pt-3">
              <span>{result.subjectCount} subjects</span>
              <span>{result.totalCredits} total credits</span>
            </div>
          </>
        ) : (
          <div className="text-center text-muted-foreground py-2">
            Add subjects with valid grades and credits
          </div>
        )}
      </div>

      {/* Grade Scale Reference */}
      <details className="text-sm">
        <summary className="text-muted-foreground cursor-pointer hover:text-foreground">
          View Grade Scale
        </summary>
        <div className="mt-2 p-3 rounded-lg bg-secondary/30 grid grid-cols-4 gap-2 text-xs">
          {Object.entries(GRADE_SCALE).map(([grade, data]) => (
            <div key={grade} className="flex justify-between">
              <span className="font-medium">{grade}</span>
              <span className="text-muted-foreground">{data.points}</span>
            </div>
          ))}
        </div>
      </details>

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
