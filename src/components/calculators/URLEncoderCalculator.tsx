import { useState, useCallback } from 'react';
import { Copy, RotateCcw, Check, ArrowDown, ArrowUp } from 'lucide-react';

export function URLEncoderCalculator() {
  const [input, setInput] = useState('Hello World! Special chars: @#$%^&*()');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const process = useCallback(() => {
    setError(null);
    try {
      if (mode === 'encode') {
        setOutput(encodeURIComponent(input));
      } else {
        setOutput(decodeURIComponent(input));
      }
    } catch (e) {
      setError(mode === 'decode' ? 'Invalid URL-encoded string' : 'Could not encode input');
      setOutput('');
    }
  }, [input, mode]);

  const reset = useCallback(() => {
    setInput('Hello World! Special chars: @#$%^&*()');
    setOutput('');
    setError(null);
    setMode('encode');
  }, []);

  const copyResult = useCallback(() => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [output]);

  const swap = useCallback(() => {
    setInput(output);
    setOutput('');
    setMode(mode === 'encode' ? 'decode' : 'encode');
  }, [output, mode]);

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <div className="flex gap-2 p-1 bg-secondary/50 rounded-xl">
        <button
          onClick={() => setMode('encode')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'encode' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
          }`}
        >
          Encode
        </button>
        <button
          onClick={() => setMode('decode')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'decode' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
          }`}
        >
          Decode
        </button>
      </div>

      {/* Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          {mode === 'encode' ? 'Text to Encode' : 'URL-encoded to Decode'}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-24 px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none font-mono text-sm"
          placeholder={mode === 'encode' ? 'Enter text...' : 'Enter URL-encoded string...'}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={process}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          {mode === 'encode' ? <ArrowDown className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />}
          {mode === 'encode' ? 'Encode' : 'Decode'}
        </button>
        <button
          onClick={swap}
          disabled={!output}
          className="px-4 py-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors disabled:opacity-50"
          title="Swap input/output"
        >
          ⇅
        </button>
      </div>

      {/* Output */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Result</label>
        <div className="relative">
          <textarea
            value={output}
            readOnly
            className="w-full h-24 px-4 py-3 rounded-xl bg-secondary/30 border border-border font-mono text-sm resize-none"
            placeholder="Result will appear here..."
          />
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-secondary/90 rounded-xl">
              <span className="text-destructive text-sm">{error}</span>
            </div>
          )}
        </div>
      </div>

      {/* Reference */}
      <details className="text-sm">
        <summary className="text-muted-foreground cursor-pointer hover:text-foreground">
          Common Encoded Characters
        </summary>
        <div className="mt-2 p-3 rounded-lg bg-secondary/30 grid grid-cols-4 gap-2 text-xs font-mono">
          <div>space → %20</div>
          <div>! → %21</div>
          <div># → %23</div>
          <div>$ → %24</div>
          <div>& → %26</div>
          <div>' → %27</div>
          <div>+ → %2B</div>
          <div>/ → %2F</div>
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
          disabled={!output}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy Result'}
        </button>
      </div>
    </div>
  );
}
