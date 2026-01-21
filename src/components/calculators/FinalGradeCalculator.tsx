import { useState, useMemo, useCallback } from 'react';
import { Copy, RotateCcw, Check, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function FinalGradeCalculator() {
  const [currentGrade, setCurrentGrade] = useState('');
  const [targetGrade, setTargetGrade] = useState('');
  const [finalWeight, setFinalWeight] = useState('');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const current = parseFloat(currentGrade);
    const target = parseFloat(targetGrade);
    const weight = parseFloat(finalWeight) / 100; // Convert percentage to decimal

    if (isNaN(current) || isNaN(target) || isNaN(weight) || weight <= 0 || weight > 1) {
      return null;
    }

    // Formula: (Target - (Current * (1 - Weight))) / Weight
    const neededGrade = (target - (current * (1 - weight))) / weight;

    return {
      neededGrade,
      isPossible: neededGrade <= 100,
      isEasy: neededGrade <= current,
    };
  }, [currentGrade, targetGrade, finalWeight]);

  const reset = useCallback(() => {
    setCurrentGrade('');
    setTargetGrade('');
    setFinalWeight('');
  }, []);

  const copyResult = useCallback(() => {
    if (result) {
      navigator.clipboard.writeText(
        `Final Grade Calculator\nCurrent Grade: ${currentGrade}%\nTarget Grade: ${targetGrade}%\nFinal Exam Weight: ${finalWeight}%\nNeeded on Final: ${result.neededGrade.toFixed(1)}%`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result, currentGrade, targetGrade, finalWeight]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="currentGrade">Current Grade (%)</Label>
          <Input
            id="currentGrade"
            type="number"
            value={currentGrade}
            onChange={(e) => setCurrentGrade(e.target.value)}
            placeholder="Your current grade (0-100)"
            min="0"
            max="100"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetGrade">Target Final Grade (%)</Label>
          <Input
            id="targetGrade"
            type="number"
            value={targetGrade}
            onChange={(e) => setTargetGrade(e.target.value)}
            placeholder="Grade you want to achieve (0-100)"
            min="0"
            max="100"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="finalWeight">Final Exam Weight (%)</Label>
          <Input
            id="finalWeight"
            type="number"
            value={finalWeight}
            onChange={(e) => setFinalWeight(e.target.value)}
            placeholder="Weight of final exam (e.g., 30)"
            min="1"
            max="100"
          />
        </div>
      </div>

      {/* Results */}
      <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-4">
        {result ? (
          <>
            <div className="flex justify-between items-center">
              <span className="font-medium flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Grade Needed on Final
              </span>
              <span className={`text-2xl font-bold ${
                result.neededGrade < 0 ? 'text-green-500' : 
                result.isEasy ? 'text-green-500' : 
                result.isPossible ? 'text-yellow-500' : 'text-red-500'
              }`}>
                {result.neededGrade < 0 ? '0%' : `${result.neededGrade.toFixed(1)}%`}
              </span>
            </div>

            <div className="text-sm text-center pt-2 border-t border-border">
              {result.neededGrade < 0 && (
                <span className="text-green-500">✓ You've already achieved your target!</span>
              )}
              {result.neededGrade >= 0 && result.isEasy && (
                <span className="text-green-500">✓ Very achievable - below your current average</span>
              )}
              {result.neededGrade > parseFloat(currentGrade) && result.isPossible && (
                <span className="text-yellow-500">Challenging but possible</span>
              )}
              {!result.isPossible && (
                <span className="text-red-500">✗ Not possible - consider adjusting your target</span>
              )}
            </div>
          </>
        ) : (
          <div className="text-center text-muted-foreground py-2">
            Enter values to calculate required final grade
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="secondary" onClick={reset} className="flex-1">
          <RotateCcw className="w-4 h-4 mr-2" />
          Clear
        </Button>
        <Button onClick={copyResult} disabled={!result} className="flex-1">
          {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
          {copied ? 'Copied!' : 'Copy Result'}
        </Button>
      </div>
    </div>
  );
}
