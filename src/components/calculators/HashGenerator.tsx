import { useState, useCallback } from 'react';
import { Copy, RotateCcw, Check, Hash } from 'lucide-react';

export function HashGenerator() {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateHashes = async () => {
    if (!input) {
      setHashes({});
      return;
    }

    setIsGenerating(true);
    const encoder = new TextEncoder();
    const data = encoder.encode(input);

    try {
      const [sha1, sha256, sha384, sha512] = await Promise.all([
        crypto.subtle.digest('SHA-1', data),
        crypto.subtle.digest('SHA-256', data),
        crypto.subtle.digest('SHA-384', data),
        crypto.subtle.digest('SHA-512', data),
      ]);

      setHashes({
        'SHA-1': arrayBufferToHex(sha1),
        'SHA-256': arrayBufferToHex(sha256),
        'SHA-384': arrayBufferToHex(sha384),
        'SHA-512': arrayBufferToHex(sha512),
      });
    } catch (error) {
      console.error('Error generating hashes:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const arrayBufferToHex = (buffer: ArrayBuffer): string => {
    return Array.from(new Uint8Array(buffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const reset = useCallback(() => {
    setInput('');
    setHashes({});
  }, []);

  const copyHash = useCallback((algorithm: string, hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopied(algorithm);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  const copyAll = useCallback(() => {
    const allHashes = Object.entries(hashes)
      .map(([alg, hash]) => `${alg}: ${hash}`)
      .join('\n');
    navigator.clipboard.writeText(allHashes);
    setCopied('all');
    setTimeout(() => setCopied(null), 2000);
  }, [hashes]);

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          Text to Hash
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to generate hashes..."
          rows={4}
          className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none transition-all resize-none"
        />
      </div>

      {/* Generate Button */}
      <button
        onClick={generateHashes}
        disabled={!input || isGenerating}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        <Hash className="w-4 h-4" />
        {isGenerating ? 'Generating...' : 'Generate Hashes'}
      </button>

      {/* Hash Results */}
      {Object.keys(hashes).length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Generated Hashes</h3>
          {Object.entries(hashes).map(([algorithm, hash]) => (
            <div key={algorithm} className="p-4 rounded-xl bg-secondary/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{algorithm}</span>
                <button
                  onClick={() => copyHash(algorithm, hash)}
                  className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
                  aria-label={`Copy ${algorithm} hash`}
                >
                  {copied === algorithm ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              <div className="font-mono text-xs break-all text-muted-foreground">
                {hash}
              </div>
              <div className="text-xs text-muted-foreground/60 mt-1">
                {hash.length} characters
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Character Count */}
      {input && (
        <div className="p-4 rounded-xl bg-secondary/50">
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div className="font-medium">{input.length}</div>
              <div className="text-muted-foreground">Characters</div>
            </div>
            <div>
              <div className="font-medium">{input.split(/\s+/).filter(Boolean).length}</div>
              <div className="text-muted-foreground">Words</div>
            </div>
            <div>
              <div className="font-medium">{new TextEncoder().encode(input).length}</div>
              <div className="text-muted-foreground">Bytes (UTF-8)</div>
            </div>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="p-4 rounded-xl bg-secondary/30 text-sm text-muted-foreground">
        <p className="font-medium mb-2">About Hash Functions:</p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>SHA-1: 160-bit (legacy, not recommended for security)</li>
          <li>SHA-256: 256-bit (widely used, secure)</li>
          <li>SHA-384: 384-bit (high security)</li>
          <li>SHA-512: 512-bit (highest security)</li>
        </ul>
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
          onClick={copyAll}
          disabled={Object.keys(hashes).length === 0}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {copied === 'all' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied === 'all' ? 'Copied!' : 'Copy All'}
        </button>
      </div>
    </div>
  );
}
