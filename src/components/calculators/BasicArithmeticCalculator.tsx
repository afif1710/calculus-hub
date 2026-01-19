import { useState, useCallback } from 'react';
import { Copy, RotateCcw, Check, Delete } from 'lucide-react';

export function BasicArithmeticCalculator() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [copied, setCopied] = useState(false);

  const handleNumber = (num: string) => {
    if (display === '0' || display === 'Error') {
      setDisplay(num);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOperator = (op: string) => {
    if (display === 'Error') return;
    setExpression(expression + display + op);
    setDisplay('0');
  };

  const handleDecimal = () => {
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleEquals = () => {
    try {
      const fullExpression = expression + display;
      // Replace × and ÷ with * and /
      const sanitized = fullExpression.replace(/×/g, '*').replace(/÷/g, '/');
      // eslint-disable-next-line no-eval
      const result = eval(sanitized);
      if (isNaN(result) || !isFinite(result)) {
        setDisplay('Error');
      } else {
        setDisplay(String(parseFloat(result.toFixed(10))));
      }
      setExpression('');
    } catch {
      setDisplay('Error');
      setExpression('');
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setExpression('');
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const handlePlusMinus = () => {
    if (display !== '0' && display !== 'Error') {
      setDisplay(display.startsWith('-') ? display.slice(1) : '-' + display);
    }
  };

  const handlePercent = () => {
    const num = parseFloat(display);
    if (!isNaN(num)) {
      setDisplay(String(num / 100));
    }
  };

  const reset = useCallback(() => {
    setDisplay('0');
    setExpression('');
  }, []);

  const copyResult = useCallback(() => {
    if (display !== 'Error') {
      navigator.clipboard.writeText(display);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [display]);

  const Button = ({ children, onClick, className = '' }: { children: React.ReactNode; onClick: () => void; className?: string }) => (
    <button
      onClick={onClick}
      className={`p-4 rounded-xl text-lg font-medium transition-all active:scale-95 ${className}`}
    >
      {children}
    </button>
  );

  return (
    <div className="space-y-4">
      {/* Display */}
      <div className="bg-secondary/50 rounded-xl p-4">
        <div className="text-sm text-muted-foreground h-5 text-right truncate">
          {expression}
        </div>
        <div className="text-3xl font-bold text-right truncate text-foreground">
          {display}
        </div>
      </div>

      {/* Calculator Buttons */}
      <div className="grid grid-cols-4 gap-2">
        <Button onClick={handleClear} className="bg-destructive/20 text-destructive hover:bg-destructive/30">AC</Button>
        <Button onClick={handlePlusMinus} className="bg-secondary hover:bg-secondary/80">±</Button>
        <Button onClick={handlePercent} className="bg-secondary hover:bg-secondary/80">%</Button>
        <Button onClick={() => handleOperator('÷')} className="bg-primary text-primary-foreground hover:bg-primary/90">÷</Button>
        
        <Button onClick={() => handleNumber('7')} className="bg-secondary/50 hover:bg-secondary">7</Button>
        <Button onClick={() => handleNumber('8')} className="bg-secondary/50 hover:bg-secondary">8</Button>
        <Button onClick={() => handleNumber('9')} className="bg-secondary/50 hover:bg-secondary">9</Button>
        <Button onClick={() => handleOperator('×')} className="bg-primary text-primary-foreground hover:bg-primary/90">×</Button>
        
        <Button onClick={() => handleNumber('4')} className="bg-secondary/50 hover:bg-secondary">4</Button>
        <Button onClick={() => handleNumber('5')} className="bg-secondary/50 hover:bg-secondary">5</Button>
        <Button onClick={() => handleNumber('6')} className="bg-secondary/50 hover:bg-secondary">6</Button>
        <Button onClick={() => handleOperator('-')} className="bg-primary text-primary-foreground hover:bg-primary/90">−</Button>
        
        <Button onClick={() => handleNumber('1')} className="bg-secondary/50 hover:bg-secondary">1</Button>
        <Button onClick={() => handleNumber('2')} className="bg-secondary/50 hover:bg-secondary">2</Button>
        <Button onClick={() => handleNumber('3')} className="bg-secondary/50 hover:bg-secondary">3</Button>
        <Button onClick={() => handleOperator('+')} className="bg-primary text-primary-foreground hover:bg-primary/90">+</Button>
        
        <Button onClick={() => handleNumber('0')} className="col-span-2 bg-secondary/50 hover:bg-secondary">0</Button>
        <Button onClick={handleDecimal} className="bg-secondary/50 hover:bg-secondary">.</Button>
        <Button onClick={handleEquals} className="bg-primary text-primary-foreground hover:bg-primary/90">=</Button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleBackspace}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
        >
          <Delete className="w-4 h-4" />
          Backspace
        </button>
        <button
          onClick={reset}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
        <button
          onClick={copyResult}
          disabled={display === 'Error'}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
}
