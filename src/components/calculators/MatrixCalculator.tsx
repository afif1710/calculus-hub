import { useState, useMemo } from 'react';
import { RotateCcw, Shuffle } from 'lucide-react';

function parseMatrix(text: string): number[][] {
  return text.trim().split('\n').map(r => 
    r.trim().split(/[\s,]+/).map(Number)
  ).filter(r => r.length > 0 && !r.some(isNaN));
}

function multiplyMatrices(A: number[][], B: number[][]): number[][] {
  const aRows = A.length, aCols = A[0]?.length || 0;
  const bRows = B.length, bCols = B[0]?.length || 0;
  
  if (aCols !== bRows) throw new Error(`Cannot multiply: A cols (${aCols}) ≠ B rows (${bRows})`);
  
  const C: number[][] = Array.from({ length: aRows }, () => Array(bCols).fill(0));
  
  for (let i = 0; i < aRows; i++) {
    for (let j = 0; j < bCols; j++) {
      for (let k = 0; k < aCols; k++) {
        C[i][j] += A[i][k] * B[k][j];
      }
    }
  }
  return C;
}

function formatMatrix(m: number[][]): string {
  return m.map(r => r.map(n => n.toFixed(2).replace(/\.00$/, '')).join('\t')).join('\n');
}

export function MatrixCalculator() {
  const [aText, setAText] = useState('1 2\n3 4');
  const [bText, setBText] = useState('5 6\n7 8');

  const result = useMemo(() => {
    try {
      const A = parseMatrix(aText);
      const B = parseMatrix(bText);
      
      if (!A.length || !A[0]?.length) return { error: 'Matrix A is empty or invalid' };
      if (!B.length || !B[0]?.length) return { error: 'Matrix B is empty or invalid' };
      if (A.some(r => r.length !== A[0].length)) return { error: 'Matrix A has inconsistent row lengths' };
      if (B.some(r => r.length !== B[0].length)) return { error: 'Matrix B has inconsistent row lengths' };
      
      const C = multiplyMatrices(A, B);
      return { matrix: C, dimensions: `${A.length}×${A[0].length} × ${B.length}×${B[0].length} = ${C.length}×${C[0].length}` };
    } catch (e) {
      return { error: (e as Error).message };
    }
  }, [aText, bText]);

  const reset = () => {
    setAText('1 0\n0 1');
    setBText('1 2\n3 4');
  };

  const randomize = () => {
    const rand = () => Math.floor(Math.random() * 10);
    setAText(`${rand()} ${rand()}\n${rand()} ${rand()}`);
    setBText(`${rand()} ${rand()}\n${rand()} ${rand()}`);
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-muted-foreground">Matrix A (rows by newline, values by space/comma)</span>
          <textarea
            value={aText}
            onChange={e => setAText(e.target.value)}
            className="input-calc h-28 font-mono text-sm"
            placeholder="1 2&#10;3 4"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-muted-foreground">Matrix B</span>
          <textarea
            value={bText}
            onChange={e => setBText(e.target.value)}
            className="input-calc h-28 font-mono text-sm"
            placeholder="5 6&#10;7 8"
          />
        </label>
      </div>

      <div className="flex gap-2">
        <button onClick={reset} className="btn-ghost flex items-center gap-2">
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
        <button onClick={randomize} className="btn-ghost flex items-center gap-2">
          <Shuffle className="w-4 h-4" />
          Random
        </button>
      </div>

      <div className="p-5 rounded-xl bg-secondary/30">
        {'error' in result ? (
          <div className="text-destructive font-medium">{result.error}</div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">Result</span>
              <span className="text-xs text-muted-foreground">{result.dimensions}</span>
            </div>
            <pre className="font-mono text-lg bg-card p-4 rounded-lg overflow-x-auto">
              {formatMatrix(result.matrix)}
            </pre>
          </>
        )}
      </div>
    </div>
  );
}
