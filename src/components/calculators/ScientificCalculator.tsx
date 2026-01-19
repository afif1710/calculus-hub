import { useState, useCallback } from 'react';
import { Copy, RotateCcw, Check } from 'lucide-react';

export function ScientificCalculator() {
  const [display, setDisplay] = useState('0');
  const [memory, setMemory] = useState<number | null>(null);
  const [isRadians, setIsRadians] = useState(true);
  const [copied, setCopied] = useState(false);

  const toRadians = (deg: number) => (deg * Math.PI) / 180;
  const toDegrees = (rad: number) => (rad * 180) / Math.PI;

  const handleNumber = (num: string) => {
    if (display === '0' || display === 'Error') {
      setDisplay(num);
    } else {
      setDisplay(display + num);
    }
  };

  const handleDecimal = () => {
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOperator = (op: string) => {
    if (display === 'Error') return;
    const current = parseFloat(display);
    setMemory(current);
    setDisplay('0');
    setOperation(op);
  };

  const [operation, setOperation] = useState<string | null>(null);

  const calculate = () => {
    if (memory === null || operation === null) return;
    const current = parseFloat(display);
    let result: number;
    
    switch (operation) {
      case '+': result = memory + current; break;
      case '-': result = memory - current; break;
      case '×': result = memory * current; break;
      case '÷': result = current !== 0 ? memory / current : NaN; break;
      case '^': result = Math.pow(memory, current); break;
      default: return;
    }

    if (isNaN(result) || !isFinite(result)) {
      setDisplay('Error');
    } else {
      setDisplay(String(parseFloat(result.toFixed(10))));
    }
    setMemory(null);
    setOperation(null);
  };

  const handleFunction = (fn: string) => {
    const num = parseFloat(display);
    if (isNaN(num)) {
      setDisplay('Error');
      return;
    }

    let result: number;
    const angle = isRadians ? num : toRadians(num);

    switch (fn) {
      case 'sin': result = Math.sin(angle); break;
      case 'cos': result = Math.cos(angle); break;
      case 'tan': result = Math.tan(angle); break;
      case 'asin': result = isRadians ? Math.asin(num) : toDegrees(Math.asin(num)); break;
      case 'acos': result = isRadians ? Math.acos(num) : toDegrees(Math.acos(num)); break;
      case 'atan': result = isRadians ? Math.atan(num) : toDegrees(Math.atan(num)); break;
      case 'log': result = Math.log10(num); break;
      case 'ln': result = Math.log(num); break;
      case 'sqrt': result = Math.sqrt(num); break;
      case 'cbrt': result = Math.cbrt(num); break;
      case 'x²': result = Math.pow(num, 2); break;
      case 'x³': result = Math.pow(num, 3); break;
      case '1/x': result = 1 / num; break;
      case 'exp': result = Math.exp(num); break;
      case 'abs': result = Math.abs(num); break;
      case '!': result = factorial(num); break;
      default: return;
    }

    if (isNaN(result) || !isFinite(result)) {
      setDisplay('Error');
    } else {
      setDisplay(String(parseFloat(result.toFixed(10))));
    }
  };

  const factorial = (n: number): number => {
    if (n < 0 || !Number.isInteger(n)) return NaN;
    if (n === 0 || n === 1) return 1;
    if (n > 170) return Infinity;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
  };

  const insertConstant = (constant: string) => {
    switch (constant) {
      case 'π': setDisplay(String(Math.PI)); break;
      case 'e': setDisplay(String(Math.E)); break;
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setMemory(null);
    setOperation(null);
  };

  const handlePlusMinus = () => {
    if (display !== '0' && display !== 'Error') {
      setDisplay(display.startsWith('-') ? display.slice(1) : '-' + display);
    }
  };

  const reset = useCallback(() => {
    setDisplay('0');
    setMemory(null);
    setOperation(null);
  }, []);

  const copyResult = useCallback(() => {
    if (display !== 'Error') {
      navigator.clipboard.writeText(display);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [display]);

  const Button = ({ children, onClick, className = '', title }: { children: React.ReactNode; onClick: () => void; className?: string; title?: string }) => (
    <button
      onClick={onClick}
      title={title}
      className={`p-3 rounded-lg text-sm font-medium transition-all active:scale-95 ${className}`}
    >
      {children}
    </button>
  );

  return (
    <div className="space-y-4">
      {/* Mode Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setIsRadians(true)}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
            isRadians ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'
          }`}
        >
          Radians
        </button>
        <button
          onClick={() => setIsRadians(false)}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
            !isRadians ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'
          }`}
        >
          Degrees
        </button>
      </div>

      {/* Display */}
      <div className="bg-secondary/50 rounded-xl p-4">
        <div className="text-sm text-muted-foreground h-5">
          {memory !== null && `${memory} ${operation}`}
        </div>
        <div className="text-2xl font-bold text-right truncate text-foreground">
          {display}
        </div>
      </div>

      {/* Scientific Functions */}
      <div className="grid grid-cols-5 gap-1.5">
        <Button onClick={() => handleFunction('sin')} className="bg-secondary/70 hover:bg-secondary text-xs">sin</Button>
        <Button onClick={() => handleFunction('cos')} className="bg-secondary/70 hover:bg-secondary text-xs">cos</Button>
        <Button onClick={() => handleFunction('tan')} className="bg-secondary/70 hover:bg-secondary text-xs">tan</Button>
        <Button onClick={() => handleFunction('log')} className="bg-secondary/70 hover:bg-secondary text-xs">log</Button>
        <Button onClick={() => handleFunction('ln')} className="bg-secondary/70 hover:bg-secondary text-xs">ln</Button>
        
        <Button onClick={() => handleFunction('asin')} className="bg-secondary/70 hover:bg-secondary text-xs">sin⁻¹</Button>
        <Button onClick={() => handleFunction('acos')} className="bg-secondary/70 hover:bg-secondary text-xs">cos⁻¹</Button>
        <Button onClick={() => handleFunction('atan')} className="bg-secondary/70 hover:bg-secondary text-xs">tan⁻¹</Button>
        <Button onClick={() => handleFunction('sqrt')} className="bg-secondary/70 hover:bg-secondary text-xs">√</Button>
        <Button onClick={() => handleFunction('cbrt')} className="bg-secondary/70 hover:bg-secondary text-xs">∛</Button>
        
        <Button onClick={() => handleFunction('x²')} className="bg-secondary/70 hover:bg-secondary text-xs">x²</Button>
        <Button onClick={() => handleFunction('x³')} className="bg-secondary/70 hover:bg-secondary text-xs">x³</Button>
        <Button onClick={() => handleOperator('^')} className="bg-secondary/70 hover:bg-secondary text-xs">xʸ</Button>
        <Button onClick={() => handleFunction('exp')} className="bg-secondary/70 hover:bg-secondary text-xs">eˣ</Button>
        <Button onClick={() => handleFunction('!')} className="bg-secondary/70 hover:bg-secondary text-xs">n!</Button>
        
        <Button onClick={() => insertConstant('π')} className="bg-secondary/70 hover:bg-secondary text-xs">π</Button>
        <Button onClick={() => insertConstant('e')} className="bg-secondary/70 hover:bg-secondary text-xs">e</Button>
        <Button onClick={() => handleFunction('1/x')} className="bg-secondary/70 hover:bg-secondary text-xs">1/x</Button>
        <Button onClick={() => handleFunction('abs')} className="bg-secondary/70 hover:bg-secondary text-xs">|x|</Button>
        <Button onClick={handlePlusMinus} className="bg-secondary/70 hover:bg-secondary text-xs">±</Button>
      </div>

      {/* Basic Calculator */}
      <div className="grid grid-cols-4 gap-1.5">
        <Button onClick={handleClear} className="bg-destructive/20 text-destructive hover:bg-destructive/30">AC</Button>
        <Button onClick={() => setDisplay(display.slice(0, -1) || '0')} className="bg-secondary hover:bg-secondary/80">⌫</Button>
        <Button onClick={() => {}} className="bg-secondary hover:bg-secondary/80">()</Button>
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
        <Button onClick={calculate} className="bg-primary text-primary-foreground hover:bg-primary/90">=</Button>
      </div>

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
